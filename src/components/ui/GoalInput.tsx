'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LoadingFlow } from './LoadingFlow'
import { LoginModal } from '@/components/auth/LoginModal'
import { trackEvent } from '@/lib/analytics'

const EXAMPLES = [
  '블로그 글을 유튜브 쇼츠로 자동 제작하고 싶어',
  '경쟁사 리서치를 10분 안에 끝내고 싶어',
  'SNS 콘텐츠 기획부터 발행까지 자동화하고 싶어',
  '이메일 초안을 AI로 빠르게 작성하고 싶어',
  '내 아이디어를 PPT로 자동 정리하고 싶어',
]

interface GoalInputProps {
  value?: string
  onChange?: (value: string) => void
}

export function GoalInput({ value: externalValue, onChange: externalOnChange }: GoalInputProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [internalGoal, setInternalGoal] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [typedText, setTypedText] = useState('')
  const pendingNavRef = useRef<string | null>(null)
  const animDoneRef = useRef(false)
  const phraseIdx = useRef(0)
  const charIdx = useRef(0)
  const isDeleting = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const goal = externalValue !== undefined ? externalValue : internalGoal
  const setGoal = (v: string) => {
    setInternalGoal(v)
    externalOnChange?.(v)
  }

  useEffect(() => {
    const tick = () => {
      const phrase = EXAMPLES[phraseIdx.current]

      if (!isDeleting.current) {
        charIdx.current += 1
        setTypedText(phrase.slice(0, charIdx.current))

        if (charIdx.current === phrase.length) {
          // 다 타이핑됐으면 1.6초 대기 후 삭제 시작
          timerRef.current = setTimeout(() => {
            isDeleting.current = true
            tick()
          }, 1600)
          return
        }
      } else {
        charIdx.current -= 1
        setTypedText(phrase.slice(0, charIdx.current))

        if (charIdx.current === 0) {
          // 다 지워지면 다음 문구로
          isDeleting.current = false
          phraseIdx.current = (phraseIdx.current + 1) % EXAMPLES.length
          timerRef.current = setTimeout(tick, 400)
          return
        }
      }

      const speed = isDeleting.current ? 28 : 55
      timerRef.current = setTimeout(tick, speed)
    }

    timerRef.current = setTimeout(tick, 800)
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal.trim() || isLoading) return

    if (!session) {
      trackEvent({ event: 'login_prompted', goal_text: goal.trim() })
      setShowLogin(true)
      return
    }

    trackEvent({
      event: 'submit_click',
      user_id: session.user?.email ?? undefined,
      user_email: session.user?.email ?? undefined,
      goal_text: goal.trim(),
    })

    setIsLoading(true)
    try {
      const res = await fetch('/api/generate-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      trackEvent({
        event: 'flow_generated',
        user_id: session.user?.email ?? undefined,
        user_email: session.user?.email ?? undefined,
        flow_id: data.flow.id,
        goal_text: goal.trim(),
        steps_count: data.flow.steps?.length,
      })

      sessionStorage.setItem(`flow_${data.flow.id}`, JSON.stringify(data.flow))
      if (animDoneRef.current) {
        router.push(`/flow/${data.flow.id}`)
      } else {
        pendingNavRef.current = `/flow/${data.flow.id}`
      }
    } catch (err) {
      console.error(err)
      setIsLoading(false)
    }
  }

  const handleAnimComplete = () => {
    animDoneRef.current = true
    if (pendingNavRef.current) router.push(pendingNavRef.current)
  }

  if (isLoading) return <LoadingFlow onComplete={handleAnimComplete} />

  const showTyping = !goal && !isFocused

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative bg-white dark:bg-[#1a1a1a] rounded-[18px] border-2 border-gray-200 dark:border-white/[0.12] focus-within:border-gray-900 dark:focus-within:border-white/60 transition-colors shadow-[0_2px_16px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={3}
            autoFocus
            className="w-full resize-none bg-transparent px-5 pt-4 pb-4 text-[15px] text-gray-900 dark:text-white focus:outline-none leading-relaxed relative z-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e as unknown as React.FormEvent)
              }
            }}
          />
          {/* 타이핑 애니메이션 placeholder */}
          {showTyping && (
            <div className="absolute top-4 left-5 right-5 pointer-events-none text-[15px] leading-relaxed text-gray-400 dark:text-[#525252]">
              <span className="text-gray-300 dark:text-[#3a3a3a] mr-1">무엇을 만들고 싶으세요?</span>
              {typedText}
              <span className="inline-block w-[2px] h-[1em] bg-gray-400 dark:bg-[#525252] ml-[1px] align-middle animate-pulse" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!goal.trim()}
          className={`
            w-full py-[18px] rounded-[14px] font-bold text-[15px] transition-all duration-200
            ${goal.trim()
              ? 'bg-gray-900 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-gray-700 dark:hover:bg-zinc-300 active:scale-[0.98] shadow-[0_4px_14px_rgba(0,0,0,0.15)]'
              : 'bg-gray-200 dark:bg-[#232323] text-gray-400 dark:text-[#525252] cursor-not-allowed'
            }
          `}
        >
          지금 실행하기 →
        </button>
      </form>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
