// The page language, decided once at startup. /en/... is English, everything else Korean.
// A bare visit to / (no query) picks English for browsers that don't list Korean, unless the
// visitor already chose with the language switch on the main page.
import { SPECIES } from '../data/species'
import { SPECIES_EN } from '../data/species.en'
import type { Lang } from './copy'
import { recordFor } from './record'
import { STRINGS } from './strings'

const PREF = 'woe-lang'
const EN_PATH = /^\/en(\/|$)/

function detect(): Lang {
  if (EN_PATH.test(location.pathname)) return 'en'
  if (location.pathname !== '/' || location.search) return 'ko'
  let pref: string | null = null
  try {
    pref = localStorage.getItem(PREF)
  } catch {}
  if (pref === 'ko' || pref === 'en') return pref
  return (navigator.languages ?? [navigator.language]).some((l) => l.toLowerCase().startsWith('ko')) ? 'ko' : 'en'
}

export const LANG = detect()
// Path prefix for every link the app makes, so a shared link opens in the same language.
export const BASE = LANG === 'en' ? '/en/' : '/'
if (LANG === 'en' && !EN_PATH.test(location.pathname)) history.replaceState(null, '', BASE)
document.documentElement.lang = LANG

export const t = STRINGS[LANG]
export const SPECIES_L = LANG === 'en' ? SPECIES_EN : SPECIES
export const makeRecordL = (birth: string) => recordFor(birth, LANG)

export function switchLang(to: Lang) {
  try {
    localStorage.setItem(PREF, to)
  } catch {}
  location.assign(to === 'en' ? '/en/' : '/')
}
