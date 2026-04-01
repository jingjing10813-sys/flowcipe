import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { Flow } from '@/types/flow'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const SYSTEM_PROMPT = `당신은 AI 워크플로우 설계 전문가입니다.
사용자의 목표를 입력받아 단계별 실행 흐름(Flow)을 JSON 형식으로 생성하세요.

사용 가능한 툴 목록:
- claude: Claude AI (텍스트 생성, 요약, 분석) url: https://claude.ai/new
- gpt4o: ChatGPT GPT-4o (텍스트 생성, 분석) url: https://chat.openai.com/
- midjourney: Midjourney (이미지 생성) url: https://www.midjourney.com/
- runway: Runway (영상 생성) url: https://app.runwayml.com/
- elevenlabs: ElevenLabs (음성 생성) url: https://elevenlabs.io/
- notion: Notion (문서 정리) url: https://www.notion.so/

반드시 아래 JSON 구조를 정확히 따르세요. 다른 텍스트 없이 JSON만 반환하세요:

{
  "id": "flow-{랜덤 6자리 숫자}",
  "goal": "사용자 목표 요약 (20자 이내)",
  "description": "Flow에 대한 설명 (40자 이내)",
  "tags": ["태그1", "태그2"],
  "difficulty": "입문" | "중급" | "고급",
  "estimatedTime": "예상 시간 (예: 10분)",
  "createdAt": "현재 ISO 시간",
  "steps": [
    {
      "id": "step-1",
      "order": 1,
      "title": "단계 제목",
      "tool": {
        "id": "claude",
        "name": "Claude",
        "model": "Claude 3.5 Sonnet",
        "url": "https://claude.ai/new",
        "icon": "🤖"
      },
      "promptType": "system" | "user" | "visual" | "config",
      "prompt": "이 단계에서 사용할 실제 프롬프트 (구체적이고 바로 사용 가능하게)",
      "inputGuide": "이 단계에서 무엇을 입력해야 하는지 안내",
      "outputGuide": "이 단계의 결과물을 어떻게 활용하는지 안내",
      "connectorMessage": "단계 완료 시 표시할 메시지"
    }
  ]
}

규칙:
- steps는 3~5개로 구성
- 각 prompt는 바로 복사해서 쓸 수 있을 만큼 구체적으로 작성
- promptType이 config일 경우 prompt 대신 config 객체 사용 (key-value 형태)
- 모든 텍스트는 한국어로 작성
`

export async function POST(req: NextRequest) {
  try {
    const { goal } = await req.json()

    if (!goal?.trim()) {
      return NextResponse.json({ error: '목표를 입력해주세요' }, { status: 400 })
    }

    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: goal,
      config: { systemInstruction: SYSTEM_PROMPT },
    })

    const text = result.text?.trim() ?? ''

    // JSON 파싱 (마크다운 코드블록 제거)
    const jsonStr = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim()
    const flow: Flow = JSON.parse(jsonStr)

    // prompt가 객체인 경우 문자열로 변환
    flow.steps = flow.steps.map((step) => ({
      ...step,
      prompt: typeof step.prompt === 'string'
        ? step.prompt
        : step.prompt != null
          ? Object.values(step.prompt as Record<string, string>).join('\n')
          : undefined,
    }))

    return NextResponse.json({ flow })
  } catch (err) {
    console.error('Gemini API error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
