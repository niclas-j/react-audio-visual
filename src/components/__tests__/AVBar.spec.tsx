import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AVBars from '@/components/AVBars'

describe('AVBars', () => {
  it('default properties', async () => {
    render(<AVBars />)

    const canv = screen.getByRole('img', { hidden: true })
    expect(canv).toHaveAttribute('width', '300')
    expect(canv).toHaveAttribute('height', '80')

    const audio = document.querySelector('audio')!
    expect(audio).not.toHaveAttribute('src')
    expect(audio).toHaveAttribute('controls', '')
  })

  it('set properties', async () => {
    render(
      <AVBars
        src="./sound.mp3"
        canvWidth={200}
        canvHeight={75}
        audioControls={false}
      />
    )

    const canv = document.querySelector('canvas')!
    expect(canv).toHaveAttribute('width', '200')
    expect(canv).toHaveAttribute('height', '75')

    const audio = document.querySelector('audio')!
    expect(audio).toHaveAttribute('src', './sound.mp3')
    expect(audio).not.toHaveAttribute('controls')
  })
})
