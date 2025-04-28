<template>
  <div class="flex w-full h-full flex-col">
    <div class="navbar bg-base-100 shadow-sm">
      <div class="flex-1 text-xl">
        <OhVueIcon name="fa-cloudversify" :scale="3" /> Reader
      </div>
      <div class="flex-none">
        <RouterLink to="/reader">
          <button class="btn btn-primary">
            Get Started
          </button>
        </RouterLink>
      </div>
    </div>
    <div class="text-5xl text-center mt-16 font-extralight">
      <h1>AI Text To Speech</h1>
    </div>
    <div class="text-7xl text-center mt-16 font-extrabold">
      <h2>Cloud Reader</h2>
    </div>
    <VoiceCatalogue />
  </div>
</template>

<script lang="ts" setup>
import { OhVueIcon } from 'oh-vue-icons';
import VoiceCatalogue from '@/partials/home/VoiceCatalogue.vue';
</script>
