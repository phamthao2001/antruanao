import { ref, watch, type Ref } from 'vue'

type TKeyLocalStorageDefined = 'username'

const mapValueStorage = new Map<string, Ref>()

export const useLocalStorage = <T>(key: TKeyLocalStorageDefined): Ref<T | null> => {
  if (mapValueStorage.has(key)) {
    return mapValueStorage.get(key) as ReturnType<typeof useLocalStorage<T>>
  }

  const valueStorage = localStorage.getItem(key) ?? null

  const refValue = ref<T | null>(null) as Ref<T | null>

  if (valueStorage) {
    refValue.value = JSON.parse(valueStorage) as T
  }

  watch(
    refValue,
    (newValue) => {
      if (newValue === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    },
    { deep: true },
  )

  mapValueStorage.set(key, refValue)

  return refValue
}
