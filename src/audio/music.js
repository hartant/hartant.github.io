// Original background music, generated live with the Web Audio API.
// No recordings or samples: every note is synthesized in the browser.

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12)

// Each track: tempo, swing, and a 4-chord loop (MIDI notes) with bass roots.
export const TRACKS = [
  {
    title: 'Midnight Parse',
    bpm: 88,
    swing: 0.12,
    chords: [
      [62, 65, 69, 72],
      [55, 59, 62, 65],
      [60, 64, 67, 71],
      [57, 60, 64, 67],
    ],
    bass: [38, 43, 36, 45],
    seed: 7,
  },
  {
    title: 'Commit at 3AM',
    bpm: 96,
    swing: 0.08,
    chords: [
      [65, 69, 72, 76],
      [64, 67, 71, 74],
      [62, 65, 69, 72],
      [60, 64, 67, 71],
    ],
    bass: [41, 40, 38, 36],
    seed: 21,
  },
  {
    title: 'City of Glass',
    bpm: 80,
    swing: 0.15,
    chords: [
      [57, 60, 64, 67, 71],
      [53, 57, 60, 64],
      [50, 53, 57, 60, 64],
      [52, 56, 59, 62],
    ],
    bass: [45, 41, 38, 40],
    seed: 42,
  },
]

const BARS_PER_SONG = 32

function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

export class Music {
  constructor() {
    this.ctx = null
    this.track = 0
    this.playing = false
    this.volume = 0.6
    this.listeners = new Set()
  }

  // Create the audio graph on first use (must happen after a click / key press).
  init() {
    if (this.ctx) return
    const AC = window.AudioContext || window.webkitAudioContext
    const ctx = (this.ctx = new AC())

    this.master = ctx.createGain()
    this.master.gain.value = this.volume * 0.5
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -18
    comp.ratio.value = 3
    this.analyser = ctx.createAnalyser()
    this.analyser.fftSize = 128
    this.analyser.smoothingTimeConstant = 0.8
    this.master.connect(comp)
    comp.connect(this.analyser)
    this.analyser.connect(ctx.destination)

    // Small generated reverb for the keys.
    this.reverb = ctx.createConvolver()
    const len = ctx.sampleRate * 2.2
    const impulse = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = impulse.getChannelData(c)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
    }
    this.reverb.buffer = impulse
    const wet = ctx.createGain()
    wet.gain.value = 0.35
    this.reverb.connect(wet)
    wet.connect(this.master)

    // Noise buffer for drums.
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const nd = this.noise.getChannelData(0)
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1

