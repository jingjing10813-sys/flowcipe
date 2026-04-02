'use client'

import { useState, useEffect } from 'react'

interface FeedbackModalProps {
  onClose: () => void
}

export function FeedbackModal({ onClose }: FeedbackModalProps) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || status === 'loading') return

    setStatus('loading')
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    setStatus('done')
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] p-8 w-full max-w-[420px] mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {status === 'done' ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 className="text-[20px] font-bold text-gray-900 mb-2">감사합니다 🙏</h2>
            <p className="text-[14px] text-gray-400 leading-relaxed mb-6">
              소중한 피드백이 잘 전달됐어요.<br />
              더 나은 Reciflo를 만드는 데 큰 도움이 됩니다.
            </p>
            <button
              onClick={onClose}
              className="text-[13.5px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-[20px] font-bold text-gray-900 mb-1">피드백 보내기</h2>
            <p className="text-[14px] text-gray-400 mb-6 leading-relaxed">
              불편한 점, 원하는 기능, 칭찬 모두 좋아요.<br />
              모든 피드백을 직접 읽고 있어요.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="자유롭게 적어주세요 :)"
                rows={5}
                autoFocus
                className="w-full resize-none rounded-[14px] border-2 border-gray-200 focus:border-gray-900 bg-transparent px-4 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors leading-relaxed"
              />
              <button
                type="submit"
                disabled={!text.trim()}
                className={`w-full py-3.5 rounded-[12px] font-semibold text-[14px] transition-all
                  ${text.trim()
                    ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
                    : 'bg-gray-900 text-white opacity-25 cursor-not-allowed'
                  }`}
              >
                {status === 'loading' ? '전송 중...' : '보내기'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
