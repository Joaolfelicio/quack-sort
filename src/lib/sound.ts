let ctx: AudioContext | null = null;
let lastPlay = 0;
const MIN_INTERVAL_MS = 25;
let quackBuffer: AudioBuffer | null = null;
let quackBufferLoading = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function gate(): boolean {
  const now = performance.now();
  if (now - lastPlay < MIN_INTERVAL_MS) return false;
  lastPlay = now;
  return true;
}

function loadQuackBuffer(c: AudioContext): void {
  if (quackBuffer || quackBufferLoading) return;
  quackBufferLoading = true;
  fetch('/quack-sort/quack.wav')
    .then((r) => r.arrayBuffer())
    .then((ab) => c.decodeAudioData(ab))
    .then((buf) => { quackBuffer = buf; })
    .catch(() => { quackBufferLoading = false; });
}

export function quack(value: number, maxValue: number): void {
  if (!gate()) return;
  const c = getCtx();
  if (!c) return;
  loadQuackBuffer(c);
  if (!quackBuffer) return;
  const ratio = value / Math.max(1, maxValue);
  // Smaller duck = higher pitch (0.8× to 1.4× playback rate)
  const playbackRate = 0.8 + (1 - ratio) * 0.6;
  const src = c.createBufferSource();
  src.buffer = quackBuffer;
  src.playbackRate.value = playbackRate;
  const gain = c.createGain();
  gain.gain.value = 0.6;
  src.connect(gain).connect(c.destination);
  src.start(c.currentTime);
}

export function drip(value: number, maxValue: number): void {
  if (!gate()) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime;
  const freq = 300 + (value / Math.max(1, maxValue)) * 500;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, t0);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t0 + 0.07);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(0.08, t0 + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + 0.1);
}

export function splash(value: number, maxValue: number): void {
  if (!gate()) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime;
  const bufferSize = Math.floor(c.sampleRate * 0.05);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const src = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const gain = c.createGain();
  src.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.value = 600 + (value / Math.max(1, maxValue)) * 900;
  filter.Q.value = 2;
  gain.gain.setValueAtTime(0.08, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
  src.connect(filter).connect(gain).connect(c.destination);
  src.start(t0);
  src.stop(t0 + 0.06);
}
