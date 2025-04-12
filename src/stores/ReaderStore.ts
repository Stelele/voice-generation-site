import type { IAiVoice } from "@/services/TtsService/EdgeTTS";
import type { SynthOptions } from "@/services/TtsService/TtsService";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useReaderStore = defineStore('ReaderStore', () => {
  const text = ref('Hello World')
  const audio = ref<HTMLAudioElement | undefined>(undefined)
  const synthOptions = ref<SynthOptions>({
    pitch: 0,
    rate: 0,
    volume: 100,
  })
  const voices = ref<IAiVoice[]>([])
  const locals = computed(() => {
    const locs = voices.value.map(v => v.Locale)
    const uniqueLocs = [...new Set(locs)]
    return uniqueLocs.map(loc => {
      const voice = voices.value.find(v => v.Locale === loc)
      if (!voice) return { label: loc, value: loc }
      const label = voice.FriendlyName.split('-')[1].trim()
      return {
        label,
        value: loc,
      }
    }).sort((a, b) => a.label > b.label ? 1 : -1)
  })

  const selections = ref<{ local: string; voice: string; url: string }>({
    local: "en-US",
    voice: "en-US-AnaNeural",
    url: "https://avatar.iran.liara.run/public/girl?username=en-US-AnaNeural",
  })

  return {
    text,
    audio,
    synthOptions,
    voices,
    locals,
    selections,
  }
})
