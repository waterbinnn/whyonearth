// Turns a grayscale canvas into a glowing, x-ray-like ASCII image with ghost trails.
// Flat areas use a density ramp; line-like areas use - \ | / along the line.
import { H, W } from './shapes'

const RAMP = ' .,:;~=+*xo%#@'
const LINES = '-\\|/'
const GLYPHS = RAMP + LINES
const CHAR_ASPECT = 0.6 // cell width / cell height
const SUB = 4 // sub-samples per cell side, for line direction
export const INK = { blue: '#2340ff', gray: '#9a9da4', white: '#f0efea' }
// Same three plates for a paper background: the highlight plate is black and glyphs multiply.
const INK_LIGHT = { blue: '#2340ff', gray: '#33363d', white: '#070708' }

export type Field = { cols: number; rows: number; lum: Float32Array; dir: Int8Array }

// Push dim areas to empty space and keep highlights hot.
function contrast(v: number) {
  const t = Math.max(0, Math.min(1, (v - 0.08) / 0.75))
  return Math.pow(t * t * (3 - 2 * t), 1.1)
}

export function toField(src: HTMLCanvasElement, cols: number): Field {
  const rows = Math.floor(H / (W / cols / CHAR_ASPECT))
  const sw = cols * SUB
  const sh = rows * SUB
  const small = document.createElement('canvas')
  small.width = sw
  small.height = sh
  const ctx = small.getContext('2d', { willReadFrequently: true })!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(src, 0, 0, sw, sh)
  const px = ctx.getImageData(0, 0, sw, sh).data
  const at = (x: number, y: number) =>
    px[(Math.max(0, Math.min(sh - 1, y)) * sw + Math.max(0, Math.min(sw - 1, x))) * 4] / 255
  // Sub-pixel size in shape units, so angles are not skewed by the tall cells.
  const ux = W / sw
  const uy = H / sh

  const lum = new Float32Array(cols * rows)
  const dir = new Int8Array(cols * rows).fill(-1)
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      let sum = 0, sxx = 0, syy = 0, sxy = 0
      for (let y = cy * SUB - 1; y < (cy + 1) * SUB + 1; y++) {
        for (let x = cx * SUB - 1; x < (cx + 1) * SUB + 1; x++) {
          const gx = (at(x + 1, y) - at(x - 1, y)) / (2 * ux)
          const gy = (at(x, y + 1) - at(x, y - 1)) / (2 * uy)
          sxx += gx * gx
          syy += gy * gy
          sxy += gx * gy
          if (x >= cx * SUB && x < (cx + 1) * SUB && y >= cy * SUB && y < (cy + 1) * SUB) sum += at(x, y)
        }
      }
      const i = cy * cols + cx
      const mean = sum / (SUB * SUB)
      const energy = sxx + syy
      const coherence = energy > 1e-6 ? Math.sqrt((sxx - syy) ** 2 + 4 * sxy * sxy) / energy : 0
      const edge = Math.sqrt(energy / ((SUB + 2) * (SUB + 2)))
      lum[i] = contrast(Math.min(1, mean * 0.8 + edge * 1.6))
      if (coherence > 0.55 && edge > 0.06 && lum[i] > 0.2) {
        // Gradient angle → line angle (perpendicular), quantized to 4 directions.
        const gAngle = 0.5 * Math.atan2(2 * sxy, sxx - syy)
        const lineAngle = gAngle + Math.PI / 2
        const q = Math.round(((lineAngle % Math.PI) + Math.PI) % Math.PI / (Math.PI / 4)) % 4
        dir[i] = q // 0: -, 1: \, 2: |, 3: /   (screen y points down)
      }
    }
  }
  return { cols, rows, lum, dir }
}

