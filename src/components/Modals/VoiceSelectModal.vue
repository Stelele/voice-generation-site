<template>
  <dialog id="voice_select_modal" class="modal">
    <div class="modal-box w-lg max-h-[80vh]" v-on-click-outside="hide">
      <div class="flex flex-col gap-1 w-full h-full pt">
        <div class="flex flex-col gap-3 sticky -top-7 z-10 bg-base-200">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 class="text-lg font-bold">Voices</h3>
          <div class="flex gap-1 w-full">
            <div class="flex-grow w-full items-center">
              <select class="select w-full" v-model="readerStore.selections.local">
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
              <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" />
              </div>
              <div class="list-col-grow">
                <div>{{ voice.FriendlyName }}</div>
                <div class="text-xs uppercase font-semibold opacity-60">{{ voice.Gender }}</div>
              </div>
              <div>
                <button class="btn btn-sm btn-ghost" :class="{
                  'invisible group-hover:visible': readerStore.selections.voice !== voice.ShortName,
                }">
                  <OhVueIcon name="bi-play" :scale="2" />
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
import type { IAiVoice } from '@/services/TtsService/EdgeTTS';
import { useReaderStore } from '@/stores/ReaderStore';
import { vOnClickOutside } from '@vueuse/components';
import { OhVueIcon } from 'oh-vue-icons';
import { computed } from 'vue';

const readerStore = useReaderStore()

const filteredVoices = computed(() => {
  return readerStore.voices
    .filter(v => v.Locale === readerStore.selections.local)
    .map(v => {
      v.FriendlyName = v.FriendlyName.split('-')[0].trim()
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
}
</script>
