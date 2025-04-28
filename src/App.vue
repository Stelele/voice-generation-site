<template>
  <RouterView />
</template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { TtsService } from '@/services/TtsService/TtsService';
import { useReaderStore } from '@/stores/ReaderStore';

const readerStore = useReaderStore()

onBeforeMount(() => {
  getAIVoices()
})

async function getAIVoices() {
  const voices = await TtsService.getVoices()
  readerStore.voices = voices.map(v => {
    v.imageurl = `/voices-faces/${v.ShortName}.png`
    return v
  })

  const urls = readerStore.voices.map(v => {
    const temp: Record<string, string> = {}
    temp[v.ShortName] = v.imageurl
    return temp
  })
  console.log({ urls })

  const uniqueLocs = [...new Set(voices.map(v => v.Locale))]
  readerStore.locals = uniqueLocs.map(loc => {
    const voice = voices.find(v => v.Locale === loc)
    if (!voice) return { label: loc, value: loc }
    const label = voice.FriendlyName.split('-')[1]?.trim() ?? loc
    return {
      label,
      value: loc,
    }
  }).sort((a, b) => a.label > b.label ? 1 : -1)

}
</script>
