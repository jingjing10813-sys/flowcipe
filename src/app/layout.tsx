import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/auth/SessionProvider";

const BASE_URL = 'https://flowcipe.vercel.app'

export const metadata: Metadata = {
  title: "Reciflo — AI 워크플로우 레시피 플랫폼",
  description: "AI 툴을 재료로, Flow를 레시피로. 목표를 입력하면 실행 흐름이 자동으로 설계됩니다.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Reciflo — AI 워크플로우 레시피 플랫폼",
    description: "AI 툴을 재료로, Flow를 레시피로. 목표를 입력하면 실행 흐름이 자동으로 설계됩니다.",
    url: BASE_URL,
    siteName: 'Reciflo',
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Reciflo — AI 워크플로우 레시피 플랫폼",
    description: "AI 툴을 재료로, Flow를 레시피로. 목표를 입력하면 실행 흐름이 자동으로 설계됩니다.",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()` }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","w7ualacusd");` }} />
      </head>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
