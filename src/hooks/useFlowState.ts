'use client'

import { useState, useCallback } from 'react'
import { StepStatus } from '@/types/flow'

export function useFlowState(totalSteps: number) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const getStepStatus = useCallback(
    (index: number): StepStatus => {
      if (completedSteps.has(index)) return 'done'
      if (index === currentStepIndex) return 'active'
      return 'pending'
    },
    [currentStepIndex, completedSteps]
  )

  const goToStep = useCallback((index: number) => {
    setCurrentStepIndex(index)
  }, [])

  const completeCurrentStep = useCallback(() => {
    setCompletedSteps((prev) => new Set(prev).add(currentStepIndex))
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }, [currentStepIndex, totalSteps])

  const isFlowComplete = completedSteps.size === totalSteps

  return {
    currentStepIndex,
    completedSteps,
    getStepStatus,
    goToStep,
    completeCurrentStep,
    isFlowComplete,
  }
}
