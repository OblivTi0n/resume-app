import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"
import { marked } from "marked"

interface ChatMessageProps {
  isAssistant: boolean
  content: string | ReactNode
  timestamp: string
  attachmentLabel?: string
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ isAssistant, content, timestamp, attachmentLabel }) => (
  <div className={`relative flex gap-4 mb-4 p-4 rounded-lg ${isAssistant ? "bg-blue-50" : "bg-gray-50"}`}>
    <div
      className={`absolute top-4 left-4 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium ${
        isAssistant ? "bg-blue-500" : "bg-green-500"
      }`}
    >
      {isAssistant ? "A" : "U"}
    </div>
    <div className="flex-1 pl-4">
      <div className="flex items-center gap-2 mb-2 ml-5 min-h-[1.5rem]">
        {!isAssistant && <span className="font-medium">You</span>}
        <span className="text-xs text-muted-foreground ">{timestamp}</span>
      </div>
      <div
        className="text-sm text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: marked.parse(typeof content === "string" ? content : String(content)) }}
      ></div>
      {attachmentLabel && (
        <Button variant="outline" className="h-8 text-xs px-3 py-1">
          {attachmentLabel}
        </Button>
      )}
    </div>
  </div>
)

