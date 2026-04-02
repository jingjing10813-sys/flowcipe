import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0f0f0f]">
      <Sidebar />
      <Header />
      <main className="lg:ml-[72px] pt-[60px] pb-[60px] lg:pb-0 min-h-screen">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
