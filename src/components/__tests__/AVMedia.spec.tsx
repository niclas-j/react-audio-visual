import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import AVMedia from '@/components/AVMedia'

describe('AVMedia', () => {
  it('default properties', async () => {
    const { container } = render(<AVMedia />)

    const canv = container.querySelector('canvas')!
    expect(canv.getAttribute('width')).toBe('200')
    expect(canv.getAttribute('height')).toBe('40')
  })

  it('set properties', async () => {
    const { container } = render(<AVMedia canvWidth={200} canvHeight={200} />)

    const canv = container.querySelector('canvas')!
    expect(canv.getAttribute('width')).toBe('200')
    expect(canv.getAttribute('height')).toBe('200')
  })
})
