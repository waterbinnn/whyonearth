// Species index: all twelve species, one entry per zodiac sign.
// mine marks the species of the record the visitor came from.
import { SPECIES } from '../data/species'
import { SIGN_DATES } from '../lib/zodiac'
import { AsciiPortrait } from './AsciiPortrait'
import { Btn } from './Screens'

type Props = {
  mine?: { idx: number; label: string }
  onBack: () => void
  backLabel: string
  onStart?: () => void
}

export function SpeciesIndex({ mine, onBack, backLabel, onStart }: Props) {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-[calc(var(--col)+2*var(--gutter))] flex-col gap-6 gutter py-6">
      <button className="self-start font-mono fs-11 tracking-wider text-gray hover:text-paper" onClick={onBack}>
        &lt; BACK
      </button>

      <header>
        <div className="font-mono fs-9 tracking-[0.18em] text-gray">/ SPECIES INDEX — 12 KNOWN</div>
        <h2 className="glow mt-1.5 font-big fs-24 leading-snug">외계인 종족 도감</h2>
        <p className="mt-2 font-pixel fs-12 leading-[1.7] text-fog break-keep">
          지구에 갇힌 자들은 모두 이 열두 종족 중 하나에서 왔다. 어느 종족이었는지는 이번 생의 생일 별자리가 알려 준다.
        </p>
      </header>

      <ol className="flex flex-col gap-2.5">
        {SPECIES.map((s, i) => {
          const isMine = mine?.idx === i
          return (
            <li key={s.shape} className={`flex gap-3 border p-3 ${isMine ? 'border-plate bg-plate/10' : 'border-paper/20'}`}>
              <div className="w-[72px] shrink-0 self-start bg-coal">
                <AsciiPortrait shape={s.shape} seed={i + 7} cols={40} frozen />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 font-mono fs-9 tracking-wider text-gray">
                  <span>
                    {String(i + 1).padStart(2, '0')} · {s.origin.ko} {SIGN_DATES[i]} 무렵
                  </span>
                  {isMine && <span className="shrink-0 bg-plate px-1.5 text-paper">{mine.label}</span>}
                </div>
                <div className="mt-1 font-big fs-19 leading-tight">{s.ko}</div>
                <div className="font-mono fs-9 tracking-[0.14em] text-gray">{s.en}</div>
                <p className="mt-1.5 font-pixel fs-12 leading-[1.7] text-fog break-keep">{s.lore}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="flex flex-col gap-2 border-t border-dashed border-paper/20 pt-6">
        {onStart && <Btn onClick={onStart}>내 종족 찾기</Btn>}
        <Btn tone={onStart ? 'ghost' : 'main'} onClick={onBack}>
          {backLabel}
        </Btn>
      </div>
    </section>
  )
}
