<template>
  <div
    class="w-3/4 h-full ml-[10%] mr-[10%] bg-base-200 mt-10 px-4 py-5 rounded-box prose max-w-none sm:prose-lg md:prose-xl lg:prose-2xl">
    <p :id="`p-${idx}`" v-for="paragraph, idx in paragraphs" v-once :key="idx" contenteditable="true"
      @input="(e) => updateContent(e, idx)" @keydown.prevent.enter="createParagraphs(idx)">{{
        paragraph }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useReaderStore } from '@/stores/ReaderStore';
import { ref } from 'vue';

const readerStore = useReaderStore()

const paragraphs = ref(readerStore.text.split('\n'))

function updateContent(event: Event, index: number) {
  const newText = (event.target as HTMLParagraphElement).innerText

  paragraphs.value[index] = newText
  readerStore.text = paragraphs.value.join('\n')
}

function createParagraphs(index: number) {
  const pEls = document.querySelectorAll('p')

  const p = document.createElement('p')
  p.contentEditable = "true"
  p.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
      createParagraphs(index + 1)
      e.preventDefault()
    }
  })
  p.addEventListener('input', (e) => updateContent(e, index + 1))

  pEls[index]?.insertAdjacentElement("afterend", p)
  p.focus()

  paragraphs.value = [...paragraphs.value.slice(0, index + 1), "", ...paragraphs.value.slice(index + 1)]

}
</script>
