<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col">
    <!-- Topbar -->
    <header class="flex justify-between items-center px-8 py-5 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center gap-4">
        <svg viewBox="0 0 24 24" class="w-12 h-12 text-blue-600 opacity-90" fill="currentColor">
          <path d="M12 2L3 7v7c0 5 4 9 9 9s9-4 9-9V7l-9-5z" />
        </svg>
        <div>
          <h1 class="text-lg font-bold text-gray-800">OrderBoard</h1>
          <p class="text-xs text-gray-400">Dashboard quản lý đặt hàng nhóm</p>
        </div>
      </div>
      <div class="flex items-center gap-6">
        <!-- Box chọn khoảng thời gian và tìm kiếm -->
        <div class="flex flex-wrap items-center gap-2 px-3 py-2">
          <label class="text-sm text-gray-500 font-medium">Từ</label>
          <input
            type="date"
            v-model="dateFrom"
            class="h-10 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-400 transition w-[140px]"
            :max="dateTo"
          />
          <span class="mx-1 text-gray-400">-</span>
          <label class="text-sm text-gray-500 font-medium">Đến</label>
          <input
            type="date"
            v-model="dateTo"
            class="h-10 px-2 py-1 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-400 transition w-[140px]"
            :min="dateFrom"
          />
          <!-- <input
            v-model="search"
            placeholder="Tìm order, tên..."
            class="h-10 outline-none px-2 py-1 border border-gray-300 rounded-lg w-36 text-sm bg-gray-50 focus:border-blue-400 transition"
          /> -->
          <button
            @click="onSearch"
            aria-label="Tìm"
            class="h-10 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition flex items-center"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <div
            class="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold"
          >
            {{ username?.[0] ?? '?' }}
          </div>
          <div class="text-sm font-medium text-gray-700">{{ username }}</div>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1 max-w-6xl mx-auto px-6 py-8">
      <!-- Overview -->
      <section class="flex flex-col md:flex-row justify-between gap-6 items-start">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">
            Xin chào, <span class="text-blue-600 font-bold">{{ username }}</span>
          </h2>
          <p class="text-sm text-gray-400 mt-1">Tổng quan nhanh về đơn hàng và khoản phải trả</p>
        </div>
        <div class="flex gap-4">
          <div
            class="bg-white rounded-xl shadow p-4 min-w-[180px] flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white"
              >
                <svg viewBox="0 0 24 24" class="w-5 h-5">
                  <path
                    d="M3 13h8V3H3v10zM13 21h8v-8h-8v8zM3 21h8v-6H3v6zM13 11h8V3h-8v8z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <div class="text-lg font-bold text-gray-800">{{ totalOrders }}</div>
                <div class="text-xs text-gray-400">Đơn hàng của tôi</div>
              </div>
            </div>
            <button
              class="text-blue-600 hover:underline text-sm"
              @click="
                router.push({
                  path: 'my-orders',
                  query: {
                    from: dateFrom,
                    to: dateTo,
                  },
                })
              "
            >
              Xem
            </button>
          </div>
          <div
            class="bg-white rounded-xl shadow p-4 min-w-[180px] flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white"
              >
                <svg viewBox="0 0 24 24" class="w-5 h-5">
                  <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div class="text-lg font-bold text-gray-800">{{ myPayableCount }}</div>
                <div class="text-xs text-gray-400">Đơn tôi phải trả</div>
              </div>
            </div>
            <button class="text-green-600 hover:underline text-sm">Xem</button>
          </div>
          <div class="bg-white rounded-xl shadow p-4 flex items-center justify-between">
            <button
              class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition"
              @click="router.push('/orders/new')"
            >
              Thêm đơn hàng
            </button>
          </div>
        </div>
      </section>

      <!-- Cards Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <!-- Quản lý đơn hàng -->
        <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <div>
            <h3 class="text-lg font-bold text-gray-800">Quản lý đơn hàng</h3>
            <p class="text-sm text-gray-400">Xem, tìm kiếm và quản lý tất cả đơn hàng</p>
          </div>
          <ul class="mt-4 divide-y divide-gray-100">
            <li v-for="o in recentOrders" :key="o.id" class="py-3">
              <div class="font-semibold text-gray-700">#{{ o.id }} — {{ o.title }}</div>
              <div class="text-xs text-gray-400 mt-1">
                Người đặt: {{ o.orderer }} · Tổng: {{ o.total }}
              </div>
            </li>
          </ul>
          <div class="mt-4">
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Xem tất cả đơn
            </button>
          </div>
        </div>

        <!-- Đơn tôi phải trả -->
        <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <div>
            <h4 class="text-base font-bold text-gray-800">Đơn tôi phải trả</h4>
            <p class="text-sm text-gray-400">Các khoản cần thanh toán của bạn</p>
          </div>
          <ul class="mt-4 divide-y divide-gray-100">
            <li v-for="p in myPayables" :key="p.id" class="py-3 flex justify-between">
              <div class="text-gray-700">{{ p.title }}</div>
              <div class="text-blue-600 font-semibold">{{ p.amount }}</div>
            </li>
          </ul>
          <div class="mt-4">
            <button
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Quản lý khoản
            </button>
          </div>
        </div>

        <!-- Báo cáo nhanh -->
        <div
          class="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[160px]"
        >
          <div>
            <h4 class="text-base font-bold text-gray-800">Báo cáo nhanh</h4>
            <p class="text-sm text-gray-400">Tổng quan thanh toán theo ngày</p>
          </div>
          <div class="mt-6 text-gray-400 text-center">(BIỂU ĐỒ) — tích hợp chart khi cần</div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center text-xs text-gray-400 border-t border-gray-100">
      © 2025 OrderBoard • Thiết kế thân thiện
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import router from '@/router'
import { useLocalStorage } from '@/utils/local-storage'

const username = useLocalStorage<string>('username')

const search = ref('')

// Tính toán thứ 2 và thứ 6 tuần hiện tại
function getMondayAndFriday() {
  const now = new Date()
  const day = now.getDay()
  // day: 0 (CN), 1 (T2), ..., 6 (T7)
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day === 0 ? 7 : day) - 1))
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  // Định dạng yyyy-mm-dd cho input type="date"
  const format = (d: Date) => d.toISOString().slice(0, 10)
  return {
    monday: format(monday),
    friday: format(friday),
  }
}

const { monday, friday } = getMondayAndFriday()
const dateFrom = ref(monday)
const dateTo = ref(friday)

// Mock data for demo — replace with API calls
const orders = ref([
  { id: 101, title: 'Bún bò + 2 bún', orderer: 'Anh Nam', total: 120000, status: 'done' },
  { id: 102, title: 'Cơm gà xối mỡ', orderer: 'Chị Hoa', total: 80000, status: 'pending' },
  { id: 103, title: 'Phở tái', orderer: 'Bạn Long', total: 45000, status: 'pending' },
  { id: 104, title: 'Pizza lớn', orderer: 'Bạn Linh', total: 320000, status: 'paid' },
])

const totalOrders = computed(() => orders.value.length)
const myPayables = ref([
  { id: 201, title: 'Chia tiền bún', amount: 30000 },
  { id: 202, title: 'Góp pizza', amount: 40000 },
])
const myPayableCount = computed(() => myPayables.value.length)
const recentOrders = computed(() => orders.value.slice(0, 3))

function onSearch() {
  alert('Tìm: ' + search.value)
}
</script>
