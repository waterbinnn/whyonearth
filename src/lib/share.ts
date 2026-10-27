// Link sharing. A result lives in the address bar as /?r=<token>&n=<name>, so reloading or
// copying the address keeps the same card. Links we hand out to share go to /s/<token>
// instead: on Vercel that path is a small page with this result's preview image and title
// (api/s.ts), which then sends the visitor on to /?r=...
// The English version puts /en in front of all of these (BASE), so links keep the language.

import { BASE } from './locale'
import { cleanNick, decodeBirth, encodeBirth } from './token'

export { encodeBirth }

// The app's own address for a record.
export function shareUrl(birth: string, nickname: string): string {
  const q = new URLSearchParams({ r: encodeBirth(birth) })
  const nick = cleanNick(nickname)
  if (nick) q.set('n', nick)
  return `${location.origin}${BASE}?${q}`
}

// The link people send each other: shows this result in KakaoTalk and other previews.
export function shareLinkUrl(birth: string, nickname: string): string {
  const nick = cleanNick(nickname)
  return `${location.origin}${BASE}s/${encodeBirth(birth)}${nick ? `?${new URLSearchParams({ n: nick })}` : ''}`
}

export function readSharedRecord(): { birth: string; nickname: string } | null {
  const q = new URLSearchParams(location.search)
  // /s/<token> normally never reaches the app (Vercel serves api/s.ts), except in local dev.
  const token = location.pathname.match(/^(?:\/en)?\/s\/([0-9a-z]+)\/?$/)?.[1] ?? q.get('r') ?? ''
  const birth = decodeBirth(token)
  return birth ? { birth, nickname: cleanNick(q.get('n')) } : null
}

// The test itself (main page), for "테스트 공유".
export const siteUrl = () => `${location.origin}${BASE}`

// Native share sheet first (KakaoTalk, Messages, etc. show up there on phones);
// otherwise copy the link. Only the link is sent: its preview carries the text.
export async function shareLink(url: string): Promise<'shared' | 'copied' | 'cancelled' | 'failed'> {
  if (navigator.share) {
    try {
      await navigator.share({ url })
      return 'shared'
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'cancelled'
    }
  }
  return copyLink(url)
}

export async function copyLink(url: string): Promise<'copied' | 'failed'> {
  try {
    await navigator.clipboard.writeText(url)
    return 'copied'
  } catch {
    // In-app browsers (KakaoTalk, Instagram) often block the clipboard API.
    const ta = document.createElement('textarea')
    ta.value = url
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    ta.setSelectionRange(0, url.length)
    const ok = document.execCommand('copy')
    ta.remove()
    return ok ? 'copied' : 'failed'
  }
}
