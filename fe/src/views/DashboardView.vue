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
        <!-- Button tổng hợp thanh toán -->
        <button
          class="ml-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition border-2 border-orange-700"
          @click="onSumaryPay()"
        >
          Tổng hợp thanh toán
        </button>
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
        <div
          class="flex items-center gap-2 ml-6 relative"
          @click="showUserDropdown = !showUserDropdown"
        >
          <div
            class="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold"
          >
            {{ username?.[0] ?? '?' }}
          </div>
          <div class="text-sm font-medium text-gray-700 cursor-pointer">
            {{ username }}
            <svg
              class="inline w-4 h-4 ml-1 text-gray-400"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div
            v-if="showUserDropdown"
            class="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px] z-50"
          >
            <button
              class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 font-semibold"
              @click="logout"
            >
              Đăng xuất
            </button>
          </div>
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
                    <!-- Mã đơn hàng ở đầu mỗi tag -->
                    <div class="text-xs text-gray-500 font-mono mb-1">#{{ order._id }}</div>
                    <div class="flex items-center gap-2">
                      <div v-if="order.owner === username" class="font-semibold text-blue-700">
                        Người đặt: <span class="text-gray-800">{{ order.owner }} (bạn)</span>
                      </div>
                      <div v-else class="font-semibold text-green-700">
                        Bạn được đặt bởi: <span class="text-gray-800">{{ order.owner }}</span>
                      </div>
                      <!-- Status order ngay bên cạnh tên người đặt -->
                      <span
                        v-if="order.status"
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
                    <div v-if="order.status === 'paid'" :class="'font-semibold text-green-700'">
                      Tổng tiền:
                      <span class="text-gray-800">
                        {{ formatMoney(order.total_paid) }}
                        đ
                      </span>
                    </div>
                    <div
                      v-if="order.owner !== username && order.status === 'paid'"
                      :class="'font-semibold text-blue-700'"
                    >
                      Tổng tiền phần bạn:
                      <span class="text-gray-800">
                        {{ formatMoney(getMyPrice(order)) }}
                        đ
                      </span>
                    </div>
                    <div class="text-gray-700">Mô tả: {{ order.description }}</div>
                    <!-- Danh sách người được đặt nếu bạn là người đặt -->
                    <div v-if="order.list_dep_auto_share?.length" class="text-sm mt-2">
                      <div class="font-semibold text-gray-600 mb-1">Người được đặt (chia đều):</div>
                      <ul class="ml-2 list-disc text-gray-700">
                        <li
                          v-for="item in order.list_dep_auto_share"
                          :key="item.name_dep"
                          class="mb-1"
                        >
                          <div class="flex flex-col">
                            <div class="flex items-center gap-2">
                              <span class="font-semibold text-gray-800">{{ item.name_dep }}</span>
                              <span v-if="item.quantity_dep" class="text-xs text-gray-500"
                                >({{ item.quantity_dep }} người)</span
                              >
                              <span
                                :class="
                                  item.state_dep === 'paid'
                                    ? 'text-green-600 font-semibold ml-2'
                                    : 'text-red-600 font-semibold ml-2'
                                "
                              >
                                {{ item.state_dep === 'paid' ? 'Đã trả' : 'Chưa trả' }}
                              </span>
                            </div>
                            <div
                              v-if="item.description_dep"
                              class="text-xs text-gray-500 italic ml-2 mt-1"
                            >
                              {{ item.description_dep }}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div v-if="order.list_dep_specific_price?.length" class="text-sm mt-2">
                      <div class="font-semibold text-gray-600 mb-1">
                        Người được đặt (chia theo giá):
                      </div>
                      <ul class="ml-2 list-disc text-gray-700">
                        <li
                          v-for="item in order.list_dep_specific_price"
                          :key="item.name_dep"
                          class="mb-1"
                        >
                          <div class="flex flex-col">
                            <div class="flex items-center gap-2">
                              <span class="font-semibold text-gray-800">{{ item.name_dep }}</span>
                              <span class="text-xs text-gray-500"
                                >- {{ formatMoney(item.price_dep ?? 0) }} đ</span
                              >
                              <span
                                :class="
                                  item.state_dep === 'paid'
                                    ? 'text-green-600 font-semibold ml-2'
                                    : 'text-red-600 font-semibold ml-2'
                                "
                              >
                                {{ item.state_dep === 'paid' ? 'Đã trả' : 'Chưa trả' }}
                              </span>
                            </div>
                            <div
                              v-if="item.description_dep"
                              class="text-xs text-gray-500 italic ml-2 mt-1"
                            >
                              {{ item.description_dep }}
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div class="flex gap-2 mt-4">
                      <button
                        v-if="
                          order.owner !== username &&
                          order.status === 'paid' &&
                          (order.list_dep_auto_share.some(
                            (item) => item.name_dep === username && item.state_dep !== 'paid',
                          ) ||
                            order.list_dep_specific_price.some(
                              (item) => item.name_dep === username && item.state_dep !== 'paid',
                            ))
                        "
                        class="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                        @click="showPayQR(order)"
                      >
                        Trả tiền
                      </button>
                      <span
                        v-else-if="
                          order.owner !== username &&
                          order.status === 'paid' &&
                          (order.list_dep_auto_share.some(
                            (item) => item.name_dep === username && item.state_dep === 'paid',
                          ) ||
                            order.list_dep_specific_price.some(
                              (item) => item.name_dep === username && item.state_dep === 'paid',
                            ))
                        "
                        class="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-lg shadow"
                      >
                        Đã trả tiền
                      </span>
                      <button
                        class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        v-if="order.owner === username"
                        class="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                        @click="askDeleteOrder(order._id)"
                      >
                        Xóa
                      </button>
                      <button
                        v-if="order.owner === username && order.status === 'created'"
                        class="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                        @click="askOrder(order._id)"
                      >
                        Order
                      </button>
                      <button
                        v-if="order.owner === username && order.status === 'ordered'"
                        class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition border-2 border-orange-700"
                        @click="askPayOrder(order._id)"
                      >
                        Thanh toán
                      </button>
                      <button
                        v-if="order.owner === username && order.status === 'created'"
                        class="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow transition"
                        @click="shareOrderLink(order._id)"
                      >
                        Tạo link chia sẻ
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
    <!-- Popup xác nhận xóa -->
    <div
      v-if="confirmDeleteOrderId"
      class="fixed inset-0 bg-[#1e293959] bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 min-w-[320px]">
        <div class="font-semibold text-lg mb-4 text-red-600">
          Xác nhận xóa đơn hàng
          <span v-if="confirmDeleteOrderId" class="ml-2 text-xs text-gray-500 font-mono"
            >#{{ confirmDeleteOrderId }}</span
          >
        </div>
        <div class="mb-6">Bạn có chắc chắn muốn xóa đơn hàng này không?</div>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            @click="cancelDeleteOrder"
          >
            Hủy
          </button>
          <button
            class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
            @click="confirmDeleteOrder"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
    <!-- Popup xác nhận đặt đơn hàng -->
    <div
      v-if="confirmOrderId"
      class="fixed inset-0 bg-[#1e293959] bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 min-w-[320px]">
        <div class="font-semibold text-lg mb-4 text-green-600">
          Xác nhận đặt đơn hàng
          <span v-if="confirmOrderId" class="ml-2 text-xs text-gray-500 font-mono"
            >#{{ confirmOrderId }}</span
          >
        </div>
        <div class="mb-6">
          Bạn có chắc chắn muốn chuyển đơn hàng này sang trạng thái <b>Đã đặt</b>?
        </div>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            @click="cancelOrder"
          >
            Hủy
          </button>
          <button
            class="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
            @click="confirmOrder"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
    <!-- Popup xác nhận thanh toán -->
    <div
      v-if="confirmPayOrderId"
      class="fixed inset-0 bg-[#1e293959] bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 min-w-[320px]">
        <div class="font-semibold text-lg mb-4 text-orange-600">
          Thanh toán cho người đặt
          <span v-if="confirmPayOrderId" class="ml-2 text-xs text-gray-500 font-mono"
            >#{{ confirmPayOrderId }}</span
          >
        </div>
        <div class="mb-4">Nhập tổng số tiền bạn muốn thanh toán:</div>
        <input
          v-model="payAmountDisplay"
          @input="onPayAmountInput"
          type="text"
          class="w-full border border-orange-400 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:border-orange-600 font-semibold text-lg"
          placeholder="Nhập số tiền..."
        />
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            @click="cancelPayOrder"
          >
            Hủy
          </button>
          <button
            class="px-4 py-2 rounded-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-400 border-2 border-orange-700 transition"
            :disabled="!payAmount"
            @click="confirmPayOrder"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
    <!-- Popup tổng hợp thanh toán -->
    <div
      v-if="showSummaryPay"
      class="fixed inset-0 bg-[#1e293959] flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg p-8 min-w-[480px] max-w-[98vw]">
        <div class="font-semibold text-lg mb-4 text-orange-600">Tổng hợp thanh toán tuần này</div>
        <div class="mb-4 text-sm text-gray-700 max-h-[70vh] overflow-y-auto pr-2">
          <div v-for="(orders, owner) in listOrderDependNeedPaid" :key="owner" class="mb-4">
            <div class="flex items-center gap-3 mb-1">
              <div class="font-semibold text-base text-blue-700">
                Bạn cần thanh toán cho <span class="text-orange-700">{{ owner }}</span>
              </div>
            </div>
            <div v-for="order in orders" :key="order._id" class="mb-2 ml-2">
              <div class="font-mono text-xs text-gray-500 mb-1">
                #{{ order._id }}
                <span class="ml-2 text-gray-400">
                  {{
                    order.date_order ? new Date(order.date_order).toLocaleDateString('vi-VN') : ''
                  }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-800">{{ order.description }}</span>
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
              <div class="text-xs text-gray-600">
                Số tiền cần trả:
                <span class="font-semibold">{{ formatMoney(getMyPrice(order)) }} đ</span>
              </div>
              <hr class="my-2 border-dashed border-gray-300" />
            </div>
            <div class="flex items-center justify-between mt-1 mb-2">
              <div class="font-semibold text-sm text-orange-700">
                Tổng cần trả cho {{ owner }}:
                <span>
                  {{ formatMoney(orders.reduce((sum, order) => sum + getMyPrice(order), 0)) }} đ
                </span>
              </div>
              <button
                class="bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition border-2 border-fuchsia-800 ml-4"
                @click="payAllForOwner(owner)"
              >
                Thanh toán cho {{ owner }}
              </button>
            </div>
            <hr class="my-2 border-gray-400" />
          </div>
          <div class="font-semibold text-base text-gray-800">
            Tổng tiền cần trả tất cả:
            <span class="text-orange-600">
              {{
                formatMoney(
                  Object.values(listOrderDependNeedPaid).reduce(
                    (sum, orders) => sum + orders.reduce((s, order) => s + getMyPrice(order), 0),
                    0,
                  ),
                )
              }}
              đ
            </span>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            @click="showSummaryPay = false"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
    <!-- Popup hiển thị QR khi thanh toán cho owner -->
    <div
      v-if="showOwnerQRPopup"
      class="fixed inset-0 bg-[#1e293959] flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-xl shadow-lg p-8 min-w-[340px] max-w-[90vw] flex flex-col items-center"
      >
        <div class="font-semibold text-lg mb-4 text-fuchsia-700">
          Quét mã QR để thanh toán cho <span class="text-orange-700">{{ payingOwner }}</span>
        </div>
        <template v-if="ownerQRUrl">
          <img
            :src="ownerQRUrl"
            alt="QR thanh toán"
            class="w-96 h-96 object-contain mb-4 border-2 border-gray-400 rounded-xl"
          />
          <div class="text-sm text-gray-600 mb-2">
            Vui lòng sử dụng app ngân hàng để quét mã và chuyển khoản cho chủ đơn.
          </div>
        </template>
        <template v-else>
          <div class="text-base text-red-600 font-semibold mb-6 text-center">
            Không tồn tại mã QR của chủ đơn.<br />
            Vui lòng liên hệ <span class="font-bold text-orange-700">{{ payingOwner }}</span> để xin
            thông tin chuyển tiền!
          </div>
        </template>
        <div class="text-xs text-red-500 font-semibold mb-6">
          NOTE: Chuyển thành công hãy click "Tôi đã chuyển" để cập nhật trạng thái.
        </div>
        <div class="flex gap-3">
          <button
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            @click="closeOwnerQRPopup"
          >
            Đóng
          </button>
          <button
            class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
            @click="confirmPayOwner"
          >
            Tôi đã chuyển
          </button>
        </div>
      </div>
    </div>

    <!-- Popup QR trả tiền cho từng order -->
    <div
      v-if="showPayQRPopup"
      class="fixed inset-0 bg-[#1e293959] flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-xl shadow-lg p-8 min-w-[340px] max-w-[90vw] flex flex-col items-center"
      >
        <div class="font-semibold text-lg mb-4 text-yellow-700">
          Quét mã QR để thanh toán cho <span class="text-orange-700">{{ payQROwner }}</span>
        </div>
        <template v-if="payQRUrl">
          <img
            :src="payQRUrl"
            alt="QR thanh toán"
            class="w-96 h-96 object-contain mb-4 border-2 border-gray-400 rounded-xl"
          />
          <div class="text-base font-semibold text-blue-700 mb-2">
            Số tiền cần thanh toán:
            <span class="text-gray-800">{{ formatMoney(payQRAmount) }} đ</span>
          </div>
          <div class="text-sm text-gray-600 mb-2">
            Vui lòng sử dụng app ngân hàng để quét mã và chuyển khoản cho chủ đơn.
          </div>
        </template>
        <template v-else>
          <div class="text-base text-red-600 font-semibold mb-6 text-center">
            Không tồn tại mã QR của chủ đơn.<br />
            Vui lòng liên hệ <span class="font-bold text-orange-700">{{ payQROwner }}</span> để xin
            thông tin chuyển tiền!
          </div>
        </template>
        <div class="text-xs text-red-500 font-semibold mb-6">
          NOTE: Chuyển thành công hãy click "Tôi đã chuyển" để cập nhật trạng thái.
        </div>
        <div class="flex gap-3">
          <button
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            @click="closePayQRPopup"
          >
            Đóng
          </button>
          <button
            class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
            @click="payQROrder"
          >
            Tôi đã chuyển
          </button>
        </div>
      </div>
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
import { QR_CONTEXT } from '@/utils/qr'

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
    if (idx >= 0 && idx < 7) arr[idx]!.push(order)
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
  let price_specific = 0
  if (order.list_dep_specific_price) {
    order.list_dep_specific_price
      .filter((item) => item.name_dep === username.value)
      .forEach((item) => {
        price_specific += item.price_dep || 0
      })
  }

  const remain_price = (order.total_paid || 0) - price_specific

  const total_share = order.list_dep_auto_share.reduce(
    (sum: number, item) => sum + (item.quantity_dep || 1),
    0,
  )

  let price_auto = 0

  if (total_share > 0) {
    const price_per_person = remain_price / total_share
    order.list_dep_auto_share
      .filter((item) => item.name_dep === username.value)
      .forEach((item) => {
        price_auto += price_per_person * (item.quantity_dep || 1)
      })
  }

  return price_specific + price_auto
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

const confirmDeleteOrderId = ref<string | null>(null)
function askDeleteOrder(orderId: string) {
  confirmDeleteOrderId.value = orderId
}
async function confirmDeleteOrder() {
  if (confirmDeleteOrderId.value) {
    await api.delete(`/orders`, {
      data: { order_id: confirmDeleteOrderId.value },
    })
    await fetchOrders()
    confirmDeleteOrderId.value = null
  }
}
function cancelDeleteOrder() {
  confirmDeleteOrderId.value = null
}

const confirmOrderId = ref<string | null>(null)
function askOrder(orderId: string) {
  confirmOrderId.value = orderId
}
async function confirmOrder() {
  if (confirmOrderId.value) {
    // Gọi API cập nhật status
    try {
      await api.patch(`/orders/status`, { status: 'ordered', order_id: confirmOrderId.value })
      await fetchOrders()
      confirmOrderId.value = null
    } catch (err) {
      handleError(err as Error)
    }
  }
}
function cancelOrder() {
  confirmOrderId.value = null
}

const confirmPayOrderId = ref<string | null>(null)
const payAmount = ref<number | null>(null)
const payAmountDisplay = ref('')

function askPayOrder(orderId: string) {
  confirmPayOrderId.value = orderId
  payAmount.value = null
}
async function confirmPayOrder() {
  if (confirmPayOrderId.value && payAmount.value !== null) {
    try {
      await api.patch(`/orders/pay`, { amount: payAmount.value, order_id: confirmPayOrderId.value })
      confirmPayOrderId.value = null
      payAmount.value = null
      fetchOrders()
    } catch (err) {
      handleError(err as Error)
    }
  }
}
function cancelPayOrder() {
  confirmPayOrderId.value = null
  payAmount.value = null
  payAmountDisplay.value = ''
}

function onPayAmountInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value.replace(/[^\d]/g, '')
  payAmount.value = raw ? Number(raw) : null
  payAmountDisplay.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const showSummaryPay = ref(false)
const listOrderDependNeedPaid = computed(() => {
  const list = data.value
    .filter((order) => order.owner !== username.value && order.status === 'paid')
    .filter((order) => {
      // Kiểm tra xem trong order có phần của mình chưa trả không
      const hasUnpaid =
        order.list_dep_auto_share.some(
          (item) => item.name_dep === username.value && item.state_dep !== 'paid',
        ) ||
        order.list_dep_specific_price.some(
          (item) => item.name_dep === username.value && item.state_dep !== 'paid',
        )
      return hasUnpaid
    })

  const groupBy: Record<string, Data[]> = {}
  for (const i of list) {
    groupBy[i.owner] = groupBy[i.owner] || []
    groupBy[i.owner]!.push(i)
  }

  return groupBy
})

async function onSumaryPay() {
  await fetchOrders()
  showSummaryPay.value = true
}

const showOwnerQRPopup = ref(false)
const ownerQRUrl = ref('')
const payingOwner = ref('')

function payAllForOwner(owner: string) {
  const listDepend = listOrderDependNeedPaid.value[owner] || []

  let qr = QR_CONTEXT[owner] ?? ''
  if (qr) {
    qr = qr.replace(/{#user}/g, username.value ?? '')
    qr = qr.replace(
      /{#amount}/g,
      (listDepend.reduce((sum, order) => sum + getMyPrice(order), 0) ?? 0).toString(),
    )
  }

  ownerQRUrl.value = qr
  payingOwner.value = owner
  showOwnerQRPopup.value = true
}

function closeOwnerQRPopup() {
  showOwnerQRPopup.value = false
}

async function confirmPayOwner() {
  try {
    const listDepend = listOrderDependNeedPaid.value[payingOwner.value] || []
    await api.patch('/orders/pay-depend', {
      order_ids: listDepend.map((order) => order._id),
      name_dep: username.value,
    })

    // Đóng popup và tải lại danh sách đơn hàng
    showOwnerQRPopup.value = false
    await fetchOrders()
  } catch (error) {
    handleError(error as Error)
  }
}

const showPayQRPopup = ref(false)
const payQRUrl = ref('')
const payQRAmount = ref(0)
const payQROrderId = ref('')
const payQROwner = ref('')

function showPayQR(order: Data) {
  // Tìm số tiền cần trả của user cho order này
  const amount = getMyPrice(order)
  payQRAmount.value = amount
  payQROrderId.value = order._id
  payQROwner.value = order.owner

  let qr = QR_CONTEXT[order.owner] ?? ''
  if (qr) {
    qr = qr.replace(/{#user}/g, username.value ?? '')
    qr = qr.replace(/{#amount}/g, amount.toString())
  }
  payQRUrl.value = qr
  showPayQRPopup.value = true
}
function closePayQRPopup() {
  showPayQRPopup.value = false
}
async function payQROrder() {
  try {
    await api.patch('/orders/pay-depend', {
      order_ids: [payQROrderId.value],
      name_dep: username.value,
    })

    // Đóng popup và tải lại danh sách đơn hàng
    showPayQRPopup.value = false
    await fetchOrders()
  } catch (error) {
    handleError(error as Error)
  }
}

async function shareOrderLink(orderId: string) {
  try {
    await api.post('/orders/share-link', { order_id: orderId })

    await navigator.clipboard.writeText(`${window.location.origin}/orders/shared/${orderId}`)
    alert('Link chia sẻ đã được sao chép vào clipboard!')
  } catch (error) {
    handleError(error as Error)
  }
}

onMounted(fetchOrders)

const showUserDropdown = ref(false)
function logout() {
  username.value = null
  router.push('/login')
}
</script>
