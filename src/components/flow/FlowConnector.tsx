'use client'

import { motion, AnimatePresence } from 'framer-motion'

const NEXT_STEP_INDUCTION: Record<number, string> = {
  2: '여기까지 왔으면 전체의 75%가 끝난 거예요.',
  3: '완성까지 딱 1분 남았어요.',
}

interface FlowConnectorProps {
  message: string
  onNext: () => void
  isVisible: boolean
  nextStepOrder: number
  totalSteps: number
}

export function FlowConnector({ message, onNext, isVisible, nextStepOrder, totalSteps }: FlowConnectorProps) {
  const inductionKey = nextStepOrder <= 2 ? nextStepOrder : nextStepOrder === totalSteps ? 3 : null
  const inductionLine = inductionKey ? NEXT_STEP_INDUCTION[inductionKey] : null
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center py-2"
        >
          <div className="w-px h-5 bg-gray-100 dark:bg-white/[0.08]" />

          <div className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/[0.08] rounded-[14px] px-5 py-4 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
            <div>
              <p className="text-[11.5px] font-semibold text-emerald-500 dark:text-emerald-400 mb-0.5">{message}</p>
              <p className="text-[13px] text-gray-400 dark:text-[#737373]">
                {inductionLine ?? '결과를 복사해서 다음 단계에 붙여넣으세요'}
              </p>
            </div>
            <button
              onClick={onNext}
              className="shrink-0 ml-4 bg-gray-900 dark:bg-[#f0f0f0] text-white dark:text-gray-900 text-[13px] font-bold px-5 py-2.5 rounded-[9px] hover:bg-gray-800 dark:hover:bg-white active:scale-[0.97] transition-all"
            >
              다음 단계 →
            </button>
          </div>

          <div className="w-px h-5 bg-gray-100 dark:bg-white/[0.08]" />
        </motion.div>
      )}

      {!isVisible && (
        <div className="flex justify-center py-2">
          <div className="w-px h-10 bg-gray-100 dark:bg-white/[0.08]" />
        </div>
      )}
    </AnimatePresence>
  )
}
