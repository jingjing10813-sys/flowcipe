import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { Flow } from '@/types/flow'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const SYSTEM_PROMPT = `당신은 AI 워크플로우 설계 전문가입니다.
사용자의 목표를 입력받아 단계별 실행 흐름(Flow)을 JSON 형식으로 생성하세요.

## 툴 선택 방식
- 각 단계에 가장 적합한 AI 툴을 Google 검색을 통해 최신 정보 기준으로 선택하세요
- 무료 플랜이 있는 툴을 최우선으로 선택하세요
- 각 카테고리(텍스트, 이미지, UI/UX, 영상, 음성, 문서)에서 현재 가장 사용성이 좋고 최신 업데이트된 툴을 선택하세요
- tool.url은 반드시 실제로 접근 가능한 정확한 URL을 사용하세요

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
        "icon": "🤖",
        "free": true,
        "freeLimit": "무료 플랜 있음",
        "reason": "이 단계에서 이 툴을 추천하는 이유 (15자 이내)"
      },
      "stepType": "prompt",
      "promptType": "system" | "user" | "visual" | "config",
      "prompt": "바로 복사해서 사용할 수 있는 구체적인 프롬프트",
      "inputGuide": "이 단계에서 무엇을 입력해야 하는지 안내",
      "outputGuide": "이 단계의 결과물을 어떻게 활용하는지 안내",
      "connectorMessage": "단계 완료 시 표시할 메시지"
    }
  ]
}

stepType 규칙 (핵심):
- 첫 번째 step은 반드시 stepType: "prompt" — 전체 프롬프트를 제공하여 사용자가 복사 후 툴에서 바로 실행
- 두 번째 step부터는 stepType: "command" — 동일 세션에서 이어서 입력할 짧은 명령어 가이드만 제공
  - command step에는 prompt 대신 commandGuide 필드 사용
  - commandGuide: 사용자가 같은 툴 세션에서 그대로 입력할 수 있는 짧은 명령문 (예: "이 내용을 인스타그램 게시물 형식 3개로 변환해줘")
  - 단, 이전 단계와 다른 툴을 사용하는 경우는 stepType: "prompt"로 전환 가능

기타 규칙:
- steps는 3~5개로 구성
- promptType이 config일 경우 prompt 대신 config 객체 사용 (key-value 형태)
- 모든 텍스트는 한국어로 작성
- tool.free: 무료 플랜 존재 여부 (boolean)
- tool.freeLimit: 무료 플랜의 제한 설명
- tool.reason: 이 단계에서 이 툴을 선택한 이유 (15자 이내, 핵심만)
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
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }],
      },
    })

    const text = result.text?.trim() ?? ''

    // JSON 파싱 (마크다운 코드블록 + search grounding citation 마커 제거)
    const jsonStr = text
      .replace(/^```json\s*/i, '')
      .replace(/\s*```$/, '')
      .replace(/\[\d+\]/g, '')   // [1], [2] citation 마커 제거
      .trim()
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
