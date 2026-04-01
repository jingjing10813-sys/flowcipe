'use client'

import { useRef, useState, useEffect } from 'react'
import { Flow } from '@/types/flow'
import { useFlowState } from '@/hooks/useFlowState'
import { AppLayout } from '@/components/layout/AppLayout'
import { GoalHeader } from '@/components/flow/GoalHeader'
import { FlowLine } from '@/components/flow/FlowLine'
import { SideProgressBar } from '@/components/flow/SideProgressBar'
import { StepCard } from '@/components/flow/StepCard'
import { FlowConnector } from '@/components/flow/FlowConnector'
import { NextActionBlock } from '@/components/flow/NextActionBlock'
import { SaveFloatingButton } from '@/components/flow/SaveFloatingButton'

interface FlowPageClientProps {
  flow: Flow
}

function FlowInfoPanel({ flow }: { flow: Flow }) {
  // 중복 없는 툴 목록
  const uniqueTools = flow.steps.reduce<Flow['steps'][0]['tool'][]>((acc, step) => {
    if (!acc.find((t) => t.id === step.tool.id)) acc.push(step.tool)
    return acc
  }, [])

  return (
    <div className="bg-white rounded-[20px] border border-[#E8E9EC] p-5">
      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">Flow 정보</p>

      <div className="flex flex-col gap-4 mb-5">
        <div>
          <p className="text-[10px] text-gray-300 uppercase tracking-wide mb-1">예상 시간</p>
          <p className="text-[14px] font-semibold text-gray-800">{flow.estimatedTime}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-300 uppercase tracking-wide mb-1">전체 단계</p>
          <p className="text-[14px] font-semibold text-gray-800">{flow.steps.length}단계</p>
        </div>
      </div>

      <div className="border-t border-gray-50 pt-4">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-3">사용 툴</p>
        <div className="flex flex-col gap-3">
          {uniqueTools.map((tool) => (
            <div key={tool.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{tool.icon}</span>
                <div>
                  <p className="text-[13px] font-semibold text-gray-700">{tool.name}</p>
                  {tool.model && (
                    <p className="text-[10px] text-gray-300">{tool.model}</p>
                  )}
                </div>
              </div>
              {tool.free !== undefined && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  tool.free ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {tool.free ? '무료' : '유료'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {flow.tags.length > 0 && (
        <div className="border-t border-gray-50 pt-4 mt-4">
          <div className="flex flex-wrap gap-1.5">
            {flow.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function FlowPageClient({ flow }: FlowPageClientProps) {
  const {
    getStepStatus,
    goToStep,
    completeCurrentStep,
    markStepCopied,
    currentStepIndex,
    copiedSteps,
    isFlowComplete,
  } = useFlowState(flow.steps.length)

  const flowLineRef = useRef<HTMLDivElement>(null)
  const [showSideBar, setShowSideBar] = useState(false)

  useEffect(() => {
    const el = flowLineRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowSideBar(!entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-[1200px] mx-auto">

          {/* GoalHeader — full width */}
          <GoalHeader flow={flow} />

          {/* FlowLine — full width, no box */}
          <div ref={flowLineRef}>
            <FlowLine
              steps={flow.steps}
              getStepStatus={getStepStatus}
              onStepClick={goToStep}
            />
          </div>

          {/* 사이드 프로그레스바 — FlowLine 스크롤 아웃 시 등장 */}
          <SideProgressBar
            steps={flow.steps}
            getStepStatus={getStepStatus}
            onStepClick={goToStep}
            visible={showSideBar}
          />

          {/* Two-column on lg+ */}
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8 xl:gap-12">

            {/* Left: step cards */}
            <div className="flex flex-col gap-4">
              {flow.steps.map((step, index) => {
                const isPromptStep = step.stepType === 'prompt'

                return (
                  <div key={step.id}>
                    <StepCard
                      step={step}
                      status={getStepStatus(index)}
                      onCopied={() => markStepCopied(index)}
                      onComplete={completeCurrentStep}
                    />

                    {index < flow.steps.length - 1 && isPromptStep && (
                      <FlowConnector
                        message={step.connectorMessage}
                        onNext={completeCurrentStep}
                        isVisible={
                          currentStepIndex === index &&
                          copiedSteps.has(index) &&
                          !isFlowComplete
                        }
                      />
                    )}

                    {index < flow.steps.length - 1 && !isPromptStep && (
                      <div className="flex justify-center py-1">
                        <div className="w-px h-6 bg-gray-100" />
                      </div>
                    )}
                  </div>
                )
              })}

              <NextActionBlock isVisible={isFlowComplete} flow={flow} />
            </div>

            {/* Right: sticky info panel (desktop only) */}
            <div className="hidden lg:block">
              <div className="sticky top-[80px]">
                <FlowInfoPanel flow={flow} />
              </div>
            </div>

          </div>
        </div>
      </div>

      <SaveFloatingButton flow={flow} />
    </AppLayout>
  )
}
