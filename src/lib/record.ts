import { MOST_WANTED, SPECIES, type Crime, type Species } from '../data/species'
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
    verdict: `${crime.act} 죄로 기억이 지워진 채 지구에 갇힘.`,
    reincarnations,
    // Drawn last so adding it did not change anyone's crime or inmate number.
    symptoms: pick(r, species.symptoms),
  }
}
