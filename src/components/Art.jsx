import { useId } from 'react'

// Original artwork drawn in SVG (no third-party images).
// Colors come from CSS variables, so the art follows light/dark mode.

// Small seeded random generator so the mosaic looks the same on every visit.
function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Stained-glass mosaic: a hex grid with jittered, shared corners.
function buildMosaic(w, h, size, seed) {
  const rand = rng(seed)
  const corners = new Map()
  const hexW = size * Math.sqrt(3)
  const rowH = size * 1.5
  const corner = (x, y) => {
    const k = `${Math.round(x * 4)},${Math.round(y * 4)}`
    if (!corners.has(k)) {
      corners.set(k, [x + (rand() - 0.5) * size * 0.7, y + (rand() - 0.5) * size * 0.7])
    }
    return corners.get(k)
  }
  const cells = []
  for (let row = -1; row <= h / rowH + 1; row++) {
    for (let col = -1; col <= w / hexW + 1; col++) {
      const cx = col * hexW + (row % 2 ? hexW / 2 : 0)
      const cy = row * rowH
      const pts = []
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 180) * (60 * i + 30)
        pts.push(corner(cx + size * Math.cos(a), cy + size * Math.sin(a)))
      }
      const r = rand()
      const tone = r < 0.42 ? 0 : r < 0.72 ? 1 : r < 0.9 ? 2 : 3
      cells.push({ d: 'M' + pts.map((p) => p.map((n) => n.toFixed(1)).join(' ')).join('L') + 'Z', tone })
    }
  }
  return cells
}

const MOSAIC = buildMosaic(400, 520, 26, 1337)

function Mosaic() {
  return (
    <g className="mosaic">
      <rect width="400" height="520" className="mosaic__grout" />
      {MOSAIC.map((c, i) => (
        <path key={i} d={c.d} className={`mosaic__t${c.tone}`} />
      ))}
    </g>
  )
}

// An original spiky-haired character, head and shoulders.
function Figure() {
  return (
    <g className="figure">
      {/* coat with high collar */}
      <path
        className="figure__coat"
        d="M10 520 L60 430 L130 392 L160 420 L200 452 L240 420 L270 392 L340 430 L390 520 Z"
      />
      <path className="figure__collar" d="M130 392 L118 352 L168 404 L200 452 L160 420 Z" />
      <path className="figure__collar" d="M270 392 L282 352 L232 404 L200 452 L240 420 Z" />
      {/* neck */}
      <path className="figure__skin" d="M172 330 L228 330 L236 404 L200 440 L164 404 Z" />
      {/* face */}
      <path
        className="figure__skin"
        d="M122 236 C122 170 160 140 200 140 C240 140 278 170 278 236 C278 300 246 352 200 362 C154 352 122 300 122 236 Z"
      />
      {/* face shadow */}
      <path className="figure__shade" d="M200 362 C246 352 278 300 278 236 L262 250 C258 300 236 336 200 346 Z" />
      {/* rim light down the left cheek */}
      <path className="figure__face-rim" d="M126 262 C130 304 156 342 196 358" />
      {/* hair: spikes all round, bangs falling over the eyes */}
      <path
        className="figure__hair"
        d="M112 262 L70 214 L108 214 L62 150 L118 168 L96 92 L150 136 L156 54 L194 120 L222 40 L238 118 L292 62 L284 140 L344 116 L306 182 L352 196 L300 228 L330 268
           L290 250 L282 214 L262 262 L248 206 L226 262 L210 200 L190 258 L176 204 L156 258 L150 210 L128 250 Z"
      />
      {/* rim light on the hair */}
      <path
        className="figure__rim"
        d="M222 40 L238 118 L292 62 L284 140 L344 116 L306 182 L352 196 L300 228"
      />
      {/* eyes */}
      <g className="figure__eyes">
        <path className="figure__eye" d="M146 278 Q166 260 192 272 Q172 290 146 278 Z" />
        <path className="figure__eye" d="M208 272 Q234 260 254 278 Q228 290 208 272 Z" />
        <ellipse className="figure__pupil" cx="171" cy="276" rx="2.6" ry="8" />
        <ellipse className="figure__pupil" cx="229" cy="276" rx="2.6" ry="8" />
      </g>
      {/* brows */}
      <path className="figure__brow" d="M140 262 L194 262 L190 256 Z" />
      <path className="figure__brow" d="M206 262 L260 262 L210 256 Z" />
      {/* MB mark on the collar */}
      <text className="figure__mark" x="296" y="470">
        MB
      </text>
    </g>
  )
}

// Main menu: the character on its own, cut out over the sky.
export function HeroCutout() {
  return (
    <svg className="art art--cutout" viewBox="40 30 330 490" role="img" aria-label="Illustration of a spiky-haired character with gold eyes">
      <Figure />
    </svg>
  )
}

// Mosaic + character, used as a collage panel.
export function HeroArt({ viewBox = '0 0 400 520' }) {
  return (
    <svg className="art" viewBox={viewBox} aria-hidden="true">
      <Mosaic />
      <Figure />
    </svg>
  )
}

