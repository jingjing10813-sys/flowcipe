'use client'

import { Step, StepStatus } from '@/types/flow'
import { ActionButton } from '@/components/ui/ActionButton'

interface StepCardProps {
  step: Step
  status: StepStatus
}

const PROMPT_TYPE_LABELS: Record<string, string> = {
  system: 'SYSTEM PROMPT',
  user: 'USER INPUT',
  visual: 'VISUAL PROMPT',
  config: 'CONFIGURATION',
}

const PROMPT_TYPE_COLORS: Record<string, string> = {
  system: 'bg-violet-50 border-violet-100 text-violet-400',
  user: 'bg-blue-50 border-blue-100 text-blue-400',
  visual: 'bg-orange-50 border-orange-100 text-orange-400',
  config: 'bg-green-50 border-green-100 text-green-400',
}

export function StepCard({ step, status }: StepCardProps) {
  const isActive = status === 'active'
  const isDone = status === 'done'
  const isPending = status === 'pending'

  const promptLabel = PROMPT_TYPE_LABELS[step.promptType] ?? 'PROMPT'
  const promptColorClass = PROMPT_TYPE_COLORS[step.promptType] ?? 'bg-gray-50 border-gray-100 text-gray-400'

  // 복사할 텍스트: config면 key:value 형식으로 변환
  const copyText = step.config
    ? Object.entries(step.config).map(([k, v]) => `${k}: ${v}`).join('\n')
    : step.prompt ?? ''

  const buttonLabel = step.promptType === 'config' ? '설정 복사' : undefined

  return (
    <div
      className={`
        rounded-[20px] bg-white p-6 transition-all duration-300
        ${isActive ? 'shadow-md ring-1 ring-gray-200' : 'shadow-sm'}
        ${isPending ? 'opacity-40' : ''}
        ${isDone ? 'opacity-60' : ''}
      `}
    >
      {/* Step Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
            STEP {String(step.order).padStart(2, '0')}
          </span>
          {isDone && (
            <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
              완료
            </span>
          )}
        </div>

        {/* Tool Badge */}
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
            <span className="text-sm">{step.tool.icon}</span>
            <span className="text-xs font-semibold text-gray-700">{step.tool.name}</span>
          </div>
          {step.tool.model && (
            <span className="text-[10px] text-gray-400 pr-1">{step.tool.model}</span>
          )}
        </div>
      </div>

      {/* Step Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        {step.title}
      </h2>

      {/* Input Guide */}
      <div className="mb-4 p-3 bg-gray-50 rounded-[12px]">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">입력</p>
        <p className="text-sm text-gray-600">{step.inputGuide}</p>
      </div>

      {/* Prompt / Config */}
      <div className={`mb-5 p-3 rounded-[12px] border ${promptColorClass}`}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 opacity-80">
          {promptLabel}
        </p>

        {step.promptType === 'config' && step.config ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {Object.entries(step.config).map(([key, value]) => (
              <div key={key}>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{key}</p>
                <p className="text-sm font-semibold text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 line-clamp-4 whitespace-pre-line leading-relaxed">
            {step.prompt}
          </p>
        )}
      </div>

      {/* Action Button */}
      {isActive && (
        <ActionButton
          prompt={copyText}
          toolUrl={step.tool.url}
          toolName={step.tool.name}
          label={buttonLabel}
        />
      )}

      {/* Output Guide */}
      <div className="mt-4 flex items-start gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 mt-0.5 shrink-0">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <p className="text-xs text-gray-400">{step.outputGuide}</p>
      </div>
    </div>
  )
}
