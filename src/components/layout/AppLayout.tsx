import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { MobileTabBar } from './MobileTabBar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0f0f0f]">
      <Sidebar />
      <Header />
      <main className="lg:ml-[72px] pt-[60px] min-h-screen pb-[60px] lg:pb-0">
        {children}
      </main>
      <MobileTabBar />
    </div>
  )
}
