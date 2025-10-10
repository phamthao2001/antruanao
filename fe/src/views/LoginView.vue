<template>
  <!-- Main Container -->
  <div
    class="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4"
  >
    <!-- Login Card -->
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <!-- Logo -->
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4"
        >
          <span class="text-2xl">🍜</span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Ăn Trưa Nào</h1>

        <!-- Subtitle -->
        <p class="text-gray-600">Chào mừng bạn trở lại!</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Username Field -->
        <div>
          <label class="block text-gray-700 text-sm font-semibold mb-2"> Tên đăng nhập </label>

          <input
            v-model="loginForm.username"
            type="text"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            :class="{
              'border-red-500 focus:border-red-500': errors.username,
            }"
            placeholder="Nhập tên đăng nhập của bạn"
            autocomplete="username"
          />

          <!-- Error Message -->
          <p v-if="errors.username" class="text-red-500 text-sm mt-2">
            {{ errors.username }}
          </p>
        </div>

        <!-- Remember Me -->
        <div class="flex items-center">
          <input
            v-model="rememberMe"
            type="checkbox"
            id="remember"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="remember" class="ml-2 text-gray-700 text-sm"> Ghi nhớ đăng nhập </label>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span v-if="!isLoading" class="flex items-center justify-center gap-2">
            <span>Đăng nhập</span>
          </span>

          <span v-else class="flex items-center justify-center gap-2">
            <div
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></div>
            <span>Đang đăng nhập...</span>
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Form state
const loginForm = reactive({
  username: '',
})

const isLoading = ref(false)
const rememberMe = ref(false)

// Form validation
const errors = reactive({
  username: '',
})

// Methods
const validateForm = () => {
  errors.username = ''

  if (!loginForm.username.trim()) {
    errors.username = 'Vui lòng nhập tên đăng nhập'
    return false
  }

  return true
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert('Đăng nhập thành công!')
  } catch (error) {
    alert('Đăng nhập thất bại!' + error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Custom Animations */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes gradient-x {
  0%,
  100% {
    background-size: 200% 200%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

@keyframes tilt {
  0%,
  50%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(1deg);
  }
  75% {
    transform: rotate(-1deg);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-gradient-x {
  animation: gradient-x 3s ease infinite;
}

.animate-tilt {
  animation: tilt 10s infinite linear;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Custom Border Width */
.border-3 {
  border-width: 3px;
}

/* Hover Effects */
.group:hover .group-hover\:rotate-12 {
  transform: rotate(12deg);
}
</style>
