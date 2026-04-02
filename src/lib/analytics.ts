import { supabase } from './supabase'

type EventName =
  | 'submit_click'
  | 'flow_generated'
  | 'step_started'
  | 'step_completed'
  | 'flow_completed'
  | 'login_prompted'
  | 'login_success'

interface TrackEventParams {
  event: EventName
  user_id?: string
  user_email?: string
  flow_id?: string
  goal_text?: string
  step_index?: number
  steps_count?: number
}

export async function trackEvent(params: TrackEventParams) {
  try {
    await supabase.from('flow_events').insert({
      ...params,
      created_at: new Date().toISOString(),
    })
  } catch {
    // 트래킹 실패가 앱 동작에 영향 없도록 조용히 처리
  }
}
