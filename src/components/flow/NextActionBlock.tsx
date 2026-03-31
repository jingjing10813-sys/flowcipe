'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Flow } from '@/types/flow'
import { saveRecipe, isRecipeSaved } from '@/lib/recipe-book'

interface NextActionBlockProps {
  isVisible: boolean
  flow: Flow
}

export function NextActionBlock({ isVisible, flow }: NextActionBlockProps) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setSaved(isRecipeSaved(flow.id))
    }
  }, [isVisible, flow.id])

  if (!isVisible) return null

  const handleSave = () => {
    saveRecipe(flow)
    setSaved(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-2 rounded-[20px] bg-gray-900 p-6"
    >
      <div className="text-2xl mb-3">🎉</div>
      <h3 className="text-lg font-bold text-white mb-1">
        Flow 완주!
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        모든 단계를 완료했습니다.
        <br />
        레시피북에 저장하면 나중에 다시 꺼내볼 수 있어요.
      </p>

      <div className="flex flex-col gap-3">
        {/* 레시피북 저장 CTA */}
        <button
          onClick={handleSave}
          disabled={saved}
          className={`
            w-full py-3.5 rounded-[12px] font-semibold text-sm transition-all
            ${saved
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-900 hover:bg-gray-100 active:scale-[0.98]'
            }
          `}
        >
          {saved ? (
            <span className="flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              레시피북에 저장됨
            </span>
          ) : (
            '나의 레시피북에 저장하기 →'
          )}
        </button>

        {/* 레시피북 바로가기 */}
        {saved && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => router.push('/recipe-book')}
            className="w-full py-3.5 rounded-[12px] font-semibold text-sm border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-all"
          >
            나의 레시피북 보기
          </motion.button>
        )}

        {/* 새 Flow */}
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          새 Flow 만들기
        </button>
      </div>
    </motion.div>
  )
}
