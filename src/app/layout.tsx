import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/auth/SessionProvider";

export const metadata: Metadata = {
  title: "Reciflo — AI 워크플로우 레시피 플랫폼",
  description: "AI 툴을 재료로, Flow를 레시피로. 목표를 입력하면 실행 흐름이 자동으로 설계됩니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
