import exampleImage from './example3.png'

const MAX_DIMENSION = 640

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

/**
 * potrace / imagetracerjs 都是「區塊填色描邊」工具，直接餵原圖只會得到色塊剪影。
 * 要做出「只有外框、其餘留白」的著色本效果，須先用 Sobel 算子抓邊緣，轉成黑白線稿再交給描邊庫。
 */
export async function createEdgeCanvas(threshold: number) {
  const image = await loadImage(exampleImage)

  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height))
  const width = Math.round(image.width * scale)
  const height = Math.round(image.height * scale)

  const sourceCanvas = document.createElement('canvas')
  sourceCanvas.width = width
  sourceCanvas.height = height
  const sourceCtx = sourceCanvas.getContext('2d')!
  sourceCtx.drawImage(image, 0, 0, width, height)

  const { data } = sourceCtx.getImageData(0, 0, width, height)
  const gray = new Float32Array(width * height)
  for (let i = 0; i < width * height; i++) {
    gray[i] = 0.299 * data[i * 4]! + 0.587 * data[i * 4 + 1]! + 0.114 * data[i * 4 + 2]!
  }

  const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
  const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

  const edgeCanvas = document.createElement('canvas')
  edgeCanvas.width = width
  edgeCanvas.height = height
  const edgeCtx = edgeCanvas.getContext('2d')!
  const edgeImageData = edgeCtx.createImageData(width, height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sx = 0
      let sy = 0
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx))
          const py = Math.min(height - 1, Math.max(0, y + ky))
          const weightIndex = (ky + 1) * 3 + (kx + 1)
          const value = gray[py * width + px]!
          sx += value * gx[weightIndex]!
          sy += value * gy[weightIndex]!
        }
      }

      const magnitude = Math.sqrt(sx * sx + sy * sy)
      const color = magnitude > threshold ? 0 : 255
      const pixelIndex = (y * width + x) * 4
      edgeImageData.data[pixelIndex] = color
      edgeImageData.data[pixelIndex + 1] = color
      edgeImageData.data[pixelIndex + 2] = color
      edgeImageData.data[pixelIndex + 3] = 255
    }
  }

  edgeCtx.putImageData(edgeImageData, 0, 0)
  return edgeCanvas
}
