declare module 'imagetracerjs' {
  interface ImageTracerOptions {
    ltres?: number
    qtres?: number
    pathomit?: number
    numberofcolors?: number
    scale?: number
    strokewidth?: number
  }

  interface ImageTracerStatic {
    imagedataToSVG(imageData: ImageData, options?: ImageTracerOptions | string): string
  }

  const ImageTracer: ImageTracerStatic
  export default ImageTracer
}
