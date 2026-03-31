'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: '탐색' },
  { href: '/recipe-book', label: '내 레시피북' },
]

export function Header() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-white border-b border-[#E8E9EC]">
      <div className="h-full flex items-center px-6 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-gray-900 rounded-[8px] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-gray-900 tracking-tight">Flowcipe</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-3 py-1.5 rounded-[8px] text-[14px] font-medium transition-all
                ${isActive(item.href)
                  ? 'text-gray-900 bg-gray-100'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="ml-auto flex items-center gap-3">
          <button className="text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors">
            로그인
          </button>
          <button className="text-[14px] font-semibold bg-gray-900 text-white px-4 py-[7px] rounded-[8px] hover:bg-gray-800 transition-colors">
            회원가입
          </button>
        </div>
      </div>
    </header>
  )
}
