// Dev pages. ?gallery: every figure. ?gallery=<shape>: one figure large.
// ?portrait=<shape>: a 420x504 species portrait for share previews (public/og/<shape>.png).
// ?icon: the 512x512 app icon. ?og: the 1200x630 link preview image (screenshot it into public/og.png).
// ?sheet=YYYY-MM-DD: the saved card image layout.
// ?card= / ?report= / ?story=YYYY-MM-DD: the card, card + report, or story frame for that birthday.
import { AsciiPortrait } from './components/AsciiPortrait'
import { PrisonCard } from './components/PrisonCard'
import { Report } from './components/Report'
import { CardSheet, StoryFrame } from './components/StoryFrame'
import { SPECIES, type ShapeId } from './data/species'
import { makeRecord } from './lib/record'

export function Gallery() {
  const q = new URLSearchParams(location.search)
  if (q.has('og')) return <OgImage />
  if (q.has('icon')) return <AppIcon />
  const portrait = q.get('portrait')
  if (portrait)
    return (
      <div className="bg-coal" style={{ width: 420, height: 504 }}>
        <AsciiPortrait shape={portrait as ShapeId} seed={11} cols={60} frozen />
      </div>
    )
  const card = q.get('card')
  if (card) return <div className="flex justify-center p-2"><PrisonCard record={makeRecord(card)} /></div>
  const report = q.get('report')
  if (report)
    return (
      <div className="flex flex-col items-center gap-6 px-4 py-4">
        <PrisonCard record={makeRecord(report)} />
        <Report record={makeRecord(report)} />
      </div>
    )
  const sheet = q.get('sheet')
  if (sheet) return <CardSheet record={makeRecord(sheet)} />
  const story = q.get('story')
  if (story) return <StoryFrame record={makeRecord(story)} nickname={q.get('n') ?? ''} />

  const only = q.get('gallery')
  const stars = only ? SPECIES.filter((s) => s.shape === only) : SPECIES
  const seeds = only ? [11, 2024, 777] : [11]
  return (
    <div className={`grid gap-4 p-4 ${only ? 'grid-cols-3' : 'grid-cols-4'}`}>
      {stars.flatMap((s) =>
        seeds.map((seed) => (
          <figure key={s.shape + seed} className="bg-ink border border-paper/20">
            <AsciiPortrait shape={s.shape} seed={seed} />
            <figcaption className="font-mono text-xs p-1">
              {s.ko} / {s.shape}
            </figcaption>
          </figure>
        )),
      )}
    </div>
  )
}

function OgImage() {
  const figs = [SPECIES[5], SPECIES[0], SPECIES[7]]
  return (
    <div className="relative flex overflow-hidden bg-ink" style={{ width: 1200, height: 630 }}>
      <div className="flex w-[560px] items-end gap-2 px-8 pb-10">
        {figs.map((s, i) => (
          <div key={s.shape} className={i === 1 ? 'w-[220px]' : 'w-[150px] opacity-70'}>
            <AsciiPortrait shape={s.shape} seed={11 + i} frozen />
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col justify-between py-14 pr-16">
        <div className="font-mono text-[18px] leading-relaxed text-gray">
          <div className="text-paper">OLD EMPIRE / PRISON REGISTRY</div>
          <div>&gt; RECORD RECOVERED 1947 · ROSWELL</div>
        </div>
        <div>
          <h1 className="glow font-big text-[64px] leading-[1.2]">
            당신은 왜
            <br />
            지구에 있습니까?
          </h1>
          <p className="mt-6 font-pixel text-[24px] leading-[1.6] text-fog">생년월일로 찾는 지구 이전의 삶과 죄목</p>
        </div>
        <div className="flex items-center justify-between bg-plate px-5 py-3 font-mono text-[16px] text-paper">
          <span>WHY ON EARTH</span>
          <span>FOR ENTERTAINMENT ONLY</span>
        </div>
      </div>
    </div>
  )
}

function AppIcon() {
  return (
    <div className="relative overflow-hidden bg-ink" style={{ width: 512, height: 512 }}>
      <div className="absolute left-1/2 w-[440px] -translate-x-1/2" style={{ top: -40 }}>
        <AsciiPortrait shape="ufo" seed={3} cols={40} frozen />
      </div>
    </div>
  )
}
