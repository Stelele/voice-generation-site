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
  readerStore.voices = (await TtsService.getVoices()).map(v => {
    v.imageurl = `https://avatar.iran.liara.run/public/${v.Gender === 'Male' ? 'boy' : 'girl'}?username=${v.ShortName}`
    return v
  })
}
</script>
