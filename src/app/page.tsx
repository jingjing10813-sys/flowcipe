'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageShell } from '@/components/layout/PageShell'
import { GoalInput } from '@/components/ui/GoalInput'
import Link from 'next/link'

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  VIDEO:        { bg: 'bg-violet-50',  text: 'text-violet-600',  dot: 'bg-violet-400' },
  PRODUCTIVITY: { bg: 'bg-blue-50',    text: 'text-blue-600',    dot: 'bg-blue-400' },
  RESEARCH:     { bg: 'bg-amber-50',   text: 'text-amber-600',   dot: 'bg-amber-400' },
  DESIGN:       { bg: 'bg-pink-50',    text: 'text-pink-600',    dot: 'bg-pink-400' },
  MARKETING:    { bg: 'bg-green-50',   text: 'text-green-600',   dot: 'bg-green-400' },
}

const CATEGORY_LABELS: Record<string, string> = {
  VIDEO: '영상 제작',
  PRODUCTIVITY: '업무 자동화',
  RESEARCH: '리서치',
  DESIGN: '디자인',
  MARKETING: '마케팅',
}

const POPULAR_RECIPES = [
  {
    id: 'mock-flow-1',
    badge: '🔥 지금 뜨는',
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
    badge: '📊 리서치',
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
    badge: '📣 마케팅',
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
    text: 'Vibe Coding으로 앱 만들려다 막혔는데, Reciflo가 Cursor랑 Claude 어떻게 연결하는지 바로 알려줬어요.',
    name: '이준혁',
    role: 'INDIE HACKER',
  },
  {
    stars: 5,
    text: '쇼츠 자동화 워크플로우 덕분에 매일 영상 올리고 있어요. HeyGen이랑 Vrew 조합은 몰랐는데 Reciflo가 알려줬어요.',
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
  { label: '#10분 만에 리서치 보고서', value: '10분 만에 AI로 시장조사 보고서를 작성하고 싶어' },
  { label: '#인스타 릴스 AI 자동 제작', value: '인스타그램 릴스를 AI로 자동 제작하고 싶어' },
  { label: '#AI로 브랜드 디자인 시안', value: 'AI로 브랜드 디자인 시안을 빠르게 만들고 싶어' },
  { label: '#SNS 콘텐츠 에이전트 자동화', value: 'SNS 콘텐츠 기획·작성·발행을 AI 에이전트로 자동화하고 싶어' },
]

export default function Home() {
  const [goal, setGoal] = useState('')

  return (
    <AppLayout>
      {/* ── Hero ── */}
      <div className="bg-[#F5F6F8] dark:bg-[#141414] border-b border-gray-100 dark:border-white/[0.08]">
        <PageShell wide>
          {/* Social proof */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 text-[12.5px] font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#232323] border border-gray-200 dark:border-white/[0.08] px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              지금 12,000명이 Reciflo로 AI를 실행 중
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-[32px] sm:text-[44px] lg:text-[52px] font-bold text-gray-900 dark:text-white leading-[1.15] tracking-tight mb-3 sm:mb-4">
            AI 툴은 많은데,
            <br />
            <span className="text-gray-500">어디서 시작해야 할지 모르겠다면.</span>
          </h1>
          <p className="text-center text-[14px] sm:text-[16px] text-gray-400 leading-relaxed mb-7 sm:mb-10 max-w-[480px] mx-auto">
            시작이 막막할 때, Reciflo가 길을 잡아드립니다.
            <br />
            목표를 입력하면 단계별 AI 워크플로우가 완성됩니다.
          </p>

          {/* Goal Input */}
          <div className="max-w-[580px] mx-auto mb-5 sm:mb-6">
            <GoalInput value={goal} onChange={setGoal} />
          </div>

          {/* Hashtag chips */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-2 pb-10 sm:pb-14 px-1">
            {CHIP_SUGGESTIONS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setGoal(chip.value)}
                className={`text-[12.5px] px-3 py-1.5 rounded-full border transition-all text-left sm:text-center
                  ${goal === chip.value
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                    : 'text-gray-400 bg-white dark:bg-[#232323] border-gray-200 dark:border-white/[0.08] hover:border-gray-400 hover:text-gray-700 dark:hover:border-gray-500 dark:hover:text-gray-200'
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
        <div className="mb-12">
          {/* Section header */}
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-[19px] font-bold text-gray-900 dark:text-white">인기 레시피</h2>
              <p className="text-[13px] text-gray-400 mt-0.5">최근 AI 활용 트렌드 기반으로 큐레이션됩니다</p>
            </div>
            <Link href="/recipe-book" className="text-[13px] font-medium text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              내 레시피 →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_RECIPES.map((recipe, i) => {
              const cat = CATEGORY_COLORS[recipe.category] ?? { bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400' }
              const catLabel = CATEGORY_LABELS[recipe.category] ?? recipe.category

              return (
                <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-[16px] border border-gray-100 dark:border-white/[0.08] p-5 hover:border-gray-200 dark:hover:border-white/[0.15] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 flex flex-col">
                  {/* Card top row */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Category badge */}
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${cat.bg} ${cat.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                      {catLabel}
                    </span>
                    <span className="text-[11px] text-gray-300 dark:text-gray-600">{recipe.updatedAt}</span>
                  </div>

                  {/* Title + desc */}
                  <h3 className="text-[16px] font-bold text-gray-900 dark:text-white leading-snug mb-2">{recipe.title}</h3>
                  <p className="text-[13px] text-gray-400 leading-relaxed mb-5 flex-1">{recipe.description}</p>

                  {/* Steps */}
                  <div className="flex flex-col gap-1.5 mb-5">
                    {recipe.steps.map((step) => (
                      <div key={step.no} className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold text-gray-300 w-4 shrink-0">{step.no}</span>
                        <div className="flex-1 flex items-center justify-between bg-gray-50 dark:bg-[#232323] rounded-[7px] px-3 py-1.5">
                          <span className="text-[12.5px] font-semibold text-gray-700 dark:text-gray-200">{step.label}</span>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{step.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tools + CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-white/[0.08]">
                    <div className="flex gap-1.5 flex-wrap">
                      {recipe.tools.map((tool) => (
                        <span key={tool} className="text-[11px] font-medium text-gray-400 bg-gray-50 dark:bg-[#232323] border border-gray-100 dark:border-white/[0.08] px-2 py-0.5 rounded-full">
                          {tool}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/flow/${recipe.id}`}
                      className="text-[12.5px] font-semibold text-gray-900 dark:text-gray-200 hover:text-gray-600 dark:hover:text-white transition-colors shrink-0 ml-2"
                    >
                      보기 →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-[19px] font-bold text-gray-900 dark:text-white">실제 사용자의 경험</h2>
            <p className="text-[13px] text-gray-400 mt-0.5">전문 지식 없이도 누구나 AI 워크플로우를 구축하고 있습니다</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-[16px] border border-gray-100 dark:border-white/[0.08] p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-[13px]">★</span>
                  ))}
                </div>
                <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-gray-50 dark:border-white/[0.08]">
                  <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#232323] flex items-center justify-center">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-[12.5px] font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-[10.5px] text-gray-400 font-medium tracking-wide">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-gray-900 dark:bg-[#1a1a1a] dark:border dark:border-white/[0.08] rounded-[20px] px-10 py-12 text-center mb-12">
          <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-4">Get Started</p>
          <h2 className="text-[28px] sm:text-[32px] font-bold text-white leading-tight mb-3">
            다음 행동이 막힌다면,
            <br />
            지금 바로 첫 번째 Flow를 만드세요.
          </h2>
          <p className="text-[14px] text-gray-400 mb-8 max-w-[360px] mx-auto">
            목표만 입력하면 됩니다. 나머지는 자동으로 설계됩니다.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="bg-white text-gray-900 text-[14px] font-semibold px-6 py-3 rounded-[10px] hover:bg-gray-100 transition-colors"
            >
              지금 실행하기 →
            </Link>
          </div>
        </div>
      </PageShell>
    </AppLayout>
  )
}
