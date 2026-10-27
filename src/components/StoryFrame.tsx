// Exported image. It is fixed-size and pin --card-max, so it comes out the same on
// every screen (the app's screen-size variables must not leak in).
//   StoryFrame: 9:16 for Instagram stories, rendered off-screen at 360x640, saved at 3x.
import type { CSSProperties, Ref } from 'react'
import { LANG, t } from '../lib/locale'
import type { PrisonRecord } from '../lib/record'
import { PrisonCard } from './PrisonCard'
import { StarDust } from './TripBackground'

type Props = { record: PrisonRecord; nickname?: string; ref?: Ref<HTMLDivElement> }

const pinned = (width: number, height?: number) => ({ width, height, '--card-max': '360px' }) as CSSProperties

// The incident report under the card: the part that explains the crime.
function Incident({ record, size }: { record: PrisonRecord; size: 'sm' | 'md' }) {
  return (
    <div className="w-full border-l border-paper/20 bg-coal/90 px-3 py-2.5">
      <div className="font-pixel text-[9px] text-gray">{t.incident}</div>
      <p className={`mt-1 font-pixel leading-[1.6] text-paper/90 break-keep ${size === 'sm' ? 'text-[10px]' : 'text-[12px]'}`}>
        {record.crime.story}
      </p>
    </div>
  )
}

export function StoryFrame({ record, nickname, ref }: Props) {
  return (
    <div ref={ref} className="grain relative overflow-hidden bg-ink text-paper" style={pinned(360, 640)}>
      <StarDust count={90} />
      {/* soft glow from above instead of a hard-edged spotlight */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgb(140 160 255 / 0.16), transparent 70%)' }}
      />
      <div className="vignette" />
      <div className="relative flex h-full flex-col items-center px-[28px] pt-5 pb-3">
        <div className="glow text-center font-big text-[22px] leading-[1.25]">
          {t.storyTitle[0]}
          <br />
          {t.storyTitle[1]}
        </div>
        {/* zoom (not transform) so the smaller card also takes less layout space */}
        <div className="mt-2.5" style={{ width: 360, zoom: 304 / 360 }}>
          {/* English charges often take two lines and English text runs longer, so the
              English image drops the verdict to stay inside 640px. */}
          <PrisonCard record={record} nickname={nickname} frozen compact noVerdict={LANG === 'en'} />
        </div>
        <div className="mt-2 w-[304px]">
          <Incident record={record} size="sm" />
        </div>
        <div className="mt-auto text-center font-pixel leading-[1.6]">
          <div className="text-[11px] text-paper">{t.tagline}</div>
          <div className="font-mono text-[9px] text-gray">{location.host}</div>
        </div>
      </div>
    </div>
  )
}
