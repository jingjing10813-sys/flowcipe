'use client'

import { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Flow } from '@/types/flow'
import { useFlowState } from '@/hooks/useFlowState'
import { AppLayout } from '@/components/layout/AppLayout'
import { identifyUser, trackFlowStarted, trackStepCompleted, trackFlowCompleted } from '@/lib/analytics'
import { StepCard } from '@/components/flow/StepCard'
import { StepSidebar } from '@/components/flow/StepSidebar'
import { NextActionBlock } from '@/components/flow/NextActionBlock'
import { SaveFloatingButton } from '@/components/flow/SaveFloatingButton'

const DIFFICULTY_COLOR: Record<string, string> = {
  '입문': 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30',
  '중급': 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30',
  '고급': 'text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
}

interface FlowPageClientProps {
  flow: Flow
}

export function FlowPageClient({ flow }: FlowPageClientProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const {
    getStepStatus,
    goToStep,
    completeCurrentStep,
    markStepCopied,
    copiedSteps,
    currentStepIndex,
    isFlowComplete,
    resetFlow,
    completedSteps,
  } = useFlowState(flow.steps.length)

  const trackedSteps = useRef<Set<number>>(new Set())
  const flowStartTracked = useRef(false)
  const userId = session?.user?.email ?? undefined
  const diffColor = DIFFICULTY_COLOR[flow.difficulty] ?? 'text-gray-500 bg-gray-100'
  const activeStep = flow.steps[currentStepIndex]
  const [viewingIndex, setViewingIndex] = useState<number | null>(null)

  const handleStepClick = (index: number) => {
    if (isFlowComplete) {
      setViewingIndex(prev => prev === index ? null : index)
    } else {
      goToStep(index)
    }
  }

  const handleComplete = () => {
    const idx = currentStepIndex
    if (!trackedSteps.current.has(idx)) {
      trackedSteps.current.add(idx)
      trackStepCompleted(flow.id, flow.steps[idx].order, flow.steps[idx].title)
    }
    completeCurrentStep()
  }

  useEffect(() => {
    if (userId) identifyUser(userId)
  }, [userId])

  useEffect(() => {
    if (isFlowComplete) {
      trackFlowCompleted(flow.id, flow.goal, flow.steps.length)
    }
  }, [isFlowComplete]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!flowStartTracked.current) {
      flowStartTracked.current = true
      trackFlowStarted(flow.id, flow.goal)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppLayout>
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-[#0f0f0f] border-b border-gray-100 dark:border-white/[0.07]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 dark:text-[#737373] hover:text-gray-700 dark:hover:text-gray-300 transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            홈
          </button>
          <div className="w-px h-4 bg-gray-200 dark:bg-white/[0.1] shrink-0" />
          <h1 className="text-[14px] font-semibold text-gray-900 dark:text-white truncate flex-1">
            {flow.goal}
          </h1>
          <button
            onClick={() => router.push('/recipe-book')}
            className="lg:hidden flex items-center justify-center w-8 h-8 text-gray-400 dark:text-[#737373] hover:text-gray-700 dark:hover:text-gray-300 transition-colors shrink-0"
            aria-label="내 레시피"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </button>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColor}`}>
              {flow.difficulty}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-[#737373]">⏱ {flow.estimatedTime}</span>
            <span className="text-[11px] text-gray-400 dark:text-[#737373]">{flow.steps.length}단계</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-[3px] bg-gray-100 dark:bg-white/[0.06] w-full">
          <div
            className="h-full bg-gray-900 dark:bg-zinc-200 transition-all duration-500 ease-out"
            style={{ width: `${isFlowComplete ? 100 : (currentStepIndex / flow.steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 lg:pb-8">
        <div className="lg:grid lg:grid-cols-[1fr_272px] lg:gap-8">

          {/* Left: active step */}
          <div>
            {!isFlowComplete ? (
              <StepCard
                key={activeStep.id}
                step={activeStep}
                status="active"
                onCopied={() => {
                  markStepCopied(currentStepIndex)
                  if (currentStepIndex === flow.steps.length - 1) handleComplete()
                }}
                onComplete={handleComplete}
              />
            ) : (
              <>
                <NextActionBlock isVisible={true} flow={flow} onRestart={() => { resetFlow(); setViewingIndex(null) }} />
                {viewingIndex !== null && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between px-1 mb-2">
                      <span className="text-[11px] font-bold text-gray-400 dark:text-[#525252] uppercase tracking-wider">
                        STEP {String(viewingIndex + 1).padStart(2, '0')} 다시 보기
                      </span>
                      <button
                        onClick={() => setViewingIndex(null)}
                        className="flex items-center justify-center w-6 h-6 rounded-full text-gray-400 dark:text-[#525252] hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.07] transition-all"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <StepCard
                      key={flow.steps[viewingIndex].id}
                      step={flow.steps[viewingIndex]}
                      status="done"
                    />
                  </div>
                )}
              </>
            )}

            {/* Next button — 복사 후 활성화 */}
          </div>

          {/* Right: sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-[80px]">
              <StepSidebar
                steps={flow.steps}
                getStepStatus={getStepStatus}
                onStepClick={handleStepClick}
                estimatedTime={flow.estimatedTime}
                onNext={completeCurrentStep}
                canGoNext={copiedSteps.has(currentStepIndex)}
                isFlowComplete={isFlowComplete}
                currentStepIndex={currentStepIndex}
                completedCount={completedSteps.size}
              />
            </div>
          </div>

        </div>
      </div>

      <SaveFloatingButton flow={flow} />

      {/* 모바일 하단 고정 바 */}
      {!isFlowComplete && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-md border-t border-gray-100 dark:border-white/[0.08] px-4 py-3">
          <div className="flex items-center gap-3 max-w-[600px] mx-auto">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-gray-500 dark:text-[#737373]">
                  {completedSteps.size}/{flow.steps.length}단계 완료
                </span>
                <span className="text-[11px] font-bold text-gray-400 dark:text-[#525252]">
                  {Math.round((completedSteps.size / flow.steps.length) * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-white/[0.12] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 dark:bg-zinc-200 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.round((completedSteps.size / flow.steps.length) * 100)}%` }}
                />
              </div>
            </div>
            <button
                onClick={completeCurrentStep}
                className={`shrink-0 px-4 py-2.5 rounded-[12px] text-[13px] font-semibold transition-all ${
                  copiedSteps.has(currentStepIndex)
                    ? 'bg-gray-900 dark:bg-zinc-200 text-white dark:text-zinc-900 active:scale-[0.97] cta-pulse'
                    : 'bg-gray-100 dark:bg-[#1e1e1e] text-gray-300 dark:text-[#404040]'
                }`}
              >
                다음 →
              </button>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
