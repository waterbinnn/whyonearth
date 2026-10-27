import { useEffect, useMemo, useRef, useState } from 'react'
import { SPECIES } from '../data/species'
import { SITE_DESC } from '../lib/copy'
import type { PrisonRecord } from '../lib/record'
import { AsciiPortrait } from './AsciiPortrait'

const Btn = (p: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'main' | 'ghost' }) => {
  const { tone = 'main', className = '', ...rest } = p
  const look =
    tone === 'main'
      ? 'bg-paper text-ink hover:bg-plate hover:text-paper'
      : 'border border-paper/40 text-paper hover:border-paper hover:bg-paper/10'
  return (
    <button
      {...rest}
      className={`h-[calc(40px*var(--ui))] px-4 font-pixel fs-13 transition-colors disabled:opacity-40 ${look} ${className}`}
    />
  )
}
export { Btn }

export function Main({ onStart, onReplay, onSpecies }: { onStart: () => void; onReplay: () => void; onSpecies: () => void }) {
  // A random inmate floats behind the title as a teaser.
  const teaser = useMemo(() => {
    const s = SPECIES[Math.floor(Math.random() * SPECIES.length)]
    return { shape: s.shape, seed: Math.floor(Math.random() * 1e6) }
  }, [])
  return (
    <section className="flex min-h-dvh flex-col justify-between gutter pt-4 pb-6">
      <div className="flex justify-center pt-2 text-paper/60">
        <Ufo size={34} />
      </div>

      <div className="relative mx-auto w-full max-w-[calc(420px*var(--ui))]">
        <div className="mx-auto w-[58%] opacity-90">
          <AsciiPortrait shape={teaser.shape} seed={teaser.seed} />
        </div>
        <div className="mt-4 text-center">
          <span className="inline-block bg-plate px-2 py-0.5 font-mono fs-10 tracking-[0.18em] text-paper">
            WHY ON EARTH
          </span>
        </div>
        <h1 className="glow mt-3 text-center font-big fs-28 leading-[1.2]">
          당신은 왜
          <br />
          지구에 있습니까?
        </h1>
        <p className="mx-auto mt-3 max-w-[calc(300px*var(--ui))] text-center font-pixel fs-12 leading-[1.7] text-fog break-keep">
          {SITE_DESC}
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-[var(--col)] flex-col gap-2.5">
        <Btn onClick={onStart}>내 수감 기록 열람하기</Btn>
        <button
          className="flex h-[calc(40px*var(--ui))] items-center justify-center gap-2.5 border border-paper/40 px-4 font-pixel fs-13 text-paper transition-colors hover:border-paper hover:bg-paper/10"
          onClick={onReplay}
        >
          <Ufo />
          로스웰에서 무슨 일이 있었나
        </button>
        <Btn tone="ghost" onClick={onSpecies}>
          외계인 종족 도감
        </Btn>
        <div className="text-center font-mono fs-9 text-gray">
          FOR ENTERTAINMENT ONLY · 입력값은 서버에 저장되지 않습니다
        </div>
      </div>
    </section>
  )
}

// Tiny pixel UFO: the app mark on the main page and the backstory button.
function Ufo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 14) / 22} viewBox="0 0 22 14" aria-hidden className="shrink-0" shapeRendering="crispEdges">
      <g fill="currentColor">
        <rect x="8" y="0" width="6" height="2" />
        <rect x="6" y="2" width="10" height="2" />
        <rect x="2" y="4" width="18" height="2" />
        <rect x="0" y="6" width="22" height="2" />
        <rect x="2" y="8" width="18" height="2" />
        <rect x="5" y="10" width="2" height="2" />
        <rect x="10" y="10" width="2" height="2" />
        <rect x="15" y="10" width="2" height="2" />
        <rect x="4" y="12" width="1" height="2" />
        <rect x="17" y="12" width="1" height="2" />
      </g>
      <g fill="#2340ff">
        <rect x="4" y="6" width="2" height="2" />
        <rect x="10" y="6" width="2" height="2" />
        <rect x="16" y="6" width="2" height="2" />
      </g>
    </svg>
  )
}

function validDate(y: number, m: number, d: number) {
  const dt = new Date(Date.UTC(y, m - 1, d))
  const now = new Date()
  return (
    y >= 1900 &&
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d &&
    dt.getTime() <= now.getTime()
  )
}

