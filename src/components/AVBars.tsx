import { useRef } from 'react'
import { useAVBars } from '@/composables/useAVBars'

export interface AVBarsProps {
  src?: string | null
  audioControls?: boolean
  corsAnonym?: boolean
  canvWidth?: number
  canvHeight?: number
  canvFillColor?: string | string[]
  placeholder?: boolean
  barWidth?: number
  barSpace?: number
  barColor?: string | string[]
  capsHeight?: number
  capsDropSpeed?: number
  capsColor?: string
  brickHeight?: number
  brickSpace?: number
  symmetric?: boolean
  fftSize?: number
}

export default function AVBars({
  src = null,
  audioControls = true,
  canvWidth = 300,
  canvHeight = 80,
  canvFillColor = '',
  placeholder = true,
  barWidth = 5,
  barSpace = 1,
  barColor = '#0A0AFF',
  capsHeight = 0,
  capsDropSpeed = 0.9,
  capsColor = '#A0A0FF',
  brickHeight = 0,
  brickSpace = 1,
  symmetric = false,
  fftSize = 1024
}: AVBarsProps) {
  const player = useRef<HTMLAudioElement | null>(null)
  const canvas = useRef<HTMLCanvasElement | null>(null)

  const props = {
    src,
    audioControls,
    canvWidth,
    canvHeight,
    canvFillColor,
    placeholder,
    barWidth,
    barSpace,
    barColor,
    capsHeight,
    capsDropSpeed,
    capsColor,
    brickHeight,
    brickSpace,
    symmetric,
    fftSize
  }

  useAVBars(player, canvas, props)

  return (
    <>
      <audio ref={player} controls={audioControls} src={src ?? undefined} />
      <canvas ref={canvas} role="img" />
    </>
  )
}
