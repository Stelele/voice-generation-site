import type { IAiMetaData, IAiVoice } from "@/services/TtsService/EdgeTTS";
import type { SynthOptions } from "@/services/TtsService/TtsService";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export interface ITimeSlice {
  index: number
  minTime: number
  maxTime: number
  phrase: string
  children?: ITimeSlice[]
}

export const useReaderStore = defineStore('ReaderStore', () => {
  const text = ref(`Drag and drop your files, or type, paste, and edit text here.
Natural Reader is new professional text-to-speech program that converts any written text into spoken words.
We have both free and paid subscriptions to our applications to meet different users' needs on different budgets. Our Plus subscription includes exclusive features and the use of Plus and LLM (Large Language Model) Voices, our newest and most advanced voices.
Using LLM technology, you can even clone your own voice in minutes and make it speak over 100 languages.
Free users can sample the Premium Voices for 20 minutes per day and the Plus Voices for 5 minutes per day. Or use any available Free Voices unlimitedly.
You can also listen and go with our mobile app. By using the mobile camera, you can even use our app to listen to physical books and notes.
If you are interested in using our voices for non-personal use such as for Youtube videos, e-Learning, or other commercial or public purposes, please check out our Natural Reader AI Voice Generator web application.
Our Chrome extension allows you to listen to webpages, Google Docs, online Kindle books, and emails directly from the browser. Add it to Chrome for free.`)
  const audio = ref<HTMLAudioElement | undefined>(undefined)
  const synthOptions = ref<SynthOptions>({
    pitch: 0,
    rate: 0,
    volume: 100,
  })
  const voices = ref<IAiVoice[]>([])
  const locals = ref<{ label: string; value: string }[]>([])
  const metaData = ref<IAiMetaData[]>([])

  const selections = ref<{ local: string; voice: string; url: string }>({
    local: "en-US",
    voice: "en-US-AnaNeural",
    url: "https://avatar.iran.liara.run/public/girl?username=en-US-AnaNeural",
  })

  const timeSlices = computed(() => {
    const sentenceSlices: ITimeSlice[] = []
    const wordSlices: ITimeSlice[] = []

    if (!metaData.value.length || !text.value.length) {
      return { sentenceSlices, wordSlices }
    }

    let min = 0
    let index = 0
    for (const data of metaData.value) {
      const temp: ITimeSlice = {
        index,
        minTime: min,
        maxTime: (data.Offset + data.Duration) * 100e-9,
        phrase: data.text.Text
      }
      wordSlices.push(temp)

      min = temp.maxTime
      index += 1
    }

    const sentences = text.value.split('\n').map(s => s.split(' '))
    index = 0
    let curWordPos = 0
    for (const sentence of sentences) {
      const words = wordSlices.slice(curWordPos, curWordPos + sentence.length)
      const minTime = words[0].minTime
      const maxTime = words[words.length - 1].maxTime
      sentenceSlices.push({
        index,
        minTime,
        maxTime,
        phrase: words.map(x => x.phrase).join(" "),
        children: words,
      })

      curWordPos += words.length
      index += 1
    }

    return { wordSlices, sentenceSlices }
  })

  return {
    text,
    audio,
    synthOptions,
    voices,
    locals,
    selections,
    metaData,
    timeSlices,
  }
})
