import { Flow } from '@/types/flow'

const DIFFICULTY_DOTS: Record<string, number> = {
  '입문': 1,
  '중급': 2,
  '고급': 3,
}

interface GoalHeaderProps {
  flow: Flow
}

export function GoalHeader({ flow }: GoalHeaderProps) {
  const dots = DIFFICULTY_DOTS[flow.difficulty] ?? 1

  return (
    <div className="mb-8">
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {flow.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full tracking-wide"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {flow.goal}
      </h1>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-5">
        {flow.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-5">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">난이도</p>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-700">{flow.difficulty}</span>
            <div className="flex gap-0.5">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`text-xs ${i <= dots ? 'text-gray-900' : 'text-gray-200'}`}
                >
                  ⚡
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="w-px h-8 bg-gray-100" />

        <div>
          <p className="text-xs text-gray-400 mb-0.5">예상 시간</p>
          <p className="text-sm font-semibold text-gray-700">{flow.estimatedTime}</p>
        </div>

        <div className="w-px h-8 bg-gray-100" />

        <div>
          <p className="text-xs text-gray-400 mb-0.5">단계</p>
          <p className="text-sm font-semibold text-gray-700">{flow.steps.length}단계</p>
        </div>
      </div>
    </div>
  )
}
