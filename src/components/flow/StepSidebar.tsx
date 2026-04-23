'use client'

import { Step, StepStatus } from '@/types/flow'
import { ToolIcon } from '@/components/ui/ToolIcon'

interface StepSidebarProps {
  steps: Step[]
  getStepStatus: (index: number) => StepStatus
  onStepClick: (index: number) => void
  estimatedTime: string
  onNext?: () => void
  canGoNext?: boolean
  isFlowComplete?: boolean

  completedCount?: number
}

const NUDGE_MESSAGES = [
  '첫 번째 단계부터 시작해볼까요?',
  '좋아요, 계속 이어가세요!',
  '절반을 넘었어요, 잘 하고 있어요!',
  '거의 다 왔어요, 조금만 더!',
]

export function StepSidebar({
  steps,
  getStepStatus,
  onStepClick,
  estimatedTime,
  onNext,
  canGoNext,
  isFlowComplete,
  completedCount = 0,
}: StepSidebarProps) {
  const total = steps.length
  const progress = isFlowComplete ? 100 : Math.round((completedCount / total) * 100)
  const nudgeIndex = isFlowComplete
    ? 3
    : Math.min(Math.floor((completedCount / total) * NUDGE_MESSAGES.length), NUDGE_MESSAGES.length - 1)
  const nudgeText = isFlowComplete ? '모든 단계를 완료했어요!' : NUDGE_MESSAGES[nudgeIndex]

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/[0.08]">
      <div className="px-5 pt-5 pb-1">
        <p className="text-[10px] font-bold text-gray-400 dark:text-[#737373] uppercase tracking-wider mb-5">
          진행 현황
        </p>
        <div className="flex flex-col">
          {steps.map((step, i) => {
            const status = getStepStatus(i)
            const isDone = status === 'done'
            const isActive = status === 'active'
            const isLast = i === steps.length - 1

            return (
              <button
                key={step.id}
                onClick={() => onStepClick(i)}
                className="flex gap-3 text-left hover:opacity-75 transition-opacity"
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-gray-900 dark:bg-zinc-400'
                      : isActive
                      ? 'bg-gray-900 dark:bg-zinc-200'
                      : 'bg-white dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-white/[0.12]'
                  }`}>
                    {isDone ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-white dark:text-gray-900">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                    ) : (
                      <span className={`text-[11px] font-bold leading-none ${
                        isActive ? 'text-white dark:text-gray-900' : 'text-gray-400 dark:text-[#525252]'
                      }`}>{i + 1}</span>
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-[2px] h-7 my-1 rounded-full transition-all ${
                      isDone ? 'bg-gray-800 dark:bg-zinc-500' : 'bg-gray-100 dark:bg-zinc-800'
                    }`} />
                  )}
                </div>

                <div className={`pt-1 ${isLast ? 'pb-0' : 'pb-8'}`}>
                  <p className={`text-[13px] font-semibold leading-snug transition-colors ${
                    isActive
                      ? 'text-gray-900 dark:text-white'
                      : isDone
                      ? 'text-gray-400 dark:text-[#737373] line-through'
                      : 'text-gray-300 dark:text-[#525252]'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`flex items-center gap-1 text-[11px] mt-0.5 ${
                    isActive ? 'text-gray-500 dark:text-[#a3a3a3]' : 'text-gray-200 dark:text-[#404040]'
                  }`}>
                    <ToolIcon name={step.tool.name} size={11} />
                    {step.tool.name}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-5 pt-4 pb-5 border-t border-gray-50 dark:border-white/[0.06] mt-2 space-y-3">
        {/* 진행률 바 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-[#737373]">{nudgeText}</span>
            <span className="text-[11px] font-bold text-gray-400 dark:text-[#525252]">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 dark:bg-zinc-200 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-[#737373]">
          <span>⏱ {estimatedTime}</span>
          <span>{completedCount}/{total}단계 완료</span>
        </div>

        {!isFlowComplete && (
          <button
            onClick={onNext}
            className={`w-full py-3 rounded-[12px] text-[13px] font-semibold transition-all ${
              canGoNext
                ? 'bg-gray-900 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-300 active:scale-[0.98] cta-pulse'
                : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-300 dark:text-[#404040]'
            }`}
          >
            다음 단계 →
          </button>
        )}
      </div>
    </div>
  )
}
