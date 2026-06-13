'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Flow } from '@/types/flow'
import { saveRecipe, isRecipeSaved } from '@/lib/recipe-book'
import { LoginModal } from '@/components/auth/LoginModal'
import { trackRecipeSaved } from '@/lib/analytics'

interface SaveFloatingButtonProps {
  flow: Flow
}

export function SaveFloatingButton({ flow }: SaveFloatingButtonProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [saved, setSaved] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const email = session?.user?.email
    if (!email) return
    isRecipeSaved(email, flow.id).then(setSaved)
  }, [flow.id, session?.user?.email])

  const handleSave = async () => {
    if (saved) {
      router.push('/recipe-book')
      return
    }
    const email = session?.user?.email
    if (!email) {
      setShowLogin(true)
      return
    }
    const ok = await saveRecipe(email, flow)
    if (!ok) {
      alert('저장에 실패했어요. 잠시 후 다시 시도해주세요.')
      return
    }
    trackRecipeSaved(flow.id, flow.goal)
    setSaved(true)
    setTimeout(() => router.push('/recipe-book'), 600)
  }

  return (
    <>
    {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    <div className="hidden lg:block fixed bottom-8 right-8 z-50">
      <button
        onClick={handleSave}
        className={`
          flex items-center gap-2.5 px-5 py-3.5 rounded-full font-semibold text-[14px]
          shadow-lg transition-all duration-200 active:scale-[0.97]
          ${saved
            ? 'bg-emerald-500 dark:bg-emerald-400 text-white hover:bg-emerald-600 dark:hover:bg-emerald-300'
            : 'bg-gray-900 dark:bg-[#f0f0f0] text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_16px_rgba(255,255,255,0.06)]'
          }
        `}
      >
        {saved ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20,6 9,17 4,12" />
            </svg>
            내 레시피로 이동
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            내 레시피에 저장하기
          </>
        )}
      </button>
    </div>
    </>
  )
}
