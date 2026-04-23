'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Flow } from '@/types/flow'
import { FlowPageClient } from './FlowPageClient'
import { supabase } from '@/lib/supabase'
import { getMockFlow } from '@/lib/mock-data'

export default function FlowPage() {
  const params = useParams()
  const id = params.id as string
  const [flow, setFlow] = useState<Flow | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      // 1. sessionStorage 우선
      const stored = sessionStorage.getItem(`flow_${id}`)
      if (stored) {
        setFlow(JSON.parse(stored))
        return
      }

      // 2. Supabase flows 테이블
      const { data: flowRow } = await supabase
        .from('flows')
        .select('flow')
        .eq('id', id)
        .maybeSingle()
      if (flowRow?.flow) {
        setFlow(flowRow.flow as Flow)
        return
      }

      // 3. saved_recipes fallback (재실행 케이스)
      const { data: recipes } = await supabase
        .from('saved_recipes')
        .select('flow')
        .eq('flow_id', id)
        .limit(1)
      if (recipes?.[0]?.flow) {
        setFlow(recipes[0].flow as Flow)
        return
      }

      // 4. mock-data fallback (랜딩 예시 카드)
      const mock = getMockFlow(id)
      if (mock) {
        setFlow(mock)
        return
      }

      setNotFound(true)
    }
    load()
  }, [id])

  if (notFound) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      Flow를 찾을 수 없어요.
    </div>
  )

  if (!flow) return null

  return <FlowPageClient flow={flow} />
}
