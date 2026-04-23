'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flow } from '@/types/flow'
import { removeRecipe } from '@/lib/recipe-book'

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  '입문': { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
  '중급': { bg: 'bg-amber-50 dark:bg-amber-900/20',   text: 'text-amber-600 dark:text-amber-400' },
  '고급': { bg: 'bg-red-50 dark:bg-red-900/20',       text: 'text-red-500 dark:text-red-400' },
}

interface RecipeCardProps {
  flow: Flow
  onRemove: (id: string) => void
  userEmail: string
}

export function RecipeCard({ flow, onRemove, userEmail }: RecipeCardProps) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const diff = DIFFICULTY_COLORS[flow.difficulty] ?? { bg: 'bg-gray-100 dark:bg-[#232323]', text: 'text-gray-500 dark:text-[#a3a3a3]' }

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2500)
      return
    }
    await removeRecipe(userEmail, flow.id)
    onRemove(flow.id)
  }

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-[16px] border border-gray-100 dark:border-white/[0.08] p-5 hover:border-gray-200 dark:hover:border-white/[0.15] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200">
      {/* Top row: tags + difficulty */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-wrap gap-1.5">
          {flow.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10.5px] font-semibold text-gray-400 dark:text-[#737373] bg-gray-100 dark:bg-[#232323] px-2.5 py-0.5 rounded-full tracking-wide uppercase">
              {tag}
            </span>
          ))}
        </div>
        <span className={`shrink-0 ml-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
          {flow.difficulty}
        </span>
      </div>

      {/* Title + Description */}
      <h3 className="text-[16px] font-bold text-gray-900 dark:text-[#f5f5f5] leading-snug mb-1.5">{flow.goal}</h3>
      <p className="text-[13px] text-gray-400 dark:text-[#737373] leading-relaxed mb-4 line-clamp-2">{flow.description}</p>

      {/* Step pills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {flow.steps.map((step) => (
          <span key={step.id} className="flex items-center gap-1.5 text-[12px] text-gray-500 dark:text-[#a3a3a3] bg-gray-50 dark:bg-[#232323] border border-gray-100 dark:border-white/[0.06] px-2.5 py-1 rounded-full">
            <span className="text-[10px] font-bold text-gray-300 dark:text-[#525252]">{String(step.order).padStart(2, '0')}</span>
            {step.title}
          </span>
        ))}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-[#737373] mb-4 pt-3 border-t border-gray-50 dark:border-white/[0.06]">
        <span>⏱ {flow.estimatedTime}</span>
        <span className="text-gray-200 dark:text-[#404040]">·</span>
        <span>{flow.steps.length}단계</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => router.push(`/flow/${flow.id}`)}
          className="flex-1 py-2.5 bg-gray-900 dark:bg-zinc-200 text-white dark:text-zinc-900 text-[13px] font-semibold rounded-[10px] hover:bg-gray-800 dark:hover:bg-zinc-300 active:scale-[0.98] transition-all"
        >
          다시 실행하기 →
        </button>
        <button
          onClick={handleDelete}
          className={`
            px-3.5 py-2.5 rounded-[10px] text-[13px] font-semibold transition-all
            ${confirmDelete
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 dark:bg-[#232323] text-gray-400 dark:text-[#a3a3a3] hover:bg-gray-200 dark:hover:bg-[#2a2a2a]'
            }
          `}
        >
          {confirmDelete ? '확인' : '삭제'}
        </button>
      </div>
    </div>
  )
}
