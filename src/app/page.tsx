'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageShell } from '@/components/layout/PageShell'
import { GoalInput } from '@/components/ui/GoalInput'
import Link from 'next/link'

const POPULAR_RECIPES = [
  {
    id: 'mock-flow-1',
    badge: '🔥 지금 뜨는 레시피',
    updatedAt: '방금 전',
    title: '블로그 글 → 유튜브 쇼츠 자동 제작',
    description: '텍스트 블로그를 AI가 쇼츠 대본으로 압축하고 AI 아바타 영상까지 자동 생성합니다',
    steps: [
      { no: '01', label: '쇼츠 대본 압축', sub: 'Claude' },
      { no: '02', label: 'AI 아바타 영상', sub: 'HeyGen' },
      { no: '03', label: '자막·업로드', sub: 'Vrew' },
    ],
    tools: ['Claude', 'HeyGen', 'Vrew'],
    category: 'VIDEO',
  },
  {
    id: 'mock-flow-1',
    badge: '🚀 Vibe Coding',
    updatedAt: '3시간 전',
    title: '코딩 없이 AI로 앱 만들기',
    description: '자연어 프롬프트만으로 웹앱·모바일앱을 기획부터 배포까지 완성하는 노코드 개발 워크플로우',
    steps: [
      { no: '01', label: '앱 기획서 작성', sub: 'Claude' },
      { no: '02', label: '앱 자동 빌드', sub: 'Cursor / Replit' },
      { no: '03', label: '원클릭 배포', sub: 'Vercel' },
    ],
    tools: ['Claude', 'Cursor', 'Vercel'],
    category: 'PRODUCTIVITY',
  },
  {
    id: 'mock-flow-1',
    badge: '📊 리서치 자동화',
    updatedAt: '1시간 전',
    title: 'AI 리서치 보고서 자동 작성',
    description: 'AI 에이전트가 웹 검색부터 핵심 인사이트 추출, 보고서 완성까지 자동으로 처리합니다',
    steps: [
      { no: '01', label: '웹 리서치', sub: 'Perplexity Pro' },
      { no: '02', label: '인사이트 분석', sub: 'Claude' },
      { no: '03', label: '보고서 완성', sub: 'Notion AI' },
    ],
    tools: ['Perplexity', 'Claude', 'Notion AI'],
    category: 'RESEARCH',
  },
  {
    id: 'mock-flow-1',
    badge: '✨ AI 디자인',
    updatedAt: '5시간 전',
    title: 'AI로 UI/UX 목업 즉시 생성',
    description: '텍스트 설명만으로 반응형 UI 화면을 자동 생성하고 Figma로 바로 내보냅니다',
    steps: [
      { no: '01', label: 'UI 구조 기획', sub: 'Claude' },
      { no: '02', label: 'UI 화면 생성', sub: 'Google Stitch' },
      { no: '03', label: 'Figma 내보내기', sub: 'Google Stitch' },
    ],
    tools: ['Claude', 'Google Stitch', 'Figma'],
    category: 'DESIGN',
  },
  {
    id: 'mock-flow-1',
    badge: '📣 마케팅 자동화',
    updatedAt: '2일 전',
    title: 'SNS 콘텐츠 에이전트 자동화',
    description: 'AI 에이전트가 콘텐츠 캘린더 생성부터 플랫폼별 카피 작성·예약 발행까지 자동 처리합니다',
    steps: [
      { no: '01', label: '콘텐츠 캘린더', sub: 'ChatGPT' },
      { no: '02', label: '카피 자동 생성', sub: 'Jasper AI' },
      { no: '03', label: '예약 자동 발행', sub: 'Zapier AI' },
    ],
    tools: ['ChatGPT', 'Jasper', 'Zapier AI'],
    category: 'MARKETING',
  },
  {
    id: 'mock-flow-1',
    badge: '⚡ 업무 자동화',
    updatedAt: '1일 전',
    title: 'AI 에이전트 업무 자동화',
    description: '회의록 요약·이메일 처리·일정 관리를 AI 에이전트가 자율적으로 처리합니다',
    steps: [
      { no: '01', label: '회의록 자동 요약', sub: 'Microsoft Copilot' },
      { no: '02', label: '이메일 자동 처리', sub: 'Zapier AI' },
      { no: '03', label: '주간 계획 정리', sub: 'Notion AI' },
    ],
    tools: ['Copilot', 'Zapier AI', 'Notion AI'],
    category: 'PRODUCTIVITY',
  },
]

const TESTIMONIALS = [
  {
    stars: 5,
    text: 'Vibe Coding으로 앱 만들려다 막혔는데, Runflo가 Cursor랑 Claude 어떻게 연결하는지 바로 알려줬어요. 진짜 신기했음.',
    name: '이준혁',
    role: 'INDIE HACKER',
  },
  {
    stars: 5,
    text: '쇼츠 자동화 워크플로우 덕분에 매일 영상 올리고 있어요. HeyGen이랑 Vrew 조합은 몰랐는데 Runflo가 알려줬어요.',
    name: '박소연',
    role: 'YOUTUBE CREATOR',
  },
  {
    stars: 5,
    text: 'Google Stitch 써서 UI 목업 뽑는 플로우 만들고 나서 디자인 속도가 3배 빨라졌어요. 툴 추천이 항상 최신이라 좋아요.',
    name: '김태민',
    role: 'PRODUCT DESIGNER',
  },
]

