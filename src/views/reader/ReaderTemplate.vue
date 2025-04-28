<template>
  <div class="flex flex-col min-h-[100vh] min-w-[100vw]">
    <div>
      <TopAppBar />
    </div>
    <div class="flex flex-grow gap-1">
      <SideBar />
      <div class="flex-grow">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TopAppBar from '@/components/Navigation/TopAppBar.vue';
import SideBar from '@/components/Navigation/SideBar.vue';
</script>
