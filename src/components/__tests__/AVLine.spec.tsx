import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import AVLine from '@/components/AVLine'

describe('AVLine', () => {
  it('default properties', async () => {
    const { container } = render(<AVLine />)

    const canv = container.querySelector('canvas')
    expect(canv).toHaveAttribute('width', '300')
    expect(canv).toHaveAttribute('height', '80')

    const audio = container.querySelector('audio')
    expect(audio).not.toHaveAttribute('src')
    expect(audio).toHaveAttribute('controls', '')
  })

  it('set properties', async () => {
    const { container } = render(
      <AVLine
        src="./music.mp3"
        canvWidth={100}
        canvHeight={55}
        audioControls={false}
      />
    )

    const canv = container.querySelector('canvas')
    expect(canv).toHaveAttribute('width', '100')
    expect(canv).toHaveAttribute('height', '55')

    const audio = container.querySelector('audio')
    expect(audio).toHaveAttribute('src', './music.mp3')
    expect(audio).not.toHaveAttribute('controls')
  })
})
