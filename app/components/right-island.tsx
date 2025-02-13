"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Paperclip, Send, Sparkles } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { TextareaAutosize } from "./textarea-autosize"

export const RightIsland = () => {
  const [showInstruction, setShowInstruction] = useState(true)

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto mb-4 pr-4 -mr-4">
        <ChatMessage
          isAssistant={true}
          content="I've created the essay about omelettes in the canvas for you. Let me know if you'd like any adjustments or additional details!"
          timestamp="2:39 PM"
          attachmentLabel="Omelette Essay"
        />
        <ChatMessage
          isAssistant={false}
          content="Thanks! Can you add a section about different types of cheese that work well in omelettes?"
          timestamp="2:41 PM"
        />
        <ChatMessage
          isAssistant={true}
          content="I've updated the essay with a new section on cheese varieties that complement omelettes. I've included popular options like cheddar, feta, goat cheese, and gruyère, along with their flavor profiles and how they melt. Would you like me to elaborate on any specific cheese?"
          timestamp="2:43 PM"
          attachmentLabel="Updated Omelette Essay"
        />
        {showInstruction && (
          <ChatMessage
            isAssistant={true}
            content={
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <h3 className="text-base font-semibold text-blue-700">Add a new work experience</h3>
                </div>
                <p className="text-sm text-gray-600">
                  I can help you add a new work experience to your profile. Please provide details such as the company
                  name, your role, start and end dates, and a brief description of your responsibilities.
                </p>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-medium text-blue-700 bg-white hover:bg-blue-50 border-blue-200"
                    onClick={() => setShowInstruction(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            }
            timestamp="2:45 PM"
          />
        )}
      </div>

      {/* Message Input */}
      <div className="mt-auto space-y-2">
        <div className="relative flex items-center bg-white rounded-2xl shadow-sm border p-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-transparent shrink-0">
            <Paperclip className="h-5 w-5 text-gray-400" />
          </Button>
          <div className="flex-1 min-w-0">
            <TextareaAutosize
              placeholder="Message..."
              className="w-full py-1.5 px-2 focus:outline-none"
              minRows={1}
              maxRows={5}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-transparent">
              <Mic className="h-5 w-5 text-gray-400" />
            </Button>
            <Button size="icon" className="h-8 w-8 rounded-full bg-gray-900 hover:bg-gray-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-gray-500">Messages are processed by AI. Verify important information.</p>
      </div>
    </div>
  )
}

