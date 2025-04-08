<template>
  <div class="flex w-full h-full items-center justify-center pt-5">
    <div class="w-4/5 h-full skeleton">
      <textarea class="textarea textarea-lg w-full h-full" v-model="readerStore.text"></textarea>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useReaderStore } from '@/stores/ReaderStore';


const readerStore = useReaderStore()
</script>
