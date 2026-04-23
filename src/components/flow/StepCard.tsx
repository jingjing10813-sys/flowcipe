'use client'

import { useState, useEffect } from 'react'
import { Step, StepStatus } from '@/types/flow'
import { ActionButton } from '@/components/ui/ActionButton'
import { ToolIcon } from '@/components/ui/ToolIcon'
import { PromptText } from '@/components/ui/PromptText'

interface StepCardProps {
  step: Step
  status: StepStatus
  onCopied?: () => void
  onComplete?: () => void
}

const PROMPT_TYPE_LABELS: Record<string, string> = {
  system: 'PROMPT',
  user: 'PROMPT',
  visual: 'PROMPT',
  config: 'CONFIGURATION',
}

export function StepCard({ step, status, onCopied }: StepCardProps) {
  const isActive = status === 'active'
  const isCommand = step.stepType === 'command'
  const [commandCopied, setCommandCopied] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const [showNudge, setShowNudge] = useState(isActive && step.order === 1)
  const nudgeExiting = false

  const handleCommandCopy = async () => {
    const text = step.commandGuide ?? ''
    try { await navigator.clipboard.writeText(text) } catch {
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCommandCopied(true)
    onCopied?.()
    setTimeout(() => setCommandCopied(false), 2000)
  }

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

      {/* Header + Title grouped */}
      <div className="flex items-start justify-between px-6 pt-6 pb-5">
        <div className="min-w-0 flex-1 mr-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-gray-400 dark:text-[#525252] uppercase tracking-wider">
              STEP {String(step.order).padStart(2, '0')}
            </span>
          </div>
          <h2 className="text-[22px] sm:text-[26px] font-bold text-gray-900 dark:text-[#f5f5f5] leading-snug tracking-tight">
            {step.title}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full border bg-gray-100 dark:bg-[#232323] border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-zinc-400">
            <ToolIcon name={step.tool.name} size={13} />
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
      <div className="px-6 pb-6">

        {/* IN guide — 프롬프트 스텝만 틴트 박스, 커맨드 스텝은 파란 배너로 대체 */}
        {!isCommand && (
          <div className="mb-3 px-4 py-3 bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
            <PromptText text={step.inputGuide} variant="blue" />
          </div>
        )}

        {/* Prompt Step */}
        {!isCommand && (
          <>
            <div className="mb-5">
              <p className="text-[10px] font-bold text-gray-400 dark:text-[#525252] uppercase tracking-wider mb-2">
                {promptLabel}
              </p>
              {step.promptType === 'config' && step.config ? (
                <div className="bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/[0.07] rounded-xl p-4 grid grid-cols-2 gap-x-6 gap-y-3">
                  {Object.entries(step.config).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-[9px] font-bold text-gray-400 dark:text-[#737373] uppercase tracking-wider mb-0.5">{key}</p>
                      <p className="text-[13px] font-semibold text-gray-700 dark:text-[#f5f5f5]">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-[#111] px-4 py-4">
                  <PromptText text={step.prompt ?? ''} />
                </div>
              )}
            </div>

            {isActive && (
              <div className="mb-5">
                {step.promptType === 'config' ? (
                  <button
                    onClick={() => window.open(step.tool.url, '_blank', 'noopener,noreferrer')}
                    className="w-full py-[18px] px-6 rounded-[14px] font-bold text-[15px] bg-gray-900 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-300 active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(0,0,0,0.18)] dark:shadow-none"
                  >
                    툴로 이동하기 →
                  </button>
                ) : (
                  <>
                    <div className={showNudge && !nudgeExiting ? 'cta-pulse rounded-[14px]' : ''}>
                      <ActionButton
                        prompt={copyText}
                        toolUrl={step.tool.url}
                        toolName={step.tool.name}
                        label={ctaLabel}
                        onCopied={() => { setHasCopied(true); setShowNudge(false); onCopied?.() }}
                      />
                    </div>
                    {!hasCopied && (
                      <p className="text-center text-[12px] mt-2 text-gray-400 dark:text-[#737373]">
                        버튼을 누르면 프롬프트가 자동으로 복사돼요
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* Command Step */}
        {isCommand && (
          <>
            <div className="mb-3 px-4 py-3 bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
              <PromptText text={step.inputGuide} variant="blue" />
            </div>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-gray-400 dark:text-[#525252] uppercase tracking-wider">PROMPT</p>
                {isActive && (
                  <span className={`text-[10px] font-semibold ${commandCopied ? 'text-emerald-500' : 'text-gray-400 dark:text-[#525252]'}`}>
                    {commandCopied ? '복사됨 ✓' : ''}
                  </span>
                )}
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-white/[0.1] bg-gray-50 dark:bg-[#111] px-4 py-4">
                <PromptText text={step.commandGuide ?? ''} />
              </div>
            </div>
            {isActive && (
              <div className="mb-5">
                <ActionButton
                  prompt={step.commandGuide ?? ''}
                  toolUrl={step.tool.url}
                  toolName={step.tool.name}
                  label={ctaLabel}
                  onCopied={() => { setHasCopied(true); onCopied?.() }}
                />
              </div>
            )}
          </>
        )}

        {/* OUT guide */}
        <div className="flex items-start gap-3 pt-3 border-t border-gray-50 dark:border-white/[0.06]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-gray-300 dark:text-[#525252]">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <div className="flex-1">
            <PromptText text={step.outputGuide} variant="muted" />
          </div>
        </div>
      </div>
    </div>
  )
}
