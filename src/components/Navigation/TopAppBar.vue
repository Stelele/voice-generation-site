<template>
  <div
    class="w-full h-14 bg-base-300 flex justify-between items-center py-2 px-3.5 rounded-box border-b-2 border-base-100">
    <div class="flex items-center hover:cursor-pointer" @click="toggleCloudClick"
      @mouseover="toggleCloudAnimation(true)" @mouseleave="toggleCloudAnimation(false)">
      <OhVueIcon name="fa-cloudversify" :scale="2.8" :animation="cloudAnimation" />
    </div>
    <div class="flex gap-7 items-center h-full">
      <div>
        <button class="btn btn-circle btn-ghost" @click="openModal('voice_select_modal')">
          <img :src="readerStore.selections.url" />
        </button>
      </div>
      <div v-for="button, idx in midButtons" :key="idx">
        <button :disabled="button.disabled" class="btn btn-circle btn-ghost">
          <OhVueIcon :name="button.icon" :scale="button.scale ?? 1.6" @click="button.onClick" />
        </button>
      </div>
      <VoiceSettingsDropDown />
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
  <VoiceSelectModal />
</template>

<script lang="ts" setup>
import { TtsService } from '@/services/TtsService/TtsService';
import { useReaderStore } from '@/stores/ReaderStore';
import { OhVueIcon } from 'oh-vue-icons';
import { computed, ref } from 'vue';
import VoiceSettingsDropDown from '@/components/DropDowns/VoiceSettingsDropDown.vue';
import VoiceSelectModal from '@/components/Modals/VoiceSelectModal.vue';
import { clearAudioState } from '@/helpers/functions';

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


function toggleCloudAnimation(value: boolean) {
  cloudProps.value.animate = value
}

function toggleCloudClick() {
  cloudProps.value.toggle = !cloudProps.value.toggle
}

async function playAudio() {
  if (readerStore.audio && !readerStore.audio.paused) {
    midButtons.value[1].icon = "bi-play-circle-fill"
    readerStore.audio.pause()
    return
  } else if (readerStore.audio) {
    readerStore.audio.play()
    midButtons.value[1].icon = "bi-pause-circle-fill"
    return
  }

  midButtons.value[1].disabled = true

  const { audio: audioStr, metaData } = await TtsService.getBase64StrAudio(readerStore.text, readerStore.selections.voice, readerStore.synthOptions)
  readerStore.metaData = metaData

  readerStore.audio = new Audio(audioStr)
  readerStore.audio.play()
  readerStore.audio.addEventListener('ended', () => {
    midButtons.value[1].icon = "bi-play-circle-fill"
    clearAudioState()
  })
  readerStore.audio.addEventListener('timeupdate', () => {
    const curTime = readerStore.audio?.currentTime
    if (curTime === undefined) return

    const unchangedText = readerStore.text.split('\n')

    const paragraphs = document.querySelectorAll('p')
    const curSentence = readerStore.timeSlices.sentenceSlices
      .find(slice => slice.minTime <= curTime && slice.maxTime > curTime)

    if (!curSentence) return

    const curParagraphId = `p-${curSentence.index}`
    let curParagraph: HTMLParagraphElement | undefined = undefined
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i]
      if (paragraph.id !== curParagraphId) {
        if (paragraph.classList.contains('highlighted-sentence')) {
          paragraph.classList.remove('highlighted-sentence')
          paragraph.innerHTML = unchangedText[i]
        }
        continue
      }

      if (!paragraph.classList.contains('highlighted-sentence')) {
        paragraph.classList.add('highlighted-sentence')
      }

      curParagraph = paragraph
    }

    if (!curSentence.children) return

    const curWord = curSentence.children?.find(c => c.minTime <= curTime && c.maxTime > curTime)
    if (!curWord) return

    const unchangedWords = unchangedText[curSentence.index].split(" ")
    const wordIndex = curWord.index - curSentence.children[0].index
    unchangedWords[wordIndex] = `<span class="highlighted-word">${unchangedWords[wordIndex]}</span>`

    if (curParagraph) {
      curParagraph.innerHTML = unchangedWords.join(" ")
    }
  })

  midButtons.value[1].icon = "bi-pause-circle-fill"
  midButtons.value[1].disabled = false
}

function openModal(elementId: string) {
  const el = document.getElementById(elementId) as HTMLDialogElement
  el.showModal()
}

</script>

<style>
.highlighted-sentence {
  background-color: var(--color-primary);
}

.highlighted-word {
  background-color: var(--color-secondary);
}
</style>
