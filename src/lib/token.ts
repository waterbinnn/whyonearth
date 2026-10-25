// Birth date <-> short URL token (?r=...). Pure, so the share functions in /api can use it.
// The token only scrambles the date; it is not encryption (the card prints the date anyway).

const MASK = 0x2f5a3c

export function encodeBirth(birth: string): string {
  return (Number(birth.replaceAll('-', '')) ^ MASK).toString(36)
}

export function decodeBirth(token: string): string | null {
  if (!/^[0-9a-z]{1,8}$/.test(token)) return null
  const s = String(parseInt(token, 36) ^ MASK)
  if (s.length !== 8) return null
  const birth = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}`
  const d = new Date(`${birth}T00:00:00Z`)
  const ok = !isNaN(+d) && d.toISOString().slice(0, 10) === birth && d.getUTCFullYear() >= 1900 && +d <= Date.now()
  return ok ? birth : null
}

export const NICK_MAX = 12

export const cleanNick = (n: string | null) => (n ?? '').trim().slice(0, NICK_MAX)
