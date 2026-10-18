import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

interface ShapeState {
  x: number
  y: number
  rotation: number
}

export const useFreeDotLinkStore = defineStore('free-dot-link', () => {
  const shapes = reactive<Record<string, ShapeState>>({})
  const selectedId = ref<string | null>(null)

  // 元件掛載時呼叫一次，若該 id 已有紀錄就不覆蓋（避免重複掛載時把已拖拉/旋轉過的狀態蓋回初始值）
  function initShape(id: string, x: number, y: number) {
    if (!shapes[id]) shapes[id] = { x, y, rotation: 0 }
  }

  function setPosition(id: string, x: number, y: number) {
    const shape = shapes[id]
    if (shape) {
      shape.x = x
      shape.y = y
    }
  }

  function setRotation(id: string, rotation: number) {
    const shape = shapes[id]
    if (shape) shape.rotation = rotation
  }

  function select(id: string | null) {
    selectedId.value = id
  }

  return { shapes, selectedId, initShape, setPosition, setRotation, select }
})
