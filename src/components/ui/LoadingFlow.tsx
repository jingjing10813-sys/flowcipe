'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  '목표 분석 중...',
  '태스크 분해 중...',
  'AI 처리 중...',
  '프롬프트 생성 중...',
]

export function LoadingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
useEffect(() => {
    const timings = [600, 900, 500]
    let idx = 0
    const advance = () => {
      if (idx < timings.length) {
        setTimeout(() => {
          setCurrentStep(idx + 1)
          idx++
          advance()
        }, timings[idx])
      }
    }
    advance()
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-[#F5F6F8] dark:bg-[#0f0f0f] lg:left-[72px] top-[60px] bottom-[60px] lg:bottom-0 flex items-center justify-center px-5 sm:px-8">
      <div className="w-full max-w-[900px] flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center">

        {/* Left */}
        <div className="flex-1 min-w-0">
          {/* Headline */}
          <h2 className="text-[26px] sm:text-[36px] font-bold text-gray-900 dark:text-[#f5f5f5] leading-tight tracking-tight mb-3">
            레시피를 조합하는 중...
          </h2>
          <p className="text-[14px] text-gray-400 dark:text-[#737373] leading-relaxed mb-10 max-w-[420px]">
            AI가 실행 가능한 워크플로우로 설계하고 있습니다.<br />잠시만 기다려 주세요.
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-2.5">
            {STEPS.map((label, i) => {
              const isDone = i < currentStep
              const isActive = i === currentStep
              const isPending = i > currentStep

              return (
                <div
                  key={label}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-[12px] transition-all duration-300 ${
                    isActive
                      ? 'step-active-border shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]'
                      : 'bg-transparent'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isDone
                      ? 'bg-gray-900 dark:bg-white'
                      : isActive
                      ? 'bg-gray-100 dark:bg-[#2a2a2a]'
                      : 'border-2 border-gray-200 dark:border-[#2a2a2a]'
                  }`}>
                    {isDone && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white dark:text-gray-900">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    )}
                  </div>

                  <span className={`text-[14px] font-medium transition-colors ${
                    isDone
                      ? 'text-gray-400 dark:text-[#525252]'
                      : isActive
                      ? 'text-gray-900 dark:text-[#f5f5f5]'
                      : 'text-gray-300 dark:text-[#404040]'
                  } ${isPending ? 'opacity-50' : ''}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>


      </div>
    </div>
  )
}
