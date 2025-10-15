<template>
  <div>
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50"
      style="opacity: 0.4"
    >
      <div class="flex flex-col items-center">
        <div
          class="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="mt-4 text-white text-lg font-semibold">Đang tải...</span>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useLoading } from './utils/loading'

const { loading } = useLoading()
</script>
