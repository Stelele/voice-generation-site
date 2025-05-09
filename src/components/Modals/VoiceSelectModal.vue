<template>
  <dialog id="voice_select_modal" class="modal">
    <div class="modal-box w-md max-h-[80vh]" v-on-click-outside="hide">
      <div class="flex flex-col gap-1 w-full h-full pt">
        <div class="flex flex-col gap-3 sticky -top-7 z-10 bg-base-200">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 class="text-lg font-bold">Voices</h3>
          <div class="flex gap-1 w-full">
            <div class="flex-grow w-full items-center">
              <select class="select w-full selection:open:max-h-10" v-model="readerStore.selections.local">
                <option v-for="local, idx in readerStore.locals" :key="idx" :value="local.value">
                  {{ local.label }}
                </option>
              </select>
            </div>
            <div>
              <button class="btn btn-sm btn-circle btn-ghost">
                <OhVueIcon name="bi-search" />
              </button>
            </div>
          </div>
        </div>
        <div class="w-full">
          <ul class="list bg-base-100 rounded-box shadow-md">
            <li v-for="voice, idx in filteredVoices" :key="idx"
              class="list-row group items-center hover:bg-base-300/60">
              <div><img class="size-10 rounded-box" :src="voice.imageurl" />
              </div>
              <div class="list-col-grow">
                <div>{{ voice.FriendlyName }}</div>
                <div class="text-xs uppercase font-semibold opacity-60">{{ voice.Gender }}</div>
              </div>
              <div>
                <button :disabled="sampleVoice === null" class="btn btn-sm btn-ghost swap-on"
                  @click="toggleSample(voice)" :class="{
                    'invisible group-hover:visible': readerStore.selections.voice !== voice.ShortName,
                  }">
                  <OhVueIcon :name="previewIcon(voice)" :scale="2" />
                </button>
              </div>
              <div>
                <button class="btn btn-primary btn-sm" :class="{
                  'btn-outline invisible group-hover:visible': readerStore.selections.voice !== voice.ShortName,
                  'btn-active': readerStore.selections.voice === voice.ShortName,
                }" @click="useVoice(voice)">
                  use
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { clearAudioState } from '@/helpers/functions';
import { DadJokesService } from '@/services/DadJokesService/DadJokesService';
import type { IAiVoice } from '@/services/TtsService/EdgeTTS';
import { TtsService } from '@/services/TtsService/TtsService';
import { useReaderStore } from '@/stores/ReaderStore';
import { vOnClickOutside } from '@vueuse/components';
import { OhVueIcon } from 'oh-vue-icons';
import { computed, onUnmounted, ref } from 'vue';

const readerStore = useReaderStore()
const sampleVoice = ref<IAiVoice | undefined | null>()
const sampleAudio = ref<HTMLAudioElement | undefined>()

onUnmounted(() => {
  sampleAudio.value = undefined
})

const filteredVoices = computed(() => {
  return readerStore.voices
    .filter(v => v.Locale === readerStore.selections.local)
    .map(v => {
      v.FriendlyName = v.FriendlyName
        .split('-')[0]
        .trim()
        .split(' ')
        .filter(n => !['microsoft', 'online', '(natural)'].includes(n.toLowerCase()))[0]
        .replace(/([a-z])([A-Z])/g, '$1 $2')

      return v
    })
    .sort((a, b) => a.FriendlyName > b.FriendlyName ? 1 : -1)
})

function hide() {
  const element = document.getElementById('voice_select_modal') as HTMLDialogElement

  if (element.open) {
    element.close()
  }
}

function useVoice(voice: IAiVoice) {
  readerStore.selections.voice = voice.ShortName
  readerStore.selections.url = voice.imageurl
  clearAudioState()
}

function isPlaying(voice: IAiVoice) {
  if (sampleVoice.value?.ShortName !== voice.ShortName) return false
  if (!sampleAudio.value) return false
  return !sampleAudio.value.paused
}

async function toggleSample(voice: IAiVoice) {
  if (sampleVoice.value?.ShortName === voice.ShortName && sampleAudio.value && !sampleAudio.value.paused) {
    sampleAudio.value.pause()
    sampleVoice.value = undefined
    return
  }

  sampleVoice.value = null
  const text = await DadJokesService.getJoke()
  const { audio: audioStr } = await TtsService.getBase64StrAudio(text, voice.ShortName)
  sampleAudio.value = new Audio(audioStr)
  sampleAudio.value.play()
  sampleAudio.value.addEventListener('ended', () => {
    sampleVoice.value = undefined
    sampleAudio.value = undefined
  })
  sampleVoice.value = voice
}

function previewIcon(voice: IAiVoice) {
  return isPlaying(voice) ? 'bi-pause' : 'bi-play'
}
</script>
