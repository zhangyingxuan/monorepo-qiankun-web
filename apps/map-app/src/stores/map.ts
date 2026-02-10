import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const history = ref<string[]>([])

  function addHistory(route: string) {
    history.value.push(route)
  }

  return { history, addHistory }
})