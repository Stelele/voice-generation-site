<template>
  <div class="flex w-full h-full items-center justify-center pt-5">
    <div class="w-4/5 h-full skeleton">
      <textarea v-model="readerStore.text" class="textarea textarea-lg w-full h-full"></textarea>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useReaderStore } from '@/stores/ReaderStore';


const readerStore = useReaderStore()
</script>
