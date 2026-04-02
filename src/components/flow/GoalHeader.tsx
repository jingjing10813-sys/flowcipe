import { Flow } from '@/types/flow'

const DIFFICULTY_COLOR: Record<string, string> = {
  '입문': 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30',
  '중급': 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30',
  '고급': 'text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
}

interface GoalHeaderProps {
  flow: Flow
}

export function GoalHeader({ flow }: GoalHeaderProps) {
  const diffColor = DIFFICULTY_COLOR[flow.difficulty] ?? 'text-gray-500 bg-gray-100 dark:text-[#a3a3a3] dark:bg-[#232323]'

  return (
    <div className="mb-8 sm:flex sm:items-start sm:justify-between sm:gap-6">
      {/* Left: title + desc */}
      <div className="min-w-0">
        <h1 className="text-[28px] sm:text-[34px] font-bold text-gray-900 dark:text-[#f5f5f5] leading-tight tracking-tight mb-2">
          {flow.goal}
        </h1>
        <p className="text-[14px] text-gray-400 dark:text-[#737373] leading-relaxed max-w-[560px] mb-3 sm:mb-0">
          {flow.description}
        </p>

        {/* Mobile badges */}
        <div className="flex items-center gap-2 mt-2 sm:hidden">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${diffColor}`}>
            {flow.difficulty}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#232323] text-gray-500 dark:text-[#a3a3a3]">
            {flow.estimatedTime}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#232323] text-gray-500 dark:text-[#a3a3a3]">
            {flow.steps.length}단계
          </span>
        </div>
      </div>

      {/* Desktop boxes */}
      <div className="hidden sm:flex items-start gap-2 shrink-0">
        <div className="flex flex-col items-center justify-center px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/[0.08] rounded-[12px] min-w-[64px]">
          <p className="text-[9px] font-bold text-gray-300 dark:text-[#737373] uppercase tracking-widest mb-1.5">난이도</p>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${diffColor}`}>
            {flow.difficulty}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/[0.08] rounded-[12px] min-w-[72px]">
          <p className="text-[9px] font-bold text-gray-300 dark:text-[#737373] uppercase tracking-widest mb-1.5">예상 시간</p>
          <p className="text-[13px] font-semibold text-gray-700 dark:text-[#f5f5f5]">{flow.estimatedTime}</p>
        </div>
        <div className="flex flex-col items-center justify-center px-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/[0.08] rounded-[12px] min-w-[56px]">
          <p className="text-[9px] font-bold text-gray-300 dark:text-[#737373] uppercase tracking-widest mb-1.5">단계</p>
          <p className="text-[13px] font-semibold text-gray-700 dark:text-[#f5f5f5]">{flow.steps.length}단계</p>
        </div>
      </div>
    </div>
  )
}
