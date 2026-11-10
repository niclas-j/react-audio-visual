import { useRef } from 'react'
import { useAVMedia } from '@/composables/useAVMedia'
import { makeMediaProps } from '@/composables/useProps'

type MediaProps = Record<string, any>

const mediaPropDefaults = Object.fromEntries(
  Object.entries(makeMediaProps()).map(([key, definition]: [string, any]) => [
    key,
    definition.default
  ])
)

export default function AVMedia(props: MediaProps) {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const mediaProps = { ...mediaPropDefaults, ...props }

  useAVMedia(canvas, mediaProps)

  return <canvas ref={canvas} />
}
