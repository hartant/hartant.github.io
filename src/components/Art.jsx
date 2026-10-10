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

// Close-up side profile, framed like an anime still: big gold eye top-left
// under the hair, pale blue face looking down-left, long neck with a red
// hand-drawn diamond mark, dark shadow on the right, canvas texture on top.
export function ProfileArt({ viewBox = '0 0 500 375' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="art" viewBox={viewBox} aria-hidden="true">
      <defs>
        <filter id={`grain${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.22 0" />
        </filter>
        <filter id={`soft${id}`}>
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <linearGradient id={`skin${id}`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="var(--p-skin-1)" />
          <stop offset="1" stopColor="var(--p-skin-2)" />
        </linearGradient>
        <radialGradient id={`iris${id}`} cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ffe68a" />
          <stop offset="0.6" stopColor="var(--eye-1)" />
          <stop offset="1" stopColor="#b8860b" />
        </radialGradient>
      </defs>

      <g filter={`url(#soft${id})`}>
        <rect width="500" height="375" className="p-bg" />

        {/* face and neck */}
        <path
          fill={`url(#skin${id})`}
          d="M40 0 L330 0 L345 60 L332 150 L346 262 L332 375 L236 375 L214 330 L198 306 L172 288 L180 272 L152 262 L162 250 L104 240 L92 200 L70 150 L40 110 L26 70 Z"
        />
        {/* neck in slightly deeper shade, under the jaw */}
        <path className="p-neck" d="M162 200 Q206 230 250 258 L304 232 L346 262 L332 375 L236 375 L214 330 L198 306 Z" />
        {/* soft light on the cheek */}
        <path className="p-light" d="M110 70 Q170 60 182 120 Q150 170 118 150 Q96 110 110 70 Z" />

        {/* contour lines: cheek and jaw */}
        <path className="p-line" d="M188 18 Q176 108 160 186" />
        <path className="p-line" d="M162 200 Q206 230 250 258" />
        <path className="p-line p-line--thin" d="M206 300 Q230 330 240 372" />

        {/* deep shadow and hair mass on the right */}
        <path className="p-shadow" d="M332 0 L500 0 L500 375 L332 375 L346 262 L332 150 L345 60 Z" />
        <path className="p-hair" d="M196 0 L500 0 L500 118 L452 150 L432 92 L392 144 L368 62 L336 124 L310 44 L280 30 Z" />
        <path className="p-strand" d="M470 20 L410 120 M420 10 L372 100 M360 8 L330 90 M300 6 L290 40" />

        {/* hair strands over the eye, top-left */}
        <path className="p-hair" d="M0 0 L120 0 L96 10 L70 4 L46 26 L24 14 L10 74 L0 70 Z" />
        <path className="p-hair" d="M0 70 L58 36 L18 112 Z" />
        <path className="p-hair" d="M0 134 L44 112 L10 168 Z" />
        <path className="p-hair" d="M140 0 L206 0 L182 30 L168 12 Z" /><path className="p-strand" d="M60 6 L30 50 M196 4 L176 26 M30 20 L12 66" />

        {/* the eye */}
        <path className="p-eye-white" d="M26 66 Q80 -6 168 16 Q130 88 26 66 Z" />
        <ellipse cx="98" cy="36" rx="25" ry="31" fill={`url(#iris${id})`} className="p-iris" />
        <ellipse className="p-pupil" cx="101" cy="36" rx="5" ry="20" />
        <circle className="p-glint" cx="88" cy="24" r="4.5" />
        <path className="p-lid" d="M22 66 Q78 -12 174 14" />
        <path className="p-lid p-lid--low" d="M42 72 Q110 86 152 52" />

        {/* dark coat / background on the left and bottom-left */}
        <path className="p-coat" d="M0 118 L40 110 L70 150 L92 200 L104 240 L162 250 L152 262 L180 272 L172 288 L198 306 L214 330 L236 375 L0 375 Z" />
        <path className="p-collar" d="M58 258 Q130 300 186 336" />

        {/* the mark: a sketchy red diamond with code brackets */}
        <g className="p-mark">
          <path d="M310 180 L340 232 L300 276 L276 222 Z" />
          <path d="M312 184 L337 234 L302 272 L279 220 Z" opacity="0.6" />
          <path d="M298 214 L289 226 L299 238 M316 212 L325 224 L315 236 M311 208 L303 244" />
        </g>
      </g>

      <rect width="500" height="375" filter={`url(#grain${id})`} />
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

// Character pictures (Black Cat fan art), cropped with object-position + zoom.
const GUN = 'art/train-gun.webp'
const PROFILE = 'art/train-profile.webp'

export function ArtImg({ src, pos = '50% 50%', zoom = 1, alt = '' }) {
  return (
    <img
      className="art-img"
      src={src}
      alt={alt}
      loading="lazy"
      style={{ objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos }}
    />
  )
}

// Main menu picture: the gun-pointing shot.
export function HeroImage() {
  return <ArtImg src={GUN} pos="48% 40%" alt="Anime character with gold eyes pointing a revolver" />
}

// Small crops used as row avatars.
const THUMBS = [
  () => <ArtImg src={GUN} pos="52% 42%" zoom={2.2} />,
  () => <ArtImg src={PROFILE} pos="12% 8%" zoom={2.4} />,
  () => <MoonArt viewBox="160 80 180 180" />,
  () => <ArtImg src={PROFILE} pos="64% 56%" zoom={2.6} />,
  () => <ArtImg src={GUN} pos="40% 55%" zoom={1.6} />,
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
        <ArtImg src={PROFILE} />
      </div>
      <div className="panel panel--b">
        <ArtImg src={GUN} pos="55% 42%" zoom={1.8} />
      </div>
      <div className="panel panel--c">
        <MoonArt viewBox="60 40 340 300" />
      </div>
      <div className="panel panel--d">
        <ArtImg src={GUN} pos="30% 50%" zoom={1.1} />
      </div>
      <div className="panel panel--e">
        <ArtImg src={PROFILE} pos="66% 58%" zoom={2.2} />
      </div>
    </div>
  )
}
