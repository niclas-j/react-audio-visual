import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import AVWaveform from '@/components/AVWaveform'

describe('AVWaveform', () => {
  it('default properties', () => {
    const { container } = render(<AVWaveform />)

    const canv = container.querySelector('canvas')
    expect(canv).toHaveAttribute('width', '500')
    expect(canv).toHaveAttribute('height', '80')

    const audio = container.querySelector('audio')
    expect(audio).not.toHaveAttribute('src')
    expect(audio).toHaveAttribute('controls', '')
  })

  it('set properties', () => {
    const { container } = render(
      <AVWaveform
        src="./sound.mp3"
        canvWidth={200}
        canvHeight={200}
        audioControls={false}
      />
    )

    const canv = container.querySelector('canvas')
    expect(canv).toHaveAttribute('width', '200')
    expect(canv).toHaveAttribute('height', '200')

    const audio = container.querySelector('audio')
    expect(audio).toHaveAttribute('src', './sound.mp3')
    expect(audio).not.toHaveAttribute('controls')
  })
})
