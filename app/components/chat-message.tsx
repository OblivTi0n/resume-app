import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface ChatMessageProps {
  isAssistant: boolean
  content: string | ReactNode
  timestamp: string
  attachmentLabel?: string
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ isAssistant, content, timestamp, attachmentLabel }) => (
  <div className={`flex items-start gap-4 mb-4 p-4 rounded-lg ${isAssistant ? "bg-blue-50" : "bg-gray-100"}`}>
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
        isAssistant ? "bg-blue-500" : "bg-green-500"
      }`}
    >
      {isAssistant ? "A" : "U"}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium">{isAssistant ? "Assistant 4.0" : "You"}</span>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>
      <div className="text-sm text-muted-foreground mb-2">{typeof content === "string" ? content : content}</div>
      {attachmentLabel && (
        <Button variant="outline" className="h-8 text-xs px-3 py-1">
          {attachmentLabel}
        </Button>
      )}
    </div>
  </div>
)