// Pre-rendered glyphs per ink so each frame is just drawImage calls.
function makeAtlas(cw: number, ch: number, ink: typeof INK) {
  const inks = [ink.blue, ink.gray, ink.white]
  const atlas = document.createElement('canvas')
  atlas.width = GLYPHS.length * cw
  atlas.height = inks.length * ch
  const ctx = atlas.getContext('2d')!
  ctx.font = `${Math.round(ch * 0.92)}px GalmuriMono11, monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  inks.forEach((ink, row) => {
    ctx.fillStyle = ink
    for (let i = 0; i < GLYPHS.length; i++) ctx.fillText(GLYPHS[i], i * cw + cw / 2, row * ch + ch / 2 + 1)
  })
  return atlas
}

const frac = (n: number) => n - Math.floor(n)
const noise = (n: number) => frac(Math.sin(n * 12.9898) * 43758.5453)

export type Renderer = { draw: (t: number, still?: boolean) => void }

// `light`: draw for a paper background (dark inks, no glow).
export function createRenderer(canvas: HTMLCanvasElement, field: Field, cellW = 10, light = false): Renderer {
  const cellH = Math.round(cellW / CHAR_ASPECT)
  const { cols, rows, lum, dir } = field
  canvas.width = cols * cellW
  canvas.height = rows * cellH
  const out = canvas.getContext('2d')!
  // Glyphs go to an off-screen frame; the visible canvas fades old frames for ghost trails.
  const frame = document.createElement('canvas')
  frame.width = canvas.width
  frame.height = canvas.height
  const ctx = frame.getContext('2d')!
  const canBlur = 'filter' in out
  const atlas = makeAtlas(cellW, cellH, light ? INK_LIGHT : INK)
  const blend: GlobalCompositeOperation = light ? 'multiply' : 'lighter'
  const off = cellW * 0.5
  const cell = (x: number, y: number) => {
    const xi = Math.round(x)
    return xi < 0 || xi >= cols || y < 0 || y >= rows ? -1 : y * cols + xi
  }

  const glyph = (layer: number, idx: number, shimmer: number, x: number, y: number) => {
    const v = lum[idx] * shimmer
    let k: number
    if (dir[idx] >= 0) {
      k = RAMP.length + dir[idx]
      ctx.globalAlpha = Math.min(1, 0.4 + v)
    } else {
      k = Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1)))
      if (k === 0) return
      ctx.globalAlpha = 1
    }
    ctx.drawImage(atlas, k * cellW, layer * cellH, cellW, cellH, x, y, cellW, cellH)
  }

  function draw(t: number, still = false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const amp = still ? 0.6 : 1.4
    const tick = Math.floor(t * 6)
    for (let j = 0; j < rows; j++) {
      // Rare horizontal tears.
      const tear = !still && noise(tick * 31 + j) > 0.985 ? Math.round((noise(tick + j) - 0.5) * 16) : 0
      const shift = Math.sin(j * 0.21 + t * 1.7) * amp + tear
      for (let i = 0; i < cols; i++) {
        const si = i + shift + Math.sin(i * 0.15 + t) * 0.6
        const sj = Math.round(j + Math.sin(i * 0.12 + t * 1.1) * 0.8 * (amp / 1.4))
        const shimmer = 0.86 + 0.14 * Math.sin(t * 2.3 + i * 0.31 + j * 0.17)
        // Two color plates sample slightly different spots, so edges split into color.
        const b = cell(si - 1, sj)
        const r = cell(si + 1, sj + (j % 2))
        const x = i * cellW
        const y = j * cellH
        ctx.globalCompositeOperation = blend
        if (b >= 0 && lum[b] > 0.04) glyph(0, b, shimmer, x - off, y - off * 0.3)
        if (r >= 0 && lum[r] > 0.04) glyph(1, r, shimmer, x + off, y + off * 0.3)
        ctx.globalCompositeOperation = 'source-over'
        if (b >= 0 && r >= 0 && Math.min(lum[b], lum[r]) > 0.72) glyph(2, lum[b] < lum[r] ? b : r, shimmer, x, y)
      }
    }
    ctx.globalAlpha = 1

    if (still) {
      out.clearRect(0, 0, canvas.width, canvas.height)
      out.drawImage(frame, 0, 0)
      if (light) {
        // Thin glyphs wash out on paper: print the frame a second time, one pixel over.
        out.globalAlpha = 0.7
        out.drawImage(frame, 1, 0)
        out.globalAlpha = 1
      }
      if (canBlur && !light) {
        // Baked-in glow for exported images (live view glows via CSS instead).
        out.save()
        out.globalCompositeOperation = 'lighter'
        out.filter = 'blur(7px)'
        out.globalAlpha = 0.7
        out.drawImage(frame, 0, 0)
        out.restore()
      }
      return
    }
    out.globalCompositeOperation = 'destination-out'
    out.fillStyle = 'rgba(0,0,0,0.42)'
    out.fillRect(0, 0, canvas.width, canvas.height)
    out.globalCompositeOperation = 'source-over'
    out.drawImage(frame, 0, 0)
  }

  return { draw }
}
