import { getMockFlow } from '@/lib/mock-data'
import { FlowPageClient } from './FlowPageClient'

interface FlowPageProps {
  params: { id: string }
}

export default function FlowPage({ params }: FlowPageProps) {
  // TODO: 실제 API 연결 시 Supabase에서 flow 조회
  const flow = getMockFlow(params.id)

  return <FlowPageClient flow={flow} />
}
