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

export function StepCard({ step, status, onCopied, onComplete }: StepCardProps) {
  const isActive = status === 'active'
  const isCommand = step.stepType === 'command'

  const ctaLabel = (() => {
    if (step.promptType === 'config') return '설정 복사하기'
    if (step.order === 1) return '복사하고 바로 시작하기'
    if (step.order === 2) return '이어서 완성하기'
    return '완성하고 끝내기'
  })()

  const promptLabel = PROMPT_TYPE_LABELS[step.promptType] ?? 'PROMPT'

  const copyText = step.config
    ? Object.entries(step.config).map(([k, v]) => `${k}: ${v}`).join('\n')
    : step.prompt ?? ''

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-white/[0.08] shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] overflow-hidden">

      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 dark:text-[#525252] uppercase tracking-widest">
            STEP {String(step.order).padStart(2, '0')}
          </span>
          {isCommand && isActive && (
            <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
              세션 계속
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full border bg-gray-100 dark:bg-[#232323] border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-zinc-400">
            <span className="text-[13px] leading-none">{step.tool.icon}</span>
            {step.tool.name}
          </span>
          {step.tool.free !== undefined && (
            <span className="text-[10px] font-medium text-gray-700 dark:text-[#d4d4d4]">
              {step.tool.free ? '무료' : '유료'}{step.tool.freeLimit ? ` · ${step.tool.freeLimit}` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6">

        {/* Title */}
        <h2 className="text-[22px] sm:text-[26px] font-bold text-gray-900 dark:text-[#f5f5f5] leading-snug tracking-tight mb-5">
          {step.title}
        </h2>

        {/* IN guide */}
        <div className="flex items-start gap-3 mb-5 px-4 py-3 bg-gray-50 dark:bg-[#232323] rounded-xl">
          <span className="text-[10px] font-bold text-gray-400 dark:text-[#737373] uppercase tracking-wider mt-0.5 shrink-0">IN</span>
          <p className="text-[13px] text-gray-600 dark:text-[#a3a3a3] leading-relaxed">{step.inputGuide}</p>
        </div>

        {/* Prompt Step */}
        {!isCommand && (
          <>
            <div className="mb-5">
              <p className="text-[10px] font-bold text-gray-400 dark:text-[#525252] uppercase tracking-widest mb-2">
                {promptLabel}
              </p>
              {step.promptType === 'config' && step.config ? (
                <div className="bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/[0.07] rounded-xl p-4 grid grid-cols-2 gap-x-6 gap-y-3">
                  {Object.entries(step.config).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-[9px] font-bold text-gray-400 dark:text-[#737373] uppercase tracking-widest mb-0.5">{key}</p>
                      <p className="text-[13px] font-semibold text-gray-700 dark:text-[#f5f5f5]">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/[0.07] rounded-xl p-4">
                  <p className="text-[14px] text-gray-700 dark:text-[#d4d4d4] leading-relaxed whitespace-pre-line">
                    {step.prompt}
                  </p>
                </div>
              )}
            </div>

            {isActive && (
              <div className="mb-5">
                <ActionButton
                  prompt={copyText}
                  toolUrl={step.tool.url}
                  toolName={step.tool.name}
                  label={ctaLabel}
                  onCopied={onCopied}
                />
                <p className="text-center text-[12px] text-gray-400 dark:text-[#737373] mt-2">
                  버튼을 누르면 프롬프트가 자동으로 복사돼요
                </p>
              </div>
            )}
          </>
        )}

        {/* Command Step */}
        {isCommand && (
          <>
            {isActive && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" className="shrink-0">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p className="text-[12px] text-blue-500 dark:text-blue-400 font-medium">
                  이전 대화를 닫지 말고, 아래 명령을 이어서 입력하세요
                </p>
              </div>
            )}
            <div className={`mb-5 rounded-xl p-4 ${isActive ? 'bg-gray-900 dark:bg-[#232323]' : 'bg-gray-100 dark:bg-[#232323]/60'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isActive ? 'text-gray-500 dark:text-[#737373]' : 'text-gray-400 dark:text-[#525252]'}`}>
                이렇게 입력하세요
              </p>
              <p className={`text-[15px] font-medium leading-relaxed ${isActive ? 'text-white dark:text-[#f5f5f5]' : 'text-gray-500 dark:text-[#737373]'}`}>
                &ldquo;{step.commandGuide}&rdquo;
              </p>
            </div>
            {isActive && (
              <div className="mb-5">
                <button
                  onClick={onComplete}
                  className="w-full py-3.5 rounded-[14px] font-semibold text-[14px] bg-gray-100 dark:bg-[#232323] text-gray-600 dark:text-[#a3a3a3] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] active:scale-[0.98] transition-all"
                >
                  완료하고 계속하기
                </button>
              </div>
            )}
          </>
        )}

        {/* OUT guide */}
        <div className="flex items-start gap-3 pt-4 border-t border-gray-50 dark:border-white/[0.06]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-gray-300 dark:text-[#525252]">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <p className="text-[12px] text-gray-400 dark:text-[#737373] leading-relaxed">{step.outputGuide}</p>
        </div>
      </div>
    </div>
  )
}
