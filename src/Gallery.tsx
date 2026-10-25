// Dev pages. ?gallery: every figure. ?gallery=<shape>: one figure large.
// ?portrait=<shape>: a 420x504 species portrait for share previews (public/og/<shape>.png).
// ?icon: the 512x512 app icon. ?og: the 1200x630 link preview image (screenshot it into public/og.png).
// ?card= / ?report= / ?story=YYYY-MM-DD: the card, card + report, or story frame for that birthday.
import { AsciiPortrait } from './components/AsciiPortrait'
import { PrisonCard } from './components/PrisonCard'
import { Report } from './components/Report'
import { StoryFrame } from './components/StoryFrame'
import { StarDust } from './components/TripBackground'
import { SPECIES, type ShapeId } from './data/species'
import { SITE_DESC } from './lib/copy'
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

// The main page as a link preview: dark sky, a falling beam of light, one glowing figure,
// the small blue tag, the title and the intro line.
function OgImage() {
  return (
    <div className="grain relative flex overflow-hidden bg-ink text-paper" style={{ width: 1200, height: 630 }}>
      <StarDust count={160} />
      <div className="beam" style={{ left: 330, width: 460, animation: 'none' }} />
      <div className="vignette" />
      <div className="relative flex w-[660px] items-center justify-center">
        <div className="w-[400px] opacity-95">
          <AsciiPortrait shape="halo" seed={7} frozen />
        </div>
      </div>
      <div className="relative flex flex-1 flex-col justify-center pr-14">
        <span className="self-start bg-plate px-3 py-1 font-mono text-[20px] tracking-[0.18em] text-paper">WHY ON EARTH</span>
        <h1 className="glow mt-6 font-big text-[60px] leading-[1.2] whitespace-nowrap">
          당신은 왜
          <br />
          지구에 있습니까?
        </h1>
        <p className="mt-6 max-w-[440px] font-pixel text-[21px] leading-[1.75] text-fog break-keep">{SITE_DESC}</p>
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
