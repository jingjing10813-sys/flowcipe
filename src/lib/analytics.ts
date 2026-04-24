import * as amplitude from '@amplitude/analytics-browser'
import { supabase } from '@/lib/supabase'

let initialized = false

export function initAmplitude() {
  if (initialized || typeof window === 'undefined') return
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, { autocapture: false })
  initialized = true
}

export function identifyUser(email: string) {
  initAmplitude()
  amplitude.setUserId(email)
}

function track(event: string, props?: Record<string, unknown>) {
  initAmplitude()
  amplitude.track(event, props)
  ;(async () => {
    const { error } = await supabase.from('events').insert({ event_name: event, flow_id: props?.flow_id as string ?? null, properties: props ?? {} })
    if (error) console.error('[analytics] event insert failed:', error)
  })()
}

// Flow 생성 요청 (목표 입력 → 생성)
export function trackFlowGenerated(goal: string) {
  track('flow_generated', { goal })
}

// Flow 실행 시작 — 실행 전환율 분자
export function trackFlowStarted(flowId: string, goal: string) {
  track('flow_started', { flow_id: flowId, goal })
}

// Step 완료 — Step 완료율
export function trackStepCompleted(flowId: string, stepOrder: number, stepTitle: string) {
  track('step_completed', { flow_id: flowId, step_order: stepOrder, step_title: stepTitle })
}

// Flow 완주 — Flow 완주율
export function trackFlowCompleted(flowId: string, goal: string, totalSteps: number) {
  track('flow_completed', { flow_id: flowId, goal, total_steps: totalSteps })
}

// 레시피 저장
export function trackRecipeSaved(flowId: string, goal: string) {
  track('recipe_saved', { flow_id: flowId, goal })
}

// CTA 클릭 (복사 버튼)
export function trackCtaClicked(flowId: string, stepOrder: number, stepTitle: string) {
  track('cta_clicked', { flow_id: flowId, step_order: stepOrder, step_title: stepTitle })
}
