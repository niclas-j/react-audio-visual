import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import AVCircle from '@/components/AVCircle'

describe('AVCircle', () => {
  it('default properties', async () => {
    const { container } = render(<AVCircle />)

    const canv = container.querySelector('canvas')!
    expect(canv.getAttribute('width')).toBe('100')
    expect(canv.getAttribute('height')).toBe('100')

    const audio = container.querySelector('audio')!
    expect(audio.getAttribute('src') ?? undefined).toBeUndefined()
    expect(audio.getAttribute('controls')).toBe('')
  })

  it('set properties', async () => {
    const { container } = render(
      <AVCircle
        src="./sound.mp3"
        canvWidth={200}
        canvHeight={200}
        audioControls={false}
      />
    )

    const canv = container.querySelector('canvas')!
    expect(canv.getAttribute('width')).toBe('200')
    expect(canv.getAttribute('height')).toBe('200')

    const audio = container.querySelector('audio')!
    expect(audio.getAttribute('src')).toBe('./sound.mp3')
    expect(audio.getAttribute('controls') ?? undefined).toBeUndefined()
  })
})
