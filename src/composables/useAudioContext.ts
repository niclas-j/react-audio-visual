import { useEffect, useRef } from 'react'

type AudioPlayer = HTMLAudioElement | null | { current: HTMLAudioElement | null }

export function useAudioContext(
  player: AudioPlayer,
  fft: number | null,
  cbFun: (data: Uint8Array) => void
): void {
  const callbackRef = useRef(cbFun)
  callbackRef.current = cbFun

  const audio =
    player && 'current' in player ? player.current : player

  useEffect(() => {
    if (!audio) return

    let ctx: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let src: MediaElementAudioSourceNode | null = null
    let rafId: number | null = null
    let active = false
    let previousFrameTimestamp = 0

    const fftSize = fft || 1024
    const data = new Uint8Array(fftSize / 2)

    const pause = () => {
      active = false
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
        rafId = null
      }
    }

    const loop: FrameRequestCallback = (timestamp) => {
      if (!active) return

      if (!analyser) return
      analyser.getByteFrequencyData(data)
      callbackRef.current(data)

      previousFrameTimestamp = timestamp
      rafId = window.requestAnimationFrame(loop)
    }

    const resume = () => {
      if (active) return
      active = true
      previousFrameTimestamp = 0
      rafId = window.requestAnimationFrame(loop)
    }

    const onPlay = () => {
      if (!ctx) {
        ctx = new AudioContext()
        src = ctx.createMediaElementSource(audio)
      }

      analyser = ctx.createAnalyser()
      analyser.fftSize = fftSize
      src?.connect(analyser)
      analyser.connect(ctx.destination)
      void ctx.resume()
      resume()
    }

    const onPause = () => {
      void ctx?.suspend()
      src?.disconnect()
      analyser?.disconnect()
      pause()
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      pause()
    }
  }, [audio, fft])
}
