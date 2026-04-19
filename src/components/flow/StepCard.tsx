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
  system: 'bg-violet-50 border-violet-100 text-violet-400 dark:bg-violet-900/20 dark:border-violet-800/30 dark:text-violet-400',
  user: 'bg-blue-50 border-blue-100 text-blue-400 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-400',
  visual: 'bg-orange-50 border-orange-100 text-orange-400 dark:bg-orange-900/20 dark:border-orange-800/30 dark:text-orange-400',
  config: 'bg-green-50 border-green-100 text-green-400 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-400',
}

export function StepCard({ step, status, onCopied, onComplete }: StepCardProps) {
  const isActive = status === 'active'
  const isDone = status === 'done'
  const isPending = status === 'pending'
  const isCommand = step.stepType === 'command'


  const ctaLabel = (() => {
    if (step.promptType === 'config') return '설정 복사하기'
    if (step.order === 1) return '복사하고 바로 시작하기'
    if (step.order === 2) return '이어서 완성하기'
    if (step.order >= 3) return '완성하고 끝내기'
    return `${step.tool.name}에서 바로 시작하기 →`
  })()

  const promptLabel = PROMPT_TYPE_LABELS[step.promptType] ?? 'PROMPT'
  const promptColorClass = PROMPT_TYPE_COLORS[step.promptType] ?? 'bg-gray-50 border-gray-100 text-gray-400 dark:bg-[#232323] dark:border-white/[0.08] dark:text-[#737373]'

  const copyText = step.config
    ? Object.entries(step.config).map(([k, v]) => `${k}: ${v}`).join('\n')
    : step.prompt ?? ''

  return (
    <div className={`
      rounded-[18px] bg-white dark:bg-[#1a1a1a] transition-all duration-300 overflow-hidden
      ${isActive  ? 'border border-gray-300 dark:border-white/[0.18] shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]' : 'border border-gray-100 dark:border-white/[0.06]'}
      ${isDone    ? 'opacity-80' : ''}
      ${isPending ? 'opacity-80' : ''}
    `}>
      <div className="p-6">
        {/* Step Header — 좌측 레이블+타이틀 고정 갭, 우측 뱃지 2줄 */}
        <div className="flex items-start justify-between gap-4 mb-5">

          {/* Left: 레이블 + 타이틀 항상 붙어있음 */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors
                ${isActive ? 'text-gray-400 dark:text-[#737373]' : 'text-gray-300 dark:text-[#525252]'}
              `}>
                STEP {String(step.order).padStart(2, '0')}
              </span>
              {isDone && (
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                  완료
                </span>
              )}
              {isCommand && isActive && (
                <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                  세션 계속
                </span>
              )}
            </div>
            <h2 className={`font-bold transition-all
              ${isActive  ? 'text-[22px] leading-snug text-gray-900 dark:text-[#f5f5f5]' : ''}
              ${isDone    ? 'text-[17px] leading-snug text-gray-500 dark:text-[#737373]' : ''}
              ${isPending ? 'text-[17px] leading-snug text-gray-600 dark:text-[#a3a3a3]' : ''}
            `}>
              {step.title}
            </h2>
          </div>

          {/* Right: 뱃지 2줄 */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors
              ${isActive ? 'bg-gray-900 border-gray-900 dark:bg-zinc-700 dark:border-zinc-600' : 'bg-gray-50 border-gray-100 dark:bg-[#232323] dark:border-white/[0.08]'}
            `}>
              <span className="text-sm leading-none">{step.tool.icon}</span>
              <span className={`text-[11px] font-semibold transition-colors
                ${isActive ? 'text-white dark:text-zinc-100' : 'text-gray-600 dark:text-zinc-300'}
              `}>
                {step.tool.name}
              </span>
            </div>
            {step.tool.free !== undefined && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                step.tool.free
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
              }`}>
                {step.tool.free ? '무료' : '유료'}{step.tool.freeLimit ? ` · ${step.tool.freeLimit}` : ''}
              </span>
            )}
          </div>

        </div>

        {/* ── Prompt Step UI ── */}
        {!isCommand && (
          <>
            {/* Input Guide */}
            <div className="mb-3 px-3 py-2.5 bg-gray-50 dark:bg-[#232323] rounded-[10px] flex items-start gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wide mt-0.5 shrink-0
                ${isActive ? 'text-gray-400 dark:text-[#737373]' : 'text-gray-300 dark:text-[#525252]'}
              `}>IN</span>
              <p className={`text-[13px] transition-colors
                ${isActive ? 'text-gray-600 dark:text-[#a3a3a3]' : 'text-gray-400 dark:text-[#737373]'}
              `}>{step.inputGuide}</p>
            </div>

            {/* Prompt / Config */}
            <div className={`mb-5 p-4 rounded-[14px] border ${promptColorClass} ${!isActive ? 'opacity-70' : ''}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-70">
                {promptLabel}
              </p>
              {step.promptType === 'config' && step.config ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {Object.entries(step.config).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-[9px] font-bold text-gray-400 dark:text-[#737373] uppercase tracking-widest mb-0.5">{key}</p>
                      <p className="text-[13px] font-semibold text-gray-700 dark:text-[#f5f5f5]">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-gray-600 dark:text-[#a3a3a3] line-clamp-4 whitespace-pre-line leading-relaxed">
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
                  label={ctaLabel}
                  onCopied={onCopied}
                />
                <p className="text-center text-[12px] text-gray-400 dark:text-[#737373] font-medium mt-2.5">
                  버튼을 누르면 프롬프트가 자동으로 복사돼요
                </p>
              </div>
            )}
          </>
        )}

        {/* ── Command Step UI ── */}
        {isCommand && (
          <>
            {isActive && (
              <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-[10px]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" className="shrink-0">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p className="text-[12px] text-blue-500 dark:text-blue-400 font-medium">
                  이전 대화를 닫지 말고, 아래 명령을 이어서 입력하세요
                </p>
              </div>
            )}

            {/* Command Guide */}
            <div className={`mb-5 p-4 rounded-[14px] transition-colors
              ${isActive ? 'bg-gray-900 dark:bg-[#232323]' : 'bg-gray-100 dark:bg-[#232323]/60'}
            `}>
              <p className={`text-[9px] font-bold uppercase tracking-widest mb-2
                ${isActive ? 'text-gray-500 dark:text-[#737373]' : 'text-gray-400 dark:text-[#525252]'}
              `}>
                이렇게 입력하세요
              </p>
              <p className={`text-[14px] leading-relaxed font-medium
                ${isActive ? 'text-white dark:text-[#f5f5f5]' : 'text-gray-500 dark:text-[#737373]'}
              `}>
                &ldquo;{step.commandGuide}&rdquo;
              </p>
            </div>

            {isActive && (
              <button
                onClick={onComplete}
                className="w-full py-3.5 px-6 rounded-[14px] font-semibold text-[14px] bg-gray-100 dark:bg-[#232323] text-gray-600 dark:text-[#a3a3a3] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] active:scale-[0.98] transition-all"
              >
                완료하고 계속하기
              </button>
            )}
          </>
        )}

        {/* Output Guide */}
        <div className="mt-5 pt-4 border-t border-gray-50 dark:border-white/[0.06] flex items-start gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`mt-0.5 shrink-0 ${isActive ? 'text-gray-300 dark:text-[#525252]' : 'text-gray-200 dark:text-[#404040]'}`}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <p className={`text-[12px] transition-colors
            ${isActive ? 'text-gray-400 dark:text-[#737373]' : 'text-gray-300 dark:text-[#525252]'}
          `}>{step.outputGuide}</p>
        </div>
      </div>
    </div>
  )
}
