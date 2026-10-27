import { MOST_WANTED, SPECIES, type Crime, type Species } from '../data/species'
import { MOST_WANTED_EN, SPECIES_EN } from '../data/species.en'
import { verdict, type Lang } from './copy'
import { zodiacIndex } from './zodiac'
import { hash, pick, rng } from './seed'

export type PrisonRecord = {
  birth: string // YYYY-MM-DD
  seed: number
  inmateNo: string // internal only: export file names and the recovery log
  species: Species
  wanted: boolean // rare "most wanted" crime
  crime: Crime
  verdict: string
  symptoms: string[] // one of the species' symptom versions
  reincarnations: number
}

const LETTERS = 'ABCDEFGHJKLMNPRSTXZ'

export function makeRecord(birth: string): PrisonRecord {
  const [y, m, d] = birth.split('-').map(Number)
  const seed = hash(`is-be:${birth}`)
  const r = rng(seed)

  // The zodiac sign decides the species.
  const species = SPECIES[zodiacIndex(y, m, d)]
  const wanted = r() < 0.06
  const crime = pick(r, wanted ? MOST_WANTED : species.crimes)
  const reincarnations = 80 + Math.floor(r() * 920)
  r() // was the escape rate; still drawn so everyone's later picks stay the same
  const inmateNo = `${String(y).slice(-2)}${String(d).padStart(2, '0')}-${String(m).padStart(2, '0')}${pick(r, LETTERS.split(''))}`

  return {
    birth,
    seed,
    inmateNo,
    species,
    wanted,
    crime,
    verdict: verdict('ko', crime.act),
    reincarnations,
    // Drawn last so adding it did not change anyone's crime or inmate number.
    symptoms: pick(r, species.symptoms),
  }
}

// The same record in another language. The draws above are never repeated: the English
// data has the same order and counts, so each pick maps across by its index.
export function localizeRecord(rec: PrisonRecord, lang: Lang): PrisonRecord {
  if (lang === 'ko') return rec
  const species = SPECIES_EN[SPECIES.indexOf(rec.species)]
  const crime = rec.wanted
    ? MOST_WANTED_EN[MOST_WANTED.indexOf(rec.crime)]
    : species.crimes[rec.species.crimes.indexOf(rec.crime)]
  return {
    ...rec,
    species,
    crime,
    verdict: verdict(lang, crime.act),
    symptoms: species.symptoms[rec.species.symptoms.indexOf(rec.symptoms)],
  }
}

export const recordFor = (birth: string, lang: Lang) => localizeRecord(makeRecord(birth), lang)
