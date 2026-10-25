// The inmate record, styled as an Old Empire observation plate:
// FITS-like header blocks in electric blue around an x-ray ASCII figure.
import type { PrisonRecord } from '../lib/record'
import { AsciiPortrait } from './AsciiPortrait'

// compact: shorter portrait, for the story image where space is tight.
type Props = { record: PrisonRecord; nickname?: string; frozen?: boolean; compact?: boolean }

// One header line: KEY = VALUE / comment
function Row({ k, v, c }: { k: string; v: string; c?: string }) {
  return (
    <div className="grid grid-cols-[54px_1fr] gap-x-1">
      <span>{k.padEnd(7, ' ')}=</span>
      <span className="flex min-w-0 justify-between gap-2">
        <span className="truncate">{v}</span>
        {c && <span className="shrink-0 text-paper/65">/ {c}</span>}
      </span>
    </div>
  )
}

// Dashed selection box with corner handles, as on an annotated sky plate.
function Selection() {
  const handle = 'absolute h-[7px] w-[7px] border border-paper bg-ink'
  return (
    <div className="pointer-events-none absolute top-[7%] left-[24%] h-[44%] w-[52%] border border-dashed border-paper/70" aria-hidden>
      <span className={`${handle} -top-[4px] -left-[4px]`} />
      <span className={`${handle} -top-[4px] -right-[4px]`} />
      <span className={`${handle} -bottom-[4px] -left-[4px]`} />
      <span className={`${handle} -right-[4px] -bottom-[4px]`} />
    </div>
  )
}

// Rubber stamp over the charge, slightly crooked.
function Stamp() {
  return (
    <div
      className="pointer-events-none absolute top-3 right-3 rotate-[-9deg] border-2 border-plate px-1.5 py-0.5 text-center text-plate opacity-90"
      aria-hidden
    >
      <div className="text-[9px] leading-tight tracking-[0.18em]">MEMORY WIPED</div>
      <div className="font-pixel text-[9px] leading-tight">기억 삭제 완료</div>
    </div>
  )
}

export function PrisonCard({ record, nickname, frozen, compact }: Props) {
  const { crime, species } = record
  return (
    <article className="grain relative mx-auto w-full max-w-[var(--card-max,360px)] overflow-hidden bg-ink font-mono text-paper">
      <header className="bg-plate px-2.5 py-2 text-[10px] leading-[1.5]">
        {nickname && <Row k="NAME" v={`'${nickname}'`} c="이번 생의 이름" />}
        <Row k="ZODIAC" v={`'${species.origin.en}'`} c={species.origin.ko} />
        <Row k="SPECIES" v={`'${species.en}'`} c={species.ko} />
        <Row k="REBIRTH" v={`${record.reincarnations}`} c="환생 횟수" />
        {record.wanted && <Row k="WANTED" v="'LEVEL MAX'" c="우주 최고 수배범" />}
      </header>

      <div className={`dotgrid relative flex justify-center overflow-hidden bg-coal ${compact ? 'h-[186px]' : 'h-[268px]'}`}>
        <div className={compact ? 'w-[160px] pt-1' : 'w-[230px] pt-1'}>
          <AsciiPortrait shape={species.shape} seed={record.seed} frozen={frozen} />
        </div>
        <Selection />
        <div className="scanline absolute top-0 bottom-0 left-[67%] w-px bg-[repeating-linear-gradient(to_bottom,#eef2ff_0_6px,transparent_6px_9px)]" />
        <div className="absolute top-2 left-2.5 text-[9px] text-gray">PLATE 03 · EARTH</div>
        <div className="absolute right-2.5 bottom-2 text-[9px] text-gray">SUBJECT: NON-HUMAN</div>
        <div className="absolute bottom-2 left-2.5 text-[9px] text-gray">OBS {record.birth.replaceAll('-', '.')}</div>
      </div>

      <section className="relative border-t border-paper/15 px-3 pt-3 pb-3.5">
        <Stamp />
        <div className="text-[10px] text-gray">/ CHARGE ..... 죄명</div>
        <h2 className="glow mt-1.5 pr-[84px] font-big text-[28px] leading-[1.15] break-keep">{crime.ko}</h2>
        <div className="mt-1 text-[11px] tracking-[0.14em] text-fog">{crime.en}</div>
        <p className="mt-2.5 font-pixel text-[12px] leading-[1.7] text-paper/90 break-keep">{record.verdict}</p>
      </section>
    </article>
  )
}
