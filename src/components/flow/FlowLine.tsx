'use client'

import { Step, StepStatus } from '@/types/flow'

interface FlowLineProps {
  steps: Step[]
  getStepStatus: (index: number) => StepStatus
  onStepClick: (index: number) => void
}

export function FlowLine({ steps, getStepStatus, onStepClick }: FlowLineProps) {
  return (
    <div className="mb-8 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-0 min-w-max">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => onStepClick(index)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${status === 'active'
                    ? 'bg-gray-900 text-white'
                    : status === 'done'
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-transparent text-gray-300 cursor-default'
                  }
                `}
                disabled={status === 'pending'}
              >
                {status === 'done' ? (
                  <span className="text-xs">✓</span>
                ) : (
                  <span className="text-xs text-inherit opacity-60">{index + 1}</span>
                )}
                <span>{step.title}</span>
              </button>

              {index < steps.length - 1 && (
                <div className={`
                  w-8 h-px mx-1
                  ${getStepStatus(index + 1) === 'pending' ? 'bg-gray-200' : 'bg-gray-400'}
                `} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
