import { createRoot } from 'react-dom/client';
import { AVBars, AVWaveform, AVLine, AVCircle } from '../../src';

function App() {
  return (
    <div>
      <h1 style={{ fontSize: 20 }}>react-audio-visual demo</h1>
      <h2>AVWaveform</h2>
      <AVWaveform src="/tone.wav" canvWidth={600} canvHeight={100} />
      <h2>AVBars</h2>
      <AVBars src="/tone.wav" canvWidth={600} canvHeight={80} canvFillColor="#eef" />
      <h2>AVLine</h2>
      <AVLine src="/tone.wav" canvWidth={600} canvHeight={80} canvFillColor="#efe" />
      <h2>AVCircle</h2>
      <AVCircle src="/tone.wav" canvWidth={120} canvHeight={120} />
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