const CHIP_SUGGESTIONS: { label: string; value: string }[] = [
  { label: '#코딩 없이 AI로 앱 만들기', value: '코딩 없이 AI로 웹앱을 만들고 싶어' },
  { label: '#블로그 글을 유튜브 쇼츠로', value: '블로그 글을 유튜브 쇼츠 영상으로 자동 제작하고 싶어' },
  { label: '#AI로 UI 목업 즉시 생성', value: 'AI로 UI/UX 목업을 즉시 생성하고 Figma로 내보내고 싶어' },
  { label: '#AI 에이전트로 이메일 자동화', value: 'AI 에이전트로 이메일·회의록·일정을 자동화하고 싶어' },
  { label: '#10분 만에 리서치 보고서 완성', value: '10분 만에 AI로 시장조사 보고서를 작성하고 싶어' },
  { label: '#인스타 릴스 AI 자동 제작', value: '인스타그램 릴스를 AI로 자동 제작하고 싶어' },
  { label: '#AI로 브랜드 디자인 시안 만들기', value: 'AI로 브랜드 디자인 시안을 빠르게 만들고 싶어' },
  { label: '#SNS 콘텐츠 에이전트 자동화', value: 'SNS 콘텐츠 기획·작성·발행을 AI 에이전트로 자동화하고 싶어' },
]

export default function Home() {
  const [goal, setGoal] = useState('')

  return (
    <AppLayout>
      {/* ── Hero ── */}
      <div className="bg-white border-b border-[#E8E9EC]">
        <PageShell wide>
          {/* Social proof badge */}
          <div className="flex justify-center mb-7">
            <span className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              AI 워크플로우를 실행 중인 12,000명
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-[46px] font-bold text-gray-900 leading-[1.2] tracking-tight mb-5">
            AI, 어디서 시작해야 할지
            <br />
            <span className="text-gray-400">모르겠다면.</span>
          </h1>
          <p className="text-center text-[16px] text-gray-400 leading-relaxed mb-10">
            목표를 입력하면 실행 흐름이 자동으로 설계됩니다.
            <br />
            무엇을, 어떻게, 어떤 순서로 해야 할지 고민할 필요 없습니다.
          </p>

          {/* Search / Goal Input */}
          <div className="max-w-[600px] mx-auto mb-6">
            <GoalInput value={goal} onChange={setGoal} />
          </div>

          {/* Hashtag pills */}
          <div className="flex flex-wrap justify-center gap-2 pb-12">
            {CHIP_SUGGESTIONS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setGoal(chip.value)}
                className={`text-[13px] px-3 py-1.5 rounded-full border transition-all
                  ${goal === chip.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'text-gray-400 bg-gray-50 border-[#E8E9EC] hover:border-gray-400 hover:text-gray-700'
                  }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </PageShell>
      </div>

      {/* ── Popular Recipes ── */}
      <PageShell wide>
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[20px] font-bold text-gray-900">인기 레시피</h2>
            <Link href="/recipe-book" className="text-[13px] font-medium text-gray-400 hover:text-gray-700 transition-colors">
              전체보기 →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_RECIPES.map((recipe, i) => (
              <div key={i} className="bg-white rounded-[16px] border border-[#E8E9EC] p-5 hover:shadow-md transition-all">
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                    {recipe.badge}
                  </span>
                  <span className="text-[11px] text-gray-300">수정일 {recipe.updatedAt}</span>
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-bold text-gray-900 mb-2">{recipe.title}</h3>
                <p className="text-[13px] text-gray-400 leading-relaxed mb-5">{recipe.description}</p>

                {/* Steps */}
                <div className="flex flex-col gap-2 mb-5">
                  {recipe.steps.map((step) => (
                    <div key={step.no} className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-gray-300 w-5 shrink-0">{step.no}</span>
                      <div className="flex-1 flex items-center justify-between bg-gray-50 rounded-[8px] px-3 py-2">
                        <span className="text-[13px] font-semibold text-gray-700">{step.label}</span>
                        <span className="text-[11px] text-gray-400">{step.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tools + CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {recipe.tools.map((tool) => (
                      <span key={tool} className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/flow/${recipe.id}`}
                    className="text-[13px] font-semibold text-gray-900 hover:underline"
                  >
                    레시피 보기 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[20px] font-bold text-gray-900">실제 사용자의 경험</h2>
              <p className="text-[13px] text-gray-400 mt-1">전문 지식 없이도 누구나 AI 워크플로우를 구축하고 있습니다</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-[16px] border border-[#E8E9EC] p-5">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{t.name}</p>
                  <p className="text-[11px] text-gray-400 font-medium tracking-wide">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-gray-900 rounded-[20px] px-10 py-12 text-center mb-10">
          <h2 className="text-[30px] font-bold text-white leading-tight mb-3">
            다음 행동이 막힌다면,
            <br />
            지금 바로 첫 번째 Flow를 만드세요.
          </h2>
          <p className="text-[14px] text-gray-400 mb-8">
            목표만 입력하면 됩니다. 나머지는 자동으로 설계됩니다.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="bg-white text-gray-900 text-[14px] font-semibold px-6 py-3 rounded-[10px] hover:bg-gray-100 transition-colors"
            >
              지금 실행하기 →
            </Link>
            <button className="border border-gray-700 text-gray-300 text-[14px] font-semibold px-6 py-3 rounded-[10px] hover:border-gray-500 hover:text-white transition-colors">
              전문가와 상담하기
            </button>
          </div>
        </div>
      </PageShell>
    </AppLayout>
  )
}
