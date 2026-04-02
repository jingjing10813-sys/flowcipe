'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Flow } from '@/types/flow'
import { getSavedRecipes } from '@/lib/recipe-book'
import { RecipeCard } from './RecipeCard'

export function RecipeBookClient() {
  const router = useRouter()
  const [recipes, setRecipes] = useState<Flow[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setRecipes(getSavedRecipes())
    setMounted(true)
  }, [])

  const handleRemove = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id))
  }

  if (!mounted) return null

  return (
    <div>
      {recipes.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-14 h-14 bg-gray-100 dark:bg-[#232323] rounded-[16px] flex items-center justify-center mx-auto mb-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 dark:text-[#525252]">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p className="text-[16px] font-bold text-gray-900 dark:text-[#f5f5f5] mb-2">아직 저장된 레시피가 없어요</p>
          <p className="text-[13.5px] text-gray-400 dark:text-[#737373] mb-8 leading-relaxed">
            Flow를 완주하면 레시피로 자동 저장됩니다
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[13.5px] font-semibold px-5 py-3 rounded-[10px] hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
          >
            첫 Flow 만들기 →
          </button>
        </div>
      ) : (
        <>
          {/* 헤더 카운트 */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[13px] text-gray-400 dark:text-[#737373] font-medium">
              저장된 레시피 <span className="text-gray-900 dark:text-[#f5f5f5] font-bold">{recipes.length}개</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {recipes.map((flow) => (
              <RecipeCard key={flow.id} flow={flow} onRemove={handleRemove} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
