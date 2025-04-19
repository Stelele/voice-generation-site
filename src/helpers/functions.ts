import { useReaderStore } from "@/stores/ReaderStore";

export type Range = { min: number; max: number }
export function remap(value: number, oldRange: Range, newRange: Range) {
  const oldR = (oldRange.max - oldRange.min)
  if (oldR === 0) return (newRange.max + newRange.min) / 2

  const newR = newRange.max - newRange.min

  return (((value - oldRange.min) * newR) / oldR) + newRange.min
}


export function clearAudioState() {
  const readerStore = useReaderStore()
  if (!readerStore.audio) return

  readerStore.audio.pause()
  readerStore.audio = undefined

  const paragraphs = document.querySelectorAll('p')
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i]
    if (paragraph.classList.contains('highlighted-sentence')) {
      paragraph.classList.remove('highlighted-sentence')
      paragraph.innerHTML = readerStore.text.split("\n")[i]
    }
  }
}
