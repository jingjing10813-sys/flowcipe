'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getMockFlow } from '@/lib/mock-data'
import { Flow } from '@/types/flow'
import { FlowPageClient } from './FlowPageClient'

export default function FlowPage() {
  const params = useParams()
  const id = params.id as string
  const [flow, setFlow] = useState<Flow | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(`flow_${id}`)
    if (stored) {
      setFlow(JSON.parse(stored))
    } else {
      setFlow(getMockFlow(id))
    }
  }, [id])

  if (!flow) return null

  return <FlowPageClient flow={flow} />
}