// Close-up side profile: blue-tinted face, gold eye, red </> mark on the neck,
// with a canvas-like grain.
export function ProfileArt({ viewBox = '0 0 400 300' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="art" viewBox={viewBox} aria-hidden="true">
      <defs>
        <filter id={`grain${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.16 0" />
        </filter>
        <linearGradient id={`skin${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--p-skin-1)" />
          <stop offset="1" stopColor="var(--p-skin-2)" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" className="p-bg" />
      {/* face, profile edge on the left: brow, nose, lips, chin */}
      <path
        fill={`url(#skin${id})`}
        d="M40 0 L400 0 L400 300 L96 300 L124 252 L150 238 L168 218 L160 207 L176 193 L166 178 L136 152 L112 122 Z"
      />
      {/* neck below the jawline */}
      <path className="p-neck" d="M150 240 Q232 204 304 118 L352 150 L322 300 L170 300 Z" />
      <path className="p-line" d="M150 240 Q232 204 304 118" />
      {/* cheek light */}
      <path className="p-light" d="M126 150 Q160 160 200 150 Q170 182 140 172 Z" />
      {/* deep shadow on the right */}
      <path className="p-shadow" d="M336 0 L400 0 L400 300 L312 300 Q372 196 336 0 Z" />
      {/* hair */}
      <path
        className="p-hair"
        d="M0 0 L340 0 L306 34 L328 64 L276 52 L256 96 L234 58 L206 104 L194 62 L164 108 L152 72 L128 104 L110 82 L76 98 L58 80 L30 108 L0 96 Z"
      />
      <path className="p-strand" d="M300 10 L250 80 M240 20 L200 92 M180 14 L160 96 M120 18 L112 90 M70 22 L60 76" />
      {/* eye */}
      <path className="p-eye-white" d="M60 128 Q92 102 134 120 Q102 144 60 128 Z" />
      <circle className="p-iris" cx="102" cy="123" r="11" />
      <circle className="p-pupil" cx="104" cy="123" r="4" />
      <circle className="p-glint" cx="98" cy="119" r="2.5" />
      <path className="p-lid" d="M56 127 Q92 98 138 118" />
      {/* coat collar, bottom left */}
      <path className="p-coat" d="M0 300 L0 172 L62 204 L134 262 L206 300 Z" />
      <path className="p-collar" d="M0 172 L62 204 L134 262 L206 300" />
      {/* mark: a diamond with code brackets */}
      <g className="p-mark">
        <path d="M300 176 L328 214 L300 252 L272 214 Z" />
        <path d="M292 204 L283 214 L292 224 M308 204 L317 214 L308 224 M303 200 L297 228" />
      </g>
      <rect width="400" height="300" filter={`url(#grain${id})`} />
    </svg>
  )
}

// Night scene: big moon over a city skyline.
export function MoonArt({ viewBox = '0 0 400 520' }) {
  const towers = [
    [0, 380, 46], [40, 330, 30], [66, 360, 52], [112, 300, 26], [134, 350, 40],
    [170, 250, 34], [200, 330, 48], [244, 290, 30], [270, 345, 56], [322, 310, 34], [352, 360, 48],
  ]
  return (
    <svg className="art" viewBox={viewBox} aria-hidden="true">
      <rect width="400" height="520" className="moon__sky" />
      <circle cx="250" cy="170" r="120" className="moon__halo" />
      <circle cx="250" cy="170" r="92" className="moon__disc" />
      <circle cx="222" cy="150" r="16" className="moon__crater" />
      <circle cx="282" cy="196" r="24" className="moon__crater" />
      <circle cx="268" cy="130" r="9" className="moon__crater" />
      {towers.map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={520 - y} className="moon__tower" />
          {Array.from({ length: Math.floor((520 - y) / 26) }).map((_, j) =>
            (i + j) % 3 === 0 ? (
              <rect key={j} x={x + 6} y={y + 12 + j * 26} width="5" height="8" className="moon__window" />
            ) : null
          )}
        </g>
      ))}
      <path d="M170 250 L187 196 L204 250 Z" className="moon__tower" />
      <path d="M0 470 C80 455 160 485 240 468 S360 470 400 462 L400 520 L0 520 Z" className="moon__water" />
    </svg>
  )
}

// Small square crops used as row avatars.
const THUMBS = [
  () => <HeroArt viewBox="130 220 140 140" />,
  () => <ProfileArt viewBox="40 80 140 140" />,
  () => <MoonArt viewBox="160 80 180 180" />,
  () => <ProfileArt viewBox="250 160 100 100" />,
  () => <HeroArt viewBox="60 40 300 300" />,
]

export function Thumb({ index = 0 }) {
  const T = THUMBS[index % THUMBS.length]
  return (
    <span className="thumb" aria-hidden="true">
      <T />
    </span>
  )
}

// Tilted collage of panels on the right side of inner pages.
export function Collage() {
  return (
    <div className="collage" aria-hidden="true">
      <div className="panel panel--a">
        <ProfileArt />
      </div>
      <div className="panel panel--b">
        <HeroArt viewBox="110 200 200 160" />
      </div>
      <div className="panel panel--c">
        <MoonArt viewBox="60 40 340 300" />
      </div>
      <div className="panel panel--d">
        <HeroArt viewBox="0 0 400 260" />
      </div>
      <div className="panel panel--e">
        <ProfileArt viewBox="230 140 160 130" />
      </div>
    </div>
  )
}
