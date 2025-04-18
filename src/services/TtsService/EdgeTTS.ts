/* eslint-disable @typescript-eslint/no-explicit-any */

/***
 * This code comes from ()
 * For the most part its exactly the same but it was slightly
 * modified to make it work on the web browser instead of the
 * node JS environment.
 */

import { Buffer } from "buffer";

const Constants = {
  TRUSTED_CLIENT_TOKEN: '6A5AA1D4EAFF4E9FB37E23D68491D6F4',
  WSS_URL: 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1',
  VOICES_URL: 'https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list',
};

export interface IAiVoice {
  FriendlyName: string
  Gender: string
  Locale: string
  Name: string
  ShortName: string
  imageurl: string
}

export interface IAiMetaData {
  Offset: number
  Duration: number
  text: {
    Text: string
    Length: number
    BoundaryType: string
  }
}

export class EdgeTTS {
  private message_stream: Promise<ArrayBuffer>[] = []
  private audio_stream: Buffer[] = [];
  private subtitle_stream: IAiMetaData[] = []
  private ws!: WebSocket;
  private isProcessingDone = false;

  async getVoices(): Promise<IAiVoice[]> {
    const response = await fetch(`${Constants.VOICES_URL}?trustedclienttoken=${Constants.TRUSTED_CLIENT_TOKEN}`);
    const data = await response.json();
    return data.map((voice: any) => {
      delete voice.VoiceTag;
      delete voice.SuggestedCodec;
      delete voice.Status;
      return voice;
    });
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private validatePitch(pitch: string): string {
    if (!/^(-?\d{1,3}Hz)$/.test(pitch)) {
      throw new Error("Invalid pitch format. Expected format: '-100Hz to 100Hz'.");
    }
    return pitch;
  }

  private validateRate(rate: string): string {
    if (!/^(-?\d{1,3}%)$/.test(rate)) {
      throw new Error("Invalid rate format. Expected format: '-100% to 100%'.");
    }
    return rate;
  }

  private validateVolume(volume: string): string {
    if (!/^(-?\d{1,3}%)$/.test(volume)) {
      throw new Error("Invalid volume format. Expected format: '-100% to 100%'.");
    }
    return volume;
  }

  async synthesize(text: string, voice: string = 'en-US-AnaNeural', options: any = {}): Promise<void> {
    this.isProcessingDone = false
    return new Promise((resolve, reject) => {
      const req_id = this.generateUUID();
      this.ws = new WebSocket(`${Constants.WSS_URL}?trustedclienttoken=${Constants.TRUSTED_CLIENT_TOKEN}&ConnectionId=${req_id}`);

      const SSML_text = this.getSSML(text, voice, options);

      this.ws.onopen = (() => {
        const message = this.buildTTSConfigMessage();
        this.ws.send(message);

        const speechMessage = `X-RequestId:${req_id}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date().toISOString()}Z\r\nPath:ssml\r\n\r\n${SSML_text}`;
        this.ws.send(speechMessage);
      }).bind(this);

      this.ws.onmessage = ((data: any) => {
        this.processAudioData(data);
      }).bind(this);

      this.ws.onclose = () => {
        resolve();
      };

      this.ws.onerror = (err) => {
        reject(err);
      };
    });
  }

  private getSSML(text: string, voice: string, options: any = {}): string {
    options.pitch = options.pitch?.replace('hz', 'Hz');
    const pitch = this.validatePitch(options.pitch || '0Hz');
    const rate = this.validateRate(options.rate || '0%');
    const volume = this.validateVolume(options.volume || '0%');

    return `<speak version='1.0' xml:lang='en-US'><voice name='${voice}'><prosody pitch='${pitch}' rate='${rate}' volume='${volume}'>${text}</prosody></voice></speak>`;
  }

  private buildTTSConfigMessage(): string {
    return `X-Timestamp:${new Date().toISOString()}Z\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
      `{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":true},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
  }

  private processAudioData(evt: MessageEvent<string | Blob>): void {
    if (evt.data instanceof Blob) {
      this.message_stream.push(evt.data.arrayBuffer())
      return
    }

    const audioMetaData = "Path:audio.metadata"
    if (evt.data.includes(audioMetaData)) {
      const data = evt.data.slice(evt.data.indexOf(audioMetaData) + audioMetaData.length)
      this.subtitle_stream.push(JSON.parse(data).Metadata[0].Data)
    }

    if (evt.data.includes("Path:turn.end")) {
      this.ws.close();
    }
  }

  private async processMessageData() {
    const searchTerm = "Path:audio\r\n"
    const messages = await Promise.all(this.message_stream)

    for (const messageBuffer of messages) {
      const message = new Uint8Array(messageBuffer)
      const start_ind = this.findStart(message, searchTerm);

      if (start_ind !== -1) {
        const audioData = Buffer.from(message.slice(start_ind + searchTerm.length));
        this.audio_stream.push(audioData);
      }
    }

    this.isProcessingDone = true
  }

  private findStart(data: Uint8Array, searchTerm: string) {
    const startIdx = data.indexOf(searchTerm.charCodeAt(0))
    if (startIdx === -1) return -1
    if (startIdx + searchTerm.length > data.length) return -1

    let pos = 0
    for (let i = startIdx; i < startIdx + searchTerm.length; i++) {
      if (data[i] !== searchTerm.charCodeAt(pos)) return -1
      pos += 1
    }

    return startIdx
  }


  public async toRaw() {
    if (!this.isProcessingDone) {
      await this.processMessageData()
    }

    if (this.audio_stream.length === 0) {
      throw new Error("No audio data available.");
    }

    const audioBuffer = Buffer.concat(this.audio_stream);
    return { audio: audioBuffer.toString('base64'), metaData: this.subtitle_stream }
  }

  public async toBase64() {
    if (!this.isProcessingDone) {
      await this.processMessageData()
    }

    const audioBuffer = Buffer.concat(this.audio_stream);
    return { audio: audioBuffer.toString('base64'), metaData: this.subtitle_stream }
  }
}
