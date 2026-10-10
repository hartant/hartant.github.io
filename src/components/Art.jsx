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

// Front image: mosaic + character in a slanted frame.
export function HeroArt() {
  return (
    <svg className="art" viewBox="0 0 400 520" role="img" aria-label="Illustration of a spiky-haired character with gold eyes">
      <defs>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--eye-1)" />
          <stop offset="1" stopColor="var(--eye-2)" />
        </radialGradient>
      </defs>
      <Mosaic />
      <Figure />
    </svg>
  )
}

// Close-up: zoom on the eyes and the mark.
export function CloseUpArt() {
  return (
    <svg className="art" viewBox="110 200 240 320" role="img" aria-label="Close-up of the character's gold eyes">
      <defs>
        <radialGradient id="eyeGlow2" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--eye-1)" />
          <stop offset="1" stopColor="var(--eye-2)" />
        </radialGradient>
      </defs>
      <Mosaic />
      <Figure />
    </svg>
  )
}

// Night scene: big moon over a city skyline.
export function MoonArt() {
  const towers = [
    [0, 380, 46], [40, 330, 30], [66, 360, 52], [112, 300, 26], [134, 350, 40],
    [170, 250, 34], [200, 330, 48], [244, 290, 30], [270, 345, 56], [322, 310, 34], [352, 360, 48],
  ]
  return (
    <svg className="art" viewBox="0 0 400 520" role="img" aria-label="Illustration of a large moon over a city at night">
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
      {/* the tallest tower with a spire */}
      <path d="M170 250 L187 196 L204 250 Z" className="moon__tower" />
      <path d="M0 470 C80 455 160 485 240 468 S360 470 400 462 L400 520 L0 520 Z" className="moon__water" />
    </svg>
  )
}

export const ART = { hero: HeroArt, close: CloseUpArt, moon: MoonArt }
