'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { LoginModal } from '@/components/auth/LoginModal'

export function Header() {
  const { data: session } = useSession()
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <header className="fixed top-0 right-0 z-40 h-[60px] bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-gray-100 dark:border-white/[0.08] lg:left-[72px] left-0">
        <div className="h-full flex items-center px-6 gap-4">
          {/* Text Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-[20px] font-bold text-gray-900 dark:text-white tracking-tight">
              Reci<span className="text-gray-400 font-semibold">flo</span>
            </span>
          </Link>

          {/* Mobile Nav */}

          {/* Right */}
          <div className="ml-auto flex items-center gap-2">
            {session ? (
              <>
                {/* 아바타 + 이름 */}
                <div className="flex items-center gap-2">
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? ''}
                      className="w-7 h-7 rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-600">
                      {session.user?.name?.[0] ?? 'U'}
                    </div>
                  )}
                  <span className="text-[13px] font-medium text-gray-700 hidden sm:block">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-[13px] font-medium text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors px-3 py-1.5"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-[13.5px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-1.5"
                >
                  로그인
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-[13.5px] font-semibold bg-gray-900 text-white px-4 py-[7px] rounded-[8px] hover:bg-gray-800 transition-colors"
                >
                  무료로 시작
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
