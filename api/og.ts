// Share preview image (1200x630) for one record: /api/og?r=<token>&n=<name>.
// Rendered on the server with the same pixel fonts; the portrait is a pre-rendered PNG
// per species (public/og/<shape>.png) since the live one is drawn on a canvas.
// Chat apps show this at 300-450px wide, so: flat panels, no glow or grain, nothing under 28px.
import { ImageResponse } from '@vercel/og'
import { OG, type Lang } from '../src/lib/copy'
import { recordFor } from '../src/lib/record'
import { cleanNick, decodeBirth } from '../src/lib/token'

export const config = { runtime: 'edge' }

const C = { ink: '#070708', coal: '#111113', paper: '#f0efea', plate: '#2340ff', dim: 'rgba(240,239,234,0.72)' }

type Node = { type: string; props: Record<string, unknown> }
// Satori takes plain element objects; every box is a flex box.
const box = (style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children: children.length === 1 ? children[0] : children },
})

// Galmuri Hangul is about 1em wide per glyph, Latin about 0.54em; the text column is 584px
// inside its padding. English charges are at most 20 characters, so they stay on one line.
const crimeSize = (name: string, lang: Lang) =>
  lang === 'en'
    ? name.length <= 12 ? 84 : name.length <= 16 ? 64 : 52
    : name.length <= 5 ? 104 : name.length <= 7 ? 84 : 64

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const birth = decodeBirth(url.searchParams.get('r') ?? '')
  if (!birth) return Response.redirect(new URL('/og.png', url).href, 302)
  const nick = cleanNick(url.searchParams.get('n'))
  const lang: Lang = url.searchParams.get('lang') === 'en' ? 'en' : 'ko'
  const { species, crime, verdict } = recordFor(birth, lang)

  const asset = (path: string) => new URL(path, url).href
  const font = (name: string) => fetch(asset(`/og/${name}.woff`)).then((r) => r.arrayBuffer())
  const [g11, g14, mono] = await Promise.all([font('Galmuri11'), font('Galmuri14'), font('GalmuriMono11')])

  const row = (k: string, v: string, note?: string) =>
    box(
      { justifyContent: 'space-between', alignItems: 'baseline', width: '100%' },
      box({ whiteSpace: 'pre' }, `${k.padEnd(7, ' ')} = '${v}'`),
      ...(note ? [box({ fontFamily: 'G11', color: C.dim }, note)] : []),
    )

  const tree = box(
    { width: 1200, height: 630, background: C.ink, color: C.paper, fontFamily: 'Mono' },
    box(
      { width: 440, height: 630, alignItems: 'center', justifyContent: 'center', background: C.coal },
      { type: 'img', props: { src: asset(`/og/${species.shape}.png`), width: 420, height: 504 } },
    ),
    box(
      { flex: 1, flexDirection: 'column', justifyContent: 'space-between', background: C.plate, padding: '40px 44px 36px 44px' },
      box(
        { flexDirection: 'column', fontSize: 30, lineHeight: 1.5 },
        ...(nick ? [row('NAME', nick)] : []),
        row('SPECIES', species.en, species.home ?? species.name),
      ),
      box(
        { flexDirection: 'column' },
        box({ fontSize: 28, color: C.dim }, OG[lang].charge),
        box({ fontFamily: 'G14', fontSize: crimeSize(crime.name, lang), lineHeight: 1.15, marginTop: 8, wordBreak: 'keep-all' }, crime.name),
        box({ fontSize: 28, letterSpacing: 2, color: C.dim, marginTop: 6 }, crime.en),
        // English verdicts run to four lines at 32px, so they are set a little smaller.
        box({ fontFamily: 'G11', fontSize: lang === 'en' ? 28 : 32, lineHeight: 1.5, marginTop: 22, wordBreak: 'keep-all' }, verdict),
      ),
      box(
        { justifyContent: 'space-between', fontSize: 28 },
        box({ color: C.dim }, 'WHY ON EARTH'),
        box({ fontFamily: 'G11' }, OG[lang].cta),
      ),
    ),
  )

  return new ImageResponse(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'G11', data: g11 },
      { name: 'G14', data: g14 },
      { name: 'Mono', data: mono },
    ],
    headers: { 'cache-control': 'public, max-age=86400, s-maxage=31536000' },
  })
}
