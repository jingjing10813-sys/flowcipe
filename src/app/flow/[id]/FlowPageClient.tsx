'use client'

import { Flow } from '@/types/flow'
import { useFlowState } from '@/hooks/useFlowState'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageShell } from '@/components/layout/PageShell'
import { GoalHeader } from '@/components/flow/GoalHeader'
import { FlowLine } from '@/components/flow/FlowLine'
import { StepCard } from '@/components/flow/StepCard'
import { FlowConnector } from '@/components/flow/FlowConnector'
import { NextActionBlock } from '@/components/flow/NextActionBlock'
import { SaveFloatingButton } from '@/components/flow/SaveFloatingButton'

interface FlowPageClientProps {
  flow: Flow
}

export function FlowPageClient({ flow }: FlowPageClientProps) {
  const { getStepStatus, goToStep, completeCurrentStep, currentStepIndex, isFlowComplete } =
    useFlowState(flow.steps.length)

  return (
    <AppLayout>
      <PageShell>
        <GoalHeader flow={flow} />
        <FlowLine
          steps={flow.steps}
          getStepStatus={getStepStatus}
          onStepClick={goToStep}
        />

        <div className="flex flex-col">
          {flow.steps.map((step, index) => (
            <div key={step.id}>
              <StepCard step={step} status={getStepStatus(index)} />

              {index < flow.steps.length - 1 && (
                <FlowConnector
                  message={step.connectorMessage}
                  onNext={completeCurrentStep}
                  isVisible={currentStepIndex === index && !isFlowComplete}
                />
              )}
            </div>
          ))}

          <NextActionBlock isVisible={isFlowComplete} flow={flow} />
        </div>
      </PageShell>
      <SaveFloatingButton flow={flow} />
    </AppLayout>
  )
}
