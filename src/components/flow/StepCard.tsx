'use client'

import { Step, StepStatus } from '@/types/flow'
import { ActionButton } from '@/components/ui/ActionButton'

interface StepCardProps {
  step: Step
  status: StepStatus
  onCopied?: () => void
  onComplete?: () => void
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

export function StepCard({ step, status, onCopied, onComplete }: StepCardProps) {
  const isActive = status === 'active'
  const isDone = status === 'done'
  const isPending = status === 'pending'
  const isCommand = step.stepType === 'command'

  const promptLabel = PROMPT_TYPE_LABELS[step.promptType] ?? 'PROMPT'
  const promptColorClass = PROMPT_TYPE_COLORS[step.promptType] ?? 'bg-gray-50 border-gray-100 text-gray-400'

  const copyText = step.config
    ? Object.entries(step.config).map(([k, v]) => `${k}: ${v}`).join('\n')
    : step.prompt ?? ''

  return (
    <div className={`
      rounded-[20px] bg-white transition-all duration-300 overflow-hidden
      ${isActive
        ? 'shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-gray-200'
        : 'shadow-sm'
      }
      ${isPending ? 'opacity-35' : ''}
      ${isDone ? 'opacity-55' : ''}
    `}>
      {/* Active accent bar */}
      {isActive && (
        <div className="h-[3px] w-full bg-gray-900 rounded-t-[20px]" />
      )}

      <div className="p-6">
        {/* Step Header */}
        <div className="flex items-start justify-between mb-1">
          {/* Left: step label + badges */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">
              STEP {String(step.order).padStart(2, '0')}
            </span>
            {isDone && (
              <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                완료
              </span>
            )}
            {isCommand && !isDone && (
              <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                세션 계속
              </span>
            )}
          </div>

          {/* Right: tool pill */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
              <span className="text-sm leading-none">{step.tool.icon}</span>
              <span className="text-[11px] font-semibold text-gray-700">{step.tool.name}</span>
            </div>
            {/* 유무료 + 추천이유 — 한 줄 */}
            <div className="flex items-center gap-1">
              {step.tool.free !== undefined && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  step.tool.free
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  {step.tool.free ? '무료' : '유료'}
                  {step.tool.freeLimit ? ` · ${step.tool.freeLimit}` : ''}
                </span>
              )}
              {step.tool.reason && (
                <span
                  className="text-[9px] text-gray-300 max-w-[120px] truncate"
                  title={step.tool.reason}
                >
                  {step.tool.reason}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Step Title — active일 때 크고 bold */}
        <h2 className={`font-bold text-gray-900 mb-5 transition-all
          ${isActive ? 'text-[22px] leading-snug' : 'text-lg'}
        `}>
          {step.title}
        </h2>

        {/* ── Prompt Step UI ── */}
        {!isCommand && (
          <>
            {/* Input Guide */}
            <div className="mb-3 px-3 py-2.5 bg-gray-50 rounded-[10px] flex items-start gap-2">
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide mt-0.5 shrink-0">IN</span>
              <p className="text-[13px] text-gray-500">{step.inputGuide}</p>
            </div>

            {/* Prompt / Config */}
            <div className={`mb-5 p-4 rounded-[14px] border ${promptColorClass}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-70">
                {promptLabel}
              </p>
              {step.promptType === 'config' && step.config ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {Object.entries(step.config).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{key}</p>
                      <p className="text-[13px] font-semibold text-gray-700">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-gray-600 line-clamp-4 whitespace-pre-line leading-relaxed">
                  {step.prompt}
                </p>
              )}
            </div>

            {/* Primary CTA */}
            {isActive && (
              <div>
                <ActionButton
                  prompt={copyText}
                  toolUrl={step.tool.url}
                  toolName={step.tool.name}
                  label={step.promptType === 'config' ? '설정 복사하기' : `${step.tool.name}에서 바로 시작하기 →`}
                  onCopied={onCopied}
                />
                <p className="text-center text-[11px] text-gray-300 mt-2">
                  프롬프트가 자동으로 복사됩니다
                </p>
              </div>
            )}
          </>
        )}

        {/* ── Command Step UI ── */}
        {isCommand && (
          <>
            {/* Session continue notice */}
            <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-blue-50 rounded-[10px]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" className="shrink-0">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-[12px] text-blue-500 font-medium">
                이전 대화를 닫지 말고, 아래 명령을 이어서 입력하세요
              </p>
            </div>

            {/* Command Guide */}
            <div className="mb-5 p-4 bg-gray-900 rounded-[14px]">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                이렇게 입력하세요
              </p>
              <p className="text-[14px] text-white leading-relaxed font-medium">
                &ldquo;{step.commandGuide}&rdquo;
              </p>
            </div>

            {/* Complete button */}
            {isActive && (
              <button
                onClick={onComplete}
                className="w-full py-3.5 px-6 rounded-[14px] font-semibold text-[14px] bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-[0.98] transition-all"
              >
                입력 완료 → 다음 단계
              </button>
            )}
          </>
        )}

        {/* Output Guide */}
        <div className="mt-5 pt-4 border-t border-gray-50 flex items-start gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200 mt-0.5 shrink-0">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <p className="text-[12px] text-gray-300">{step.outputGuide}</p>
        </div>
      </div>
    </div>
  )
}
