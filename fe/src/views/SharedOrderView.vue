<template>
  <div class="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
    <h2 class="text-xl font-bold text-blue-700 mb-6">Tham gia đơn hàng #{{ orderId }}</h2>
    <!-- Thông tin đơn hàng được share -->
    <div v-if="order" class="mb-8 p-4 rounded-lg bg-gray-50 border border-gray-200">
      <div class="mb-2 text-base font-semibold text-gray-800">
        Mô tả: <span class="font-normal">{{ order.description }}</span>
      </div>
      <div class="mb-2 text-sm text-gray-600">
        Người đặt: <span class="font-semibold text-blue-700">{{ order.owner }}</span>
      </div>
      <div class="mb-2 text-sm text-gray-600">
        Ngày đặt:
        <span class="font-semibold">{{
          order.date_order ? new Date(order.date_order).toLocaleDateString('vi-VN') : ''
        }}</span>
      </div>
      <div class="mb-2 text-sm text-gray-600">
        Tổng tiền:
        <span class="font-semibold text-orange-700">{{ formatMoney(order.total_paid) }} đ</span>
      </div>
      <div class="mb-2 text-sm text-gray-600">
        Trạng thái:
        <span
          :class="[
            'px-2 py-1 rounded text-xs font-semibold',
            order.status === 'ordered'
              ? 'bg-green-200 text-green-800'
              : order.status === 'paid'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-700',
          ]"
        >
          {{
            order.status === 'ordered'
              ? 'Đã đặt'
              : order.status === 'paid'
                ? 'Đã thanh toán'
                : 'Mới tạo'
          }}
        </span>
      </div>
      <div v-if="order.list_dep_auto_share?.length" class="mb-2 text-sm">
        <span class="font-semibold text-gray-700">Người được đặt (chia đều):</span>
        <ul class="ml-4 list-disc">
          <li
            v-for="item in order.list_dep_auto_share"
            :key="item.name_dep"
            class="flex items-center gap-2 mb-1"
          >
            <span class="font-semibold text-gray-800">{{ item.name_dep }}</span>
            <span v-if="item.quantity_dep" class="text-xs text-gray-500"
              >({{ item.quantity_dep }} người)</span
            >
            <span v-if="item.description_dep" class="italic text-gray-500"
              >- {{ item.description_dep }}</span
            >
          </li>
        </ul>
      </div>
      <div v-if="order.list_dep_specific_price?.length" class="mb-2 text-sm">
        <span class="font-semibold text-gray-700">Người được đặt (chia theo giá):</span>
        <ul class="ml-4 list-disc">
          <li
            v-for="item in order.list_dep_specific_price"
            :key="item.name_dep"
            class="flex items-center gap-2 mb-1"
          >
            <span class="font-semibold text-gray-800">{{ item.name_dep }}</span>
            <span v-if="item.price_dep" class="text-xs text-gray-500"
              >- {{ formatMoney(item.price_dep) }} đ</span
            >
            <span v-if="item.description_dep" class="italic text-gray-500"
              >- {{ item.description_dep }}</span
            >
          </li>
        </ul>
      </div>
    </div>
    <!-- Phần của bạn: autoShare và specificPrice theo hàng dọc -->
    <div class="mb-8">
      <div class="font-semibold text-gray-700 mb-2">
        Phần của bạn: <span class="text-blue-700">{{ username }}</span>
      </div>
      <div class="flex flex-col gap-6">
        <!-- Chia đều (auto share) -->
        <div class="flex flex-col gap-2 border rounded-lg p-4 bg-green-50">
          <label class="font-medium text-green-700 mb-1">Chia đều (auto share)</label>
          <template v-if="autoShare.isCreate">
            <input
              v-model="autoShare.quantity_dep"
              type="number"
              min="1"
              class="border border-gray-300 rounded-lg px-2 py-1 w-32"
              placeholder="Số lượng"
            />
            <input
              v-model="autoShare.description_dep"
              type="text"
              class="border border-gray-300 rounded-lg px-2 py-1 w-full"
              placeholder="Mô tả (tuỳ chọn)"
            />
            <div class="flex gap-2 mt-2">
              <button
                class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition w-fit"
                @click="removeMyAutoShare"
              >
                Xóa phần của bạn
              </button>
            </div>
          </template>
          <template v-else>
            <div class="flex gap-2 mt-2">
              <button
                class="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition w-fit"
                @click="joinAutoShare"
              >
                Thêm bản thân vào chia đều
              </button>
            </div>
          </template>
        </div>
        <!-- Chia theo giá (specific price) -->
        <div class="flex flex-col gap-2 border rounded-lg p-4 bg-blue-50">
          <label class="font-medium text-blue-700 mb-1">Chia theo giá (specific price)</label>
          <template v-if="specificPrice.isCreate">
            <input
              v-model.number="specificPrice.price_dep"
              type="number"
              min="0"
              class="border border-gray-300 rounded-lg px-2 py-1 w-32"
              placeholder="Số tiền"
            />
            <input
              v-model="specificPrice.description_dep"
              type="text"
              class="border border-gray-300 rounded-lg px-2 py-1 w-full"
              placeholder="Mô tả (tuỳ chọn)"
            />
            <div class="flex gap-2 mt-2">
              <button
                class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition w-fit"
                @click="removeMySpecificPrice"
              >
                Xóa phần của bạn
              </button>
            </div>
          </template>
          <template v-else>
            <div class="flex gap-2 mt-2">
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition w-fit"
                @click="joinSpecificPrice"
              >
                Thêm bản thân vào chia theo giá
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-8">
      <button
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
        @click="updateOrder"
      >
        Cập nhật đơn hàng
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import type { Data } from './MyOrdersView.vue'

