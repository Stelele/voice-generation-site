<template>
  <div
    class="w-full h-14 bg-base-300 flex justify-between items-center py-2 px-3.5 rounded-box border-b-2 border-base-100">
    <div class="flex items-center hover:cursor-pointer" @click="toggleCloudClick"
      @mouseover="toggleCloudAnimation(true)" @mouseleave="toggleCloudAnimation(false)">
      <OhVueIcon name="fa-cloudversify" :scale="2.8" :animation="cloudAnimation" />
    </div>
    <div class="flex gap-7 items-center h-full">
      <div>
        <button class="btn btn-circle btn-ghost">
          <OhVueIcon name="bi-gear-fill" :scale="1.4" />
        </button>
      </div>
      <div v-for="button, idx in midButtons" :key="idx">
        <button class="btn btn-circle btn-ghost">
          <OhVueIcon :name="button.icon" :scale="button.scale ?? 1.6" @click="button.onClick" />
        </button>
      </div>
      <div class="dropdown dropdown-center">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <OhVueIcon name="bi-gear-fill" :scale="1.4" />
        </div>
        <div tabindex="0" class="dropdown-content card card-sm bg-base-200 z-1 w-64 shadow-md">
          <div class="card-body prose text-center">
            <h3 class="font-extrabold">Speed: {{ speakingSpeed }}x</h3>
            <input type="range" min="-100" max="100" value="0" class="range range-sm" step="10"
              v-model="readerStore.synthOptions.rate" />
            <div class="flex justify-between px-2.5 mt-2 text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
            <div class="flex justify-between px-0.5 mt-2 text-xs text-center">
              <span>0.0x</span>
              <span>0.5x</span>
              <span>1.0x</span>
              <span>1.5x</span>
              <span>2.0x</span>
            </div>
            <h3 class="font-extrabold">Pitch: {{ pitchSize }}x</h3>
            <input type="range" min="-100" max="100" value="0" class="range range-sm" step="10"
              v-model="readerStore.synthOptions.pitch" />
            <div class="flex justify-between px-2.5 mt-2 text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
            <div class="flex justify-between px-0.5 mt-2 text-xs text-center">
              <span>0.0x</span>
              <span>0.5x</span>
              <span>1.0x</span>
              <span>1.5x</span>
              <span>2.0x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-4 items-center h-full">
      <div class="hover:cursor-pointer h-fit w-fit">
        <OhVueIcon name="bi-badge-cc" :scale="1.2" />
      </div>
      <div class="hover:cursor-pointer h-fit w-fit">
        <OhVueIcon name="bi-clipboard2" :scale="1.2" />
      </div>
      <div class="hover:cursor-pointer h-fit w-fit">
        <OhVueIcon name="fa-regular-save" :scale="1.2" />
      </div>
      <div class="hover:cursor-pointer h-fit w-fit">
        <OhVueIcon name="bi-search" :scale="1.2" />
      </div>
      <div class="hover:cursor-pointer h-fit w-fit">
        <OhVueIcon name="bi-three-dots" :scale="1.2" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { remap } from '@/helpers/functions';
import { TtsService } from '@/services/TtsService/TtsService';
import { useReaderStore } from '@/stores/ReaderStore';
import { OhVueIcon } from 'oh-vue-icons';
import { computed, ref } from 'vue';

const readerStore = useReaderStore()

interface Button {
  icon: string
  scale?: number
  disabled?: boolean
  onClick?: () => void
}

const midButtons = ref<Button[]>([
  {
    icon: "bi-arrow-counterclockwise",
  },
  {
    icon: "bi-play-circle-fill",
    scale: 2,
    onClick: playAudio,
  },
  {
    icon: "bi-arrow-clockwise"
  }
])

const cloudProps = ref({
  animate: false,
  toggle: true,
})
const cloudAnimation = computed(() => cloudProps.value.animate ? 'pulse' : undefined)

const speakingSpeed = computed(() => remap(readerStore.synthOptions.rate ?? 0, { min: -100, max: 100 }, { min: 0, max: 2 }).toFixed(1))
const pitchSize = computed(() => remap(readerStore.synthOptions.pitch ?? 0, { min: -100, max: 100 }, { min: 0, max: 2 }).toFixed(1))

function toggleCloudAnimation(value: boolean) {
  cloudProps.value.animate = value
}

function toggleCloudClick() {
  cloudProps.value.toggle = !cloudProps.value.toggle
}

async function playAudio() {
  const audioStr = await TtsService.getBase64StrAudio(readerStore.text, undefined, readerStore.synthOptions)
  readerStore.audio = new Audio(audioStr)
  readerStore.audio.play()
}

</script>
