'use client'

import { useActionButton } from '@/hooks/useActionButton'

interface ActionButtonProps {
  prompt: string
  toolUrl: string
  toolName: string
  label?: string
  onCopied?: () => void
}

export function ActionButton({ prompt, toolUrl, toolName, label, onCopied }: ActionButtonProps) {
  const { buttonState, handleAction } = useActionButton(onCopied)

  const idleLabel = label ?? `Copy & Open ${toolName}`

  return (
    <button
      onClick={() => handleAction(prompt, toolUrl)}
      disabled={buttonState !== 'idle'}
      className={`
        w-full py-[18px] px-6 rounded-[14px] font-bold text-[15px]
        transition-all duration-200
        ${buttonState === 'idle'
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-[0.98] shadow-[0_4px_14px_rgba(0,0,0,0.18)] dark:shadow-[0_4px_14px_rgba(255,255,255,0.08)]'
          : buttonState === 'copied'
          ? 'bg-emerald-500 dark:bg-emerald-400 text-white dark:text-white'
          : 'bg-gray-300 dark:bg-[#2a2a2a] text-white dark:text-[#525252]'
        }
      `}
    >
      <span className="flex items-center justify-center gap-2">
        {buttonState === 'idle' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
        {buttonState === 'copied' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        )}
        {buttonState === 'opening' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        {buttonState === 'idle' ? idleLabel : buttonState === 'copied' ? 'Copied!' : 'Opening...'}
      </span>
    </button>
  )
}
