'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Flow } from '@/types/flow'
import { saveRecipe, isRecipeSaved } from '@/lib/recipe-book'

interface SaveFloatingButtonProps {
  flow: Flow
}

export function SaveFloatingButton({ flow }: SaveFloatingButtonProps) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isRecipeSaved(flow.id))
  }, [flow.id])

  const handleSave = () => {
    if (saved) {
      router.push('/recipe-book')
      return
    }
    saveRecipe(flow)
    setSaved(true)
    setTimeout(() => {
      router.push('/recipe-book')
    }, 600)
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={handleSave}
        className={`
          flex items-center gap-2.5 px-5 py-3.5 rounded-full font-semibold text-[14px]
          shadow-lg transition-all duration-200 active:scale-[0.97]
          ${saved
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-900 text-white hover:bg-gray-800'
          }
        `}
      >
        {saved ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20,6 9,17 4,12" />
            </svg>
            레시피북으로 이동
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            나의 레시피북에 저장하기
          </>
        )}
      </button>
    </div>
  )
}
