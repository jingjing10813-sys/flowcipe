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
    const timings = [300, 700, 400]
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
    <div className="flex flex-col gap-2 py-4">
      {STEPS.map((label, i) => {
        const isDone = i < currentStep
        const isActive = i === currentStep

        return (
          <div
            key={label}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-300
              ${isActive ? 'bg-white shadow-sm' : ''}
            `}
          >
            {/* Icon */}
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
              isDone
                ? 'bg-gray-900'
                : isActive
                ? 'border-2 border-gray-400'
                : 'border-2 border-gray-200'
            }`}>
              {isDone && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              )}
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
              )}
            </div>

            <span className={`text-sm font-medium transition-colors ${
              isDone ? 'text-gray-400' : isActive ? 'text-gray-900' : 'text-gray-300'
            }`}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
