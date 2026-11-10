import { useEffect, useRef, type MutableRefObject } from 'react'
import type { Props } from '@/composables/useProps'

type CanvasRef = HTMLCanvasElement | null | MutableRefObject<HTMLCanvasElement | null>

export function useCanvasContext(
  canvas: CanvasRef,
  props: Props
): MutableRefObject<CanvasRenderingContext2D | null> {
  const ctx = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canv = canvas && 'current' in canvas ? canvas.current : canvas
    if (!canv) return

    ctx.current = canv.getContext('2d')
    canv.width = props.canvWidth
    canv.height = props.canvHeight
  }, [canvas, props.canvWidth, props.canvHeight])

  return ctx
}

type CanvColor = string[] | string | null | undefined

export function fillCanvasBackground(ctx: CanvasRenderingContext2D, w: number, h: number, colors: CanvColor): void {
  ctx.clearRect(0, 0, w, h)
  if (!colors) {
    return
  }
  ctx.fillStyle = fillGradient(ctx, w, h, colors)
  ctx.fillRect(0, 0, w, h)
}

export function fillGradient(ctx: CanvasRenderingContext2D, w: number, h: number, colors: CanvColor): CanvasGradient | string {
  if (!Array.isArray(colors)) {
    return colors || ''
  }
  const gradient = ctx.createLinearGradient(w / 2, 0, w / 2, h)
  let offset = 0
  colors.forEach((color: string) => {
    gradient.addColorStop(offset, color)
    offset += 1 / colors.length
  })
  return gradient
}
