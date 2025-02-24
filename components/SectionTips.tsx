"use client"

import { ChevronDown, ChevronUp } from "lucide-react"

interface SectionTipsProps {
  tips: string[]
  isOpen: boolean
  onToggle: () => void
}

export function SectionTips({ tips, isOpen, onToggle }: SectionTipsProps) {
  return (
    <div className="bg-white max-w-[90%] mx-auto rounded-t-[15px]">
      {/* Header (click to toggle) */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <h2 className="font-semibold text-gray-800">Tips and Recommendations</h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </div>

      {/* Body (visible only when `isOpen` is true) */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-2">
          {tips.map((tip, index) => (
            <div key={index} className="text-sm text-gray-700">
              • {tip}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
