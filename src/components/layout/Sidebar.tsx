'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/',
    label: '새 Flow 만들기',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    href: '/recipe-book',
    label: '나의 레시피북',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
]

const CATEGORY_ITEMS = [
  { label: '콘텐츠 제작', emoji: '✍️' },
  { label: '데이터 분석', emoji: '📊' },
  { label: '마케팅 자동화', emoji: '📣' },
  { label: '이미지 생성', emoji: '🎨' },
  { label: '영상 제작', emoji: '🎬' },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="hidden lg:flex fixed left-0 z-40 w-[240px] bg-white border-r border-[#E8E9EC] flex-col overflow-y-auto"
      style={{ top: 'var(--header-height)', height: 'calc(100vh - var(--header-height))' }}
    >
      {/* Navigation */}
      <div className="px-3 py-4">
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-all
                ${isActive(item.href)
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <span className={`${isActive(item.href) ? 'opacity-100' : 'opacity-50'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-[#E8E9EC]" />

      {/* Categories */}
      <div className="px-4 py-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-1">카테고리</p>
        <div className="flex flex-col gap-0.5">
          {CATEGORY_ITEMS.map((cat) => (
            <button
              key={cat.label}
              className="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all text-left"
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-auto px-4 py-4 border-t border-[#E8E9EC]">
        <div className="bg-gray-900 rounded-[12px] p-4">
          <p className="text-[13px] font-semibold text-white mb-1">오늘의 추천 Flow</p>
          <p className="text-[12px] text-gray-400 mb-3">블로그 → 유튜브 변환</p>
          <Link
            href="/flow/mock-flow-1"
            className="block w-full text-center text-[12px] font-semibold bg-white text-gray-900 py-2 rounded-[8px] hover:bg-gray-100 transition-colors"
          >
            바로 시작하기
          </Link>
        </div>
      </div>
    </aside>
  )
}
