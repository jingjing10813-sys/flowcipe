import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Runflo — 실행 경로 설계 플랫폼",
  description: "목표를 입력하면 실행 흐름이 만들어집니다. 행동 사이의 공백을 제거합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
