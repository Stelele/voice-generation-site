<template>
  <dialog id="voice_select_modal" class="modal">
    <div class="modal-box w-sm max-h-[80vh]" v-on-click-outside="hide">
      <div class="flex flex-col gap-1 w-full h-full pt">
        <div class="flex flex-col gap-3 sticky -top-7 z-10 bg-base-200">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 class="text-lg font-bold">Voices</h3>
          <div class="flex gap-1 w-full">
            <div class="flex-grow w-full items-center">
              <select class="select w-full">
                <option disabled selected>Pick a color</option>
                <option>Crimson</option>
                <option>Amber</option>
                <option>Velvet</option>
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
            <li v-for="i in 30" :key="i" class="list-row group items-center hover:bg-base-300/60">
              <div><img class="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" />
              </div>
              <div class="list-col-grow">
                <div>Dua Lipa</div>
                <div class="text-xs uppercase font-semibold opacity-60">Remaining Reason</div>
              </div>
              <div>
                <button class="btn btn-square btn-sm btn-ghost invisible group-hover:visible">
                  <svg class="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"
                      stroke="currentColor">
                      <path d="M6 3L20 12 6 21 6 3z"></path>
                    </g>
                  </svg>
                </button>
              </div>
              <div>
                <button class="btn btn-primary btn-sm btn-outline invisible group-hover:visible">
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
import { vOnClickOutside } from '@vueuse/components';
import { OhVueIcon } from 'oh-vue-icons';

function hide() {
  const element = document.getElementById('voice_select_modal') as HTMLDialogElement

  if (element.open) {
    element.close()
  }
}
</script>
