import { EdgeTTS } from "@/services/TtsService/EdgeTTS";

export type SynthOptions = {
  rate?: number
  volume?: number
  pitch?: number
}
export class TtsService {
  public static async getVoices() {
    const tts = new EdgeTTS()
    return tts.getVoices()
  }

  public static async getBase64StrAudio(text: string, voice?: string, options?: SynthOptions) {
    const tts = new EdgeTTS()

    await tts.synthesize(text, voice, {
      rate: options?.rate ? `${this.clampValue(-99, 99, options.rate)}%` : undefined,
      volume: options?.volume ? `${this.clampValue(-99, 99, options.volume)}%` : undefined,
      pitch: options?.pitch ? `${this.clampValue(-99, 99, options.pitch)}Hz` : undefined,
    })

    const response = await tts.toBase64()
    return { audio: `data:audio/x-wav;base64,${response.audio}`, metaData: response.metaData }
  }

  private static clampValue(min: number, max: number, val: number) {
    if (val < min) return min
    if (val > max) return max
    return val
  }
}
