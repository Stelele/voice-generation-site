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
      <div v-for="voice, idx in filteredVoices" :key="idx"
        class="card card-sm p-10 w-full h-fit shadow-sm hover:cursor-pointer" :class="{
          'bg-primary': voice.ShortName === selectedVoice?.ShortName,
          'bg-base-100 hover:bg-base-200': voice.ShortName !== selectedVoice?.ShortName
        }" @click="playAudio(voice)">
        <figure>
          <img :src="voice.imageurl" alt="Shoes" />
        </figure>
        <div class="card-body">
          <h2 class="card-title justify-center">{{ voice.FriendlyName }}</h2>
          <div class="card-actions justify-center">
            <button class="btn btn-ghost btn-circle">
              <OhVueIcon :name="selectedVoice?.ShortName === voice.ShortName ? `gi-sound-waves` : `bi-volume-up`"
                :scale="3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useReaderStore } from '@/stores/ReaderStore'
import { computed, ref } from 'vue'
import { OhVueIcon } from 'oh-vue-icons'
import type { IAiVoice } from '@/services/TtsService/EdgeTTS'
import { TtsService } from '@/services/TtsService/TtsService'
import { DadJokesService } from '@/services/DadJokesService/DadJokesService'

const readerStore = useReaderStore()
const language = ref('en-US')
const selectedVoice = ref<IAiVoice | undefined>()
const sampleAudio = ref<HTMLAudioElement | undefined>()

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

async function playAudio(voice: IAiVoice) {
  if (sampleAudio.value) {
    sampleAudio.value.pause()
    sampleAudio.value = undefined

    if (selectedVoice.value?.ShortName === voice.ShortName) {
      selectedVoice.value = undefined
      return
    }
  }

  selectedVoice.value = voice

  const joke = await DadJokesService.getJoke()
  const { audio } = await TtsService.getBase64StrAudio(joke, voice.ShortName)

  sampleAudio.value = new Audio(audio)
  sampleAudio.value.play()
  sampleAudio.value.addEventListener('ended', () => {
    sampleAudio.value = undefined
    selectedVoice.value = undefined
  })
}
</script>
