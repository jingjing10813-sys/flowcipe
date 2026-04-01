'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingFlow } from './LoadingFlow'

const EXAMPLE_GOALS = [
  { label: '#블로그 글을 영상으로 만들기', value: '블로그 글을 유튜브 영상으로 만들고 싶어' },
  { label: '#SNS 게시물 자동화', value: 'SNS 게시물을 자동으로 만들고 싶어' },
  { label: '#GPT-4로 고객 피드백 분석', value: 'GPT-4로 고객 피드백을 분석하고 싶어' },
]

export function GoalInput() {
  const router = useRouter()
  const [goal, setGoal] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal.trim() || isLoading) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/generate-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // flow 데이터를 sessionStorage에 저장 후 이동
      sessionStorage.setItem(`flow_${data.flow.id}`, JSON.stringify(data.flow))
      router.push(`/flow/${data.flow.id}`)
    } catch (err) {
      console.error(err)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-[20px] bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-900 mb-1">Flow를 생성하는 중...</p>
        <p className="text-xs text-gray-400 mb-4">
          태스크 분해 엔진이 실행 가능한 워크플로우로 나누고 있습니다
        </p>
        <LoadingFlow />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="relative">
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="어떤 목표를 달성하고 싶으신가요?"
          rows={3}
          className="w-full resize-none rounded-[16px] border border-gray-200 bg-white px-5 py-4 text-base text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e as unknown as React.FormEvent)
            }
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!goal.trim()}
        className={`
          w-full py-4 rounded-[14px] font-semibold text-base
          transition-all duration-200
          ${goal.trim()
            ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }
        `}
      >
        Flow 만들기 →
      </button>

      {/* Example Goals */}
      <div>
        <p className="text-xs text-gray-400 mb-2 font-medium">예시</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_GOALS.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => setGoal(example.value)}
              className="text-sm text-gray-500 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-all"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}
