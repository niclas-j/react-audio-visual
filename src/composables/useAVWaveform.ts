import { useEffect, type MutableRefObject } from 'react'
import { useCanvasContext } from '@/composables/useCanvasContext'
import { Waveform, type PropsWaveformType } from '@/composables/useProps'

type CreateFetchOptions = {
  options?: Record<string, unknown>
  fetchOptions?: RequestInit
}

export function useAVWaveform<T extends object>(
  player: MutableRefObject<HTMLAudioElement | null>,
  canvas: MutableRefObject<HTMLCanvasElement | null>,
  props: T,
  fetchOpts: CreateFetchOptions = {}
) {
  const p = new Waveform(props as PropsWaveformType)
  const ctx = useCanvasContext(canvas, p)

  useEffect(() => {
    fetchData(ctx, p, fetchOpts)
  }, [ctx.current, p.src])

  useEffect(() => {
    const audio = player.current
    const canv = canvas.current
    if (!audio || !canv) return

    let rafId: number | null = null
    let active = false

    const drawFrame = () => {
      if (!active) return
      p.currentTime = audio.currentTime ?? 0
      draw(ctx, p)
      rafId = window.requestAnimationFrame(drawFrame)
    }
    const resume = () => {
      if (active) return
      active = true
      rafId = window.requestAnimationFrame(drawFrame)
    }
    const pause = () => {
      active = false
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
        rafId = null
      }
    }
    const ended = () => {
      // This patches audio formats whose fetched duration exceeds their real duration.
      if (audio.duration === p.duration) return
      p.duration = audio.duration
      draw(ctx, p)
    }
    const timeupdate = () => {
      p.currentTime = audio.currentTime
      draw(ctx, p)
    }
    const click = (e: MouseEvent) => {
      if (!p.playtimeClickable) return
      audio.currentTime = e.offsetX / p.canvWidth * p.duration
      p.currentTime = audio.currentTime
      draw(ctx, p)
    }

    audio.addEventListener('play', resume)
    audio.addEventListener('pause', pause)
    audio.addEventListener('ended', ended)
    audio.addEventListener('timeupdate', timeupdate)
    canv.addEventListener('click', click)
    return () => {
      pause()
      audio.removeEventListener('play', resume)
      audio.removeEventListener('pause', pause)
      audio.removeEventListener('ended', ended)
      audio.removeEventListener('timeupdate', timeupdate)
      canv.removeEventListener('click', click)
    }
  }, [player.current, canvas.current, ctx.current])
}

export function draw(canvas: MutableRefObject<CanvasRenderingContext2D | null>, p: Waveform) {
  const ctx = canvas.current
  if (!ctx) return
  let x = 0

  ctx.clearRect(0, 0, p.canvWidth, p.canvHeight)

  const waveform = (from: number, to: number, lw: number, color: string): number => {
    ctx.lineWidth = lw
    ctx.strokeStyle = color
    to = to > p.peaks.length ? p.peaks.length : to
    ctx.beginPath()
    for (; from < to; from++) {
      ctx.moveTo(from, p.peaks[from][0])
      ctx.lineTo(from, p.peaks[from][1])
    }
    ctx.stroke()
    return from
  }

  x = waveform(x, p.playX, p.playedLineWidth, p.playedLineColor)
  waveform(x, p.peaks.length, p.noplayedLineWidth, p.noplayedLineColor)

  drawSlider(ctx, p)
  if (p.playtime) drawTime(ctx, p)
}

function drawSlider(ctx: CanvasRenderingContext2D, p: Waveform) {
  ctx.lineWidth = p.playtimeSliderWidth
  ctx.strokeStyle = p.playtimeSliderColor
  ctx.beginPath()
  ctx.moveTo(p.playX, 0)
  ctx.lineTo(p.playX, p.canvHeight)
  ctx.stroke()
}

function drawTime(ctx: CanvasRenderingContext2D, p: Waveform) {
  const time = p.timePlayed
  const offset = 3
  const textWidth = ~~ctx.measureText(time).width
  const textX = p.playX > (p.canvWidth - textWidth - offset)
    ? p.playX - textWidth - offset
    : p.playX + offset
  const textY = p.playtimeTextBottom
    ? p.canvHeight - p.playtimeFontSize + offset
    : p.playtimeFontSize + offset
  ctx.fillStyle = p.playtimeFontColor
  ctx.font = `${p.playtimeFontSize}px ${p.playtimeFontFamily}`
  ctx.fillText(time, textX, textY)
}

function fetchData(
  canv: MutableRefObject<CanvasRenderingContext2D | null>,
  p: Waveform,
  fetchOpts: CreateFetchOptions
) {
  if (!p.src) return
  const init = { ...fetchOpts.fetchOptions }
  fetch(p.src, init).then(async response => {
    if (!response.ok) throw new Error(String(response.status))
    return response.arrayBuffer()
  }).then(data => {
    const audioContext = new AudioContext()
    return audioContext.decodeAudioData(data).then(buff => {
      p.duration = buff.duration
      p.setPeaks(buff)
      draw(canv, p)
    })
  }).catch(err => {
    console.error(`Failed get url '${p.src}': ${err}`)
  })

  const ctx = canv.current
  if (!ctx) return
  ctx.lineWidth = p.noplayedLineWidth
  ctx.strokeStyle = p.noplayedLineColor
  ctx.beginPath()
  ctx.moveTo(0, p.canvHeight / 2)
  ctx.lineTo(p.canvWidth, p.canvHeight / 2)
  ctx.stroke()
  drawSlider(ctx, p)
  if (p.playtime) drawTime(ctx, p)
}
