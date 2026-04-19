'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Step, StepStatus } from '@/types/flow'

interface SideProgressBarProps {
  steps: Step[]
  getStepStatus: (index: number) => StepStatus
  onStepClick: (index: number) => void
  visible: boolean
  estimatedTime?: string
}

export function SideProgressBar({ steps, getStepStatus, onStepClick, visible, estimatedTime }: SideProgressBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="hidden lg:block fixed right-5 top-1/2 -translate-y-1/2 z-40"
        >
          <div className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/[0.08] rounded-[16px] px-4 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] min-w-[176px]">
            {/* Flow 정보 */}
            {estimatedTime && (
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50 dark:border-white/[0.06]">
                <div>
                  <p className="text-[9px] text-gray-300 dark:text-[#525252] uppercase tracking-wide">예상 시간</p>
                  <p className="text-[12px] font-semibold text-gray-800 dark:text-[#f5f5f5]">{estimatedTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-300 dark:text-[#525252] uppercase tracking-wide">전체</p>
                  <p className="text-[12px] font-semibold text-gray-800 dark:text-[#f5f5f5]">{steps.length}단계</p>
                </div>
              </div>
            )}
            <p className="text-[9.5px] font-bold text-gray-300 dark:text-[#525252] uppercase tracking-widest mb-4">Flow Map</p>

            <div className="flex flex-col">
              {steps.map((step, index) => {
                const status = getStepStatus(index)
                const isActive = status === 'active'
                const isDone = status === 'done'
                const isPending = status === 'pending'
                const isLast = index === steps.length - 1

                return (
                  <div key={step.id} className="flex gap-3">
                    {/* 원 + 세로선 */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => onStepClick(index)}
                        className={`shrink-0 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110
                          ${isActive  ? 'w-6 h-6 bg-gray-900 dark:bg-zinc-300 ring-2 ring-gray-100 dark:ring-zinc-700' : ''}
                          ${isDone    ? 'w-6 h-6 bg-gray-900 dark:bg-zinc-400' : ''}
                          ${isPending ? 'w-6 h-6 bg-white dark:bg-[#232323] border-2 border-gray-200 dark:border-white/[0.12]' : ''}
                        `}
                      >
                        {isDone && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white dark:text-gray-900">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        )}
                        {isActive && (
                          <span className="text-[9px] font-bold text-white dark:text-gray-900">{index + 1}</span>
                        )}
                        {isPending && (
                          <span className="text-[9px] font-bold text-gray-400 dark:text-[#525252]">{index + 1}</span>
                        )}
                      </button>

                      {!isLast && (
                        <div className={`w-[2px] h-8 rounded-full my-0.5 transition-all duration-300
                          ${isDone ? 'bg-gray-800 dark:bg-zinc-500' : 'bg-gray-100 dark:bg-zinc-800'}
                        `} />
                      )}
                    </div>

                    {/* 텍스트 */}
                    <div className="pb-4">
                      <p className={`text-[11.5px] leading-tight transition-all
                        ${isActive  ? 'font-bold text-gray-900 dark:text-[#f5f5f5]' : ''}
                        ${isDone    ? 'font-medium text-gray-500 dark:text-[#737373]' : ''}
                        ${isPending ? 'font-medium text-gray-500 dark:text-[#525252]' : ''}
                      `}>
                        {step.title}
                      </p>
                      <p className="text-[10px] mt-0.5 text-gray-400 dark:text-[#737373]">
                        {step.tool.name}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
