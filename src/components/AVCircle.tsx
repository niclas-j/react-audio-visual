import { useRef } from 'react'
import { makeCircleProps } from '@/composables/useProps'
import { useAVCircle } from '@/composables/useAVCircle'

type AVCircleProps = {
  src?: string | null
  audioControls?: boolean
} & Record<string, unknown>

export default function AVCircle(props: AVCircleProps) {
  const definitions = makeCircleProps()
  const resolvedProps = {
    ...props,
    src: props.src ?? definitions.src.default,
    audioControls: props.audioControls ?? definitions.audioControls.default
  }
  const player = useRef<HTMLAudioElement | null>(null)
  const canvas = useRef<HTMLCanvasElement | null>(null)

  useAVCircle(player, canvas, resolvedProps)

  return (
    <>
      <audio
        ref={player}
        controls={resolvedProps.audioControls}
        src={resolvedProps.src ?? undefined}
      />
      <canvas ref={canvas} />
    </>
  )
}
