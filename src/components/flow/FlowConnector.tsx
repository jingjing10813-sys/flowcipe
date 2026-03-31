'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface FlowConnectorProps {
  message: string
  onNext: () => void
  isVisible: boolean
}

export function FlowConnector({ message, onNext, isVisible }: FlowConnectorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center py-2"
        >
          {/* Vertical line */}
          <div className="w-px h-6 bg-gray-200" />

          {/* Connector card */}
          <div className="w-full bg-white border border-gray-100 rounded-[16px] px-5 py-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-semibold text-green-500 mb-0.5">{message}</p>
              <p className="text-sm text-gray-500">
                결과를 복사하여 다음 단계에 붙여넣으세요
              </p>
            </div>
            <button
              onClick={onNext}
              className="shrink-0 ml-4 bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-[10px] hover:bg-gray-800 active:scale-[0.97] transition-all"
            >
              다음 단계 →
            </button>
          </div>

          {/* Vertical line */}
          <div className="w-px h-6 bg-gray-200" />
        </motion.div>
      )}

      {!isVisible && (
        <div className="flex justify-center py-2">
          <div className="w-px h-10 bg-gray-100" />
        </div>
      )}
    </AnimatePresence>
  )
}
