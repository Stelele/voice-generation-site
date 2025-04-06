<template>
  <div
    class="w-full h-14 bg-base-300 flex justify-between items-center py-2 px-3.5 rounded-box border-b-2 border-base-100">
    <div class="flex items-center hover:cursor-pointer" @click="toggleCloudClick"
      @mouseover="toggleCloudAnimation(true)" @mouseleave="toggleCloudAnimation(false)">
      <OhVueIcon name="fa-cloudversify" :scale="2.8" :animation="cloudAnimation" />
    </div>
    <div class="flex gap-7 items-center h-full">
      <div class="hover:cursor-pointer h-fit w-fit">
        <OhVueIcon name="bi-arrow-counterclockwise" :scale="1.5" />
      </div>
      <div class="hover:cursor-pointer h-fit w-fit">
        <OhVueIcon name="bi-play-circle-fill" :scale="1.8" @click="playAudio" />
      </div>
      <div class="hover:cursor-pointer h-fit w-fit">
        <OhVueIcon name="bi-arrow-clockwise" :scale="1.5" />
      </div>
      <div class="hover:cursor-pointer h-fit w-fit">
        <span>1x</span>
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
import { OhVueIcon } from 'oh-vue-icons';
import { computed, ref } from 'vue';
import { useReaderStore } from '@/stores/ReaderStore';
import { TtsService } from '@/services/TtsService/TtsService';

const readerStore = useReaderStore()

const cloudProps = ref({
  animate: false,
  toggle: true,
})
const cloudAnimation = computed(() => cloudProps.value.animate ? 'pulse' : undefined)

function toggleCloudAnimation(value: boolean) {
  cloudProps.value.animate = value
}

function toggleCloudClick() {
  cloudProps.value.toggle = !cloudProps.value.toggle
}

async function playAudio() {
  const base64AudioStr = await TtsService.getBase64StrAudio(readerStore.text)
  readerStore.audio = new Audio(base64AudioStr)
  readerStore.audio.play()
}
</script>
