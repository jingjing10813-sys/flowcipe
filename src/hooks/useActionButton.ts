'use client'

import { useState, useCallback } from 'react'

export type ButtonState = 'idle' | 'copied' | 'opening'

export function useActionButton(onCopied?: () => void) {
  const [buttonState, setButtonState] = useState<ButtonState>('idle')

  const handleAction = useCallback(async (prompt: string, toolUrl: string) => {
    if (buttonState !== 'idle') return

    try {
      await navigator.clipboard.writeText(prompt)
    } catch {
      // clipboard 실패 시 fallback
      const textarea = document.createElement('textarea')
      textarea.value = prompt
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    setButtonState('copied')
    onCopied?.()

    setTimeout(() => {
      setButtonState('opening')
      window.open(toolUrl, '_blank', 'noopener,noreferrer')

      setTimeout(() => {
        setButtonState('idle')
      }, 1500)
    }, 800)
  }, [buttonState, onCopied])

  return { buttonState, handleAction }
}
