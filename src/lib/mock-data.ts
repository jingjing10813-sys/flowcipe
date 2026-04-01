import { Flow, Tool } from '@/types/flow'

export const TOOLS: Record<string, Tool> = {
  gpt4o: {
    id: 'gpt4o',
    name: 'ChatGPT',
    model: 'GPT-4o · Long Context',
    url: 'https://chat.openai.com/',
    icon: '💬',
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    model: 'Claude 3.5 Sonnet',
    url: 'https://claude.ai/new',
    icon: '🤖',
  },
  runway: {
    id: 'runway',
    name: 'Runway',
    model: 'Gen 3 · Text to Video',
    url: 'https://app.runwayml.com/',
    icon: '🎬',
  },
  elevenlabs: {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    model: 'Multilingual v2',
    url: 'https://elevenlabs.io/',
    icon: '🎙️',
  },
  midjourney: {
    id: 'midjourney',
    name: 'Midjourney',
    model: 'v6.1',
    url: 'https://www.midjourney.com/',
    icon: '🎨',
  },
  notion: {
    id: 'notion',
    name: 'Notion',
    url: 'https://www.notion.so/',
    icon: '📝',
  },
}

export const MOCK_FLOW: Flow = {
  id: 'mock-flow-1',
  goal: '블로그 글을 영상으로 변환하기',
  description: '글 기반의 깊이 있는 소스를 활용해 유튜브 영상을 자동으로 제작합니다',
  tags: ['WORKFLOW RECIPE', 'CONTENT CREATION'],
  difficulty: '중급',
  estimatedTime: '10분',
  createdAt: new Date().toISOString(),
  steps: [
    {
      id: 'step-1',
      order: 1,
      title: '텍스트 요약',
      tool: TOOLS.gpt4o,
      stepType: 'prompt',
      promptType: 'system',
      prompt: `첨부된 블로그 글의 핵심 내용을 3가지 주요 포인트로 요약하고, 영상의 시각적 흐름을 고려하여 각 포인트의 핵심 메시지를 추출하세요.

출력 형식:
- 훅(Hook): 시청자를 첫 5초 안에 사로잡을 문장 1개
- 핵심 포인트 1: [내용 2~3문장]
- 핵심 포인트 2: [내용 2~3문장]
- 핵심 포인트 3: [내용 2~3문장]

[여기에 블로그 글을 붙여넣으세요]`,
      inputGuide: '블로그 글 전체를 붙여넣으세요',
      outputGuide: '생성된 요약을 스크립트 작성에 사용합니다',
      connectorMessage: '텍스트 요약 완료됨',
    },
    {
      id: 'step-2',
      order: 2,
      title: '스크립트 생성',
      tool: TOOLS.claude,
      stepType: 'prompt',
      promptType: 'user',
      prompt: `요약된 포인트를 바탕으로 5분 길이의 유튜브 스크립트를 작성해주세요. 전문적이면서도 친근하게, 도입부에서는 시청자의 주의를 끌 수 있는 후킹 멘트를 포함해.

구성:
- 오프닝 훅 (30초): 강렬한 질문 또는 놀라운 사실로 시작
- 본론 (3분 30초): 3가지 핵심 포인트를 자연스럽게 연결
- 클로징 (1분): 핵심 요약 + 구독/좋아요 유도

[이전 단계의 요약 결과를 붙여넣으세요]`,
      inputGuide: '이전 단계에서 생성한 3가지 핵심 포인트를 붙여넣으세요',
      outputGuide: '완성된 스크립트를 영상 제작과 음성 생성에 사용합니다',
      connectorMessage: '스크립트 생성 완료됨',
    },
    {
      id: 'step-3',
      order: 3,
      title: '영상 제작',
      tool: TOOLS.runway,
      stepType: 'prompt',
      promptType: 'visual',
      prompt: `Cinematic close-up of a high-tech digital workspace, soft blue lighting, hyper-realistic, 4k, smooth camera motion, futuristic interface elements floating in the air, professional presenter speaking naturally, warm studio atmosphere, shallow depth of field`,
      inputGuide: '위 프롬프트를 Runway에 붙여넣고 스크립트 길이에 맞게 영상 길이를 설정하세요',
      outputGuide: '생성된 영상에 다음 단계에서 음성을 입힙니다',
      connectorMessage: '영상 제작 완료됨',
    },
    {
      id: 'step-4',
      order: 4,
      title: '음성 추가',
      tool: TOOLS.elevenlabs,
      stepType: 'prompt',
      promptType: 'config',
      config: {
        'Voice': 'Fin (Professional Narrator)',
        'Stability': '65%',
        'Clarity': '88%',
        'Style Exaggeration': '15%',
      },
      inputGuide: 'Step 2에서 작성한 스크립트를 ElevenLabs 텍스트 입력란에 붙여넣으세요',
      outputGuide: '생성된 음성(MP3)을 영상에 합성하면 완성됩니다',
      connectorMessage: '음성 추가 완료됨',
    },
  ],
}

export function getMockFlow(id: string): Flow {
  return { ...MOCK_FLOW, id }
}
