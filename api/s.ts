// /s/<token>?n=<name> (rewritten here by vercel.json): a tiny page whose title and preview
// image show this person's record, so KakaoTalk and other link previews show their crime.
// Visitors are sent straight on to the app at /?r=<token>.
import { makeRecord } from '../src/lib/record'
import { cleanNick, decodeBirth } from '../src/lib/token'

export const config = { runtime: 'edge' }

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

export default function handler(req: Request): Response {
  const url = new URL(req.url)
  const token = url.searchParams.get('r') ?? ''
  const birth = decodeBirth(token)
  if (!birth) return Response.redirect(new URL('/', url).href, 302)

  const nick = cleanNick(url.searchParams.get('n'))
  const { species, crime, verdict } = makeRecord(birth)
  const q = new URLSearchParams({ r: token })
  if (nick) q.set('n', nick)
  const nq = nick ? `?${new URLSearchParams({ n: nick })}` : ''

  const app = new URL(`/?${q}`, url).href
  const page = new URL(`/s/${token}${nq}`, url).href
  const image = new URL(`/api/og?${q}`, url).href
  const title = `${nick ? `${nick}의` : '이 사람의'} 죄명: ${crime.ko}`
  const desc = `${species.origin.ko} · ${species.ko}. ${verdict} 당신은 무슨 죄로 지구에 왔을까?`

  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Why on Earth" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${esc(page)}" />
<meta property="og:image" content="${esc(image)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta http-equiv="refresh" content="0; url=${esc(app)}" />
<link rel="canonical" href="${esc(page)}" />
</head>
<body style="background:#070708">
<script>location.replace(${JSON.stringify(app)})</script>
</body>
</html>`

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300, s-maxage=86400' },
  })
}
