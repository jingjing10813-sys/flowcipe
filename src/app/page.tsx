'use client'

import { useState, useEffect, useRef } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { GoalInput } from '@/components/ui/GoalInput'
import Link from 'next/link'

const CATEGORY_COLORS: Record<string, { text: string; dot: string }> = {
  VIDEO:        { text: 'text-violet-500',  dot: 'bg-violet-400' },
  PRODUCTIVITY: { text: 'text-blue-500',    dot: 'bg-blue-400' },
  RESEARCH:     { text: 'text-amber-500',   dot: 'bg-amber-400' },
  DESIGN:       { text: 'text-pink-500',    dot: 'bg-pink-400' },
  MARKETING:    { text: 'text-green-500',   dot: 'bg-green-400' },
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
    badge: '지금 뜨는',
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
    id: 'mock-flow-2',
    badge: 'Vibe Coding',
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
    id: 'mock-flow-3',
    badge: '리서치',
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
    id: 'mock-flow-4',
    badge: 'AI 디자인',
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
    id: 'mock-flow-5',
    badge: '마케팅',
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
    id: 'mock-flow-6',
    badge: '업무 자동화',
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
  {
    stars: 5,
    text: '주간 보고서 쓰는 데 두 시간 걸렸는데 Reciflo 플로우 그대로 따라하니까 30분으로 줄었어요. Perplexity + Notion 조합 진짜 신세계.',
    name: '정유진',
    role: 'MARKETING MANAGER',
  },
  {
    stars: 5,
    text: '수업 자료 만들고 영상 녹화하고 편집까지, AI 툴이 많은데 뭘 써야 할지 몰랐어요. Reciflo가 순서대로 딱 정리해줘서 너무 편했어요.',
    name: '한승우',
    role: 'ONLINE EDUCATOR',
  },
  {
    stars: 5,
    text: 'IR 덱 초안 잡는 게 늘 막막했는데 Reciflo로 플로우 짜고 Claude한테 섹션별로 시키니까 진짜 빠르게 완성됐어요.',
    name: '오민지',
    role: 'STARTUP FOUNDER',
  },
  {
    stars: 5,
    text: '뉴스레터 구독자가 두 배 늘었어요. Reciflo가 알려준 콘텐츠 자동화 플로우 덕분에 매주 빠짐없이 발행하게 됐거든요.',
    name: '최성진',
    role: 'CONTENT CREATOR',
  },
  {
    stars: 5,
    text: '코드 리뷰 자동화 플로우 만들었는데 팀 전체가 쓰고 있어요. AI 툴 연결 방법을 이렇게 정리해준 데가 없었는데.',
    name: '김도현',
    role: 'SOFTWARE ENGINEER',
  },
  {
    stars: 5,
    text: '포트폴리오 PDF 만들고 LinkedIn 업데이트하고 지원서 쓰는 플로우를 Reciflo로 짰어요. 취업 준비가 훨씬 체계적으로 됐어요.',
    name: '이서연',
    role: 'JOB SEEKER',
  },
  {
    stars: 5,
    text: '환자 상담 노트를 AI로 정리하는 워크플로우 찾고 있었는데 Reciflo가 딱 맞는 플로우를 제안해줬어요. 업무 시간이 눈에 띄게 줄었어요.',
    name: '박진우',
    role: 'HEALTHCARE WORKER',
  },
  {
    stars: 5,
    text: '강의 커리큘럼 설계부터 퀴즈 자동 생성까지 Reciflo 플로우 하나로 해결했어요. 교수법 연구에 쓸 시간이 생겼습니다.',
    name: '윤채원',
    role: 'UNIVERSITY PROFESSOR',
  },
  {
    stars: 5,
    text: '부동산 매물 분석 보고서를 AI로 자동화하고 싶었는데, Reciflo가 어떤 툴을 어떤 순서로 쓸지 바로 알려줘서 당장 적용했어요.',
    name: '장현석',
    role: 'REAL ESTATE AGENT',
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

function SlotDigit({ digit, pos }: { digit: string; pos: number }) {
  if (digit === ',') return <span>{digit}</span>
  return (
    <span className="overflow-hidden inline-block" style={{ height: '1.4em', verticalAlign: '-0.3em', lineHeight: '1.4' }}>
      <span key={`${pos}-${digit}`} className="animate-slot-up inline-block" style={{ lineHeight: '1.4' }}>
        {digit}
      </span>
    </span>
  )
}

export default function Home() {
  const [goal, setGoal] = useState('')
  const painPointsRef = useRef<HTMLDivElement>(null)
  const [cardsVisible, setCardsVisible] = useState(false)
  const featuresRef = useRef<HTMLDivElement>(null)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const recipesRef = useRef<HTMLDivElement>(null)
  const [recipesVisible, setRecipesVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    const sections = [
      { ref: painPointsRef, setter: setCardsVisible },
      { ref: featuresRef,   setter: setFeaturesVisible },
      { ref: recipesRef,    setter: setRecipesVisible },
      { ref: statsRef,      setter: setStatsVisible },
    ]
    const check = () => {
      sections.forEach(({ ref, setter }) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        setter(rect.top < window.innerHeight - 80 && rect.bottom > 0)
      })
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])
  const BASE_COUNT = 12847
  const [flowCount, setFlowCount] = useState(BASE_COUNT)
  const countRef = useRef(BASE_COUNT)
  useEffect(() => {
    const tick = () => {
      const increment = Math.floor(Math.random() * 3) + 1
      countRef.current += increment
      setFlowCount(countRef.current)
      setTimeout(tick, 1800 + Math.random() * 1200)
    }
    const t = setTimeout(tick, 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <AppLayout>


      {/* ── Hero ── */}
      <div className="relative bg-[#ffffff] dark:bg-[#0f0f0f] overflow-hidden">

        {/* Left — Frame 6 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/frame6.png" alt="" className="float-b hidden lg:block absolute pointer-events-none select-none" style={{ top: '120px', left: 0, width: '258px', height: '561px', animationDelay: '0s' }} />

        {/* Right — Frame 7 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/frame7.png" alt="" className="float-a hidden lg:block absolute pointer-events-none select-none" style={{ top: '120px', right: '-40px', width: '284px', height: '555px', animationDelay: '0.6s' }} />

        <div className="relative z-20 mx-auto max-w-[1100px] px-6 sm:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20">

          <div className="flex justify-center mb-10">
            <span className="inline-flex items-center justify-center gap-1.5 text-[12px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-white/[0.07] border border-gray-200 dark:border-white/[0.1] px-4 py-1.5 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              <span className="font-bold tabular-nums">
                {flowCount.toLocaleString('ko-KR').split('').map((d, i) => (
                  <SlotDigit key={i} digit={d} pos={i} />
                ))}
              </span>개의 목표가 워크플로우로 바뀌는 중
            </span>
          </div>

          <h1 className="text-center font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-5">
            <span className="block text-[34px] sm:text-[48px] lg:text-[58px]">AI 툴은 많은데,</span>
            <span className="block text-[34px] sm:text-[48px] lg:text-[58px] text-gray-300 dark:text-gray-600">
              어디서 시작해야 할지
            </span>
            <span className="block text-[34px] sm:text-[48px] lg:text-[58px] text-gray-300 dark:text-gray-600">
              모르겠다면.
            </span>
          </h1>

          <p className="text-center text-[15px] sm:text-[17px] text-gray-400 dark:text-gray-500 leading-relaxed mb-10 max-w-[460px] mx-auto">
            목표를 입력하면 단계별 AI 워크플로우가 완성됩니다.
          </p>

          <div className="max-w-[600px] mx-auto mb-6">
            <GoalInput value={goal} onChange={setGoal} />
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-2 pb-4 px-1">
            {CHIP_SUGGESTIONS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => setGoal(chip.value)}
                className={`text-[12px] px-3.5 py-1.5 rounded-full border transition-all text-left sm:text-center
                  ${goal === chip.value
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-600'
                    : 'bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/[0.1] hover:border-gray-400 hover:text-gray-700 dark:hover:border-gray-500 dark:hover:text-gray-200'
                  }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pain Points ── */}
      <div ref={painPointsRef} className="relative bg-[#F7F7F8] dark:bg-[#0f0f0f] overflow-hidden">
        {/* 원형 그라데이션 배경 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ width: '800px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse at center, rgba(40,40,50,0.13) 0%, rgba(70,70,80,0.06) 45%, transparent 70%)' }} />
        </div>
        <div className="relative mx-auto max-w-[1100px] px-6 sm:px-8 pt-24 sm:pt-32 pb-16 sm:pb-20">
          <div className="text-center mb-10">
            <h2 className="text-[28px] sm:text-[36px] font-bold leading-[1.3] tracking-tight">
              <span className="text-gray-400 dark:text-gray-500">AI 좋다는건 알지만</span><br />
              <span className="text-gray-900 dark:text-white">도대체 어떻게 내 업무에 쓸 지 막막했던 경험 있으신가요?</span>
            </h2>
          </div>
          <div
            className="relative mx-auto"
            style={{ height: '240px', maxWidth: '560px' }}
          >
            {[
              { text: '실행은 못하고',      emoji: '⏱️', top: 0,   rotate:  3, z: 3 },
              { text: '다음 단계가 막히고', emoji: '🚧', top: 72,  rotate: -2, z: 2 },
              { text: 'AI는 빠르게 바뀌고', emoji: '⚡', top: 144, rotate:  1, z: 1 },
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: card.top,
                  left: 0,
                  right: 0,
                  zIndex: card.z,
                  opacity: cardsVisible ? 1 : 0,
                  transition: `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(2 - i) * 0.18}s, opacity 0.4s ease ${(2 - i) * 0.18}s`,
                  transform: `translateY(${cardsVisible ? 0 : 70}px) rotate(${card.rotate}deg)`,
                }}
              >
                <div className="mx-auto bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-white/[0.06] rounded-2xl px-8 py-5 shadow-md flex items-center justify-center gap-3" style={{ maxWidth: '480px' }}>
                  <span className="text-[22px]">{card.emoji}</span>
                  <span className="text-[17px] sm:text-[19px] font-bold text-gray-800 dark:text-gray-100">{card.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 세로 점 3개 */}
          <div className="flex flex-col items-center gap-2 mt-8">
            {[
              'bg-gray-500 dark:bg-gray-400',
              'bg-gray-400 dark:bg-gray-500',
              'bg-gray-300 dark:bg-gray-600',
            ].map((color, i) => (
              <span
                key={i}
                className={`block w-2 h-2 rounded-full ${color}`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ── Features ── */}
      <div ref={featuresRef} className="bg-[#F7F7F8] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-8 py-16 sm:py-20">
          <div
            className="text-center mb-10"
            style={{
              opacity: featuresVisible ? 1 : 0,
              transform: `translateY(${featuresVisible ? 0 : 24}px)`,
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <h2 className="text-[28px] sm:text-[36px] font-bold leading-[1.3] tracking-tight">
              <span className="text-gray-400 dark:text-gray-500">막막하던 AI 실행,</span><br />
              <span className="text-gray-900 dark:text-white">이제 Reciflo가 설계합니다</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Feature 1 */}
            <div
              className="bg-[#141414] rounded-2xl overflow-hidden flex flex-col"
              style={{
                opacity: featuresVisible ? 1 : 0,
                transform: `translateY(${featuresVisible ? 0 : 32}px)`,
                transition: 'opacity 0.55s ease 0.1s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s',
              }}
            >
              <div className="flex-1 min-h-[200px] bg-[#1a1a1a] flex items-center justify-center p-6">
                <div className="w-full space-y-2">
                  {['ChatGPT', 'Claude', 'Gemini', 'Perplexity'].map((tool, i) => (
                    <div key={tool} className="flex items-center gap-3 bg-[#232323] rounded-xl px-4 py-2.5">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-green-400' : i === 1 ? 'bg-blue-400' : i === 2 ? 'bg-yellow-400' : 'bg-purple-400'}`} />
                      <span className="text-[12px] font-medium text-gray-300">{tool}</span>
                      <span className="ml-auto text-[10px] text-gray-600">최신</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 py-5">
                <p className="text-[14px] font-bold text-white mb-1">최신 AI 트렌드 반영</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">항상 최신 조합 유지</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              className="bg-[#141414] rounded-2xl overflow-hidden flex flex-col"
              style={{
                opacity: featuresVisible ? 1 : 0,
                transform: `translateY(${featuresVisible ? 0 : 32}px)`,
                transition: 'opacity 0.55s ease 0.22s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.22s',
              }}
            >
              <div className="flex-1 min-h-[200px] bg-[#1a1a1a] flex items-center justify-center p-6">
                <div className="w-full space-y-2">
                  {[
                    { no: '01', label: '목표 설정', tool: 'Claude' },
                    { no: '02', label: '리서치 수행', tool: 'Perplexity' },
                    { no: '03', label: '초안 작성', tool: 'ChatGPT' },
                  ].map((step) => (
                    <div key={step.no} className="flex items-center gap-3 bg-[#232323] rounded-xl px-4 py-2.5">
                      <span className="text-[10px] font-bold text-gray-600 w-5 shrink-0">{step.no}</span>
                      <span className="text-[12px] font-medium text-gray-300 flex-1">{step.label}</span>
                      <span className="text-[10px] text-gray-600">{step.tool}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 py-5">
                <p className="text-[14px] font-bold text-white mb-1">구체적인 스텝</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">실행 가능한 단계로 바로 분해</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div
              className="bg-[#141414] rounded-2xl overflow-hidden flex flex-col"
              style={{
                opacity: featuresVisible ? 1 : 0,
                transform: `translateY(${featuresVisible ? 0 : 32}px)`,
                transition: 'opacity 0.55s ease 0.34s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.34s',
              }}
            >
              <div className="flex-1 min-h-[200px] bg-[#1a1a1a] flex items-center justify-center p-6">
                <div className="w-full space-y-2">
                  {[
                    { label: '프롬프트 복사', icon: '📋' },
                    { label: 'Claude 바로가기', icon: '🔗' },
                    { label: 'Notion 템플릿', icon: '🔗' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 bg-[#232323] rounded-xl px-4 py-2.5">
                      <span className="text-[14px]">{item.icon}</span>
                      <span className="text-[12px] font-medium text-gray-300">{item.label}</span>
                      <div className="ml-auto w-5 h-5 rounded-md bg-white/[0.07] flex items-center justify-center">
                        <span className="text-[9px] text-gray-500">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 py-5">
                <p className="text-[14px] font-bold text-white mb-1">맞춤 프롬프트와 링크 연결</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">각 단계에 바로 쓸 수 있게 연결</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 멘트 1 ── */}
      <div ref={statsRef} className="bg-[#F7F7F8] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-8 pt-16 sm:pt-20 pb-10 text-center">
          <h2
            className="text-[28px] sm:text-[36px] font-bold leading-[1.2] tracking-tight mb-3"
            style={{
              opacity: statsVisible ? 1 : 0,
              transform: `translateY(${statsVisible ? 0 : 24}px)`,
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <span className="text-gray-400 dark:text-gray-500">매주 최신 AI 트렌드로 업데이트되는</span><br className="hidden sm:block" />
            <span className="text-gray-900 dark:text-white">최적의 워크플로우를 바로 찾아드립니다.</span>
          </h2>
          <p
            className="text-[14px] sm:text-[15px] text-gray-400 dark:text-gray-500 leading-relaxed"
            style={{
              opacity: statsVisible ? 1 : 0,
              transform: `translateY(${statsVisible ? 0 : 16}px)`,
              transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
            }}
          >
            직접 찾고 비교하는 시간 없이, 지금 가장 효과적인 AI 조합을 바로 실행하세요.
          </p>
        </div>
      </div>

      {/* ── AI Tools Stats ── */}
      <div className="bg-[#F7F7F8] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-8 pb-16 sm:pb-20">
          <div
            className="w-full bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/[0.07] rounded-2xl sm:rounded-3xl px-6 py-10 sm:py-12 sm:px-16 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
            style={{
              opacity: statsVisible ? 1 : 0,
              transform: `translateY(${statsVisible ? 0 : 28}px)`,
              transition: 'opacity 0.55s ease 0.2s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-stretch gap-0">
              <div className="flex-1 flex flex-col items-center gap-1.5 py-4 sm:py-0">
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest text-center">AI 툴</p>
                <p className="text-[40px] sm:text-[44px] font-bold text-gray-900 dark:text-white leading-none">120<span className="text-[24px] text-gray-300 dark:text-gray-500">+</span></p>
                <p className="text-[11px] text-gray-400 dark:text-gray-600 text-center">분석된 최신 툴</p>
              </div>
              <div className="h-px sm:h-auto sm:w-px bg-gray-100 dark:bg-white/[0.07] sm:mx-8 lg:mx-12 shrink-0" />
              <div className="flex-1 flex flex-col items-center gap-1.5 py-4 sm:py-0">
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest text-center">플로우</p>
                <p className="text-[40px] sm:text-[44px] font-bold text-gray-900 dark:text-white leading-none">48,000<span className="text-[22px] text-gray-300 dark:text-gray-500">+</span></p>
                <p className="text-[11px] text-gray-400 dark:text-gray-600 text-center">생성된 워크플로우</p>
              </div>
              <div className="h-px sm:h-auto sm:w-px bg-gray-100 dark:bg-white/[0.07] sm:mx-8 lg:mx-12 shrink-0" />
              <div className="flex-1 flex flex-col items-center gap-1.5 py-4 sm:py-0">
                <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-widest text-center">트렌드 반영</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                  <p className="text-[40px] sm:text-[44px] font-bold text-gray-900 dark:text-white leading-none">매주</p>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-600 text-center">최신 AI 트렌드 반영</p>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-gray-400 dark:text-gray-600 mt-3">업데이트: 26년 4월 기준</p>
        </div>
      </div>


      {/* ── 멘트 2 + Popular Recipes ── */}
      <div ref={recipesRef} className="bg-[#F7F7F8] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-8 pt-16 sm:pt-20 pb-16 sm:pb-20">
          <div
            className="flex items-end justify-between mb-6"
            style={{
              opacity: recipesVisible ? 1 : 0,
              transform: `translateY(${recipesVisible ? 0 : 24}px)`,
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <h2 className="text-[28px] sm:text-[36px] font-bold text-gray-900 dark:text-white leading-[1.2] tracking-tight">
              지금 뜨는 AI 플로우,<br />바로 실행해보세요
            </h2>
            <Link href="/recipe-book" className="text-[13px] font-medium text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors shrink-0 ml-4 pb-1">
              내 레시피 →
            </Link>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_RECIPES.map((recipe, i) => {
              const cat = CATEGORY_COLORS[recipe.category] ?? { text: 'text-gray-400', dot: 'bg-gray-400' }
              const catLabel = CATEGORY_LABELS[recipe.category] ?? recipe.category

              return (
                <Link
                  key={i}
                  href={`/flow/${recipe.id}`}
                  className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  style={{
                    opacity: recipesVisible ? 1 : 0,
                    transform: `translateY(${recipesVisible ? 0 : 32}px)`,
                    transition: `box-shadow 0.2s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.12}s, opacity 0.5s ease ${0.1 + i * 0.12}s`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 24px rgba(0,0,0,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                    <span className={`text-[11px] font-semibold ${cat.text}`}>{catLabel}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug mb-2">{recipe.title}</h3>
                  <p className="text-[12.5px] text-gray-400 leading-relaxed mb-5 flex-1">{recipe.description}</p>
                  <div className="flex flex-col gap-1.5 mb-5">
                    {recipe.steps.map((step) => (
                      <div key={step.no} className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold text-gray-300 dark:text-gray-700 w-4 shrink-0 tabular-nums">{step.no}</span>
                        <div className="flex-1 flex items-center justify-between bg-[#F0F0F2] dark:bg-white/[0.04] rounded-lg px-3 py-1.5">
                          <span className="text-[12px] font-semibold text-gray-700 dark:text-gray-300">{step.label}</span>
                          <span className="text-[11px] text-gray-400 dark:text-gray-600 font-medium">{step.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/[0.05]">
                    <div className="flex gap-1.5 flex-wrap">
                      {recipe.tools.map((tool) => (
                        <span key={tool} className="text-[10.5px] font-medium text-gray-400 dark:text-gray-600 bg-[#F0F0F2] dark:bg-white/[0.04] px-2 py-0.5 rounded-md">
                          {tool}
                        </span>
                      ))}
                    </div>
                    <span className="text-[12.5px] font-semibold text-gray-700 dark:text-gray-300 shrink-0 ml-2">
                      보기 →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="bg-[#F7F7F8] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-8 pt-16 sm:pt-20 pb-6">
          <h2 className="text-[28px] sm:text-[36px] font-bold text-gray-900 dark:text-white leading-[1.3] tracking-tight mb-4">
            이미 다양한 직군에서<br />Reciflo로 AI를 실행하고 있습니다
          </h2>
          <div className="flex flex-wrap gap-2">
            {['🎨 UX/UI 디자이너', '📋 기획자 / PM', '📢 마케터', '💻 개발자', '🎬 크리에이터', '🚀 스타트업 창업자', '🎓 학생 / 연구자'].map((p) => (
              <span key={p} className="text-[12px] font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/[0.06] px-3 py-1 rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden py-10">
          <div className="marquee-track flex gap-4 w-max">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={i}
                className="w-[320px] shrink-0 bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-[12px]">★</span>
                  ))}
                </div>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/[0.07] flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900 dark:text-white">{t.name[0]}OO</p>
                    <p className="text-[10.5px] text-gray-300 dark:text-gray-600 font-medium tracking-wide">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-[#F7F7F8] dark:bg-[#0f0f0f]">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-8 py-16 sm:py-24">
          <div className="bg-[#141414] border border-white/[0.07] rounded-2xl sm:rounded-3xl px-8 sm:px-16 py-12 sm:py-16 text-center">
            <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-5">Get Started</p>
            <h2 className="text-[32px] sm:text-[44px] font-bold text-white leading-[1.15] tracking-tight mb-5">
              AI 툴 찾는 건 Reciflo에 맡기고,<br />
              실행에만 집중하세요.
            </h2>
            <p className="text-[15px] text-gray-500 mb-10 leading-relaxed">
              목표만 입력하면 됩니다.<br />어떤 툴을 어떤 순서로 써야 할지, Reciflo가 바로 설계합니다.
            </p>
            <Link
              href="/"
              className="inline-block btn-wave text-zinc-900 text-[14px] font-semibold px-8 py-3.5 rounded-xl active:scale-[0.98] transition-transform"
            >
              지금 실행하기 →
            </Link>
          </div>
        </div>
      </div>

    </AppLayout>
  )
}
