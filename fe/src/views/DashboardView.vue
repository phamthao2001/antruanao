<template>
  <div
    class="h-screen w-screen bg-gradient-to-b from-gray-100 to-white flex flex-col overflow-hidden"
  >
    <!-- Header + chọn tuần trên cùng 1 hàng -->
    <header
      class="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-gray-50 gap-4"
    >
      <div class="flex items-center gap-4">
        <svg viewBox="0 0 24 24" class="w-12 h-12 text-blue-600 opacity-90" fill="currentColor">
          <path d="M12 2L3 7v7c0 5 4 9 9 9s9-4 9-9V7l-9-5z" />
        </svg>
        <div>
          <h1 class="text-lg font-bold text-gray-800">OrderBoard</h1>
          <p class="text-xs text-gray-400">Lịch đặt hàng nhóm</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span
          v-if="isCurrentWeek"
          class="bg-yellow-100 text-yellow-800 font-semibold px-3 py-2 rounded-lg shadow text-sm"
        >
          Đang chọn tuần này
        </span>
        <button
          type="button"
          @click="goPrevWeek"
          class="bg-gray-200 text-gray-700 font-semibold px-3 py-2 rounded-lg shadow hover:bg-gray-300 transition text-sm"
        >
          &larr; Tuần trước
        </button>
        <button
          type="button"
          class="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-200 transition text-sm"
          disabled
        >
          Từ: {{ monday }} &nbsp; đến: {{ sunday }}
        </button>
        <button
          type="button"
          @click="goNextWeek"
          class="bg-gray-200 text-gray-700 font-semibold px-3 py-2 rounded-lg shadow hover:bg-gray-300 transition text-sm"
        >
          Tuần sau &rarr;
        </button>
        <!-- Tên người dùng luôn ở cuối cùng -->
        <div class="flex items-center gap-2 ml-6">
          <div
            class="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold"
          >
            {{ username?.[0] ?? '?' }}
          </div>
          <div class="text-sm font-medium text-gray-700">{{ username }}</div>
        </div>
      </div>
    </header>
    <div class="flex-1 flex">
      <table class="w-full h-full bg-white rounded-xl shadow-lg table-fixed" style="height: 100%">
        <thead style="height: 64px">
          <tr class="bg-blue-100">
            <th
              v-for="day in daysOfWeek"
              :key="day"
              class="py-4 px-2 text-blue-700 font-semibold text-lg text-center border-r last:border-r-0"
            >
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              v-for="i in 7"
              :key="i"
              class="border-t border-r last:border-r-0 text-center align-top px-2"
              :style="{ height: 'calc(100vh - 64px - 68px - 80px)' }"
            >
              <div class="h-full overflow-y-auto px-1 scrollbar-hide flex flex-col">
                <!-- Hiển thị các đơn hàng theo ngày -->
                <template v-for="order in ordersByDay[i - 1]" :key="order._id">
                  <div
                    :class="[
                      'rounded-lg p-4 shadow text-left space-y-2 my-4 max-w-xs',
                      order.owner === username ? 'bg-blue-50' : 'bg-green-50',
                    ]"
                  >
                    <div v-if="order.owner === username" class="font-semibold text-blue-700">
                      Người đặt: <span class="text-gray-800">{{ order.owner }} (bạn)</span>
                    </div>
                    <div v-else class="font-semibold text-green-700">
                      Bạn được đặt bởi: <span class="text-gray-800">{{ order.owner }}</span>
                    </div>
                    <div
                      :class="
                        order.owner === username
                          ? 'font-semibold text-green-700'
                          : 'font-semibold text-blue-700'
                      "
                    >
                      Tổng tiền{{ order.owner === username ? '' : ' phần bạn' }}:
                      <span class="text-gray-800">
                        {{
                          order.owner === username
                            ? formatMoney(order.total_paid)
                            : formatMoney(getMyPrice(order))
                        }}
                        đ
                      </span>
                    </div>
                    <div class="text-gray-700">Mô tả: {{ order.description }}</div>
                    <!-- Danh sách người được đặt nếu bạn là người đặt -->
                    <div
                      v-if="order.owner === username && order.list_dep_auto_share?.length"
                      class="text-sm mt-2"
                    >
                      <div class="font-semibold text-gray-600 mb-1">Người được đặt (chia đều):</div>
                      <ul class="ml-2 list-disc text-gray-700">
                        <li v-for="item in order.list_dep_auto_share" :key="item.name_dep">
                          {{ item.name_dep }}
                          <span v-if="item.quantity_dep">({{ item.quantity_dep }} người)</span>
                          <!-- Trạng thái trả tiền -->
                          <span
                            :class="
                              item.state_dep === 'paid'
                                ? 'text-green-600 font-semibold ml-2'
                                : 'text-red-600 font-semibold ml-2'
                            "
                          >
                            {{ item.state_dep === 'paid' ? 'Đã trả' : 'Chưa trả' }}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div
                      v-if="order.owner === username && order.list_dep_specific_price?.length"
                      class="text-sm mt-2"
                    >
                      <div class="font-semibold text-gray-600 mb-1">
                        Người được đặt (chia theo giá):
                      </div>
                      <ul class="ml-2 list-disc text-gray-700">
                        <li v-for="item in order.list_dep_specific_price" :key="item.name_dep">
                          {{ item.name_dep }} - {{ formatMoney(item.price_dep) }} đ
                          <!-- Trạng thái trả tiền -->
                          <span
                            :class="
                              item.state_dep === 'paid'
                                ? 'text-green-600 font-semibold ml-2'
                                : 'text-red-600 font-semibold ml-2'
                            "
                          >
                            {{ item.state_dep === 'paid' ? 'Đã trả' : 'Chưa trả' }}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div class="flex gap-2 mt-4">
                      <button
                        v-if="order.owner !== username"
                        class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                      >
                        Trả tiền
                      </button>
                      <button
                        class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        v-if="order.owner === username"
                        class="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </template>
                <!-- Button thêm đơn luôn ở cuối mỗi body -->
                <div class="flex justify-center mt-4 mb-8">
                  <button
                    class="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition"
                    @click="goToNewOrder(i)"
                  >
                    + Thêm đơn
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import type { Data } from './MyOrdersView.vue'