import router from '@/router'
import api from '@/utils/axios'
import { handleError } from '@/utils/handler-error'
import { useLocalStorage } from '@/utils/local-storage'

const route = useRoute()
const username = useLocalStorage<string>('username')
const { orderId } = route.params

const order = ref<Data | null>(null)

function formatMoney(val: number) {
  return val?.toLocaleString('vi-VN')
}

const autoShare = ref<{
  description_dep?: string
  quantity_dep: number
  isCreate: boolean
}>({
  description_dep: 'gì cũng được',
  quantity_dep: 1,
  isCreate: false,
})
const specificPrice = ref<{
  description_dep?: string
  price_dep: number
  isCreate: boolean
}>({
  description_dep: 'gì cũng được',
  price_dep: 0,
  isCreate: false,
})

onMounted(async () => {
  try {
    const res: Data = await api.get(`/orders/shared/${orderId}`)

    const auto = (res.list_dep_auto_share || []).find((item) => item.name_dep === username.value)
    const specific = (res.list_dep_specific_price || []).find(
      (item) => item.name_dep === username.value,
    )

    if (auto) {
      autoShare.value = {
        description_dep: auto.description_dep || '',
        quantity_dep: auto.quantity_dep,
        isCreate: true,
      }
    }

    if (specific) {
      specificPrice.value = {
        description_dep: specific.description_dep || '',
        price_dep: specific.price_dep,
        isCreate: true,
      }
    }

    res.list_dep_auto_share = res.list_dep_auto_share.filter(
      (item) => item.name_dep !== username.value,
    )
    res.list_dep_specific_price = res.list_dep_specific_price.filter(
      (item) => item.name_dep !== username.value,
    )

    order.value = res
  } catch (error) {
    handleError(error as Error)
    router.push('/dashboard')
  }
})

function removeMyAutoShare() {
  autoShare.value = {
    description_dep: 'gì cũng được',
    quantity_dep: 1,
    isCreate: false,
  }
}

function removeMySpecificPrice() {
  specificPrice.value = {
    description_dep: 'gì cũng được',
    price_dep: 0,
    isCreate: false,
  }
}

function joinAutoShare() {
  autoShare.value.isCreate = true
}

function joinSpecificPrice() {
  specificPrice.value.isCreate = true
}

function updateOrder() {}
</script>

<style lang="scss"></style>
