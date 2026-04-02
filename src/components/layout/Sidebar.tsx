'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FeedbackModal } from '@/components/feedback/FeedbackModal'

const NAV_ITEMS = [
  {
    href: '/',
    label: '탐색',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    href: '/recipe-book',
    label: '내 레시피',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [showFeedback, setShowFeedback] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
    <aside className="hidden lg:flex fixed left-0 top-0 z-50 w-[72px] h-screen bg-white dark:bg-[#1a1a1a] border-r border-gray-100 dark:border-white/[0.08] flex-col items-center">

      {/* Symbol Logo */}
      <Link
        href="/"
        className="w-full h-[60px] flex items-center justify-center shrink-0 border-b border-gray-100 dark:border-white/[0.08]"
      >
        <div className="w-[40px] h-[40px] bg-gray-900 rounded-[12px] flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 400 400" fill="white">
            <path d="M280.49 237.019C272.529 252.941 256.254 263 238.452 263H183.46C178.196 263 173.452 266.175 171.443 271.041L150 323H51L69.5098 285.981C77.4712 270.059 93.7456 260 111.548 260H166.54C171.804 260 176.548 256.825 178.557 251.959L200 200H299L280.49 237.019Z"/>
            <path d="M330.49 114.019C322.529 129.941 306.254 140 288.452 140H233.46C228.196 140 223.452 143.175 221.443 148.041L200 200H101L119.51 162.981C127.471 147.059 143.746 137 161.548 137H216.54C221.804 137 226.548 133.825 228.557 128.959L250 77H349L330.49 114.019Z"/>
          </svg>
        </div>
      </Link>

      {/* Nav Items */}
      <nav className="flex flex-col items-center gap-1 pt-5 w-full px-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              w-full flex flex-col items-center gap-1 py-2.5 px-1 rounded-[10px] transition-all
              ${isActive(item.href)
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-300 dark:hover:bg-[#232323]'
              }
            `}
          >
            {item.icon}
            <span className="text-[10px] font-semibold leading-none">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="mt-auto flex flex-col items-center gap-1 pb-4 w-full px-2 border-t border-gray-100 dark:border-white/[0.08] pt-3">
        <button
          onClick={() => setShowFeedback(true)}
          className="w-full flex flex-col items-center gap-1 py-2.5 px-1 rounded-[10px] text-gray-400 hover:bg-gray-50 dark:hover:bg-[#232323] hover:text-gray-700 dark:hover:text-gray-300 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-[10px] font-semibold leading-none">피드백</span>
        </button>
      </div>
    </aside>

    {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
  </>
  )
}
