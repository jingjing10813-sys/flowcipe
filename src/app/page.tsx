import { AppLayout } from '@/components/layout/AppLayout'
import { PageShell } from '@/components/layout/PageShell'
import { GoalInput } from '@/components/ui/GoalInput'
import Link from 'next/link'

const POPULAR_RECIPES = [
  {
    id: 'mock-flow-1',
    badge: '인기 레시피',
    updatedAt: '2시간 전',
    title: '콘텐츠 변환하기',
    description: '하나의 소스 데이터로 블로그, 뉴스레터, SNS 게시물까지 한 번에 생성하는 최적의 워크플로우',
    steps: [
      { no: '01', label: '데이터 수집', sub: '구글 스프레드시트' },
      { no: '02', label: 'LLM 추론', sub: 'GPT-4로 핵심 분석 및 요약' },
      { no: '03', label: '멀티 플랫폼 출력', sub: '블로그·SNS·뉴스레터' },
    ],
    tools: ['Claude', 'GPT-4o', 'Midjourney'],
    category: 'CONTENT CREATION',
  },
  {
    id: 'mock-flow-1',
    badge: '이번주 인기',
    updatedAt: '1일 전',
    title: 'SNS 게시물 자동화',
    description: '브랜드 키워드와 트렌드를 분석해 최적화된 SNS 게시물을 자동으로 생성합니다',
    steps: [
      { no: '01', label: '트렌드 분석', sub: 'GPT-4 검색 연동' },
      { no: '02', label: '카피 생성', sub: 'Claude 3.5 Sonnet' },
      { no: '03', label: '이미지 생성', sub: 'Midjourney v6' },
    ],
    tools: ['Claude', 'GPT-4o', 'Midjourney'],
    category: 'MARKETING',
  },
]

const TESTIMONIALS = [
  {
    stars: 5,
    text: '목표를 쓰면 Flow가 바로 나와서 너무 편해요. 매번 툴 찾느라 고민하던 시간이 사라졌어요.',
    name: '김지수',
    role: 'CONTENT CREATOR',
  },
  {
    stars: 5,
    text: '비즈니스 프로세스를 AI로 전환하는 가장 빠른 방법. 팀 전체에 공유했습니다.',
    name: '박성학',
    role: 'TECH CONSULTANT',
  },
  {
    stars: 5,
    text: '다음 할 일을 항상 알려줘서 막히는 게 없어요. 전체 워크플로우를 한눈에 파악할 수 있어요.',
    name: '이진아',
    role: 'E-COMMERCE OWNER',
  },
]

export default function Home() {
  return (
    <AppLayout>
      {/* ── Hero ── */}
      <div className="bg-white border-b border-[#E8E9EC]">
        <PageShell wide>
          {/* Social proof badge */}
          <div className="flex justify-center mb-7">
            <span className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              12,000명 이상의 크리에이터가 사용 중
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-[46px] font-bold text-gray-900 leading-[1.2] tracking-tight mb-5">
            당신의 AI 워크플로우를
            <br />
            <span className="text-gray-400">레시피</span>로 만드세요
          </h1>
          <p className="text-center text-[16px] text-gray-400 leading-relaxed mb-10">
            복잡한 자동화도 단계별로 가이드해 드립니다.
            <br />
            목표를 입력하면 완벽한 실행 흐름이 탄생합니다.
          </p>

          {/* Search / Goal Input */}
          <div className="max-w-[600px] mx-auto mb-6">
            <GoalInput />
          </div>

          {/* Hashtag pills */}
          <div className="flex flex-wrap justify-center gap-2 pb-12">
            {[
              '#블로그 글을 영상으로 만들기',
              '#SNS 게시물 자동화',
              '#GPT-4로 고객 피드백 분석',
              '#이미지 배너 자동 생성',
            ].map((tag) => (
              <span
                key={tag}
                className="text-[13px] text-gray-400 bg-gray-50 border border-[#E8E9EC] px-3 py-1.5 rounded-full cursor-pointer hover:border-gray-400 hover:text-gray-700 transition-all"
              >
                {tag}
              </span>
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

          <div className="grid grid-cols-2 gap-4">
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
            지금 바로 첫 번째 레시피를
            <br />
            구축해 보세요
          </h2>
          <p className="text-[14px] text-gray-400 mb-8">
            복잡한 설정 없이, 클릭 몇 번으로 AI 자동화를 시작할 수 있습니다.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="bg-white text-gray-900 text-[14px] font-semibold px-6 py-3 rounded-[10px] hover:bg-gray-100 transition-colors"
            >
              무료로 시작하기
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
