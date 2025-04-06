import { defineStore } from "pinia";
import { ref } from "vue";

export const useReaderStore = defineStore('ReaderStore', () => {
  const text = ref('Hello World')
  const audio = ref<HTMLAudioElement | undefined>(undefined)

  return {
    text,
    audio,
  }
})
