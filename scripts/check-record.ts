import { MOST_WANTED, SPECIES } from '../src/data/species'
import { EN_TEXT, SPECIES_EN } from '../src/data/species.en'
import { localizeRecord, makeRecord } from '../src/lib/record'
import { zodiacIndex } from '../src/lib/zodiac'

// Sign boundaries. The real crossing moves by a day between years, so these cases
// (well away from noon KST) check the computed Sun position, not a fixed table.
//   2000-03-20 07:35 UTC Aries, 2023-09-23 06:50 UTC Libra,
//   2023-12-22 03:27 UTC Capricorn, 2024-06-20 20:51 UTC Cancer.
const cases: [string, string][] = [
  ['2000-03-20', 'PISCES'], ['2000-03-21', 'ARIES'],
  ['2023-09-23', 'VIRGO'], ['2023-09-24', 'LIBRA'],
  ['2023-12-22', 'SAGITTARIUS'], ['2023-12-23', 'CAPRICORN'],
  ['2024-06-20', 'GEMINI'], ['2024-06-21', 'CANCER'],
  ['1995-01-01', 'CAPRICORN'], ['1995-08-30', 'VIRGO'],
]
for (const [birth, want] of cases) {
  const [y, m, d] = birth.split('-').map(Number)
  const got = SPECIES[zodiacIndex(y, m, d)].origin.en
  if (got !== want) console.log(`FAIL ${birth}: ${got} (want ${want})`)
}
console.log('zodiac boundaries checked')

const count = (map: Map<string, number>, k: string) => map.set(k, (map.get(k) ?? 0) + 1)
const species = new Map<string, number>(), crimes = new Map<string, number>(), versions = new Map<string, number>()
const start = Date.UTC(1960, 0, 1)
const N = 20000
for (let i = 0; i < N; i++) {
  const r = makeRecord(new Date(start + i * 86400000).toISOString().slice(0, 10))
  count(species, r.species.name)
  count(crimes, r.crime.name)
  count(versions, String(r.species.symptoms.indexOf(r.symptoms)))
}
console.log('species', Object.fromEntries([...species].map(([k, v]) => [k, `${((v / N) * 100).toFixed(1)}%`])))
const cv = [...crimes.values()]
console.log('crimes used', cv.length, 'min', Math.min(...cv), 'max', Math.max(...cv))
console.log('symptom versions', Object.fromEntries(versions))
const a = makeRecord('1995-03-14')
console.log(a.species.origin.name, '/', a.species.name, '/', a.crime.name, '/', a.verdict)
console.log(JSON.stringify(a) === JSON.stringify(makeRecord('1995-03-14')) ? 'deterministic OK' : 'FAIL')

// English: the text must line up one to one with the Korean, so the same birthday gets the
// same species, crime and symptoms. Titles must fit one line on the card.
const bad: string[] = []
if (EN_TEXT.species.length !== SPECIES.length) bad.push(`species ${EN_TEXT.species.length}`)
if (EN_TEXT.mostWanted.length !== MOST_WANTED.length) bad.push(`most wanted ${EN_TEXT.mostWanted.length}`)
SPECIES.forEach((s, i) => {
  const e = EN_TEXT.species[i]
  if (!e) return
  if (e.crimes.length !== s.crimes.length) bad.push(`${e.name} crimes ${e.crimes.length}`)
  if (e.merits.length !== s.merits.length) bad.push(`${e.name} merits ${e.merits.length}`)
  if (e.symptoms.length !== s.symptoms.length || e.symptoms.some((v, j) => v.length !== s.symptoms[j].length))
    bad.push(`${e.name} symptoms`)
})
for (const c of [...EN_TEXT.species.flatMap((s) => s.crimes), ...EN_TEXT.mostWanted])
  if (c.title.length > 20) bad.push(`title too long: ${c.title}`)
for (let i = 0; i < N; i++) {
  const ko = makeRecord(new Date(start + i * 86400000).toISOString().slice(0, 10))
  const en = localizeRecord(ko, 'en')
  if (!en.crime || !en.symptoms || SPECIES_EN.indexOf(en.species) !== SPECIES.indexOf(ko.species)) {
    bad.push(`no English for ${ko.birth}`)
    break
  }
}
const e = localizeRecord(a, 'en')
console.log(e.species.name, '/', e.crime.name, '/', e.verdict)
console.log(bad.length ? `English FAIL: ${bad.join(', ')}` : 'English lines up OK')
