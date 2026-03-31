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
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-base font-semibold text-gray-900 mb-2">아직 저장된 레시피가 없어요</p>
          <p className="text-sm text-gray-400 mb-6">Flow를 완주하면 레시피북에 저장할 수 있어요</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-[12px] hover:bg-gray-800 transition-all"
          >
            첫 Flow 만들기 →
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {recipes.map((flow) => (
            <RecipeCard key={flow.id} flow={flow} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  )
}
