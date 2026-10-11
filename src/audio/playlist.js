// One playlist for the player: the embedded YouTube songs. YouTube audio streams from YouTube's own
// embedded player (nothing is downloaded).
import { music, TRACKS as SYNTH } from './music.js'

// Add or remove songs here: the id is the part after youtu.be/
export const YOUTUBE_SONGS = [
  { id: 'ckvG6_Wjrlo', title: 'Konoyo no Uta (Piano)' },
  { id: '9Lvs12fV-74', title: 'Katarare Zaru Mono no Densetsu' },
  { id: 'AnKTcOx9kZE', title: 'Accettami' },
]

// Only the YouTube songs are in the playlist. The synth engine (music.js) is
// kept as a fallback: add `...SYNTH.map((t, i) => ({ kind: 'synth', index: i, title: t.title }))`
// to bring those tracks back.
const ITEMS = YOUTUBE_SONGS.map((s) => ({ kind: 'yt', ...s }))

export const YT_ELEMENT_ID = 'yt-player'

let apiPromise = null
function loadYouTubeApi() {
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT)
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve(window.YT)
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    s.async = true
    document.head.appendChild(s)
  })
  return apiPromise
}

// Wait until the player widget has rendered its video slot.
function waitForElement(id, timeout = 4000) {
  return new Promise((resolve, reject) => {
    const start = performance.now()
    const check = () => {
      const el = document.getElementById(id)
      if (el) return resolve(el)
      if (performance.now() - start > timeout) return reject(new Error('player slot missing'))
      requestAnimationFrame(check)
    }
    check()
  })
}

class Playlist {
  constructor() {
    this.index = 0
    this.playing = false
    this.volume = 0.6
    this.yt = null
    this.ytReady = null
    this.listeners = new Set()
    // When a synth track finishes, music.js moves to its next track on its own;
    // keep our index in sync with it.
    music.on((st) => {
      if (this.current.kind === 'synth' && st.track !== this.current.index && this.playing) {
        this.index = ITEMS.findIndex((it) => it.kind === 'synth' && it.index === st.track)
      }
      this.emit()
    })
  }

  get items() {
    return ITEMS
  }

  get current() {
    return ITEMS[this.index]
  }

  on(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  emit() {
    const st = this.state()
    this.listeners.forEach((fn) => fn(st))
  }

  state() {
    const cur = this.current
    let elapsed = 0
    let length = 0
    if (cur.kind === 'yt' && this.yt?.getCurrentTime) {
      elapsed = this.yt.getCurrentTime() || 0
      length = this.yt.getDuration() || 0
    } else if (cur.kind === 'synth') {
      const m = music.state()
      elapsed = m.elapsed
      length = m.length
    }
    return { index: this.index, kind: cur.kind, title: cur.title, playing: this.playing, elapsed, length, volume: this.volume }
  }

  ensureYouTube() {
    if (this.ytReady) return this.ytReady
    this.ytReady = Promise.all([loadYouTubeApi(), waitForElement(YT_ELEMENT_ID)]).then(
      ([YT]) =>
        new Promise((resolve) => {
          this.yt = new YT.Player(YT_ELEMENT_ID, {
            host: 'https://www.youtube-nocookie.com',
            width: 200,
            height: 200,
            playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
            events: {
              onReady: () => {
                this.yt.setVolume(Math.round(this.volume * 100))
                resolve(this.yt)
              },
              onStateChange: (e) => {
                if (this.current.kind !== 'yt') return
                if (e.data === YT.PlayerState.ENDED) this.next()
                else if (e.data === YT.PlayerState.PLAYING) {
                  this.playing = true
                  this.emit()
                } else if (e.data === YT.PlayerState.PAUSED) {
                  this.playing = false
                  this.emit()
                }
              },
              // Video removed or embedding blocked: skip it.
              onError: () => this.next(),
            },
          })
        })
    )
    return this.ytReady
  }

  async play() {
    const cur = this.current
    this.playing = true
    this.emit()
    if (cur.kind === 'yt') {
      music.pause()
      try {
        const p = await this.ensureYouTube()
        if (this.current !== cur) return
        const loaded = p.getVideoData?.().video_id
        if (loaded === cur.id) p.playVideo()
        else p.loadVideoById(cur.id)
      } catch {
        this.next()
      }
    } else {
      this.yt?.pauseVideo?.()
      if (music.track !== cur.index) music.setTrack(cur.index)
      music.setVolume(this.volume)
      music.play()
    }
  }

  pause() {
    this.playing = false
    if (this.current.kind === 'yt') this.yt?.pauseVideo?.()
    else music.pause()
    this.emit()
  }

  toggle() {
    this.playing ? this.pause() : this.play()
  }

  go(i) {
    const wasPlaying = this.playing
    if (this.current.kind === 'yt') this.yt?.pauseVideo?.()
    else music.pause()
    this.index = (i + ITEMS.length) % ITEMS.length
    if (wasPlaying) this.play()
    else this.emit()
  }

  next() {
    this.go(this.index + 1)
  }

  prev() {
    this.go(this.index - 1)
  }

  setVolume(v) {
    this.volume = v
    this.yt?.setVolume?.(Math.round(v * 100))
    music.setVolume(v)
    this.emit()
  }
}

export const playlist = new Playlist()
