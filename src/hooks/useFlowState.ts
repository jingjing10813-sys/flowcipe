'use client'

import { useState, useCallback } from 'react'
import { StepStatus } from '@/types/flow'

export function useFlowState(totalSteps: number) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [copiedSteps, setCopiedSteps] = useState<Set<number>>(new Set())

  const getStepStatus = useCallback(
    (index: number): StepStatus => {
      if (index === currentStepIndex) return 'active'
      if (completedSteps.has(index)) return 'done'
      return 'pending'
    },
    [currentStepIndex, completedSteps]
  )

  const goToStep = useCallback((index: number) => {
    setCurrentStepIndex(index)
  }, [])

  const markStepCopied = useCallback((index: number) => {
    setCopiedSteps((prev) => new Set(prev).add(index))
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
    copiedSteps,
    getStepStatus,
    goToStep,
    markStepCopied,
    completeCurrentStep,
    isFlowComplete,
  }
}
