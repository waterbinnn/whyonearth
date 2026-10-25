// Intro told like a movie trailer: letterboxed frame, one line per cut.
// Roswell crash → the survivor → the prison planet → "Why are you on Earth?"
// Lines auto-advance; tap for the next cut, SKIP to jump to the main page.
import { useEffect, useRef, useState } from 'react'
import type { ShapeId } from '../data/species'
import type { SceneId } from '../lib/shapes'
import { AsciiPortrait } from './AsciiPortrait'

const BEAT = 2.6 // seconds per line

type Scene = { caption: string; figure: ShapeId | SceneId; seed: number; lines: string[] }

const SCENES: Scene[] = [
  {
    caption: 'ROSWELL, NEW MEXICO · JULY 1947',
    figure: 'crash',
    seed: 1947,
    lines: ['1947년 7월, 뉴멕시코 사막에 무언가가 추락했다.', '잔해 속 생존자는 사람이 아니었다.'],
  },
  {
    caption: 'ROSWELL ARMY AIR FIELD · ISOLATION ROOM',
    figure: 'grey',
    seed: 8,
    lines: ['생존자는 군 기지로 옮겨졌다.', '그리고 한 간호사에게 지구의 비밀을 알려 주었다.'],
  },
  {
    caption: 'EARTH · PRESENT DAY',
    figure: 'earth',
    seed: 3,
    lines: [
      '지구는 우주의 감옥이다.',
      '우주에서 죄를 지은 외계인의 영혼이 기억을 지운 채 이곳에 갇힌다.',
      '당신도 그중 하나다.',
    ],
  },
]

// Running timecode, like a tape deck counter. Updates the DOM directly.
function Timecode() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    const pad = (n: number) => String(n).padStart(2, '0')
    const tick = (now: number) => {
      const f = Math.floor(((now - t0) / 1000) * 24)
      if (ref.current) ref.current.textContent = `00:${pad(Math.floor(f / 1440) % 60)}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <span ref={ref}>00:00:00:00</span>
}

export function StoryIntro({ onDone }: { onDone: () => void }) {
  const [pos, setPos] = useState({ s: 0, b: 0 })
  const scene = SCENES[pos.s]
  const lastScene = pos.s === SCENES.length - 1
  const lastBeat = pos.b === scene.lines.length - 1

  const next = () => {
    if (!lastBeat) setPos({ s: pos.s, b: pos.b + 1 })
    else if (!lastScene) setPos({ s: pos.s + 1, b: 0 })
    else onDone()
  }
  const nextRef = useRef(next)
  nextRef.current = next

  // Auto-advance one cut at a time; the final line holds a little longer.
  useEffect(() => {
    const t = setTimeout(() => nextRef.current(), (lastScene && lastBeat ? BEAT * 1.6 : BEAT) * 1000)
    return () => clearTimeout(t)
  }, [pos, lastScene, lastBeat])

  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    fn()
  }

  return (
    <section className="relative flex min-h-dvh flex-col select-none" onClick={next}>
      {/* letterbox top */}
      <div className="flex h-14 shrink-0 flex-col justify-end gap-1.5 bg-black gutter pb-2">
        <div className="flex gap-1">
          {SCENES.map((sc, k) => (
            <div key={k} className="h-px flex-1 bg-paper/20">
              <div
                className="h-full bg-paper transition-[width] duration-700"
                style={{ width: k < pos.s ? '100%' : k > pos.s ? '0%' : `${((pos.b + 1) / sc.lines.length) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between font-mono fs-9 text-gray">
          <span>
            <span className="text-plate">●</span> <Timecode />
          </span>
          <button className="-my-1 py-1 pl-4 text-paper/80" onClick={stop(onDone)}>
            SKIP
          </button>
        </div>
      </div>

      {/* frame */}
      <div className="relative flex flex-1 flex-col items-center justify-center gutter">
        <div key={pos.s} className="fade-up w-full max-w-[calc(250px*var(--ui))] opacity-90">
          <AsciiPortrait shape={scene.figure} seed={scene.seed} cols={58} />
        </div>
        <div key={`c${pos.s}`} className="fade-up mt-3 font-mono fs-9 tracking-[0.18em] text-gray">
          {scene.caption}
        </div>
        <p
          key={`${pos.s}-${pos.b}`}
          className={`fade-up mt-6 min-h-[3.4em] max-w-[calc(320px*var(--ui))] text-center font-pixel leading-[1.7] break-keep ${
            lastBeat ? 'glow fs-17 text-paper' : 'fs-15 text-fog'
          }`}
        >
          {scene.lines[pos.b]}
        </p>
      </div>

      {/* letterbox bottom */}
      <div className="flex h-14 shrink-0 items-center justify-between bg-black gutter">
        <span className="font-mono fs-8 leading-relaxed text-gray/80 break-keep">
          1947년 로스웰 외계인 추락 사건을 바탕으로 각색
        </span>
        <button className="shrink-0 py-2 pl-4 font-pixel fs-12 text-paper" onClick={stop(next)}>
          {lastScene && lastBeat ? '내 기록 열람 →' : '다음 →'}
        </button>
      </div>
    </section>
  )
}
