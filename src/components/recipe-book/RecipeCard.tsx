'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flow } from '@/types/flow'
import { removeRecipe } from '@/lib/recipe-book'

const DIFFICULTY_DOTS: Record<string, number> = { '입문': 1, '중급': 2, '고급': 3 }

interface RecipeCardProps {
  flow: Flow
  onRemove: (id: string) => void
}

export function RecipeCard({ flow, onRemove }: RecipeCardProps) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const dots = DIFFICULTY_DOTS[flow.difficulty] ?? 1

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2500)
      return
    }
    removeRecipe(flow.id)
    onRemove(flow.id)
  }

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col gap-4">
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {flow.tags.map((tag) => (
          <span key={tag} className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full tracking-wide">
            {tag}
          </span>
        ))}
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-1">{flow.goal}</h3>
        <p className="text-xs text-gray-400 line-clamp-2">{flow.description}</p>
      </div>

      {/* Step pills */}
      <div className="flex flex-wrap gap-1.5">
        {flow.steps.map((step) => (
          <span key={step.id} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            <span>{step.tool.icon}</span>
            {step.title}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span>{flow.difficulty} {[1,2,3].map(i => <span key={i} className={i <= dots ? 'text-gray-600' : 'text-gray-200'}>⚡</span>)}</span>
        <span>·</span>
        <span>{flow.estimatedTime}</span>
        <span>·</span>
        <span>{flow.steps.length}단계</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => router.push(`/flow/${flow.id}`)}
          className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-[10px] hover:bg-gray-800 active:scale-[0.98] transition-all"
        >
          다시 보기 →
        </button>
        <button
          onClick={handleDelete}
          className={`
            px-3 py-2.5 rounded-[10px] text-sm font-semibold transition-all
            ${confirmDelete
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }
          `}
        >
          {confirmDelete ? '확인' : '삭제'}
        </button>
      </div>
    </div>
  )
}
