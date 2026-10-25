// Share preview image (1200x630) for one record: /api/og?r=<token>&n=<name>.
// Rendered on the server with the same pixel fonts; the portrait is a pre-rendered PNG
// per species (public/og/<shape>.png) since the live one is drawn on a canvas.
import { ImageResponse } from '@vercel/og'
import { makeRecord } from '../src/lib/record'
import { cleanNick, decodeBirth } from '../src/lib/token'

export const config = { runtime: 'edge' }

const C = { ink: '#070708', coal: '#111113', gray: '#8a8d94', fog: '#c6c8cc', paper: '#f0efea', plate: '#2340ff' }

type Node = { type: string; props: Record<string, unknown> }
// Satori takes plain element objects; every box is a flex box.
const box = (style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children: children.length === 1 ? children[0] : children },
})

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const birth = decodeBirth(url.searchParams.get('r') ?? '')
  if (!birth) return Response.redirect(new URL('/og.png', url).href, 302)
  const nick = cleanNick(url.searchParams.get('n'))
  const { species, crime, verdict } = makeRecord(birth)

  const asset = (path: string) => new URL(path, url).href
  const font = (name: string) => fetch(asset(`/og/${name}.woff`)).then((r) => r.arrayBuffer())
  const [g11, g14, mono] = await Promise.all([font('Galmuri11'), font('Galmuri14'), font('GalmuriMono11')])

  const row = (k: string, v: string, c: string) =>
    box({ justifyContent: 'space-between', width: '100%' }, box({ whiteSpace: 'pre' }, `${k.padEnd(7, ' ')}= '${v}'`), box({ color: 'rgba(240,239,234,0.7)' }, `/ ${c}`))

  const tree = box(
    { width: 1200, height: 630, background: C.ink, color: C.paper, fontFamily: 'Mono' },
    box(
      { width: 470, height: 630, alignItems: 'center', justifyContent: 'center', background: C.coal },
      { type: 'img', props: { src: asset(`/og/${species.shape}.png`), width: 420, height: 504 } },
    ),
    box(
      { flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '44px 56px 40px 48px' },
      box(
        { flexDirection: 'column', background: C.plate, padding: '14px 18px', fontSize: 20, lineHeight: 1.5 },
        ...(nick ? [row('NAME', nick, '이번 생의 이름')] : []),
        row('ZODIAC', species.origin.en, species.origin.ko),
        row('SPECIES', species.en, species.ko),
      ),
      box(
        { flexDirection: 'column' },
        box({ fontSize: 20, color: C.gray }, '/ CHARGE ..... 죄명'),
        box(
          {
            fontFamily: 'G14',
            fontSize: crime.ko.length > 8 ? 58 : 72,
            lineHeight: 1.15,
            marginTop: 10,
            wordBreak: 'keep-all',
            textShadow: '0 0 8px rgba(240,239,234,0.45), 0 0 28px rgba(35,64,255,0.6)',
          },
          crime.ko,
        ),
        box({ fontSize: 20, letterSpacing: 3, color: C.fog, marginTop: 8 }, crime.en),
        box({ fontFamily: 'G11', fontSize: 25, lineHeight: 1.6, marginTop: 18, wordBreak: 'keep-all' }, verdict),
      ),
      box(
        { justifyContent: 'space-between', fontSize: 18, color: C.gray },
        box({}, 'WHY ON EARTH'),
        box({ color: C.paper }, '당신은 왜 지구에 있습니까? →'),
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
