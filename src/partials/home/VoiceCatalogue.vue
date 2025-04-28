<template>
  <div class="flex flex-col w-full gap-10 justify-center mt-10">
    <div class="flex justify-center">
      <select class="select w-sm selection:open:max-h-10" v-model="language">
        <option class="text-center" v-for="local, idx in readerStore.locals" :key="idx" :value="local.value">
          {{ local.label }}
        </option>
      </select>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-10 w-full">
      <div v-if="filteredVoices.length < 4"></div>
      <div v-for="voice, idx in filteredVoices" :key="idx" class="card bg-base-100 w-full shadow-sm">
        <figure>
          <img :src="voice.imageurl" alt="Shoes" />
        </figure>
        <div class="card-body">
          <h2 class="card-title justify-center">{{ voice.FriendlyName }}</h2>
          <div class="card-actions justify-center">
            <button class="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useReaderStore } from '@/stores/ReaderStore'
import { computed, ref } from 'vue'

const readerStore = useReaderStore()
const language = ref('en-US')

const filteredVoices = computed(() => {
  return readerStore.voices
    .filter(v => v.Locale === language.value)
    .map(v => {
      v.FriendlyName = v.FriendlyName
        .split('-')[0]
        .trim()
        .split(' ')
        .filter(n => !['microsoft', 'online', '(natural)'].includes(n.toLowerCase()))[0]
        .replace(/([a-z])([A-Z])/g, '$1 $2')

      return v
    })
    .slice(0, 4)
})
</script>
