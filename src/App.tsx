import { useEffect, useRef, useState } from 'react'
import { PrisonCard } from './components/PrisonCard'
import { Report } from './components/Report'
import { BirthForm, Btn, Main, RecoveryLog } from './components/Screens'
import { StoryIntro } from './components/StoryIntro'
import { CardSheet, StoryFrame } from './components/StoryFrame'
import { TripBackground } from './components/TripBackground'
import { nodeToFile, shareOrDownload } from './lib/exportImage'
import { makeRecord, type PrisonRecord } from './lib/record'
import { copyLink, encodeBirth, KAKAO_KEY, preloadKakao, readSharedRecord, shareKakao, shareLink, shareLinkUrl, shareUrl } from './lib/share'

type Step = 'story' | 'main' | 'form' | 'recovering' | 'result'

// A shared link (?r=...) opens straight to that record. If this tab made that record
// itself (a reload), show it as the owner's result rather than a friend's.
const shared = readSharedRecord()
const MINE_KEY = 'isbe-mine'
const readMine = () => {
  try {
    return sessionStorage.getItem(MINE_KEY)
  } catch {
    return null
  }
}
const ownsShared = !!shared && readMine() === encodeBirth(shared.birth)

export function App() {
  const [step, setStep] = useState<Step>(shared ? 'result' : 'story')
  const [record, setRecord] = useState<PrisonRecord | null>(shared ? makeRecord(shared.birth) : null)
  const [nickname, setNickname] = useState(shared?.nickname ?? '')
  const [isShared, setIsShared] = useState(!!shared && !ownsShared)
  const [burst, setBurst] = useState(false)

  // Keep the address bar pointing at the current record so it can be copied or reloaded.
  useEffect(() => {
    const url = step === 'result' && record ? shareUrl(record.birth, nickname) : '/'
    if (url !== location.href) history.replaceState(null, '', url)
  }, [step, record, nickname])

  const reveal = () => {
    setBurst(true)
    setTimeout(() => setStep('result'), 450)
    setTimeout(() => setBurst(false), 1700)
  }

  return (
    <main className="relative min-h-dvh">
      <TripBackground burst={burst} throb={step === 'recovering'} />
      {step === 'story' && <StoryIntro onDone={() => setStep('main')} />}
      {step === 'main' && <Main onStart={() => setStep('form')} onReplay={() => setStep('story')} />}
      {step === 'form' && (
        <BirthForm
          onSubmit={(birth, nick) => {
            setRecord(makeRecord(birth))
            setNickname(nick)
            setIsShared(false)
            try {
              sessionStorage.setItem(MINE_KEY, encodeBirth(birth))
            } catch {}
            setStep('recovering')
          }}
        />
      )}
      {step === 'recovering' && record && <RecoveryLog record={record} onDone={reveal} />}
      {step === 'result' && record && (
        <Result
          record={record}
          nickname={nickname}
          isShared={isShared}
          onAgain={() => setStep('form')}
          onMine={() => setStep('story')}
        />
      )}
    </main>
  )
}

type ResultProps = {
  record: PrisonRecord
  nickname: string
  isShared: boolean
  onAgain: () => void
  onMine: () => void
}

function Result({ record, nickname, isShared, onAgain, onMine }: ResultProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const [files, setFiles] = useState<{ card: File; story: File } | null>(null)
  const [toast, setToast] = useState('')

  // Build both images up front so sharing happens right inside the tap (iOS needs that).
  useEffect(() => {
    let alive = true
    const name = `whyonearth-${record.inmateNo}`
    const t = setTimeout(async () => {
      const card = await nodeToFile(cardRef.current!, `${name}-card.png`)
      const story = await nodeToFile(storyRef.current!, `${name}-story.png`)
      if (alive) setFiles({ card, story })
    }, 600)
    preloadKakao()
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [record])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const url = shareLinkUrl(record.birth, nickname)
  const text = `${record.crime.act} 죄로 지구에 갇혔다고 한다. 당신은 무슨 죄로 왔을까?`
  const say = (r: string) => r === 'copied' ? setToast('링크를 복사했습니다') : r === 'failed' && setToast('링크를 복사하지 못했습니다')

  const onKakao = async () => {
    if (!(await shareKakao(url))) say(await shareLink(url, text))
  }

  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-[calc(var(--col)+2*var(--gutter))] flex-col items-center gap-4 gutter py-6">
      <div className="self-start font-mono fs-11 text-gray">
        {isShared ? 'SHARED RECORD ..... 친구가 공유한 수감 기록' : 'RECORD RESTORED ..... ?>'}
      </div>
      <div className="glitch-in flex w-full justify-center [zoom:var(--card-zoom)]">
        <PrisonCard record={record} nickname={nickname} />
      </div>

      {isShared ? (
        <div className="flex w-full max-w-[var(--col)] flex-col gap-2">
          <Btn onClick={onMine}>내 수감 기록 열람하기</Btn>
          <p className="text-center font-pixel fs-11 text-gray break-keep">생년월일만 넣으면 당신의 죄목이 나옵니다.</p>
        </div>
      ) : (
        <div className="grid w-full max-w-[var(--col)] grid-cols-2 gap-2">
          {KAKAO_KEY ? (
            <Btn onClick={onKakao}>카카오톡 공유</Btn>
          ) : (
            <Btn onClick={async () => say(await shareLink(url, text))}>링크 공유</Btn>
          )}
          <Btn disabled={!files} onClick={() => files && shareOrDownload(files.story)}>
            {files ? '인스타 스토리' : '인화 중…'}
          </Btn>
          <Btn tone="ghost" disabled={!files} onClick={() => files && shareOrDownload(files.card)}>
            {files ? '카드 이미지 저장' : '인화 중…'}
          </Btn>
          <Btn tone="ghost" onClick={async () => say(await copyLink(url))}>
            링크 복사
          </Btn>
        </div>
      )}

      <div className="mt-6 w-full max-w-[var(--col)]">
        <Report record={record} />
      </div>
      <div className="mt-6 flex w-full max-w-[var(--col)] flex-col items-center gap-3 border-t border-dashed border-paper/20 pt-6">
        {isShared ? (
          <Btn className="w-full" onClick={onMine}>
            내 수감 기록 열람하기
          </Btn>
        ) : (
          <>
            <p className="text-center font-pixel fs-11 leading-relaxed text-gray break-keep">
              같은 생일이면 언제나 같은 기록이 나옵니다. 친구는 무슨 죄로 왔는지 확인해 보세요.
            </p>
            <button className="font-pixel fs-12 text-fog underline underline-offset-4 hover:text-paper" onClick={onAgain}>
              다른 생일 열람하기
            </button>
          </>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-paper px-4 py-2 font-pixel fs-12 text-ink">
          {toast}
        </div>
      )}

      {/* Off-screen copies with a frozen portrait, used only for image export. */}
      <div aria-hidden style={{ position: 'fixed', left: -10000, top: 0, pointerEvents: 'none' }}>
        <CardSheet ref={cardRef} record={record} nickname={nickname} />
        <StoryFrame ref={storyRef} record={record} nickname={nickname} />
      </div>
    </section>
  )
}
