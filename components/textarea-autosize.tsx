
"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface TextareaAutosizeProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number
  maxRows?: number
}

export const TextareaAutosize: React.FC<TextareaAutosizeProps> = ({
  minRows = 1,
  maxRows = 5,
  className,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const updateTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minRows * 24), // Assuming 24px per row
        maxRows * 24,
      )
      textarea.style.height = `${newHeight}px`
    }
  }

  useEffect(() => {
    updateTextareaHeight()
  }, [props.value, minRows, maxRows]) // Added minRows and maxRows to dependencies

  return (
    <textarea
      ref={textareaRef}
      className={cn("resize-none overflow-hidden bg-transparent", "text-sm focus:outline-none", className)}
      rows={minRows}
      onChange={(e) => {
        updateTextareaHeight()
        props.onChange?.(e)
      }}
      {...props}
    />
  )
}

