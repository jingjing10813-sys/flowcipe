import { Flow } from '@/types/flow'

const DIFFICULTY_COLOR: Record<string, string> = {
  '입문': 'text-emerald-600 bg-emerald-50',
  '중급': 'text-amber-600 bg-amber-50',
  '고급': 'text-red-500 bg-red-50',
}

interface GoalHeaderProps {
  flow: Flow
}

export function GoalHeader({ flow }: GoalHeaderProps) {
  const diffColor = DIFFICULTY_COLOR[flow.difficulty] ?? 'text-gray-500 bg-gray-100'

  return (
    <div className="mb-6">
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {flow.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full tracking-wide uppercase"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title — dominant */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-3">
        {flow.goal}
      </h1>

      {/* Description */}
      <p className="text-[15px] text-gray-400 leading-relaxed mb-5 max-w-[600px]">
        {flow.description}
      </p>

      {/* Meta row — compact pills */}
      <div className="flex items-center flex-wrap gap-2">
        <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${diffColor}`}>
          {flow.difficulty}
        </span>
        <span className="text-gray-200 text-sm">·</span>
        <span className="text-[13px] font-medium text-gray-400">
          ⏱ {flow.estimatedTime}
        </span>
        <span className="text-gray-200 text-sm">·</span>
        <span className="text-[13px] font-medium text-gray-400">
          {flow.steps.length}단계
        </span>
      </div>
    </div>
  )
}
