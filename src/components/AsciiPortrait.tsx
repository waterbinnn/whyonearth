import { useEffect, useRef } from 'react'
import type { ShapeId } from '../data/species'
import type { SceneId } from '../lib/shapes'
import { createRenderer, toField } from '../lib/ascii'
import { rng } from '../lib/seed'
import { drawShape } from '../lib/shapes'

type Props = { shape: ShapeId | SceneId; seed: number; cols?: number; frozen?: boolean; light?: boolean; className?: string }

export function AsciiPortrait({ shape, seed, cols = 60, frozen = false, light = false, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    let raf = 0
    let alive = true
    const still = frozen || matchMedia('(prefers-reduced-motion: reduce)').matches

    document.fonts.load('12px GalmuriMono11').then(() => {
      if (!alive) return
      const field = toField(drawShape(shape, rng(seed)), cols)
      const renderer = createRenderer(canvas, field, 10, light)
      if (still) return renderer.draw(1.3, true)
      let last = 0
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop)
        if (now - last < 1000 / 24) return
        last = now
        renderer.draw(now / 1000)
      }
      raf = requestAnimationFrame(loop)
    })
    return () => {
      alive = false
      cancelAnimationFrame(raf)
    }
  }, [shape, seed, cols, frozen, light])

  return (
    <canvas
      ref={ref}
      className={`${frozen ? '' : 'trip'} ${className ?? ''}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  )
}
