interface PageShellProps {
  children: React.ReactNode
  wide?: boolean
}

export function PageShell({ children, wide }: PageShellProps) {
  return (
    <div className={`mx-auto px-8 py-10 ${wide ? 'max-w-[1100px]' : 'max-w-[720px]'}`}>
      {children}
    </div>
  )
}
