'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Step, StepStatus } from '@/types/flow'

interface SideProgressBarProps {
  steps: Step[]
  getStepStatus: (index: number) => StepStatus
  onStepClick: (index: number) => void
  visible: boolean
}

export function SideProgressBar({ steps, getStepStatus, onStepClick, visible }: SideProgressBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed right-5 top-1/2 -translate-y-1/2 z-40"
        >
          <div className="bg-white border border-[#E8E9EC] rounded-[16px] px-4 py-4 shadow-lg min-w-[180px]">
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mb-4">Flow Map</p>

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
                        onClick={() => !isPending && onStepClick(index)}
                        disabled={isPending}
                        className={`shrink-0 rounded-full flex items-center justify-center transition-all duration-200
                          ${isPending ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                          ${isActive  ? 'w-7 h-7 bg-gray-900 ring-2 ring-gray-200' : ''}
                          ${isDone    ? 'w-6 h-6 bg-gray-900' : ''}
                          ${isPending ? 'w-5 h-5 bg-white border-2 border-gray-200' : ''}
                        `}
                      >
                        {isDone && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        )}
                        {isActive && (
                          <span className="text-xs leading-none">{step.tool.icon}</span>
                        )}
                        {isPending && (
                          <span className="text-[9px] font-bold text-gray-300">{index + 1}</span>
                        )}
                      </button>

                      {/* 세로 연결선 */}
                      {!isLast && (
                        <div className={`w-[2px] h-8 rounded-full my-0.5 transition-all duration-300
                          ${isDone ? 'bg-gray-900' : 'bg-gray-100'}
                        `} />
                      )}
                    </div>

                    {/* 텍스트 */}
                    <div className="pb-4">
                      <p className={`text-[12px] leading-tight transition-all
                        ${isActive  ? 'font-bold text-gray-900' : ''}
                        ${isDone    ? 'font-medium text-gray-500' : ''}
                        ${isPending ? 'font-medium text-gray-300' : ''}
                      `}>
                        {step.title}
                      </p>
                      <p className={`text-[10px] mt-0.5
                        ${isActive  ? 'text-gray-400' : 'text-gray-300'}
                      `}>
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
