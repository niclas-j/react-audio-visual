import { useRef } from 'react'
import { makeWaveformProps } from '@/composables/useProps'
import { useAVWaveform } from '@/composables/useAVWaveform'

type AVWaveformProps = {
  [key: string]: unknown
  src?: string | null
  audioControls?: boolean
}

export default function AVWaveform(props: AVWaveformProps) {
  const player = useRef<HTMLAudioElement | null>(null)
  const canvas = useRef<HTMLCanvasElement | null>(null)

  useAVWaveform(player, canvas, props, {
    options: { refetch: true },
    fetchOptions: { mode: 'cors' }
  })

  const defaults = makeWaveformProps()
  const width = props.canvWidth === undefined ? defaults.canvWidth.default : props.canvWidth
  const height = props.canvHeight === undefined ? defaults.canvHeight.default : props.canvHeight

  return (
    <>
      <audio
        ref={player}
        controls={props.audioControls === undefined ? true : Boolean(props.audioControls)}
        src={props.src ?? undefined}
      />
      <canvas ref={canvas} width={Number(width)} height={Number(height)} />
    </>
  )
}
