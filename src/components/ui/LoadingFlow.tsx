'use client'

import { useEffect, useRef, useState } from 'react'

const STEPS = [
  { no: 'STEP 1', label: '목표 분석', active: '분석 중' },
  { no: 'STEP 2', label: '태스크 분해', active: '분해 중' },
  { no: 'STEP 3', label: 'AI 처리', active: '처리 중' },
  { no: 'STEP 4', label: '레시피 생성', active: '생성 중' },
]

interface LoadingFlowProps {
  onComplete?: () => void
  done?: boolean
}

export function LoadingFlow({ onComplete, done }: LoadingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const onCompleteRef = useRef(onComplete)
  const doneRef = useRef(done ?? false)
  onCompleteRef.current = onComplete
  doneRef.current = done ?? false

  useEffect(() => {
    const timings = [700, 1000, 600]
    let idx = 0
    let cancelled = false

    const advance = () => {
      if (idx < timings.length) {
        setTimeout(() => {
          if (cancelled) return
          setCurrentStep(s => s + 1)
          idx++
          advance()
        }, timings[idx])
      } else {
        // step 4 활성화 — done 될 때까지 폴링
        const waitForDone = () => {
          if (cancelled) return
          if (doneRef.current) {
            setTimeout(() => {
              if (cancelled) return
              setCurrentStep(STEPS.length)
              setTimeout(() => onCompleteRef.current?.(), 400)
            }, 800)
          } else {
            setTimeout(waitForDone, 100)
          }
        }
        waitForDone()
      }
    }
    advance()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F6F8] dark:bg-[#0a0a0f] lg:left-[72px] top-[60px] lg:bottom-0 flex flex-col items-center justify-center px-5 sm:px-8">

      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-[22px] sm:text-[30px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight mb-2">
          레시피를 조합하는 중...
        </h2>
        <p className="text-[13px] sm:text-[14px] text-gray-400 dark:text-[#737373]">
          AI가 실행 가능한 워크플로우로 설계하고 있습니다. 잠시만 기다려 주세요.
        </p>
      </div>

      {/* Vertical steps */}
      <div className="w-full max-w-[380px] bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/[0.07] rounded-2xl px-7 py-7 shadow-sm">
        <div className="flex flex-col">
          {STEPS.map((step, i) => {
            const isDone = i < currentStep
            const isActive = i === currentStep
            const isPending = i > currentStep
            const isLast = i === STEPS.length - 1

            return (
              <div key={i} className="flex gap-4">
                {/* 원 + 세로선 */}
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isDone
                      ? 'bg-gray-900 dark:bg-zinc-400'
                      : isActive
                      ? 'bg-white dark:bg-[#1a1a1a] border-2 border-gray-900 dark:border-white'
                      : 'bg-white dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-white/[0.12]'
                  }`}>
                    {isDone && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-white dark:text-gray-900">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    )}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-zinc-300 animate-pulse" />
                    )}
                    {isPending && (
                      <span className="text-[10px] font-bold text-gray-300 dark:text-[#525252]">{i + 1}</span>
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-[2px] h-8 my-1 rounded-full transition-all duration-300 ${
                      isDone ? 'bg-gray-900 dark:bg-zinc-500' : 'bg-gray-100 dark:bg-zinc-800'
                    }`} />
                  )}
                </div>

                {/* 텍스트 */}
                <div className={`pb-${isLast ? '0' : '0'} flex flex-col justify-center`} style={{ paddingBottom: isLast ? 0 : '2rem' }}>
                  <p className={`text-[13px] font-semibold transition-colors ${
                    isPending ? 'text-gray-300 dark:text-[#525252]' : 'text-gray-900 dark:text-white'
                  }`}>{step.label}</p>
                  <p className={`text-[11px] font-medium mt-0.5 transition-colors ${
                    isDone
                      ? 'text-gray-400 dark:text-gray-500'
                      : isActive
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-300 dark:text-[#525252]'
                  }`}>
                    {isDone ? '완료' : isActive ? step.active : '대기중'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
