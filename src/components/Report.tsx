// Long-form result under the card: record before Earth (the species, then the crime), what your soul kept (bad habits, then good points), and species matches.
import type { Match } from '../data/species'
import { SPECIES_L as SPECIES, t } from '../lib/locale'
import type { PrisonRecord } from '../lib/record'
import { AsciiPortrait } from './AsciiPortrait'

function Section({ no, en, title, children }: { no: string; en: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-dashed border-paper/20 pt-6">
      <div className="font-mono fs-9 tracking-[0.18em] text-gray">
        / {no} — {en}
      </div>
      <h3 className="glow mt-1.5 font-big fs-19 leading-snug">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

const P = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`font-pixel fs-13 leading-[1.85] text-fog break-keep ${className}`}>{children}</p>
)

function Mate({ label, match, tone }: { label: string; match: Match; tone: 'good' | 'bad' }) {
  const s = SPECIES[match.idx]
  return (
    <div className="flex gap-3 border border-paper/20 p-3">
      <div className="w-[64px] shrink-0 self-start bg-coal">
        <AsciiPortrait shape={s.shape} seed={match.idx + 7} cols={40} frozen />
      </div>
      <div className="min-w-0">
        <div className={`font-mono fs-9 tracking-wider ${tone === 'good' ? 'text-plate' : 'text-gray'}`}>{label}</div>
        <div className="mt-0.5 font-big fs-16 leading-tight">
          {s.name} <span className="font-mono fs-9 text-gray">{s.home ?? s.en}</span>
        </div>
        <P className="mt-1 fs-12 leading-[1.7]">{match.why}</P>
      </div>
    </div>
  )
}

export function Report({ record, onSpecies }: { record: PrisonRecord; onSpecies?: () => void }) {
  const { species, crime } = record
  // One list: the bad habits first, then the good points.
  const traits = [...record.symptoms, ...species.merits]
  return (
    <div className="w-full max-w-[var(--col)] space-y-8">
      {/* Right under the card's charge: the story behind it. The card already names the crime. */}
      <Section no="01" en="INCIDENT REPORT" title={t.incident}>
        <P>{crime.story}</P>
      </Section>

      <Section no="02" en="RECORD BEFORE EARTH" title={t.beforeEarthTitle(species)}>
        <P>{t.beforeEarth(species)}</P>
      </Section>

      <Section no="03" en="WHAT YOUR SOUL KEPT" title={t.soulTitle}>
        <div className="font-pixel fs-14 text-paper">{t.soulLead}</div>
        <div className="mt-3 space-y-4 border-l border-paper/15 pl-3">
          {traits.map((t) => (
            <P key={t}>{t}</P>
          ))}
        </div>
      </Section>

      <Section no="04" en="SPECIES MATCH" title={t.matchTitle}>
        <div className="space-y-2.5">
          <Mate label={t.best} match={species.best} tone="good" />
          <Mate label={t.worst} match={species.worst} tone="bad" />
        </div>
        {onSpecies && (
          <button
            className="mt-3 w-full border border-dashed border-paper/30 py-2.5 font-pixel fs-12 text-fog hover:border-paper hover:text-paper"
            onClick={onSpecies}
          >
            {t.allSpecies}
          </button>
        )}
      </Section>

    </div>
  )
}
