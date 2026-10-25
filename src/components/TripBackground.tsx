// Full-screen backdrop: black field, a faint beam of light, rising dust, grain.
import { useMemo } from 'react'

type Props = { burst?: boolean; throb?: boolean }

// Static star dust; used in the background and in exported story images.
export function StarDust({ count = 120 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() < 0.07 ? 2 : 1,
        o: 0.2 + Math.random() * 0.5,
        twinkle: i % 9 === 0,
      })),
    [count],
  )
  return (
    <div className="absolute inset-0">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute bg-fog"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            opacity: s.o,
            animation: s.twinkle ? `twinkle ${2 + (i % 5)}s steps(2) infinite` : undefined,
          }}
        />
      ))}
    </div>
  )
}

// Specks drifting upward through the beam.
function RisingDust() {
  const motes = useMemo(
    () =>
      Array.from({ length: 28 }, () => ({
        x: 38 + Math.random() * 24,
        y: 100 + Math.random() * 20,
        dur: 14 + Math.random() * 18,
        delay: -Math.random() * 30,
        o: 0.25 + Math.random() * 0.5,
      })),
    [],
  )
  return (
    <div className="absolute inset-0">
      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute h-px w-px bg-paper"
          style={{ left: `${m.x}%`, top: `${m.y}%`, opacity: m.o, animation: `rise ${m.dur}s linear ${m.delay}s infinite` }}
        />
      ))}
    </div>
  )
}

export function TripBackground({ burst, throb }: Props) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden>
      <StarDust />
      <div className="beam" />
      <RisingDust />
      <div className="vignette" />
      <div className="grain-layer" />
      <div className={`flash ${burst ? 'on' : throb ? 'dim' : ''}`} />
    </div>
  )
}
