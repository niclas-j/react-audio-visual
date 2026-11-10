/**
* Mock canvas for plugin
*/
class CanvasGradient {
  colors: string[] = []
  offsets = 0

  addColorStop(offset:number, color:string) {
    this.colors.push(color)
    this.offsets = offset
  }
}

class CanvasRenderingContext2D {
  lineWidth: number | null = null
  lineCap = ''
  strokeStyle: string | null = null
  fillStyle: string | null = null

  clearRect() {/*.*/}
  fillRect() {/*.*/}
  beginPath() {/*.*/}
  moveTo() {/*.*/}
  lineTo() {/*.*/}
  stroke() {/*.*/}
  arc() {/*.*/}
  measureText() { return {} }
  fill() {/*.*/}
  fillText() {/*.*/}
  createRadialGradient() { return new CanvasGradient() }
  createLinearGradient() { return new CanvasGradient() }
}

export function makeCanvasContex2D () : CanvasRenderingContext2D {
  return new CanvasRenderingContext2D()
}

class MediaElementAudioSourceNode {
  connect(){/**/}
  disconnect(){/**/}
}

class MediaStreamAudioSourceNode {
  connect(){/**/}
}

class AnalyserNode {
  fftSize = 0
  getByteFrequencyData() {/**/}
  getByteTimeDomainData() {/**/}
  connect(){/**/}
  disconnect(){/**/}
}

export class AudioContext {
  createMediaElementSource() {return new MediaElementAudioSourceNode()}
  createMediaStreamSource() {return new MediaStreamAudioSourceNode()}
  createAnalyser() { return new AnalyserNode() }
  resume(){/**/}
  suspend(){/**/}
}

Object.defineProperty(globalThis, 'MediaStream', { value: class MediaStreamMock {} })
