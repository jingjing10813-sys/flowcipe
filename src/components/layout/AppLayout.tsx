import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Header />
      <div className="flex" style={{ paddingTop: 'var(--header-height)' }}>
        <Sidebar />
        <main
          className="flex-1 min-h-[calc(100vh-60px)] overflow-y-auto lg:ml-[var(--sidebar-width)]"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
