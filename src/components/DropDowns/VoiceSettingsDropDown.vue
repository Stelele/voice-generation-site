<template>
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
</template>

<script lang="ts" setup>
import { remap } from '@/helpers/functions';
import { useReaderStore } from '@/stores/ReaderStore';
import { computed } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';

const readerStore = useReaderStore()

const speakingSpeed = computed(() => remap(readerStore.synthOptions.rate ?? 0, { min: -100, max: 100 }, { min: 0, max: 2 }).toFixed(1))
const pitchSize = computed(() => remap(readerStore.synthOptions.pitch ?? 0, { min: -100, max: 100 }, { min: 0, max: 2 }).toFixed(1))
</script>