import router from '@/router'
import api from '@/utils/axios'
import { handleError } from '@/utils/handler-error'
import { useLocalStorage } from '@/utils/local-storage'

const username = useLocalStorage<string>('username')

const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
const currentDate = ref(new Date())

function getMondayAndSunday(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((day + 6) % 7))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return [monday, sunday] as const
}

const [mondayDate, sundayDate] = getMondayAndSunday(currentDate.value)
const monday = ref(mondayDate.toISOString().slice(0, 10))
const sunday = ref(sundayDate.toISOString().slice(0, 10))

function goPrevWeek() {
  currentDate.value.setDate(currentDate.value.getDate() - 7)
  const [mon, sun] = getMondayAndSunday(currentDate.value)
  monday.value = mon.toISOString().slice(0, 10)
  sunday.value = sun.toISOString().slice(0, 10)
  fetchOrders()
}

function goNextWeek() {
  currentDate.value.setDate(currentDate.value.getDate() + 7)
  const [mon, sun] = getMondayAndSunday(currentDate.value)
  monday.value = mon.toISOString().slice(0, 10)
  sunday.value = sun.toISOString().slice(0, 10)
  fetchOrders()
}

// Xác định có phải tuần hiện tại không
const isCurrentWeek = computed(() => {
  const today = new Date()
  const [curMonday, curSunday] = getMondayAndSunday(today)
  return (
    monday.value === curMonday.toISOString().slice(0, 10) &&
    sunday.value === curSunday.toISOString().slice(0, 10)
  )
})

// Hàm lấy ngày theo index cột (i: 1 -> 7)
function goToNewOrder(i: number) {
  // i: 1 = Thứ 2, ..., 7 = Chủ nhật
  const date = new Date(monday.value)
  date.setDate(date.getDate() + (i - 1))
  const dateStr = date.toISOString().slice(0, 10)
  router.push({ path: '/orders/new', query: { date: dateStr } })
}

const data = ref<Data[]>([])

// Gom đơn hàng theo từng ngày trong tuần
const ordersByDay = computed(() => {
  // Tạo mảng 7 ngày rỗng
  const arr: Data[][] = Array.from({ length: 7 }, () => [])
  data.value.forEach((order) => {
    const idx = getDayIndex(order.date_order)
    if (idx >= 0 && idx < 7) arr[idx].push(order)
  })
  return arr
})

// Lấy index thứ trong tuần từ date_order (yyyy-mm-dd)
function getDayIndex(dateStr: string) {
  const d = new Date(dateStr)
  // getDay: 0=CN, 1=T2,...,6=T7 => cần chuyển về 0=T2,...,6=CN
  return (d.getDay() + 6) % 7
}

// Lấy số tiền phần của mình nếu là người được đặt
function getMyPrice(order: Data) {
  if (order.list_dep_specific_price) {
    const found = order.list_dep_specific_price.find(
      (item: any) => item.name_dep === username.value,
    )
    if (found) return found.price_dep
  }
  // Nếu không có chia theo giá, chia đều
  if (order.list_dep_auto_share) {
    const found = order.list_dep_auto_share.find((item: any) => item.name_dep === username.value)
    if (found && order.total_paid && found.quantity_dep) {
      // Tính phần tiền chia đều (nếu có quantity)
      const totalQuantity = order.list_dep_auto_share.reduce(
        (sum: number, item: any) => sum + (item.quantity_dep || 1),
        0,
      )
      return Math.round((order.total_paid * (found.quantity_dep || 1)) / totalQuantity)
    }
  }
  return 0
}

function formatMoney(v: number) {
  return (v || 0).toLocaleString('vi-VN')
}

async function fetchOrders() {
  try {
    const res: Data[] = await api.get('/dashboard', {
      params: {
        owner: username.value,
        from: monday.value,
        to: sunday.value,
        list_depend: username.value,
      },
    })
    data.value = res
  } catch (err) {
    handleError(err as Error)
  }
}

onMounted(fetchOrders)
</script>
