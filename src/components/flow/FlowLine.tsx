'use client'

import { Step, StepStatus } from '@/types/flow'

interface FlowLineProps {
  steps: Step[]
  getStepStatus: (index: number) => StepStatus
  onStepClick: (index: number) => void
}

export function FlowLine({ steps, getStepStatus, onStepClick }: FlowLineProps) {
  const N = steps.length
  const doneCount = steps.filter((_, i) => getStepStatus(i) === 'done').length
  const progressFraction = N > 1 ? doneCount / (N - 1) : 0

  return (
    <div className="mb-10 select-none">

      {/* 1행: 단계 타이틀 — 고정 높이 */}
      <div className="flex mb-3">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isActive = status === 'active'
          const isDone = status === 'done'
          return (
            <div key={step.id} className="flex justify-center" style={{ width: `${100 / N}%` }}>
              <p className={`text-[10px] sm:text-[11px] leading-tight text-center line-clamp-2 px-0.5 h-[30px] flex items-end justify-center transition-all
                ${isActive  ? 'font-bold text-gray-900 dark:text-[#f5f5f5]' : ''}
                ${isDone    ? 'font-medium text-gray-400 dark:text-[#737373]' : ''}
                ${!isActive && !isDone ? 'font-medium text-gray-400 dark:text-[#525252]' : ''}
              `}>
                {step.title}
              </p>
            </div>
          )
        })}
      </div>

      {/* 2행: 선 + 원 — h-8 고정으로 선이 항상 원 중앙 통과 */}
      <div className="relative flex items-center h-8">

        {/* 배경 선 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-gray-200 dark:bg-[#2a2a2a] rounded-full"
          style={{ left: `${50 / N}%`, right: `${50 / N}%` }}
        />
        {/* 진행 채움 선 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-gray-900 dark:bg-white rounded-full transition-all duration-700 ease-out"
          style={{
            left: `${50 / N}%`,
            width: `calc((100% - ${100 / N}%) * ${Math.min(progressFraction, 1)})`,
          }}
        />

        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isActive = status === 'active'
          const isDone = status === 'done'
          const isPending = status === 'pending'

          return (
            <div key={step.id} className="relative z-10 flex justify-center" style={{ width: `${100 / N}%` }}>
              <button
                onClick={() => onStepClick(index)}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 cursor-pointer hover:scale-110
                  ${isActive  ? 'bg-gray-900 dark:bg-white ring-4 ring-gray-100 dark:ring-white/10 shadow-sm' : ''}
                  ${isDone    ? 'bg-gray-900 dark:bg-white' : ''}
                  ${isPending ? 'bg-white dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-white/[0.12]' : ''}
                `}
              >
                {isDone && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white dark:text-gray-900">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                )}
                {isActive && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white dark:text-gray-900">
                    <polyline points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
                  </svg>
                )}
                {isPending && (
                  <span className="text-[11px] font-bold text-gray-300 dark:text-[#525252]">{index + 1}</span>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* 3행: 상태 텍스트 */}
      <div className="flex mt-2.5">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isActive = status === 'active'
          const isDone = status === 'done'
          const isPending = status === 'pending'
          return (
            <div key={step.id} className="flex justify-center" style={{ width: `${100 / N}%` }}>
              <p className={`text-[10px] font-semibold transition-all
                ${isActive  ? 'text-gray-900 dark:text-[#f5f5f5]' : ''}
                ${isDone    ? 'text-gray-400 dark:text-[#737373]' : ''}
                ${isPending ? 'text-gray-300 dark:text-[#525252]' : ''}
              `}>
                {isDone ? '완료' : isActive ? '진행 중' : step.tool.name}
              </p>
            </div>
          )
        })}
      </div>

    </div>
  )
}