    // Soft vinyl hiss under everything.
    const hiss = ctx.createBufferSource()
    hiss.buffer = this.noise
    hiss.loop = true
    const hf = ctx.createBiquadFilter()
    hf.type = 'highpass'
    hf.frequency.value = 5000
    const hg = ctx.createGain()
    hg.gain.value = 0.012
    hiss.connect(hf)
    hf.connect(hg)
    hg.connect(this.master)
    hiss.start()
  }

  on(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  emit() {
    this.listeners.forEach((fn) => fn(this.state()))
  }

  get current() {
    return TRACKS[this.track]
  }

  get beat() {
    return 60 / this.current.bpm
  }

  get length() {
    return BARS_PER_SONG * 4 * this.beat
  }

  state() {
    const elapsed =
      this.ctx && this.playing ? Math.min(this.ctx.currentTime - this.songStart, this.length) : this.pausedAt || 0
    return {
      playing: this.playing,
      title: this.current.title,
      track: this.track,
      elapsed,
      length: this.length,
      volume: this.volume,
    }
  }

  play() {
    this.init()
    this.ctx.resume()
    if (this.playing) return
    this.playing = true
    const offset = this.pausedAt || 0
    this.songStart = this.ctx.currentTime - offset
    this.step = Math.floor(offset / (this.beat / 4))
    this.nextTime = this.ctx.currentTime + 0.05
    this.rand = rng(this.current.seed + this.step)
    this.timer = setInterval(() => this.schedule(), 25)
    this.emit()
  }

  pause() {
    if (!this.playing) return
    this.pausedAt = this.ctx.currentTime - this.songStart
    this.playing = false
    clearInterval(this.timer)
    this.emit()
  }

  toggle() {
    this.playing ? this.pause() : this.play()
  }

  setTrack(i) {
    const wasPlaying = this.playing
    if (wasPlaying) this.pause()
    this.track = (i + TRACKS.length) % TRACKS.length
    this.pausedAt = 0
    if (wasPlaying) this.play()
    else this.emit()
  }

  next() {
    this.setTrack(this.track + 1)
  }

  prev() {
    this.setTrack(this.track - 1)
  }

  setVolume(v) {
    this.volume = v
    if (this.master) this.master.gain.setTargetAtTime(v * 0.5, this.ctx.currentTime, 0.05)
    this.emit()
  }

  // Frequency data for the visualizer.
  bars(out) {
    if (this.analyser) this.analyser.getByteFrequencyData(out)
    return out
  }

  // Lookahead scheduler: queue notes a little ahead of time.
  schedule() {
    const ctx = this.ctx
    const sixteenth = this.beat / 4
    while (this.nextTime < ctx.currentTime + 0.12) {
      if (this.step >= BARS_PER_SONG * 16) {
        // Song finished: move on to the next track.
        clearInterval(this.timer)
        this.playing = false
        this.pausedAt = 0
        this.track = (this.track + 1) % TRACKS.length
        this.play()
        return
      }
      const s = this.step % 16
      const swing = s % 2 === 1 ? sixteenth * this.current.swing * 2 : 0
      this.playStep(this.step, this.nextTime + swing)
      this.nextTime += sixteenth
      this.step++
    }
  }

  playStep(step, t) {
    const tr = this.current
    const bar = Math.floor(step / 16) % tr.chords.length
    const s = step % 16
    const chord = tr.chords[bar]
    const r = this.rand
    const songBar = Math.floor(step / 16)
    const intro = songBar < 2

    // Drums (sparser in the first two bars).
    if (!intro) {
      if (s === 0 || s === 8 || (s === 10 && r() < 0.4)) this.kick(t)
      if (s === 4 || s === 12) this.snare(t)
    }
    if (s % 2 === 0) this.hat(t, s % 4 === 0 ? 0.05 : 0.03)

    // Bass.
    if (!intro) {
      if (s === 0) this.bass(midi(tr.bass[bar]), t, this.beat * 1.5)
      if (s === 6) this.bass(midi(tr.bass[bar] + 7), t, this.beat * 0.5)
      if (s === 10) this.bass(midi(tr.bass[bar] + 12), t, this.beat * 0.4)
      if (s === 14 && r() < 0.6) this.bass(midi(tr.bass[(bar + 1) % 4] - 1), t, this.beat * 0.3)
    }

    // Electric-piano chords.
    if (s === 0) chord.forEach((n) => this.keys(midi(n), t, this.beat * 2.2, 0.07))
    if (s === 7) chord.forEach((n) => this.keys(midi(n), t, this.beat * 0.6, 0.04))

    // A light melody from the chord tones, an octave up.
    if (!intro && s % 2 === 0 && r() < 0.32) {
      const n = chord[Math.floor(r() * chord.length)] + 12
      this.keys(midi(n), t, this.beat * (r() < 0.5 ? 0.5 : 1), 0.05, true)
    }
  }

  env(g, t, peak, attack, dur) {
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  }

  keys(freq, t, dur, vol, bright = false) {
    const ctx = this.ctx
    const g = ctx.createGain()
    const a = ctx.createOscillator()
    const b = ctx.createOscillator()
    a.type = 'sine'
    b.type = 'triangle'
    a.frequency.value = freq
    b.frequency.value = freq * 2.001
    const bg = ctx.createGain()
    bg.gain.value = bright ? 0.25 : 0.12
    a.connect(g)
    b.connect(bg)
    bg.connect(g)
    this.env(g, t, vol, 0.008, dur)
    g.connect(this.master)
    g.connect(this.reverb)
    a.start(t)
    b.start(t)
    a.stop(t + dur + 0.05)
    b.stop(t + dur + 0.05)
  }

  bass(freq, t, dur) {
    const ctx = this.ctx
    const o = ctx.createOscillator()
    o.type = 'triangle'
    o.frequency.value = freq
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 600
    const g = ctx.createGain()
    this.env(g, t, 0.22, 0.01, dur)
    o.connect(f)
    f.connect(g)
    g.connect(this.master)
    o.start(t)
    o.stop(t + dur + 0.05)
  }

  kick(t) {
    const ctx = this.ctx
    const o = ctx.createOscillator()
    o.frequency.setValueAtTime(130, t)
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12)
    const g = ctx.createGain()
    this.env(g, t, 0.5, 0.004, 0.32)
    o.connect(g)
    g.connect(this.master)
    o.start(t)
    o.stop(t + 0.35)
  }

  noiseHit(t, type, freq, vol, dur) {
    const ctx = this.ctx
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const f = ctx.createBiquadFilter()
    f.type = type
    f.frequency.value = freq
    const g = ctx.createGain()
    this.env(g, t, vol, 0.002, dur)
    src.connect(f)
    f.connect(g)
    g.connect(this.master)
    src.start(t, Math.random() * 0.5)
    src.stop(t + dur + 0.02)
  }

  snare(t) {
    this.noiseHit(t, 'bandpass', 1900, 0.18, 0.16)
    const o = this.ctx.createOscillator()
    o.type = 'triangle'
    o.frequency.value = 190
    const g = this.ctx.createGain()
    this.env(g, t, 0.08, 0.002, 0.08)
    o.connect(g)
    g.connect(this.master)
    o.start(t)
    o.stop(t + 0.1)
  }

  hat(t, vol) {
    this.noiseHit(t, 'highpass', 7500, vol, 0.04)
  }
}

export const music = new Music()
