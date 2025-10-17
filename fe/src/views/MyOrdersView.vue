<template>
  <div class="max-w-4xl mx-auto py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
      <h2 class="text-xl font-bold text-blue-700">Đơn hàng của {{ username }}</h2>
      <div v-if="from && to" class="text-sm text-gray-500">
        Khoảng thời gian:
        <span class="font-semibold text-blue-600">{{ from }}</span>
        &rarr;
        <span class="font-semibold text-blue-600">{{ to }}</span>
      </div>
    </div>
    <div v-if="data.length === 0" class="text-gray-400 text-center py-8">
      Không có đơn hàng nào.
    </div>
    <div v-else class="space-y-6">
      <div
        v-for="order in data"
        :key="order._id || order.date_order + order.owner"
        class="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center gap-4"
      >
        <!-- Thông tin đơn hàng -->
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="font-semibold text-gray-700">Người đặt:</span>
            <span class="text-blue-600 font-bold">{{ order.owner }}</span>
          </div>
          <div class="mb-1">
            <span class="font-semibold text-gray-700">Mô tả:</span>
            <span class="text-gray-600">{{ order.description }}</span>
          </div>
          <div class="mb-1">
            <span class="font-semibold text-gray-700">Tổng tiền:</span>
            <span class="text-green-600 font-bold"
              >{{ (order.total_paid || 0).toLocaleString('vi-VN') }} đ</span
            >
          </div>
          <div class="mb-1">
            <span class="font-semibold text-gray-700">Ngày đặt:</span>
            <span class="text-gray-600">{{ order.date_order }}</span>
          </div>
          <div v-if="order.list_dep_auto_share?.length">
            <span class="font-semibold text-gray-700">Chia đều:</span>
            <ul class="ml-2 list-disc text-gray-600 text-sm">
              <li v-for="item in order.list_dep_auto_share" :key="item.name_dep">
                {{ item.name_dep }} - {{ item.quantity_dep }} người
              </li>
            </ul>
          </div>
          <div v-if="order.list_dep_specific_price?.length">
            <span class="font-semibold text-gray-700">Chia theo giá:</span>
            <ul class="ml-2 list-disc text-gray-600 text-sm">
              <li v-for="item in order.list_dep_specific_price" :key="item.name_dep">
                {{ item.name_dep }} - {{ (item.price_dep || 0).toLocaleString('vi-VN') }} đ
              </li>
            </ul>
          </div>
        </div>
        <!-- Button thao tác -->
        <div class="flex flex-col gap-2 min-w-[120px]">
          <button
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-4 rounded-lg shadow transition text-sm"
          >
            Cập nhật
          </button>
          <button
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-lg shadow transition text-sm"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import type { TOrderForm } from './NewOrderView.vue'

import api from '@/utils/axios'
import { handleError } from '@/utils/handler-error'
import { useLocalStorage } from '@/utils/local-storage'

const route = useRoute()
const username = useLocalStorage<string>('username')

const { from, to } = route.query

export type Data = TOrderForm & {
  _id: string
}

const data = ref<Data[]>([])

onMounted(async () => {
  try {
    const res: Data[] = await api.get('/orders', {
      params: {
        owner: username.value,
        from,
        to,
      },
    })

    data.value = res
  } catch (err) {
    handleError(err as Error)
  }
})
</script>

<style lang="scss"></style>
