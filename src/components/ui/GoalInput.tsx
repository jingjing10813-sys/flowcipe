'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingFlow } from './LoadingFlow'

const EXAMPLE_GOALS = [
  { label: '#코딩 없이 AI로 앱 만들기', value: '코딩 없이 AI로 웹앱을 만들고 싶어' },
  { label: '#블로그 글을 유튜브 쇼츠로', value: '블로그 글을 유튜브 쇼츠 영상으로 자동 제작하고 싶어' },
  { label: '#AI 에이전트로 업무 자동화', value: 'AI 에이전트로 이메일·회의록·일정을 자동화하고 싶어' },
]

interface GoalInputProps {
  value?: string
  onChange?: (value: string) => void
}

export function GoalInput({ value: externalValue, onChange: externalOnChange }: GoalInputProps) {
  const router = useRouter()
  const [internalGoal, setInternalGoal] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const goal = externalValue !== undefined ? externalValue : internalGoal
  const setGoal = (v: string) => {
    setInternalGoal(v)
    externalOnChange?.(v)
  }

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
    return <LoadingFlow />
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* 텍스트필드 컨테이너 — focus 시 테두리 강조 */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-[18px] border-2 border-gray-200 dark:border-white/[0.12] focus-within:border-gray-900 dark:focus-within:border-white/60 transition-colors shadow-[0_2px_16px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="무엇을 만들고 싶으세요? (예: 블로그 글을 유튜브 쇼츠로 자동 제작하고 싶어)"
          rows={3}
          autoFocus
          className="w-full resize-none bg-transparent px-5 pt-4 pb-4 text-[15px] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#525252] focus:outline-none leading-relaxed"
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
          w-full py-[18px] rounded-[14px] font-bold text-[15px] transition-all duration-200
          ${goal.trim()
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-[0.98] shadow-[0_4px_14px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_14px_rgba(255,255,255,0.08)]'
            : 'bg-gray-200 dark:bg-[#232323] text-gray-400 dark:text-[#525252] cursor-not-allowed'
          }
        `}
      >
        지금 실행하기 →
      </button>

    </form>
  )
}
