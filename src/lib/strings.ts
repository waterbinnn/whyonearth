// UI text for both languages. Components read the current language's set through `t`
// (src/lib/locale.ts). Mono labels in capitals (DECLASSIFIED, / CHARGE ...) stay in the
// components: they are English in both versions.
import type { Species } from '../data/species'
import { SITE, type Lang } from './copy'

// Korean particles that change with the last syllable: 은/는, 이었다/였다.
const hasFinal = (word: string) => (word.charCodeAt(word.length - 1) - 0xac00) % 28 !== 0
const topic = (word: string) => (hasFinal(word) ? '은' : '는')
const copula = (word: string) => (hasFinal(word) ? '이었다' : '였다')
const article = (word: string) => (/^[AEIOU]/i.test(word) ? 'an' : 'a')

// Usual birthday range of each sign, for display only (see SIGN_DATES in zodiac.ts).
const SIGN_DATES_EN = [
  'Mar 21 – Apr 19', 'Apr 20 – May 20', 'May 21 – Jun 21', 'Jun 22 – Jul 22', 'Jul 23 – Aug 22', 'Aug 23 – Sep 22',
  'Sep 23 – Oct 22', 'Oct 23 – Nov 22', 'Nov 23 – Dec 21', 'Dec 22 – Jan 19', 'Jan 20 – Feb 18', 'Feb 19 – Mar 20',
]

const ko = {
  site: SITE.ko,
  otherLang: 'ENGLISH',
  // main
  title: ['당신은 왜', '지구에 있습니까?'],
  openMine: '내 수감 기록 열람하기',
  roswell: '로스웰에서 무슨 일이 있었나',
  speciesIndex: '외계인 종족 도감',
  notStored: '입력값은 서버에 저장되지 않습니다',
  // form
  formTitle: '이번 생의 생년월일을 입력하세요',
  formNote: '양력 기준입니다. 같은 생일이면 언제나 같은 기록이 나옵니다.',
  year: '태어난 해',
  month: '태어난 달',
  day: '태어난 날',
  nameLabel: '이름 (선택)',
  namePlaceholder: '이름',
  badDate: 'ERR: 존재하지 않는 날짜입니다. 다시 입력해 주세요.',
  submit: '기록 복원 시작',
  // result
  sharedHint: '생년월일만 넣으면 당신의 죄목이 나옵니다.',
  shareTitle: '결과 공유',
  saveImage: '결과 이미지 저장',
  makingImage: '이미지 만드는 중…',
  shareResult: '결과 공유하기',
  another: '다른 생일 열람하기',
  sendTest: '친구에게 테스트 보내기',
  copied: '링크를 복사했습니다',
  copyFailed: '링크를 복사하지 못했습니다',
  // species index
  indexMine: '나의 종족',
  indexShared: '이 기록',
  backToRecord: '수감 기록으로 돌아가기',
  backToStart: '처음으로',
  indexIntro: '지구에 갇힌 자들은 모두 이 열두 종족 중 하나에서 왔다. 어느 종족이었는지는 이번 생의 생일 별자리가 알려 준다.',
  signLine: (s: Species, _i: number, dates: string) => `${s.origin.name} ${dates} 무렵`,
  findMine: '내 종족 찾기',
  // card
  speciesSub: '종족',
  nameNote: '이번 생의 이름',
  rebirthNote: '환생 횟수',
  wantedNote: '우주 최고 수배범',
  chargeSub: ' 죄명',
  stamp: '기억 삭제 완료',
  // report
  incident: '사건 경위서',
  beforeEarthTitle: (s: Species) => `지구 이전 기록: ${s.name}`,
  beforeEarth: (s: Species) => `지구에 오기 전 당신은 ${s.name}${copula(s.name)}. ${s.name}${topic(s.name)} ${s.lore}`,
  soulTitle: '영혼에 남은 당신',
  soulLead: '기억은 지워져도 당신은 그대로다.',
  matchTitle: '외계인 종족 궁합',
  best: '가장 잘 맞는 종족',
  worst: '가장 안 맞는 종족',
  allSpecies: '외계인 12종족 전체 보기 >',
  // story image
  storyTitle: ['당신은 무슨 죄로', '지구에 왔을까?'],
  tagline: '별자리 외계 사주',
  // intro
  intro: [
    ['1947년 7월, 뉴멕시코 사막에 무언가가 추락했다.', '잔해 속 생존자는 사람이 아니었다.'],
    ['생존자는 군 기지로 옮겨졌다.', '그리고 한 간호사에게 지구의 비밀을 알려 주었다.'],
    ['지구는 우주의 감옥이다.', '우주에서 죄를 지은 외계인의 영혼이 기억을 지운 채 이곳에 갇힌다.', '당신도 그중 하나다.'],
  ],
  close: '닫기 ✕',
  introCredit: '1947년 로스웰 외계인 추락 사건을 바탕으로 각색',
  next: '다음 →',
  done: '돌아가기 →',
}

