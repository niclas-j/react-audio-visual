import { useRef } from 'react'
import { makeLineProps } from '@/composables/useProps'
import { useAVLine } from '@/composables/useAVLine'

const lineProps = makeLineProps()

export type AVLineProps = {
  [K in keyof typeof lineProps]?: unknown
}

export default function AVLine(props: AVLineProps) {
  const player = useRef<HTMLAudioElement | null>(null)
  const canvas = useRef<HTMLCanvasElement | null>(null)

  const resolvedProps = Object.fromEntries(
    Object.entries(lineProps).map(([key, definition]) => [
      key,
      props[key as keyof AVLineProps] === undefined
        ? definition.default
        : props[key as keyof AVLineProps]
    ])
  ) as AVLineProps

  useAVLine(player, canvas, resolvedProps)

  return (
    <>
      <audio
        ref={player}
        controls={Boolean(resolvedProps.audioControls)}
        src={resolvedProps.src as string | undefined}
      />
      <canvas
        ref={canvas}
        width={Number(resolvedProps.canvWidth)}
        height={Number(resolvedProps.canvHeight)}
      />
    </>
  )
}
