interface PromptTextProps {
  text: string
  variant?: 'default' | 'blue' | 'muted'
}

function renderInline(text: string, boldClass: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className={`font-semibold ${boldClass}`}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  )
}

export function PromptText({ text, variant = 'default' }: PromptTextProps) {
  const c = {
    default: { num: 'text-gray-300 dark:text-[#525252]', main: 'text-gray-800 dark:text-[#e5e5e5]', sub: 'text-gray-500 dark:text-[#a3a3a3]', bold: 'text-gray-900 dark:text-white' },
    blue:    { num: 'text-blue-400 dark:text-blue-500',  main: 'text-blue-800 dark:text-blue-200',  sub: 'text-blue-600 dark:text-blue-400',  bold: 'text-blue-900 dark:text-blue-100' },
    muted:   { num: 'text-gray-200 dark:text-[#404040]', main: 'text-gray-500 dark:text-[#737373]', sub: 'text-gray-400 dark:text-[#525252]', bold: 'text-gray-600 dark:text-[#a3a3a3]' },
  }[variant]

  const lines = text.split('\n')

  return (
    <div className="text-left space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} className="h-1.5" />

        const numbered = trimmed.match(/^(\d+)\.\s+(.+)$/)
        if (numbered) return (
          <div key={i} className="flex gap-2 items-baseline">
            <span className={`text-[11px] font-bold shrink-0 ${c.num}`}>{numbered[1]}.</span>
            <p className={`text-[13.5px] font-medium leading-[1.75] tracking-[-0.01em] ${c.main}`}>{renderInline(numbered[2], c.bold)}</p>
          </div>
        )

        const bullet = trimmed.match(/^[-•]\s+(.+)$/)
        if (bullet) return (
          <div key={i} className="flex gap-2 items-baseline pl-4">
            <span className={`text-[10px] shrink-0 ${c.num}`}>·</span>
            <p className={`text-[13px] leading-[1.7] ${c.sub}`}>{renderInline(bullet[1], c.bold)}</p>
          </div>
        )

        return (
          <p key={i} className={`text-[13px] leading-[1.75] tracking-[-0.01em] ${c.sub}`}>{renderInline(trimmed, c.bold)}</p>
        )
      })}
    </div>
  )
}