export type Strings = typeof ko

const en: Strings = {
  site: SITE.en,
  otherLang: '한국어',
  title: ['Why are you', 'on Earth?'],
  openMine: 'Open my prison file',
  roswell: 'What happened at Roswell',
  speciesIndex: 'Alien species index',
  notStored: 'NOTHING YOU ENTER IS STORED',
  formTitle: 'When were you born this time?',
  formNote: 'Same birthday, same record. Every time.',
  year: 'Birth year',
  month: 'Birth month',
  day: 'Birth day',
  nameLabel: 'NAME (OPTIONAL)',
  namePlaceholder: 'Name',
  badDate: 'ERR: That date does not exist. Try again.',
  submit: 'Restore my record',
  sharedHint: 'One birthday is all it takes to find your crime.',
  shareTitle: 'SHARE',
  saveImage: 'Save result image',
  makingImage: 'Making image…',
  shareResult: 'Share my result',
  another: 'Try another birthday',
  sendTest: 'Send this test to a friend',
  copied: 'Link copied',
  copyFailed: 'Could not copy the link',
  indexMine: 'YOURS',
  indexShared: 'THIS FILE',
  backToRecord: 'Back to the prison file',
  backToStart: 'Back to start',
  indexIntro:
    'Everyone locked up on Earth came from one of these twelve species. Which one you were is written in the star sign of this life’s birthday.',
  signLine: (s: Species, i: number) => `${s.origin.en} · ${SIGN_DATES_EN[i]}`,
  findMine: 'Find my species',
  speciesSub: '',
  nameNote: 'this life',
  rebirthNote: 'lives served',
  wantedNote: 'most wanted',
  chargeSub: '',
  stamp: 'CASE CLOSED',
  incident: 'Incident report',
  beforeEarthTitle: (s: Species) => `Record before Earth: ${s.name}`,
  beforeEarth: (s: Species) => `Before Earth, you were ${article(s.name)} ${s.name}. ${s.lore}`,
  soulTitle: 'What your soul kept',
  soulLead: 'The memory is gone. You are not.',
  matchTitle: 'Species match',
  best: 'BEST MATCH',
  worst: 'WORST MATCH',
  allSpecies: 'See all 12 species >',
  storyTitle: ['What did you do', 'to end up on Earth?'],
  tagline: 'Your zodiac alien rap sheet',
  intro: [
    ['July 1947. Something fell out of the sky over the New Mexico desert.', 'The survivor in the wreckage was not human.'],
    ['The survivor was taken to an army airfield.', 'There, it told one nurse the truth about Earth.'],
    [
      'Earth is a prison.',
      'Aliens who commit crimes in space are locked up here, their memories wiped.',
      'You are one of them.',
    ],
  ],
  close: 'CLOSE ✕',
  introCredit: 'Loosely based on the 1947 Roswell UFO incident',
  next: 'Next →',
  done: 'Back →',
}

export const STRINGS: Record<Lang, Strings> = { ko, en }
