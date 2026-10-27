// Long-form result under the card: record before Earth (the species, then the crime), what your soul kept (bad habits, then good points), and species matches.
import { SPECIES, type Match } from '../data/species'
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

// Korean particles that change with the last syllable: 은/는, 이었다/였다.
const hasFinal = (word: string) => (word.charCodeAt(word.length - 1) - 0xac00) % 28 !== 0
const topic = (word: string) => (hasFinal(word) ? '은' : '는')
const copula = (word: string) => (hasFinal(word) ? '이었다' : '였다')

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
          {s.ko} <span className="font-mono fs-9 text-gray">{s.en}</span>
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
      <Section no="01" en="RECORD BEFORE EARTH" title={`지구 이전 기록: ${species.ko}`}>
        <P>
          지구에 오기 전 당신은 {species.ko}
          {copula(species.ko)}. {species.ko}
          {topic(species.ko)} {species.lore}
        </P>
        <div className="mt-4 border-l border-paper/15 bg-coal/70 px-3 py-3">
          <div className="font-mono fs-9 tracking-wider text-gray">INCIDENT REPORT · 사건 경위서</div>
          <div className="mt-1 font-pixel fs-13 text-paper">{crime.ko}</div>
          <P className="mt-1.5">{crime.story}</P>
        </div>
      </Section>

      <Section no="02" en="WHAT YOUR SOUL KEPT" title="영혼에 남은 당신">
        <div className="font-pixel fs-14 text-paper">기억은 지워져도 당신은 그대로다.</div>
        <div className="mt-3 space-y-4 border-l border-paper/15 pl-3">
          {traits.map((t) => (
            <P key={t}>{t}</P>
          ))}
        </div>
      </Section>

      <Section no="03" en="SPECIES MATCH" title="외계인 종족 궁합">
        <div className="space-y-2.5">
          <Mate label="가장 잘 맞는 종족" match={species.best} tone="good" />
          <Mate label="가장 안 맞는 종족" match={species.worst} tone="bad" />
        </div>
        {onSpecies && (
          <button
            className="mt-3 w-full border border-dashed border-paper/30 py-2.5 font-pixel fs-12 text-fog hover:border-paper hover:text-paper"
            onClick={onSpecies}
          >
            외계인 12종족 전체 보기 &gt;
          </button>
        )}
      </Section>

    </div>
  )
}
