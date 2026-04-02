'use client'

import { signIn } from 'next-auth/react'
import { useEffect } from 'react'

interface LoginModalProps {
  onClose: () => void
}

export function LoginModal({ onClose }: LoginModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] p-8 w-full max-w-[380px] mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 로고 */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 bg-gray-900 rounded-[8px] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M3 2 Q1 2 1 6 Q1 10 3 10 H13 Q17 10 18 7 Q19 4 17 2 Z"/>
              <path d="M21 22 Q23 22 23 18 Q23 14 21 14 H11 Q7 14 6 17 Q5 20 7 22 Z"/>
            </svg>
          </div>
          <span className="text-[17px] font-bold text-gray-900 tracking-tight">
            Reci<span className="text-gray-400 font-semibold">flo</span>
          </span>
        </div>

        <h2 className="text-[22px] font-bold text-gray-900 mb-1">시작하기</h2>
        <p className="text-[14px] text-gray-400 mb-8 leading-relaxed">
          구글 계정으로 간편하게 로그인하고<br />내 레시피를 저장하세요.
        </p>

        {/* 구글 로그인 버튼 */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-[12px] py-3.5 px-4 text-[14px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google로 계속하기
        </button>

        <p className="text-[11.5px] text-gray-300 text-center mt-5 leading-relaxed">
          로그인 시 서비스 이용약관 및 개인정보처리방침에<br />동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  )
}
