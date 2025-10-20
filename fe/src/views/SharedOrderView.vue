<template>
  <div>{{ orderId }}</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import router from '@/router'
import api from '@/utils/axios'
import { handleError } from '@/utils/handler-error'

const route = useRoute()

const { orderId } = route.params

onMounted(async () => {
  try {
    await api.get(`/orders/shared/${orderId}`)
  } catch (error) {
    handleError(error as Error)

    router.push('/dashboard')
  }
})
</script>

<style lang="scss"></style>
