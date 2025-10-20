<template>
  <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
    <h2 class="text-2xl font-bold mb-8 text-blue-700 flex items-center gap-2">
      <svg
        class="w-7 h-7 text-blue-400"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8 12h8m-4-4v8"
        />
      </svg>
      Tạo đơn hàng mới
    </h2>
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Cột 1: Thông tin đơn hàng + nút tạo đơn -->
        <div class="space-y-6 flex flex-col h-full">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Người đặt hàng</label>
            <select
              v-model="form.owner"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-50"
            >
              <option value="" disabled>Chọn người đặt</option>
              <option v-for="p in allPeople" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Mô tả đơn hàng</label>
            <input
              v-model="form.description"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-50"
              placeholder="Nhập mô tả..."
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Tổng tiền (VNĐ)</label>
            <input
              v-model.number="form.total_paid"
              type="number"
              min="0"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-50"
              placeholder="Nhập tổng tiền"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Ngày đặt</label>
            <input
              v-model="form.date_order"
              type="date"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 bg-gray-50"
            />
          </div>
          <div class="mt-8 flex justify-center">
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition text-sm"
            >
              Tạo đơn hàng
            </button>
          </div>
        </div>

        <!-- Cột 2: Chia đều (auto share) -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Chia đều (auto share)</label
          >
          <div
            v-for="(item, idx) in form.list_dep_auto_share"
            :key="idx"
            class="flex flex-wrap items-center gap-4 mb-4 bg-gradient-to-r from-green-100 to-green-50 rounded-2xl p-4 shadow-lg"
          >
            <div class="flex items-center gap-2 min-w-[120px]">
              <div
                class="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white font-bold text-base"
              >
                {{ item.name_dep ? item.name_dep[0]?.toUpperCase() : '?' }}
              </div>
              <select
                v-model="item.name_dep"
                class="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-green-500 bg-white font-medium w-[120px]"
              >
                <option value="" disabled>Chọn người</option>
                <option v-for="p in allPeople" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div class="flex items-center">
              <input
                v-model.number="item.quantity_dep"
                type="number"
                min="1"
                class="w-20 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-green-500 bg-white font-medium"
                placeholder="Số lượng"
              />
              <span class="ml-2 text-gray-500 text-sm">người</span>
            </div>
            <!-- Thêm input mô tả cho từng người chia đều -->
            <input
              v-model="item.description_dep"
              type="text"
              class="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-green-500 bg-white font-medium w-40"
              placeholder="Mô tả"
            />
            <button
              type="button"
              @click="removeAutoShare(idx)"
              class="ml-auto rounded-full p-2 transition flex items-center justify-center hover:bg-red-100 group"
              title="Xóa"
            >
              <svg
                class="w-5 h-5 text-red-500 group-hover:text-red-700"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            @click="addAutoShare"
            class="text-green-600 hover:underline text-sm mt-1 font-semibold"
          >
            + Thêm người chia đều
          </button>
        </div>

        <!-- Cột 3: Chia theo giá (specific price) -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"
            >Chia theo giá (specific price)</label
          >
          <div
            v-for="(item, idx) in form.list_dep_specific_price"
            :key="idx"
            class="flex flex-wrap items-center gap-4 mb-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl p-4 shadow-lg"
          >
            <div class="flex items-center gap-2 min-w-[120px]">
              <div
                class="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-base"
              >
                {{ item.name_dep ? item.name_dep[0]?.toUpperCase() : '?' }}
              </div>
              <select
                v-model="item.name_dep"
                class="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 bg-white font-medium w-[120px]"
              >
                <option value="" disabled>Chọn người</option>
                <option v-for="p in allPeople" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div class="flex items-center">
              <input
                v-model.number="item.price_dep"
                type="number"
                min="0"
                class="w-28 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 bg-white font-medium"
                placeholder="Số tiền"
              />
              <span class="ml-2 text-gray-500 text-sm">đ</span>
            </div>
            <!-- Thêm input mô tả cho từng người chia giá -->
            <input
              v-model="item.description_dep"
              type="text"
              class="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 bg-white font-medium w-40"
              placeholder="Mô tả"
            />
            <button
              type="button"
              @click="removeSpecificPrice(idx)"
              class="ml-auto rounded-full p-2 transition flex items-center justify-center hover:bg-red-100 group"
              title="Xóa"
            >
              <svg
                class="w-5 h-5 text-red-500 group-hover:text-red-700"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            @click="addSpecificPrice"
            class="text-blue-600 hover:underline text-sm mt-1 font-semibold"
          >
            + Thêm người chia giá
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import router from '@/router'
import api from '@/utils/axios'
import { handleError } from '@/utils/handler-error'
import { useLocalStorage } from '@/utils/local-storage'

const allPeople = ['thaopv1', 'vunx', 'bacnt'] as const
type TAllPeopleHardcode = (typeof allPeople)[number]

type TAutoShare = {
  name_dep: TAllPeopleHardcode
  description_dep?: string
  quantity_dep: number
  state_dep: 'no_paid' | 'paid'
}
type TSpecificPrice = {
  name_dep: TAllPeopleHardcode
  description_dep?: string
  price_dep: number
  state_dep: 'no_paid' | 'paid'
}
export type TOrderForm = {
  owner: TAllPeopleHardcode | ''
  description: string
  total_paid: number
  date_order: string
  status: 'created' | 'ordered' | 'paid'
  list_dep_auto_share: TAutoShare[]
  list_dep_specific_price: TSpecificPrice[]
}

const route = useRoute()
const username = useLocalStorage<TAllPeopleHardcode>('username')

const { date } = route.query

const form = ref<TOrderForm>({
  owner: username.value!,
  description: 'ăn trưa',
  total_paid: 0,
  date_order: <string>date ?? new Date().toISOString().slice(0, 10),
  status: 'created',
  list_dep_auto_share: [],
  list_dep_specific_price: [],
})

function addAutoShare() {
  form.value.list_dep_auto_share.push({
    name_dep: '' as TAllPeopleHardcode,
    description_dep: 'gì cũng được',
    quantity_dep: 1,
    state_dep: 'no_paid',
  })
}
function removeAutoShare(idx: number) {
  form.value.list_dep_auto_share.splice(idx, 1)
}

function addSpecificPrice() {
  form.value.list_dep_specific_price.push({
    name_dep: '' as TAllPeopleHardcode,
    description_dep: 'gì cũng được',
    price_dep: 0,
    state_dep: 'no_paid',
  })
}
function removeSpecificPrice(idx: number) {
  form.value.list_dep_specific_price.splice(idx, 1)
}

async function handleSubmit() {
  if (!form.value.owner || !form.value.date_order) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc!')
    return
  }

  try {
    await api.post('/orders', form.value)

    await router.push({ name: 'dashboard' })
  } catch (e) {
    handleError(e as Error)
  }
}
</script>

<style lang="scss"></style>
