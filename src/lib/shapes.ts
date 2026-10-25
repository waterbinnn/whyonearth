// Non-human figures drawn as grayscale light on black.
// The ASCII renderer turns brightness into characters, so only light matters here.
import type { ShapeId } from '../data/species'
import { range, type Rng } from './seed'

export const W = 200
export const H = 240
const CX = 100

type Ctx = CanvasRenderingContext2D
const g = (v: number, a = 1) => `rgba(${v * 255 | 0},${v * 255 | 0},${v * 255 | 0},${a})`

function shoulders(ctx: Ctx, light = 0.35) {
  ctx.beginPath()
  ctx.moveTo(6, H)
  ctx.bezierCurveTo(12, 204, 48, 190, 80, 184)
  ctx.lineTo(86, 150)
  ctx.lineTo(114, 150)
  ctx.lineTo(120, 184)
  ctx.bezierCurveTo(152, 190, 188, 204, 194, H)
  ctx.closePath()
  const grad = ctx.createLinearGradient(0, 150, 0, H)
  grad.addColorStop(0, g(light))
  grad.addColorStop(1, g(light * 0.25))
  ctx.fillStyle = grad
  ctx.fill()
  ctx.strokeStyle = g(Math.min(1, light * 2.2))
  ctx.lineWidth = 2
  ctx.stroke()
}

function headPath(ctx: Ctx, rx = 50, ry = 64, cy = 92) {
  ctx.beginPath()
  ctx.ellipse(CX, cy, rx, ry, 0, 0, Math.PI * 2)
}

function litFill(ctx: Ctx, cx: number, cy: number, r: number, hi = 0.95, lo = 0.08) {
  const grad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.05, cx, cy, r * 1.1)
  grad.addColorStop(0, g(hi))
  grad.addColorStop(0.55, g((hi + lo) / 2))
  grad.addColorStop(1, g(lo))
  return grad
}

