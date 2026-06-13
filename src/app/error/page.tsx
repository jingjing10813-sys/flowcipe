'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'

const EXAMPLES = [
  '블로그 글을 유튜브 쇼츠로 만들고 싶어',
  '10분 만에 리서치 보고서 만들기',
  'SNS 콘텐츠 기획부터 발행까지 자동화',
]

const CONTENT = {
  invalid: {
    title: '워크플로우를 만들기 어려운 목표예요',
    desc: '조금 더 구체적으로 입력해주면\n더 잘 만들어드릴 수 있어요!',
    retry: '다시 입력하기',
  },
  default: {
    title: '잠깐 문제가 생겼어요!',
    desc: '일시적인 오류예요.\n다시 한번 시도해주세요.',
    retry: '다시 시도하기',
  },
}

function ErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const goal = searchParams.get('goal') ?? ''
  const type = searchParams.get('type') === 'invalid' ? 'invalid' : 'default'
  const [showFeedback, setShowFeedback] = useState(false)

  const { title, desc, retry } = CONTENT[type]

  const handleRetry = () => {
    router.push(`/?goal=${encodeURIComponent(goal)}`)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center px-5">
      <div className="w-full max-w-[400px] flex flex-col items-center gap-6 text-center">

        <Image src="/reciflo-symbol-240.svg" alt="Reciflo" width={64} height={64} />

        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-[14px] text-gray-400 dark:text-[#666] leading-relaxed whitespace-pre-line">
            {desc}
          </p>
        </div>

        {type === 'invalid' && (
          <div className="flex flex-col gap-1.5 w-full">
          <p className="text-[11px] text-gray-400 dark:text-[#555] text-left">예시 목표</p>
          <div className="flex flex-nowrap gap-2 overflow-x-auto w-full pb-1 scrollbar-hide">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => router.push(`/?goal=${encodeURIComponent(ex)}&autosubmit=1`)}
                className="flex-shrink-0 text-[12px] px-3.5 py-1.5 rounded-full border bg-white dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/[0.1] hover:border-gray-400 hover:text-gray-700 dark:hover:border-gray-500 dark:hover:text-gray-200 transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
          </div>
        )}

        {goal && (
          <div className="w-full bg-gray-50 dark:bg-[#141414] rounded-[14px] px-4 py-3 text-left">
            <p className="text-[11px] text-gray-400 dark:text-[#555] mb-1">입력하신 목표</p>
            <p className="text-[13.5px] text-gray-700 dark:text-[#bbb] leading-relaxed line-clamp-2">
              {goal}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={handleRetry}
            className="w-full py-4 rounded-[14px] bg-gray-900 dark:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-[15px] hover:bg-gray-700 dark:hover:bg-zinc-300 active:scale-[0.98] transition-all"
          >
            {retry}
          </button>
          <button
            onClick={() => setShowFeedback(true)}
            className="w-full py-4 rounded-[14px] border border-gray-200 dark:border-white/[0.1] text-gray-500 dark:text-[#888] font-semibold text-[14px] hover:bg-gray-50 dark:hover:bg-[#141414] transition-colors"
          >
            피드백 보내기
          </button>
        </div>

      </div>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}
