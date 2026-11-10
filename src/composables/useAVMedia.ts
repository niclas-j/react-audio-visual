import * as React from 'react'
import { useEffect, useRef } from 'react'
import { useCanvasContext } from './useCanvasContext'
import { type PropsMediaType, Media } from './useProps'

type CanvasLike = HTMLCanvasElement | null | { current: HTMLCanvasElement | null }
type ContextLike = CanvasRenderingContext2D | null | { current: CanvasRenderingContext2D | null }

export function useAVMedia<T extends object>(
  canvas: CanvasLike,
  props: T
) {
  // Vue composables could be called directly; keep that legacy usage harmless
  // when this function is invoked outside a React render.
  if (!(React as unknown as {
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
      ReactCurrentDispatcher: { current: unknown }
    }
  }).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current) {
    return undefined
  }

  const p = props as PropsMediaType
  const media = new Media(p)
  const ctx = useCanvasContext(canvas, media)
  const analyserRef = useRef<AnalyserNode | null>(null)

  useEffect(() => {
    const stream = p.media && typeof p.media === 'object' && 'current' in p.media
      ? (p.media as { current: MediaStream | null }).current
      : p.media

    if (!stream) {
      analyserRef.current = null
      return
    }

    analyserRef.current = setAnalyser(stream as MediaStream, new Media(p))
  }, [p.media, p.connectDestination, p.fftSize])

  useEffect(() => {
    let active = true
    let rafId: number | null = null
    let previousTimestamp = 0

    const loop = (timestamp: number) => {
      if (!active) return
      if (!previousTimestamp) previousTimestamp = timestamp
      const analyser = analyserRef.current
      if (analyser) draw(analyser, ctx, new Media(p))
      rafId = window.requestAnimationFrame(loop)
    }

    if (analyserRef.current && typeof window !== 'undefined') {
      rafId = window.requestAnimationFrame(loop)
    }

    return () => {
      active = false
      if (rafId !== null && typeof window !== 'undefined') window.cancelAnimationFrame(rafId)
    }
  }, [ctx, p.media, p.type, p.canvWidth, p.canvHeight, p.canvFillColor, p.lineColor, p.lineWidth])

  // Keep direct invocation harmless for legacy callers that invoke the composable
  // outside a React render (rather than mounting it as a hook).
  return undefined
}

function setAnalyser(stream: MediaStream, p: Media): AnalyserNode {
  const ctx = new AudioContext()
  const analyser = ctx.createAnalyser()
  const src = ctx.createMediaStreamSource(stream)

  src.connect(analyser)
  analyser.fftSize = p.fftSize

  if (p.connectDestination) {
    analyser.connect(ctx.destination)
  }

  return analyser
}

export function draw(analyser: AnalyserNode, canv: ContextLike, p: Media) {
  const ctx = canv && typeof canv === 'object' && 'current' in canv
    ? canv.current
    : canv
  if (!ctx) return

  const data = new Uint8Array(analyser.fftSize)
  if (p.canvFillColor) ctx.fillStyle = p.canvFillColor
  ctx.clearRect(0, 0, p.canvWidth, p.canvHeight)
  ctx.beginPath()
  ctx.strokeStyle = p.lineColor

  switch (p.type) {
  case 'frequ':
    analyser.getByteFrequencyData(data)
    drawFrequ(data, ctx, p)
    break
  case 'circle':
    analyser.getByteFrequencyData(data)
    drawCircle(data, ctx, p)
    break
  case 'vbar':
    analyser.getByteFrequencyData(data)
    drawVBar(data, ctx, p)
    break
  default:
    analyser.getByteTimeDomainData(data)
    drawWForm(data, ctx, p)
    break
  }
}

function drawFrequ(data: Uint8Array, ctx: CanvasRenderingContext2D, p: Media) {
  const middleOut = p.frequDirection === 'mo'
  const start = middleOut ? p.canvWidth / 2 : 0
  const c = middleOut ? p.frequLnum / 2 : p.frequLnum
  const step = middleOut ? p.canvWidth / c / 2 : p.canvWidth / c
  const h = p.canvHeight
  const lw = p.lineWidth || 2
  for (let i = 0; i < c; i++) {
    const x = middleOut ? i * step : i * step + lw
    const v = data.slice(x, x + step).reduce((sum, value) => sum + (value / 255.0 * h), 0) / step
    const space = (h - v) / 2 + 2
    ctx.lineWidth = lw
    ctx.lineCap = p.frequLineCap ? 'round' : 'butt'
    ctx.moveTo(start + x, space)
    ctx.lineTo(start + x, h - space)
    ctx.stroke()

    if (middleOut && i > 0) {
      ctx.moveTo(start - x, space)
      ctx.lineTo(start - x, h - space)
      ctx.stroke()
    }
  }
}

function drawVBar(data: Uint8Array, ctx: CanvasRenderingContext2D, p: Media) {
  const barWidth = p.vbarWidth
  const barSpace = p.vbarSpace
  const capSpace = barWidth < 5 ? 5 : barWidth / 2
  let max = 0
  for (let i = 0; i < data.length; i++) {
    max = max < data[i] ? data[i] : max
  }
  const vbarLen = max / 255 * p.canvWidth
  ctx.lineWidth = p.vbarWidth
  ctx.lineCap = p.vbarCaps ? 'round' : 'butt'
  ctx.fillStyle = p.vbarBgColor
  ctx.fillRect(0, 0, p.canvWidth, p.canvHeight)
  for (let x = barWidth / 2; x + barWidth + barSpace <= p.canvWidth; x = x + barWidth + barSpace) {
    ctx.strokeStyle = x > vbarLen ? p.vbarRightColor : p.vbarFillColor
    ctx.beginPath()
    ctx.moveTo(x, capSpace)
    ctx.lineTo(x, p.canvHeight - capSpace)
    ctx.stroke()
  }
}

function drawCircle(data: Uint8Array, ctx: CanvasRenderingContext2D, p: Media) {
  const cx = p.canvWidth / 2
  const cy = p.canvHeight / 2
  const outr = cx < cy ? cx : cy
  const max = Math.max(...data)
  const r = max / 255 * outr
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)

  for (const [offset, color] of p.circleGradient) {
    gradient.addColorStop(offset, color)
  }

  ctx.fillStyle = gradient
  ctx.arc(cx, cy, r, 0, 2 * Math.PI)
  ctx.fill('evenodd')
}

function drawWForm(data: Uint8Array, ctx: CanvasRenderingContext2D, p: Media) {
  const h = p.canvHeight
  const step = p.canvWidth / p.fftSize
  let x = 0
  ctx.lineWidth = p.lineWidth || 0.5
  for (let i = 0; i < data.length; i++) {
    const y = (data[i] / 255.0) * h
    ctx.lineTo(x, y)
    x += step
  }
  ctx.stroke()
}