const SHAPES: Record<ShapeId, (ctx: Ctx, r: Rng) => void> = {
  // Floating jellyfish being, no body.
  jelly(ctx, r) {
    const cy = 86
    const n = 7 + Math.floor(r() * 5)
    for (let i = 0; i < n; i++) {
      const x0 = CX - 56 + (112 * (i + 0.5)) / n
      const f = range(r, 0.04, 0.08)
      const amp = range(r, 4, 12)
      const ph = r() * 6.28
      ctx.beginPath()
      for (let y = cy + 30; y < H; y += 3) {
        const x = x0 + Math.sin(y * f + ph) * amp * ((y - cy) / 120)
        y === cy + 30 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = g(range(r, 0.45, 0.9))
      ctx.lineWidth = range(r, 1.5, 4)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.ellipse(CX, cy + 30, 70, 76, 0, Math.PI, Math.PI * 2)
    const waves = 6 + Math.floor(r() * 4)
    for (let i = 0; i <= 40; i++) {
      const x = CX + 70 - (140 * i) / 40
      ctx.lineTo(x, cy + 30 + Math.sin((i / 40) * Math.PI * waves) * 6)
    }
    ctx.fillStyle = litFill(ctx, CX, cy, 76, 0.95, 0.12)
    ctx.fill()
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.arc(CX + range(r, -30, 30), cy + range(r, -20, 20), range(r, 4, 10), 0, Math.PI * 2)
      ctx.fillStyle = g(0.05)
      ctx.fill()
    }
  },

  // The classic grey: egg head, huge almond eyes.
  grey(ctx, r) {
    shoulders(ctx, 0.3)
    ctx.beginPath()
    ctx.moveTo(CX, 22)
    ctx.bezierCurveTo(CX + 78, 22, CX + 64, 120, CX, 158)
    ctx.bezierCurveTo(CX - 64, 120, CX - 78, 22, CX, 22)
    ctx.fillStyle = litFill(ctx, CX, 80, 80, 0.9, 0.12)
    ctx.fill()
    const tilt = range(r, 0.35, 0.6)
    const size = range(r, 1, 1.25)
    for (const s of [-1, 1]) {
      ctx.beginPath()
      ctx.ellipse(CX + s * 24, 96, 22 * size, 11 * size, s * tilt, 0, Math.PI * 2)
      ctx.fillStyle = g(0)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(CX + s * 20, 91, 5, 2.5, s * tilt, 0, Math.PI * 2)
      ctx.fillStyle = g(1)
      ctx.fill()
    }
    ctx.beginPath()
    ctx.moveTo(CX - 6, 136)
    ctx.lineTo(CX + 6, 136)
    ctx.strokeStyle = g(0.1)
    ctx.lineWidth = 2
    ctx.stroke()
  },

  // A spiral where the face should be.
  vortex(ctx, r) {
    shoulders(ctx, 0.35)
    ctx.save()
    headPath(ctx)
    ctx.fillStyle = g(0.06)
    ctx.fill()
    ctx.clip()
    const arms = 2 + Math.floor(r() * 2)
    const tight = range(r, 4.2, 5.4)
    for (let a = 0; a < arms; a++) {
      ctx.beginPath()
      for (let th = 0; th < Math.PI * 7; th += 0.05) {
        const rad = tight * th
        const x = CX + Math.cos(th + (a * Math.PI * 2) / arms) * rad * 0.82
        const y = 96 + Math.sin(th + (a * Math.PI * 2) / arms) * rad
        th ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
      }
      ctx.strokeStyle = g(0.95)
      ctx.lineWidth = 3.4
      ctx.stroke()
    }
    ctx.restore()
    headPath(ctx)
    ctx.strokeStyle = g(0.7)
    ctx.lineWidth = 2
    ctx.stroke()
  },

  // Dark head lit from behind, with orbits around it.
  halo(ctx, r) {
    ctx.beginPath()
    ctx.arc(CX, 88, 74, 0, Math.PI * 2)
    const glow = ctx.createRadialGradient(CX, 88, 40, CX, 88, 80)
    glow.addColorStop(0, g(0.9))
    glow.addColorStop(1, g(0))
    ctx.fillStyle = glow
    ctx.fill()
    shoulders(ctx, 0.15)
    headPath(ctx)
    ctx.fillStyle = g(0.03)
    ctx.fill()
    ctx.strokeStyle = g(1)
    ctx.lineWidth = 2.5
    ctx.stroke()
    const n = 2 + Math.floor(r() * 2)
    for (let i = 0; i < n; i++) {
      const tilt = range(r, -1.2, 1.2)
      const rx = range(r, 80, 96)
      const ry = range(r, 16, 34)
      ctx.beginPath()
      ctx.ellipse(CX, 96, rx, ry, tilt, 0, Math.PI * 2)
      ctx.strokeStyle = g(0.8)
      ctx.lineWidth = 1.2
      ctx.stroke()
      const a = r() * 6.28
      const px = CX + Math.cos(a) * rx * Math.cos(tilt) - Math.sin(a) * ry * Math.sin(tilt)
      const py = 96 + Math.cos(a) * rx * Math.sin(tilt) + Math.sin(a) * ry * Math.cos(tilt)
      ctx.beginPath()
      ctx.arc(px, py, range(r, 4, 8), 0, Math.PI * 2)
      ctx.fillStyle = g(1)
      ctx.fill()
    }
  },
  // Reptilian: the "lizard person" of conspiracy lore, seen from the front.
  // Big slit-pupil eyes, nostril slits, lipless mouth, crest bumps, scaly skin.
  reptilian(ctx, r) {
    shoulders(ctx, 0.4)
    const head = () => {
      ctx.beginPath()
      ctx.moveTo(CX, 24)
      ctx.bezierCurveTo(CX + 34, 24, CX + 48, 54, CX + 50, 92)
      ctx.bezierCurveTo(CX + 50, 120, CX + 32, 150, CX, 160)
      ctx.bezierCurveTo(CX - 32, 150, CX - 50, 120, CX - 50, 92)
      ctx.bezierCurveTo(CX - 48, 54, CX - 34, 24, CX, 24)
      ctx.closePath()
    }
    // crest: a row of small bumps down the middle of the skull
    for (let i = 0; i < 4; i++) {
      const y = 22 + i * 9
      ctx.beginPath()
      ctx.moveTo(CX - 6, y + 8)
      ctx.lineTo(CX, y - 6)
      ctx.lineTo(CX + 6, y + 8)
      ctx.closePath()
      ctx.fillStyle = g(1)
      ctx.fill()
    }
    head()
    ctx.save()
    ctx.fillStyle = litFill(ctx, CX, 86, 72, 0.75, 0.12)
    ctx.fill()
    ctx.clip()
    const s2 = range(r, 9, 11)
    ctx.strokeStyle = g(0.45)
    ctx.lineWidth = 1
    for (let y = 24, row = 0; y < 164; y += s2 * 0.7, row++) {
      for (let x = CX - 56 + (row % 2) * (s2 / 2); x < CX + 56; x += s2) {
        ctx.beginPath()
        ctx.arc(x, y, s2 / 2, 0, Math.PI)
        ctx.stroke()
      }
    }
    ctx.restore()
    head()
    ctx.strokeStyle = g(1)
    ctx.lineWidth = 2
    ctx.stroke()
    for (const sgn of [-1, 1]) {
      // heavy angled brow
      ctx.beginPath()
      ctx.moveTo(CX + sgn * 6, 84)
      ctx.lineTo(CX + sgn * 44, 66)
      ctx.strokeStyle = g(0)
      ctx.lineWidth = 6
      ctx.stroke()
      // large eye with a vertical slit pupil
      ctx.beginPath()
      ctx.ellipse(CX + sgn * 25, 90, 17, 11, -sgn * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = g(1)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(CX + sgn * 25, 90, 3.2, 10, 0, 0, Math.PI * 2)
      ctx.fillStyle = g(0)
      ctx.fill()
      // nostril slits, no nose bridge
      ctx.beginPath()
      ctx.ellipse(CX + sgn * 6, 120, 2, 5, sgn * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = g(0)
      ctx.fill()
    }
    // wide lipless mouth
    ctx.beginPath()
    ctx.moveTo(CX - 30, 138)
    ctx.quadraticCurveTo(CX, 146, CX + 30, 138)
    ctx.strokeStyle = g(0)
    ctx.lineWidth = 3
    ctx.stroke()
    // throat ridges
    ctx.strokeStyle = g(0.7)
    ctx.lineWidth = 1.5
    for (let y = 162; y < 182; y += 6) {
      ctx.beginPath()
      ctx.moveTo(CX - 12, y)
      ctx.lineTo(CX + 12, y)
      ctx.stroke()
    }
  },

  // Anunnaki: profile from Sumerian and Assyrian reliefs. Horned cylinder cap,
  // tiered curly beard, a wing behind, and the famous little bucket "handbag".
  anunnaki(ctx, r) {
    // wing raised behind the back
    for (let i = 0; i < 6; i++) {
      const t = i / 5
      ctx.beginPath()
      ctx.moveTo(78, 150 - t * 10)
      ctx.quadraticCurveTo(40 - t * 6, 120 - t * 40, 14 + t * 6, 60 - t * 30 + range(r, -3, 3))
      ctx.strokeStyle = g(0.9 - t * 0.25)
      ctx.lineWidth = 7
      ctx.stroke()
    }
    // body, shoulders turned toward the viewer
    shoulders(ctx, 0.4)
    // long hair gathered behind the neck, in curls
    ctx.beginPath()
    ctx.ellipse(94, 112, 15, 40, 0.1, 0, Math.PI * 2)
    ctx.fillStyle = g(0.55)
    ctx.fill()
    ctx.fillStyle = g(1)
    for (let y = 80; y < 150; y += 9) {
      ctx.beginPath()
      ctx.arc(92 + ((y / 9) % 2) * 5, y, 2.6, 0, Math.PI * 2)
      ctx.fill()
    }
    // face in profile, looking right
    ctx.beginPath()
    ctx.moveTo(96, 62)
    ctx.lineTo(128, 62)
    ctx.quadraticCurveTo(132, 76, 140, 90)
    ctx.lineTo(132, 94)
    ctx.lineTo(134, 104)
    ctx.lineTo(118, 110)
    ctx.lineTo(96, 110)
    ctx.closePath()
    ctx.fillStyle = litFill(ctx, 118, 84, 30, 0.85, 0.3)
    ctx.fill()
    // frontal almond eye, as drawn on reliefs
    ctx.beginPath()
    ctx.ellipse(120, 78, 7, 3.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = g(0)
    ctx.fill()
    // tiered beard: rows of curls
    ctx.beginPath()
    ctx.moveTo(100, 102)
    ctx.lineTo(134, 102)
    ctx.lineTo(130, 168)
    ctx.quadraticCurveTo(115, 182, 102, 168)
    ctx.closePath()
    ctx.fillStyle = g(0.55)
    ctx.fill()
    ctx.fillStyle = g(1)
    for (let y = 110; y < 172; y += 9) {
      for (let x = 105; x < 130; x += 7) {
        ctx.beginPath()
        ctx.arc(x, y, 2.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    // horned cylinder cap
    ctx.beginPath()
    ctx.moveTo(94, 64)
    ctx.lineTo(96, 22)
    ctx.lineTo(130, 22)
    ctx.lineTo(132, 64)
    ctx.closePath()
    ctx.fillStyle = g(0.3)
    ctx.fill()
    ctx.strokeStyle = g(1)
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.lineWidth = 3.5
    for (let i = 0; i < 3; i++) {
      const y = 58 - i * 13
      ctx.beginPath()
      ctx.moveTo(98, y)
      ctx.quadraticCurveTo(122, y - 2, 140, y - 12)
      ctx.strokeStyle = g(1)
      ctx.stroke()
    }
    // forearm forward, holding the bucket
    ctx.beginPath()
    ctx.moveTo(130, 196)
    ctx.lineTo(158, 186)
    ctx.strokeStyle = g(0.8)
    ctx.lineWidth = 8
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(166, 192, 9, Math.PI, 0)
    ctx.strokeStyle = g(1)
    ctx.lineWidth = 2.5
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(154, 192)
    ctx.lineTo(178, 192)
    ctx.lineTo(176, 214)
    ctx.lineTo(156, 214)
    ctx.closePath()
    ctx.fillStyle = g(0.95)
    ctx.fill()
  },

  // Hybrid: one half alien (big black eye), one half human (small eye, hair).
  hybrid(ctx, r) {
    shoulders(ctx, 0.35)
    ctx.save()
    headPath(ctx, 50, 64, 94)
    ctx.fillStyle = litFill(ctx, CX, 94, 66, 0.85, 0.12)
    ctx.fill()
    ctx.clip()
    ctx.lineWidth = 2.5
    for (let i = 0; i < 14; i++) {
      const x0 = CX + 4 + i * 4
      ctx.beginPath()
      ctx.moveTo(x0, 26)
      ctx.quadraticCurveTo(x0 + 10, 50, x0 + range(r, 2, 8), 64 + range(r, 0, 26))
      ctx.strokeStyle = g(0.2)
      ctx.stroke()
    }
    ctx.restore()
    ctx.beginPath()
    ctx.moveTo(CX, 28)
    ctx.lineTo(CX, 160)
    ctx.setLineDash([6, 4])
    ctx.strokeStyle = g(1)
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.ellipse(CX - 24, 96, 20, 10, -0.45, 0, Math.PI * 2)
    ctx.fillStyle = g(0)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(CX - 28, 91, 4, 2, -0.45, 0, Math.PI * 2)
    ctx.fillStyle = g(1)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(CX + 24, 98, 10, 5, 0, 0, Math.PI * 2)
    ctx.fillStyle = g(1)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(CX + 24, 98, 4, 0, Math.PI * 2)
    ctx.fillStyle = g(0.05)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(CX + 12, 86)
    ctx.quadraticCurveTo(CX + 24, 80, CX + 36, 86)
    ctx.strokeStyle = g(0.08)
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(CX, 136)
    ctx.quadraticCurveTo(CX + 10, 140, CX + 18, 134)
    ctx.strokeStyle = g(0.08)
    ctx.lineWidth = 2
    ctx.stroke()
  },

  // Lyran: cat head with pointed ears, slit eyes and whiskers.
  lyran(ctx, r) {
    shoulders(ctx, 0.3)
    const cy = 100
    for (const sgn of [-1, 1]) {
      const tip = cy - 84 + range(r, -6, 6)
      ctx.beginPath()
      ctx.moveTo(CX + sgn * 18, cy - 40)
      ctx.lineTo(CX + sgn * 52, tip)
      ctx.lineTo(CX + sgn * 52, cy - 18)
      ctx.closePath()
      ctx.fillStyle = g(0.85)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(CX + sgn * 28, cy - 36)
      ctx.lineTo(CX + sgn * 48, tip + 16)
      ctx.lineTo(CX + sgn * 46, cy - 26)
      ctx.closePath()
      ctx.fillStyle = g(0.3)
      ctx.fill()
    }
    ctx.beginPath()
    ctx.ellipse(CX, cy, 56, 50, 0, 0, Math.PI * 2)
    ctx.fillStyle = litFill(ctx, CX, cy, 56, 0.85, 0.15)
    ctx.fill()
    for (const sgn of [-1, 1]) {
      ctx.beginPath()
      ctx.ellipse(CX + sgn * 22, cy - 6, 13, 9, -sgn * 0.25, 0, Math.PI * 2)
      ctx.fillStyle = g(1)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(CX + sgn * 22, cy - 6, 2.5, 8, 0, 0, Math.PI * 2)
      ctx.fillStyle = g(0)
      ctx.fill()
      ctx.lineWidth = 1.3
      ctx.strokeStyle = g(1)
      for (let k = -1; k <= 1; k++) {
        ctx.beginPath()
        ctx.moveTo(CX + sgn * 16, cy + 20 + k * 4)
        ctx.lineTo(CX + sgn * 78, cy + 14 + k * 9)
        ctx.stroke()
      }
    }
    ctx.beginPath()
    ctx.moveTo(CX - 6, cy + 14)
    ctx.lineTo(CX + 6, cy + 14)
    ctx.lineTo(CX, cy + 21)
    ctx.closePath()
    ctx.fillStyle = g(0.05)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(CX - 12, cy + 30)
    ctx.quadraticCurveTo(CX - 6, cy + 35, CX, cy + 24)
    ctx.quadraticCurveTo(CX + 6, cy + 35, CX + 12, cy + 30)
    ctx.strokeStyle = g(0.05)
    ctx.lineWidth = 2
    ctx.stroke()
  },

  // Nordic: human face framed by long wavy hair, soft glow behind.
  nordic(ctx, r) {
    const glow = ctx.createRadialGradient(CX, 92, 20, CX, 92, 96)
    glow.addColorStop(0, g(0.45))
    glow.addColorStop(1, g(1, 0))
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)
    shoulders(ctx, 0.4)
    headPath(ctx, 36, 50, 98)
    ctx.fillStyle = litFill(ctx, CX, 98, 50, 0.65, 0.2)
    ctx.fill()
    // hair: strands from the parting down past the shoulders, waving outward
    ctx.lineWidth = 3
    for (let i = 0; i < 18; i++) {
      const sgn = i % 2 ? 1 : -1
      const k = Math.floor(i / 2) / 8
      const startX = CX + sgn * (4 + k * 28)
      const amp = range(r, 6, 12)
      ctx.beginPath()
      ctx.moveTo(CX + sgn * 2, 44)
      ctx.quadraticCurveTo(startX + sgn * 24, 50 + k * 10, CX + sgn * (40 + k * 10), 90)
      ctx.bezierCurveTo(
        CX + sgn * (46 + k * 12 + amp), 130,
        CX + sgn * (38 + k * 14 - amp), 170,
        CX + sgn * (50 + k * 16), 214,
      )
      ctx.strokeStyle = g(0.75 + k * 0.25)
      ctx.stroke()
    }
    for (const sgn of [-1, 1]) {
      ctx.beginPath()
      ctx.ellipse(CX + sgn * 13, 100, 6, 2.8, 0, 0, Math.PI * 2)
      ctx.fillStyle = g(0)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(CX + sgn * 6, 90)
      ctx.lineTo(CX + sgn * 20, 89)
      ctx.strokeStyle = g(0.1)
      ctx.lineWidth = 2
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.moveTo(CX, 104)
    ctx.lineTo(CX - 3, 118)
    ctx.moveTo(CX - 8, 130)
    ctx.quadraticCurveTo(CX, 134, CX + 8, 130)
    ctx.strokeStyle = g(0.1)
    ctx.lineWidth = 2
    ctx.stroke()
  },

  // Mantis: triangular head, huge side eyes, antennae, folded forelegs.
  mantis(ctx, r) {
    ctx.fillStyle = g(0.4)
    ctx.fillRect(CX - 6, 136, 12, 60)
    ctx.lineWidth = 6
    ctx.strokeStyle = g(0.85)
    for (const sgn of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(CX + sgn * 34, H)
      ctx.lineTo(CX + sgn * 46, 196)
      ctx.lineTo(CX + sgn * 14, 168)
      ctx.stroke()
      for (let k = 0; k < 3; k++) {
        const t = 0.3 + k * 0.22
        const x = CX + sgn * (46 - 32 * t)
        const y = 196 - 28 * t
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - sgn * 4, y + 8)
        ctx.lineWidth = 2
        ctx.stroke()
      }
      ctx.lineWidth = 6
    }
    ctx.beginPath()
    ctx.moveTo(CX - 64, 66)
    ctx.quadraticCurveTo(CX, 44, CX + 64, 66)
    ctx.quadraticCurveTo(CX + 40, 112, CX + 6, 148)
    ctx.quadraticCurveTo(CX, 152, CX - 6, 148)
    ctx.quadraticCurveTo(CX - 40, 112, CX - 64, 66)
    ctx.closePath()
    ctx.fillStyle = litFill(ctx, CX, 92, 70, 0.75, 0.12)
    ctx.fill()
    for (const sgn of [-1, 1]) {
      ctx.beginPath()
      ctx.ellipse(CX + sgn * 46, 72, 20, 15, sgn * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = g(1)
      ctx.fill()
      ctx.fillStyle = g(0.55)
      for (let dx = -14; dx <= 14; dx += 5)
        for (let dy = -10; dy <= 10; dy += 5) {
          ctx.beginPath()
          ctx.arc(CX + sgn * 46 + dx, 72 + dy, 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      ctx.beginPath()
      ctx.moveTo(CX + sgn * 10, 56)
      ctx.quadraticCurveTo(CX + sgn * 20, 20, CX + sgn * (52 + range(r, -6, 6)), 4)
      ctx.strokeStyle = g(0.95)
      ctx.lineWidth = 2
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.moveTo(CX - 8, 140)
    ctx.lineTo(CX, 132)
    ctx.lineTo(CX + 8, 140)
    ctx.strokeStyle = g(0.05)
    ctx.lineWidth = 2
    ctx.stroke()
  },

  // Tall White: very tall pale head on a long thin neck.
  tallWhite(ctx, r) {
    ctx.beginPath()
    ctx.moveTo(40, H)
    ctx.bezierCurveTo(46, 214, 72, 202, 90, 198)
    ctx.lineTo(94, 150)
    ctx.lineTo(106, 150)
    ctx.lineTo(110, 198)
    ctx.bezierCurveTo(128, 202, 154, 214, 160, H)
    ctx.closePath()
    ctx.fillStyle = g(0.35)
    ctx.fill()
    ctx.strokeStyle = g(0.8)
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = g(0.55)
    ctx.fillRect(CX - 7, 116, 14, 84)
    ctx.beginPath()
    ctx.ellipse(CX, 66, 30, 62 + range(r, -4, 4), 0, 0, Math.PI * 2)
    ctx.fillStyle = litFill(ctx, CX, 66, 64, 1, 0.35)
    ctx.fill()
    ctx.strokeStyle = g(1)
    ctx.lineWidth = 2
    ctx.stroke()
    for (const sgn of [-1, 1]) {
      ctx.beginPath()
      ctx.ellipse(CX + sgn * 13, 86, 11, 7, sgn * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = g(0)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(CX + sgn * 11, 84, 2, 0, Math.PI * 2)
      ctx.fillStyle = g(1)
      ctx.fill()
    }
    ctx.beginPath()
    ctx.moveTo(CX - 5, 116)
    ctx.lineTo(CX + 5, 116)
    ctx.strokeStyle = g(0.2)
    ctx.lineWidth = 2
    ctx.stroke()
  },

  // Little green man: round head, antennae with balls, big round eyes, a grin.
  littleGreen(ctx, r) {
    ctx.beginPath()
    ctx.ellipse(CX, 226, 52, 44, 0, 0, Math.PI * 2)
    ctx.fillStyle = g(0.4)
    ctx.fill()
    for (const sgn of [-1, 1]) {
      const tx = CX + sgn * (34 + range(r, -4, 4))
      ctx.beginPath()
      ctx.moveTo(CX + sgn * 16, 56)
      ctx.lineTo(tx, 12)
      ctx.strokeStyle = g(0.9)
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(tx, 10, 8, 0, Math.PI * 2)
      ctx.fillStyle = g(1)
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(CX, 108, 58, 0, Math.PI * 2)
    ctx.fillStyle = litFill(ctx, CX, 108, 58, 0.8, 0.15)
    ctx.fill()
    for (const sgn of [-1, 1]) {
      ctx.beginPath()
      ctx.arc(CX + sgn * 22, 98, 16, 0, Math.PI * 2)
      ctx.fillStyle = g(1)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(CX + sgn * 20, 100, 7, 0, Math.PI * 2)
      ctx.fillStyle = g(0)
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(CX, 126, 22, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.strokeStyle = g(0.04)
    ctx.lineWidth = 4
    ctx.stroke()
  },
}

// Scenes for the Roswell story intro.
export type SceneId = 'crash' | 'earth' | 'ufo'

const SCENES: Record<SceneId, (ctx: Ctx, r: Rng) => void> = {
  // Desert horizon, a falling streak of light, and a half-buried craft.
  crash(ctx, r) {
    const hy = 172
    // ridge line only (no box around the ground)
    ctx.beginPath()
    for (let x = 0; x <= W; x += 10) {
      const y = hy - 6 - Math.abs(Math.sin(x * 0.05 + 1)) * 14 * (x > 120 ? 1 : 0.4)
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
    }
    ctx.strokeStyle = g(0.85)
    ctx.lineWidth = 2.5
    ctx.stroke()
    // falling streak
    const sx = 182, sy = 6, ex = 78, ey = hy + 4
    for (const [w, peak] of [[12, 0.45], [3.5, 1]] as const) {
      const streak = ctx.createLinearGradient(sx, sy, ex, ey)
      streak.addColorStop(0, g(0.15))
      streak.addColorStop(0.6, g(peak * 0.8))
      streak.addColorStop(1, g(peak))
      ctx.strokeStyle = streak
      ctx.lineWidth = w
      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.lineTo(ex, ey)
      ctx.stroke()
    }
    // impact glow
    const glow = ctx.createRadialGradient(ex, ey, 2, ex, ey, 30)
    glow.addColorStop(0, g(1))
    glow.addColorStop(1, g(1, 0))
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, W, H)
    // tilted craft
    ctx.save()
    ctx.translate(ex + 10, ey + 2)
    ctx.rotate(-0.35)
    ctx.beginPath()
    ctx.ellipse(0, 0, 26, 6, 0, 0, Math.PI * 2)
    ctx.fillStyle = g(0.85)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(0, -5, 10, 6, 0, Math.PI, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    // sparks
    for (let i = 0; i < 26; i++) {
      const a = -Math.PI * r()
      const d = range(r, 8, 40)
      ctx.fillStyle = g(range(r, 0.5, 1))
      ctx.fillRect(ex + Math.cos(a) * d, ey + Math.sin(a) * d * 0.6, 2, 2)
    }
  },

  // A lone saucer with a tractor beam: the app icon.
  ufo(ctx, r) {
    const cx = 100
    // beam
    const beam = ctx.createLinearGradient(0, 122, 0, 236)
    beam.addColorStop(0, g(0.55))
    beam.addColorStop(1, g(0.55, 0))
    ctx.fillStyle = beam
    ctx.beginPath()
    ctx.moveTo(cx - 24, 122)
    ctx.lineTo(cx + 24, 122)
    ctx.lineTo(cx + 70, 236)
    ctx.lineTo(cx - 70, 236)
    ctx.closePath()
    ctx.fill()
    // dome
    ctx.beginPath()
    ctx.ellipse(cx, 98, 32, 30, 0, Math.PI, Math.PI * 2)
    ctx.fillStyle = litFill(ctx, cx - 8, 84, 34, 1, 0.3)
    ctx.fill()
    // disc
    ctx.beginPath()
    ctx.ellipse(cx, 110, 86, 20, 0, 0, Math.PI * 2)
    ctx.fillStyle = litFill(ctx, cx - 20, 100, 90, 0.95, 0.35)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(cx, 112, 86, 9, 0, 0, Math.PI)
    ctx.strokeStyle = g(1)
    ctx.lineWidth = 3
    ctx.stroke()
    // portholes
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath()
      ctx.arc(cx + i * 30, 116 - Math.abs(i) * 2, 5, 0, Math.PI * 2)
      ctx.fillStyle = g(i % 2 ? 0.1 : 1)
      ctx.fill()
    }
    // a few sparks under the beam
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = g(range(r, 0.6, 1))
      ctx.fillRect(range(r, cx - 50, cx + 50), range(r, 150, 230), 2, 2)
    }
  },

  // Earth inside a cage: the amnesia screen that catches souls.
  earth(ctx, r) {
    const cx = 100, cy = 118, R = 62
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.fillStyle = litFill(ctx, cx, cy, R, 0.75, 0.05)
    ctx.fill()
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath()
      ctx.ellipse(cx, cy, R, R * 0.2 * Math.abs(i) + 1, 0, 0, Math.PI * 2)
      ctx.ellipse(cx, cy, R * 0.25 * Math.abs(i) + 1, R, 0, 0, Math.PI * 2)
      ctx.strokeStyle = g(0.25)
      ctx.lineWidth = 1
      ctx.stroke()
    }
    // the screen: a lattice shell around the planet
    const S = 88
    ctx.lineWidth = 1.6
    for (let k = 0; k < 7; k++) {
      ctx.beginPath()
      ctx.ellipse(cx, cy, S, S * Math.abs(Math.cos((k * Math.PI) / 7)) + 2, (k * Math.PI) / 7, 0, Math.PI * 2)
      ctx.strokeStyle = g(0.9)
      ctx.stroke()
    }
    // souls caught on the screen
    for (let i = 0; i < 14; i++) {
      const a = r() * Math.PI * 2
      ctx.beginPath()
      ctx.arc(cx + Math.cos(a) * S, cy + Math.sin(a) * S, range(r, 1.5, 3.5), 0, Math.PI * 2)
      ctx.fillStyle = g(1)
      ctx.fill()
    }
  },
}

export function drawShape(id: ShapeId | SceneId, r: Rng): HTMLCanvasElement {
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const ctx = cv.getContext('2d', { willReadFrequently: true })!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, W, H)
  if (id in SCENES) SCENES[id as SceneId](ctx, r)
  else SHAPES[id as ShapeId](ctx, r)
  // Particle dust around the figure, like a long-exposure sky plate.
  for (let i = 0; i < (id === 'ufo' ? 30 : 90); i++) {
    const x = r() * W
    const y = r() * H
    ctx.fillStyle = g(range(r, 0.25, 0.9))
    ctx.fillRect(x, y, range(r, 0.8, 2.2), range(r, 0.8, 2.2))
  }
  return cv
}

export const SHAPE_IDS = Object.keys(SHAPES) as ShapeId[]
