// Shared site copy: the main page, link previews (index.html, en/index.html, api/s.ts) all say
// the same thing. The two HTML files repeat these strings by hand because they are static.
// No browser globals here: api/ imports this too.

export type Lang = 'ko' | 'en'

export const SITE: Record<Lang, { title: string; desc: string }> = {
  ko: {
    title: '당신은 왜 지구에 있습니까?',
    desc: '우주에서 사고를 친 자들은 기억이 지워진 채 지구에 갇혔습니다. 기억은 지워져도 버릇은 남습니다. 생년월일을 넣으면 당신이 지구 이전의 삶에서 지은 죄를 찾아 드립니다.',
  },
  en: {
    title: 'Why are you on Earth?',
    desc: 'Those who caused trouble in space were locked up on Earth with their memories wiped. The memories are gone. The habits stayed. Enter your birthday and we will pull up the crime you committed before this life.',
  },
}

// The one-line verdict on the card, built from the crime's `act`.
export const verdict = (lang: Lang, act: string) =>
  lang === 'en' ? `Memory wiped and sentenced to Earth for ${act}.` : `${act} 죄로 기억이 지워진 채 지구에 갇힘.`

// Text on the share preview image (api/og.ts).
export const OG: Record<Lang, { charge: string; cta: string }> = {
  ko: { charge: '/ CHARGE ..... 죄명', cta: '당신은 왜 지구에 있습니까? →' },
  en: { charge: '/ CHARGE', cta: 'Why are you on Earth? →' },
}
