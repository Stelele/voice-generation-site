<template>
  <div class="flex flex-col min-h-[100vh] min-w-[100vw]">
    <div>
      <TopAppBar />
    </div>
    <div class="flex flex-grow gap-1">
      <SideBar />
      <div class="flex-grow">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TopAppBar from '@/components/Navigation/TopAppBar.vue';
import SideBar from '@/components/Navigation/SideBar.vue';
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
    v.imageurl = `https://avatar.iran.liara.run/public/${v.Gender === 'Male' ? 'boy' : 'girl'}?username=${v.ShortName}`
    return v
  })

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
