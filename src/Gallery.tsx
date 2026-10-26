// Dev pages. ?gallery: every figure. ?gallery=<shape>: one figure large.
// ?portrait=<shape>: a 420x504 species portrait for share previews (public/og/<shape>.png).
// ?icon: the 512x512 app icon. ?og: the 1200x630 link preview image. Regenerate public/og.png with:
//   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
//     --window-size=1200,630 --virtual-time-budget=6000 --user-data-dir=/tmp/og-chrome \
//     --screenshot=public/og.png "http://localhost:5179/?og"
// ?card= / ?report= / ?story=YYYY-MM-DD: the card, card + report, or story frame for that birthday.
import { AsciiPortrait } from './components/AsciiPortrait'
import { PrisonCard } from './components/PrisonCard'
import { Report } from './components/Report'
import { StoryFrame } from './components/StoryFrame'
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

// The main page as a link preview: a paper sheet with one big specimen in the middle, drawn
// in dark ink inside a dashed annotation box. The copy names the premise (a prison planet), the
// Roswell hook and what this is (a zodiac reading).
// Chat apps show it at 300-450px wide, so there is no grain or glow and nothing under 28px.
function OgImage() {
  const handle = 'absolute h-[12px] w-[12px] border-2 border-ink bg-paper'
  return (
    <div className="relative flex overflow-hidden bg-paper text-ink" style={{ width: 1200, height: 630 }}>
      <div className="flex w-[320px] flex-col justify-between py-10 pl-8">
        <span className="self-start bg-plate px-3 py-1 font-mono text-[28px] leading-[1.4] tracking-[0.12em] text-paper">WHY ON EARTH</span>
        <h1 className="font-big text-[66px] leading-[1.2] whitespace-nowrap" style={{ textShadow: '1px 0 0 currentColor' }}>
          지구는
          <br />
          우주의
          <br />
          감옥이다
        </h1>
      </div>
      <div className="dotgrid-ink relative flex flex-1 items-end justify-center">
        <div className="relative w-[480px]">
          <AsciiPortrait shape="grey" seed={7} frozen light />
          <div className="pointer-events-none absolute top-[6%] left-[14%] h-[60%] w-[72%] border-2 border-dashed border-ink/70">
            <span className={`${handle} -top-[7px] -left-[7px]`} />
            <span className={`${handle} -top-[7px] -right-[7px]`} />
            <span className={`${handle} -bottom-[7px] -left-[7px]`} />
            <span className={`${handle} -right-[7px] -bottom-[7px]`} />
            <span className="absolute -top-[44px] left-0 font-mono text-[28px] text-plate">SPECIMEN #0001</span>
          </div>
          <div className="absolute top-0 bottom-0 left-[68%] w-[2px] bg-[repeating-linear-gradient(to_bottom,#2340ff_0_8px,transparent_8px_14px)]" />
        </div>
      </div>
      <div className="flex w-[400px] flex-col items-end justify-between py-10 pr-8">
        <span className="bg-ink px-3 py-1 font-mono text-[28px] leading-[1.4] text-paper">별자리 외계 사주</span>
        {/* Galmuri has no bold cut: a 1px same-color shadow thickens the strokes. */}
        <p className="self-start font-big text-[48px] leading-[1.25] whitespace-nowrap text-plate" style={{ textShadow: '1px 0 0 currentColor' }}>
          로스웰에
          <br />
          추락한
          <br />
          외계인이 밝힌
          <br />
          당신의 죄
        </p>
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
