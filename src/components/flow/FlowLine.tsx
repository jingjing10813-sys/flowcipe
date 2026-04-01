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
  // 현재 활성 단계 index
  const activeIndex = steps.findIndex((_, i) => getStepStatus(i) === 'active')

  // 완료된 세그먼트 수 (0 ~ N-1)
  const completedSegments = doneCount
  // 진행중 단계가 있으면 0.5 세그먼트 추가 (active 노드 중간까지)
  const progressFraction = (completedSegments + (activeIndex >= 0 && activeIndex > 0 ? 0.5 : 0)) / (N - 1)

  return (
    <div className="mb-10 select-none">

      {/* ── 이름 행 ── */}
      <div className="flex mb-3">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isActive = status === 'active'
          const isDone = status === 'done'
          return (
            <div
              key={step.id}
              className="text-center"
              style={{ width: `${100 / N}%` }}
            >
              <span className={`text-[12px] leading-tight line-clamp-2 transition-all
                ${isActive ? 'font-bold text-gray-900' : isDone ? 'font-medium text-gray-500' : 'font-medium text-gray-300'}
              `}>
                {step.title}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── 원 + 가로선 행 ── */}
      <div className="relative flex items-center">

        {/* 배경 선 — 첫 원 중심 ~ 마지막 원 중심 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-gray-100 rounded-full"
          style={{ left: `${50 / N}%`, right: `${50 / N}%` }}
        />

        {/* 진행 채움 선 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-gray-900 rounded-full transition-all duration-700"
          style={{
            left: `${50 / N}%`,
            width: `calc((100% - ${100 / N}%) * ${Math.min(progressFraction, 1)})`,
          }}
        />

        {/* 원 노드들 */}
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isActive = status === 'active'
          const isDone = status === 'done'
          const isPending = status === 'pending'

          return (
            <div
              key={step.id}
              className="relative z-10 flex justify-center"
              style={{ width: `${100 / N}%` }}
            >
              <button
                onClick={() => !isPending && onStepClick(index)}
                disabled={isPending}
                className={`flex flex-col items-center ${isPending ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {/* 원 */}
                <div className={`
                  relative rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive ? 'w-11 h-11 bg-gray-900 ring-4 ring-gray-200 shadow-lg' : ''}
                  ${isDone  ? 'w-9 h-9 bg-gray-900' : ''}
                  ${isPending ? 'w-8 h-8 bg-white border-2 border-gray-200' : ''}
                `}>
                  {isDone && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  )}
                  {isActive && (
                    <span className="text-base">{step.tool.icon}</span>
                  )}
                  {isPending && (
                    <span className="text-[11px] font-bold text-gray-300">{index + 1}</span>
                  )}
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* ── 상태 텍스트 행 ── */}
      <div className="flex mt-2.5">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const isActive = status === 'active'
          const isDone = status === 'done'
          return (
            <div
              key={step.id}
              className="text-center"
              style={{ width: `${100 / N}%` }}
            >
              {isDone && (
                <span className="text-[11px] font-semibold text-gray-400">완료</span>
              )}
              {isActive && (
                <span className="text-[11px] font-semibold text-gray-900">진행 중</span>
              )}
              {status === 'pending' && (
                <span className="text-[11px] text-gray-200">{step.tool.name}</span>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
