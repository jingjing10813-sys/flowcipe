'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface FeedbackEntry {
  id: number
  text: string
  user_name: string
  email: string | null
  created_at: string
}

export default function AdminFeedbackPage() {
  const { data: session, status } = useSession()
  const [list, setList] = useState<FeedbackEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/feedback')
      .then((r) => {
        if (!r.ok) throw new Error('unauthorized')
        return r.json()
      })
      .then(setList)
      .catch(() => setError('접근 권한이 없습니다.'))
      .finally(() => setLoading(false))
  }, [status])

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">불러오는 중...</div>
  }

  if (!session || error) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">{error || '로그인이 필요합니다.'}</div>
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] px-6 py-10 max-w-2xl mx-auto">
      <h1 className="text-[22px] font-bold text-gray-900 mb-1">피드백</h1>
      <p className="text-[13px] text-gray-400 mb-8">{list.length}개</p>

      {list.length === 0 ? (
        <p className="text-[14px] text-gray-400">아직 피드백이 없어요.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map((item) => (
            <div key={item.id} className="bg-white rounded-[16px] px-5 py-4 border border-gray-100">
              <p className="text-[14px] text-gray-900 leading-relaxed whitespace-pre-wrap mb-3">{item.text}</p>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-gray-400">{item.user_name}{item.email ? ` · ${item.email}` : ''}</span>
                <span className="text-[12px] text-gray-300">
                  {new Date(item.created_at).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
