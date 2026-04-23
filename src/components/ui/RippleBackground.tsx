'use client'
import { useEffect, useRef, useCallback } from 'react'

const ROWS = 16
const COLS = 28
const CELL_SIZE = 56
const DELAY_PER_DIST = 55   // ms per distance unit
const ANIM_BASE = 200        // ms base duration
const ANIM_SCALE = 80        // ms added per distance unit

export function RippleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const autoTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const triggerRipple = useCallback((rowIdx: number, colIdx: number) => {
    const container = containerRef.current
    if (!container) return
    const cells = container.querySelectorAll<HTMLElement>('[data-cell]')

    cells.forEach((el) => {
      const row = Number(el.dataset.row)
      const col = Number(el.dataset.col)
      const dist = Math.hypot(row - rowIdx, col - colIdx)
      const delay = dist * DELAY_PER_DIST
      const duration = ANIM_BASE + dist * ANIM_SCALE

      // reset then animate
      el.style.transition = 'none'
      el.style.opacity = '0.08'
      el.style.transform = 'scale(1)'

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = `opacity ${duration}ms easeOut ${delay}ms, transform ${duration}ms easeOut ${delay}ms`
          el.style.opacity = '0.55'
          el.style.transform = 'scale(1.08)'

          setTimeout(() => {
            el.style.transition = `opacity ${duration}ms ease-in, transform ${duration}ms ease-in`
            el.style.opacity = '0.08'
            el.style.transform = 'scale(1)'
          }, delay + duration * 0.5)
        })
      })
    })
  }, [])

  const scheduleAuto = useCallback(() => {
    const delay = 2000 + Math.random() * 2500
    autoTimerRef.current = setTimeout(() => {
      const row = Math.floor(Math.random() * ROWS)
      const col = Math.floor(Math.random() * COLS)
      triggerRipple(row, col)
      scheduleAuto()
    }, delay)
  }, [triggerRipple])

  useEffect(() => {
    scheduleAuto()
    return () => clearTimeout(autoTimerRef.current)
  }, [scheduleAuto])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left + (containerRef.current!.scrollLeft || 0)
    const y = e.clientY - rect.top + (containerRef.current!.scrollTop || 0)

    // find offset of grid center
    const gridW = COLS * CELL_SIZE
    const gridH = ROWS * CELL_SIZE
    const offsetX = (containerRef.current!.offsetWidth - gridW) / 2
    const offsetY = (containerRef.current!.offsetHeight - gridH) / 2

    const col = Math.floor((x - offsetX) / CELL_SIZE)
    const row = Math.floor((y - offsetY) / CELL_SIZE)
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      triggerRipple(row, col)
    }
  }, [triggerRipple])

  const cells = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      cells.push({ r, c })
    }
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="absolute inset-0 overflow-hidden cursor-pointer select-none"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
          width: COLS * CELL_SIZE,
          height: ROWS * CELL_SIZE,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {cells.map(({ r, c }) => (
          <div
            key={`${r}-${c}`}
            data-cell
            data-row={r}
            data-col={c}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              opacity: 0.08,
              border: '1px solid rgba(255,255,255,0.12)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              transform: 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
