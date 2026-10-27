// The inmate record, styled as an Old Empire observation plate:
// FITS-like header blocks in electric blue around an x-ray ASCII figure.
import { t } from '../lib/locale'
import type { PrisonRecord } from '../lib/record'
import { AsciiPortrait } from './AsciiPortrait'

// compact: shorter portrait, for the story image where space is tight.
// noVerdict: leave out the verdict line (the story image's incident report already tells it).
type Props = { record: PrisonRecord; nickname?: string; frozen?: boolean; compact?: boolean; noVerdict?: boolean }

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

// The species, large: the first thing on the plate, so nobody has to look for it.
// It sits in the same 54px key column as the rows below.
function SpeciesLine({ name, tag }: { name: string; tag: string }) {
  return (
    <div className="mb-1.5 grid grid-cols-[54px_1fr] items-center gap-x-1 border-b border-dashed border-paper/45 pb-1.5">
      <span className="leading-[1.3]">
        SPECIES
        {t.speciesSub && (
          <>
            <br />
            <span className="text-paper/65">{t.speciesSub}</span>
          </>
        )}
      </span>
      <span className="flex min-w-0 items-baseline justify-between gap-2">
        <span className="glow truncate font-big text-[26px] leading-[1.15]">{name}</span>
        <span className="shrink-0 tracking-[0.12em] text-paper/80">{tag}</span>
      </span>
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
      <div className={`text-[9px] leading-tight ${t.stamp === 'CASE CLOSED' ? 'tracking-[0.18em]' : 'font-pixel'}`}>{t.stamp}</div>
    </div>
  )
}

export function PrisonCard({ record, nickname, frozen, compact, noVerdict }: Props) {
  const { crime, species } = record
  return (
    <article className="grain relative mx-auto w-full max-w-[var(--card-max,360px)] overflow-hidden border border-paper/25 bg-ink font-mono text-paper">
      <header className="bg-plate px-2.5 py-2 text-[10px] leading-[1.5]">
        <SpeciesLine name={species.name} tag={species.home ?? species.en} />
        {nickname && <Row k="NAME" v={`'${nickname}'`} c={t.nameNote} />}
        <Row k="ZODIAC" v={`'${species.origin.en}'`} c={species.origin.name} />
        <Row k="REBIRTH" v={`${record.reincarnations}`} c={t.rebirthNote} />
        {record.wanted && <Row k="WANTED" v="'LEVEL MAX'" c={t.wantedNote} />}
      </header>

      <div className={`dotgrid relative flex justify-center overflow-hidden bg-coal ${compact ? 'h-[158px]' : 'h-[268px]'}`}>
        <div className={compact ? 'w-[136px] pt-1' : 'w-[230px] pt-1'}>
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
        <div className="text-[10px] text-gray">/ CHARGE .....{t.chargeSub}</div>
        <h2 className="glow mt-1.5 pr-[84px] font-big text-[28px] leading-[1.15] break-keep">{crime.name}</h2>
        <div className="mt-1 text-[11px] tracking-[0.14em] text-fog">{crime.en}</div>
        {!noVerdict && <p className="mt-2.5 font-pixel text-[12px] leading-[1.7] text-paper/90 break-keep">{record.verdict}</p>}
      </section>
    </article>
  )
}
