'use client'

import { useState, useCallback, useEffect } from 'react'
import { StepStatus } from '@/types/flow'

function getStorageKey(flowId: string) {
  return `flow_progress_${flowId}`
}

function loadProgress(flowId: string) {
  try {
    const raw = localStorage.getItem(getStorageKey(flowId))
    if (!raw) return null
    const { currentStepIndex, completedSteps, copiedSteps } = JSON.parse(raw)
    return {
      currentStepIndex: currentStepIndex ?? 0,
      completedSteps: new Set<number>(completedSteps ?? []),
      copiedSteps: new Set<number>(copiedSteps ?? []),
    }
  } catch {
    return null
  }
}

function saveProgress(flowId: string, currentStepIndex: number, completedSteps: Set<number>, copiedSteps: Set<number>) {
  try {
    localStorage.setItem(getStorageKey(flowId), JSON.stringify({
      currentStepIndex,
      completedSteps: Array.from(completedSteps),
      copiedSteps: Array.from(copiedSteps),
    }))
  } catch {}
}

function clearProgress(flowId: string) {
  try {
    localStorage.removeItem(getStorageKey(flowId))
  } catch {}
}

export function useFlowState(totalSteps: number, flowId: string) {
  const saved = typeof window !== 'undefined' ? loadProgress(flowId) : null

  const [currentStepIndex, setCurrentStepIndex] = useState(saved?.currentStepIndex ?? 0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(saved?.completedSteps ?? new Set())
  const [copiedSteps, setCopiedSteps] = useState<Set<number>>(saved?.copiedSteps ?? new Set())

  useEffect(() => {
    saveProgress(flowId, currentStepIndex, completedSteps, copiedSteps)
  }, [flowId, currentStepIndex, completedSteps, copiedSteps])

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
      setCurrentStepIndex((prev: number) => prev + 1)
    }
  }, [currentStepIndex, totalSteps])

  const isFlowComplete = completedSteps.size === totalSteps

  const resetFlow = useCallback(() => {
    setCurrentStepIndex(0)
    setCompletedSteps(new Set())
    setCopiedSteps(new Set())
    clearProgress(flowId)
  }, [flowId])

  return {
    currentStepIndex,
    completedSteps,
    copiedSteps,
    getStepStatus,
    goToStep,
    markStepCopied,
    completeCurrentStep,
    resetFlow,
    isFlowComplete,
  }
}
