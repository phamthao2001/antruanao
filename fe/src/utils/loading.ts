import { ref } from 'vue'

const loading = ref(false)

export const useLoading = () => {
  const showLoading = () => {
    loading.value = true
  }

  const hideLoading = () => {
    loading.value = false
  }

  return {
    loading,
    showLoading,
    hideLoading,
  }
}
