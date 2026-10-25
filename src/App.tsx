import { useEffect, useRef, useState } from 'react'
import { PrisonCard } from './components/PrisonCard'
import { Report } from './components/Report'
import { BirthForm, Btn, Main, RecoveryLog } from './components/Screens'
import { StoryIntro } from './components/StoryIntro'
import { StoryFrame } from './components/StoryFrame'
import { TripBackground } from './components/TripBackground'
import { nodeToFile, shareOrDownload } from './lib/exportImage'
import { makeRecord, type PrisonRecord } from './lib/record'
import { encodeBirth, readSharedRecord, shareLink, shareLinkUrl, shareUrl, siteUrl } from './lib/share'

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
  const [step, setStep] = useState<Step>(shared ? 'result' : 'main')
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
          onMine={() => setStep('main')}
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
  const storyRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState<File | null>(null)
  const [toast, setToast] = useState('')

  // Build the story image up front so saving happens right inside the tap (iOS needs that).
  useEffect(() => {
    let alive = true
    const t = setTimeout(async () => {
      const file = await nodeToFile(storyRef.current!, `whyonearth-${record.inmateNo}.png`)
      if (alive) setImage(file)
    }, 600)
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

  // Declassification stamp: today's date plus a case number drawn from the record itself.
  const stamp = `${new Date().toISOString().slice(0, 10).replaceAll('-', '.')} · CASE ${record.inmateNo}`

  const share = async (url: string) => {
    const r = await shareLink(url)
    if (r === 'copied') setToast('링크를 복사했습니다')
    if (r === 'failed') setToast('링크를 복사하지 못했습니다')
  }

  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-[calc(var(--col)+2*var(--gutter))] flex-col items-center gap-4 gutter py-6">
      <div className="flex w-full max-w-[var(--col)] items-center justify-between font-mono fs-10 tracking-wider text-gray">
        <span>
          <span className="text-paper">DECLASSIFIED</span> · {isShared ? 'SHARED RECORD' : 'TOP SECRET // UAP'}
        </span>
        <span>{stamp}</span>
      </div>
      <div className="glitch-in flex w-full justify-center [zoom:var(--card-zoom)]">
        <PrisonCard record={record} nickname={nickname} />
      </div>

      {isShared && (
        <div className="flex w-full max-w-[var(--col)] flex-col gap-2">
          <Btn onClick={onMine}>내 수감 기록 열람하기</Btn>
          <p className="text-center font-pixel fs-11 text-gray break-keep">생년월일만 넣으면 당신의 죄목이 나옵니다.</p>
        </div>
      )}

      <div className="mt-4 w-full max-w-[var(--col)]">
        <Report record={record} />
      </div>
      <div className="mt-6 flex w-full max-w-[var(--col)] flex-col items-center gap-3 border-t border-dashed border-paper/20 pt-6">
        {isShared ? (
          <Btn className="w-full" onClick={onMine}>
            내 수감 기록 열람하기
          </Btn>
        ) : (
          <>
            <div className="flex w-full flex-col gap-2">
              <Btn disabled={!image} onClick={() => image && shareOrDownload(image)}>
                {image ? '이미지 저장' : '이미지 만드는 중…'}
              </Btn>
              <div className="grid grid-cols-2 gap-2">
                <Btn tone="ghost" onClick={() => share(shareLinkUrl(record.birth, nickname))}>
                  결과 공유
                </Btn>
                <Btn tone="ghost" onClick={() => share(siteUrl())}>
                  테스트 공유
                </Btn>
              </div>
              <Btn tone="ghost" onClick={onAgain}>
                다른 생일 열람하기
              </Btn>
            </div>
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
        <StoryFrame ref={storyRef} record={record} nickname={nickname} />
      </div>
    </section>
  )
}
