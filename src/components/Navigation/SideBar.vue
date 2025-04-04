<template>
  <div class="min-h-full bg-base-300 rounded-box w-21 gap-5 pt-3 flex flex-col">
    <div v-for="item, idx in items" :key="idx" @click="() => item.onClick ? item.onClick() : undefined"
      class="hover:cursor-pointer hover:bg-base-100 rounded-box p-1 w-full flex flex-col gap-0.5 justify-center items-center">
      <div>
        <OhVueIcon :name="item.icon" :scale="1.8" />
      </div>
      <div class="text-xs text-center">{{ item.label }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { OhVueIcon } from 'oh-vue-icons';
import { ref } from 'vue';

export interface Item {
  label: string
  icon: string
  onClick?: () => void
}

const items = ref<Item[]>([
  {
    label: "Text",
    icon: "fa-regular-edit",
  },
  {
    label: "Document",
    icon: "bi-upload",
  },
  {
    label: "Library",
    icon: "gi-bookshelf",
  },
  {
    label: "Voice Cloning",
    icon: "bi-people",
  },
  {
    label: "Login/SignUp",
    icon: "bi-person",
  }
])

</script>