export function BirthForm({ onSubmit }: { onSubmit: (birth: string, nickname: string) => void }) {
  const [y, setY] = useState('')
  const [m, setM] = useState('')
  const [d, setD] = useState('')
  const [nick, setNick] = useState('')
  const [error, setError] = useState('')
  const mRef = useRef<HTMLInputElement>(null)
  const dRef = useRef<HTMLInputElement>(null)

  const digits = (v: string, n: number) => v.replace(/\D/g, '').slice(0, n)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const [yy, mm, dd] = [Number(y), Number(m), Number(d)]
    if (!validDate(yy, mm, dd)) {
      setError('ERR: 존재하지 않는 날짜입니다. 다시 입력해 주세요.')
      return
    }
    onSubmit(`${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`, nick.trim())
  }

  const box = 'w-full border-b border-paper/60 bg-transparent py-1.5 text-center font-big fs-24 text-paper outline-none placeholder:text-paper/25 focus:border-plate'

  return (
    <form onSubmit={submit} className="mx-auto flex min-h-dvh w-full max-w-[calc(var(--col)+2*var(--gutter))] flex-col justify-center gap-7 gutter py-10">
      <div>
        <div className="font-mono fs-11 text-gray">_IDENTIFY ..... ?&gt;</div>
        <h2 className="glow mt-2 font-big fs-21 leading-snug break-keep">이번 생의 생년월일을 입력하세요</h2>
        <p className="mt-2 font-pixel fs-12 text-gray break-keep">양력 기준입니다. 같은 생일이면 언제나 같은 기록이 나옵니다.</p>
      </div>

      <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-3">
        <label>
          <span className="font-mono fs-10 text-paper/50">YYYY</span>
          <input
            className={box}
            inputMode="numeric"
            autoFocus
            placeholder="1995"
            aria-label="태어난 해"
            value={y}
            onChange={(e) => {
              const v = digits(e.target.value, 4)
              setY(v)
              if (v.length === 4) mRef.current?.focus()
            }}
          />
        </label>
        <label>
          <span className="font-mono fs-10 text-paper/50">MM</span>
          <input
            ref={mRef}
            className={box}
            inputMode="numeric"
            placeholder="03"
            aria-label="태어난 달"
            value={m}
            onChange={(e) => {
              const v = digits(e.target.value, 2)
              setM(v)
              if (v.length === 2) dRef.current?.focus()
            }}
          />
        </label>
        <label>
          <span className="font-mono fs-10 text-paper/50">DD</span>
          <input
            ref={dRef}
            className={box}
            inputMode="numeric"
            placeholder="14"
            aria-label="태어난 날"
            value={d}
            onChange={(e) => setD(digits(e.target.value, 2))}
          />
        </label>
      </div>

      <label className="block">
        <span className="font-mono fs-10 text-paper/50">이름 (선택)</span>
        <input
          className="mt-1 w-full border-b border-paper/40 bg-transparent py-1.5 font-pixel text-[max(16px,calc(16px*var(--ui)))] outline-none placeholder:text-paper/25 focus:border-plate"
          maxLength={12}
          placeholder="이름"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
        />
      </label>

      {error && <div className="font-mono fs-12 text-[#ff5a6e]">{error}</div>}

      <Btn type="submit" disabled={!y || !m || !d}>
        기록 복원 시작
      </Btn>
    </form>
  )
}

export function RecoveryLog({ record, onDone }: { record: PrisonRecord; onDone: () => void }) {
  const lines = useMemo(
    () => [
      'CONNECTING TO OLD EMPIRE REGISTRY',
      'BYPASSING AMNESIA SCREEN',
      `ZODIAC ${record.species.origin.en}`,
      `SPECIES ${record.species.en}`,
      'RECOVERING PAST RECORD',
      'DECRYPTING CHARGES'
    ],
    [record],
  )
  const [shown, setShown] = useState(0)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    const fast = matchMedia('(prefers-reduced-motion: reduce)').matches
    const step = fast ? 60 : 200 // about 1.5s in all
    const timers = lines.map((_, i) => setTimeout(() => setShown(i + 1), step * (i + 1)))
    timers.push(setTimeout(() => done.current(), step * (lines.length + 1.5)))
    return () => timers.forEach(clearTimeout)
  }, [lines])

  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-[calc(var(--col)+2*var(--gutter))] flex-col justify-center gutter font-mono fs-12 leading-[2]">
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} className="flex gap-2">
          <span className="truncate">&gt; {l}</span>
          <span className="flex-1 overflow-hidden whitespace-nowrap text-gray/40">{'.'.repeat(60)}</span>
          <span className={i === lines.length - 1 ? 'text-plate' : 'text-fog'}>{i === lines.length - 1 ? '100%' : 'OK'}</span>
        </div>
      ))}
      {shown < lines.length && <div className="caret text-paper/60">&gt; </div>}
    </section>
  )
}
