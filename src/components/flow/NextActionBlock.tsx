'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Flow } from '@/types/flow'
import { saveRecipe, isRecipeSaved } from '@/lib/recipe-book'
import { trackRecipeSaved } from '@/lib/analytics'
import { LoginModal } from '@/components/auth/LoginModal'

interface NextActionBlockProps {
  isVisible: boolean
  flow: Flow
  onRestart?: () => void
}

export function NextActionBlock({ isVisible, flow, onRestart }: NextActionBlockProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [saved, setSaved] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const email = session?.user?.email
    if (isVisible && email) {
      isRecipeSaved(email, flow.id).then(setSaved)
    }
  }, [isVisible, flow.id, session?.user?.email])

  if (!isVisible) return null

  const handleSave = async () => {
    const email = session?.user?.email
    if (!email) {
      setShowLogin(true)
      return
    }
    await saveRecipe(email, flow)
    trackRecipeSaved(flow.id, flow.goal)
    setSaved(true)
  }

  return (
    <>
    {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-2 rounded-[20px] bg-gray-900 p-6"
    >
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-lg font-bold text-white">Flow 완주!</h3>
        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-300 transition-colors shrink-0 ml-3 mt-0.5"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          다시 실행
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-6">
        모든 단계를 완료했습니다.
        <br />
        레시피에 저장하면 나중에 다시 꺼내 실행할 수 있어요.
      </p>

      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full py-3.5 rounded-[12px] font-semibold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            saved
              ? 'bg-emerald-500 text-white cursor-default'
              : 'bg-white text-gray-900 hover:bg-gray-100'
          }`}
        >
          {saved ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              레시피에 저장됨
            </>
          ) : (
            '내 레시피에 저장하기 →'
          )}
        </button>

        {saved && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => router.push('/recipe-book')}
            className="w-full py-3.5 rounded-[12px] font-semibold text-sm border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-all active:scale-[0.98]"
          >
            내 레시피 보기
          </motion.button>
        )}

        <button
          onClick={() => router.push('/')}
          className="w-full py-3.5 rounded-[12px] font-semibold text-sm border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-all active:scale-[0.98]"
        >
          새 Flow 만들기
        </button>
      </div>
    </motion.div>
    </>
  )
}
