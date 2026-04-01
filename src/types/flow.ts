export type ToolId = 'claude' | 'chatgpt' | 'runway' | 'elevenlabs' | 'midjourney' | 'notion' | 'gpt4o'

export type PromptType = 'system' | 'user' | 'visual' | 'config'

export type Difficulty = '입문' | '중급' | '고급'

export interface Tool {
  id: ToolId
  name: string
  model?: string
  url: string
  icon: string
  free?: boolean
  freeLimit?: string
  reason?: string
}

export interface StepConfig {
  [key: string]: string
}

export type StepType = 'prompt' | 'command'

export interface Step {
  id: string
  order: number
  title: string
  tool: Tool
  stepType: StepType
  promptType: PromptType
  prompt?: string
  commandGuide?: string
  config?: StepConfig
  inputGuide: string
  outputGuide: string
  connectorMessage: string
}

export interface Flow {
  id: string
  goal: string
  description: string
  tags: string[]
  difficulty: Difficulty
  estimatedTime: string
  createdAt: string
  steps: Step[]
}

export type StepStatus = 'pending' | 'active' | 'done'
