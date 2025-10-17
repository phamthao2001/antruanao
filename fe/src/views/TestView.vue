<template>
  <div
    class="h-screen w-screen bg-gradient-to-b from-gray-100 to-white flex flex-col overflow-hidden"
  >
    <!-- Button chuyển tuần -->
    <div class="flex justify-end items-center gap-2 p-4">
      <span
        v-if="isCurrentWeek"
        class="bg-yellow-100 text-yellow-800 font-semibold px-3 py-2 rounded-lg shadow text-sm mr-2"
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
    </div>
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
              :style="{ height: 'calc(100vh - 64px - 68px)' }"
            >
              <div class="h-full overflow-y-auto px-1 scrollbar-hide flex flex-col">
                <template v-if="i === 2">
                  <!-- Thẻ: Bạn là người đặt -->
                  <div
                    v-for="i in 10"
                    :key="i"
                    class="bg-blue-50 rounded-lg p-4 shadow text-left space-y-2 my-4 max-w-xs"
                  >
                    <div class="font-semibold text-blue-700">
                      Người đặt: <span class="text-gray-800">thaopv1 (bạn)</span>
                    </div>
                    <div class="font-semibold text-green-700">
                      Tổng tiền: <span class="text-gray-800">120,000 đ</span>
                    </div>
                    <div class="text-gray-700">Mô tả: Bún bò Huế + 2 bún thêm</div>
                    <div class="flex gap-2 mt-4">
                      <button
                        class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        class="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </template>
                <template v-else-if="i === 3">
                  <!-- Thẻ: Bạn là người được đặt -->
                  <div class="bg-green-50 rounded-lg p-4 shadow text-left space-y-2 mt-4 max-w-xs">
                    <div class="font-semibold text-green-700">
                      Bạn được đặt bởi: <span class="text-gray-800">vunx</span>
                    </div>
                    <div class="font-semibold text-blue-700">
                      Tổng tiền phần bạn: <span class="text-gray-800">40,000 đ</span>
                    </div>
                    <div class="text-gray-700">Mô tả: Phở bò đặc biệt</div>
                    <div class="flex gap-2 mt-4">
                      <button
                        class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                      >
                        Trả tiền
                      </button>
                      <button
                        class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                      >
                        Xem chi tiết
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
import { ref, computed } from 'vue'

import router from '@/router'

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
}

function goNextWeek() {
  currentDate.value.setDate(currentDate.value.getDate() + 7)
  const [mon, sun] = getMondayAndSunday(currentDate.value)
  monday.value = mon.toISOString().slice(0, 10)
  sunday.value = sun.toISOString().slice(0, 10)
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
</script>
