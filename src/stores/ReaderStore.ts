import type { SynthOptions } from "@/services/TtsService/TtsService";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useReaderStore = defineStore('ReaderStore', () => {
  const text = ref('Hello World')
  const audio = ref<HTMLAudioElement | undefined>(undefined)
  const synthOptions = ref<SynthOptions>({
    pitch: 0,
    rate: 0,
    volume: 100,
  })

  return {
    text,
    audio,
    synthOptions,
  }
})
