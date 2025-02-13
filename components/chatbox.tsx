import { useState, useEffect, KeyboardEvent, useRef } from "react"
import { ChatMessage } from "@/components/chat-message"
import { TextareaAutosize } from "@/components/textarea-autosize"
import { supabase } from "@/lib/supabase"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Paperclip, Mic, Sparkles } from "lucide-react"

interface RightIslandProps {
  chatLog?: Array<{
    role: string
    content: string
    timestamp: string
  }>
  activeInstruction?: string
  onCloseGuide?: () => void
  onUpdateResume?: (path: string[], value: any) => void
  resumeData?: any
}

interface AIInstruction {
  name: string;
  description: string;
  prompt: string;
}

const AI_INSTRUCTIONS: Record<string, AIInstruction> = {
  add_work_experience: {
    name: "Add a new work experience",
    description: "I can help you add a new work experience to your profile. Please provide details such as the company name, your role, start and end dates, and a brief description of your responsibilities.",
    prompt: `The user has explained their work experience if something regarding their work experience is unclear or confusing ask them to clarify it. if all is complete return in json format and only return the json format start your response with "{". follow this format: 
    {
      "company": "Company name here",
      "location": "City name here",
      "role": "Role here",
      "start_date": "Start date here",
      "end_date": "End date here",
      "responsibilities": [
        "Responsibility 1 here",
        "Responsibility 2 here",
        "Responsibility 3 here"
      ]
    }`
  },
  // Add more instructions here
};

interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
}

interface ChatBoxProps {
  chatLog?: Array<{
    role: string
    content: string
    timestamp: string
  }>
  activeInstruction?: string
  onCloseGuide?: () => void
  onUpdateResume?: (path: string[], value: any) => void
  resumeData?: any
}

function ChatBox({ chatLog = [], activeInstruction, onCloseGuide, onUpdateResume, resumeData }: RightIslandProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(chatLog)
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const resumeId = searchParams.get("id")

  // Add this useEffect to sync with incoming prop changes
  useEffect(() => {
    setMessages(chatLog)
  }, [chatLog])

  // Add this useEffect to scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Get current instruction
  const currentInstruction = activeInstruction ? AI_INSTRUCTIONS[activeInstruction] : null;
console.log(currentInstruction)
  // Send message
  const handleSendMessage = async () => {
    if (onCloseGuide) onCloseGuide(); // This will set activeInstruction to null in parent
    if (!inputMessage.trim() || !resumeId) return;
  
    setIsLoading(true);
  
    try {
      // Optimistically add user message
      const userMessageObject = {
        role: "user",
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };
  
      setMessages((prev) => [...prev, userMessageObject]);
  
      // Determine payload based on whether an instruction is active
      const requestBody: Record<string, string | undefined> = {
        resumeId,
        userMessage: inputMessage,
      };
  
      if (currentInstruction) {
        console.log(`currentInstruction: ${currentInstruction}`)
        requestBody.assistantMessage = currentInstruction.description;
        requestBody.prompt = currentInstruction.prompt;
      }
  
      // Send message to your server
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
  
      const aiMessage = await response.json();
  
      // Add this code to parse JSON if possible
      try {
        if (typeof aiMessage.content === 'string' && aiMessage.content.trim().startsWith('{')) {
          const jsonContent = JSON.parse(aiMessage.content);
          console.log('Parsed JSON:', jsonContent);
          if (onUpdateResume) {
            // For work experience
              onUpdateResume(['work_experience'], jsonContent);
            
            // Add more instruction types here
          }
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "i have added your new work experience, please click the 'Save' button to save your changes.",
              timestamp: new Date().toISOString(),
            },
          ]);
      
          // Clear input
          setInputMessage("");
        }
      } catch (e) {
        console.log('Not JSON content');
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: aiMessage.content,
            timestamp: new Date().toISOString(),
          },
        ]);
    
        // Clear input
        setInputMessage("");
      }
  
      // Add AI response to local state
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Send on Enter (without Shift)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 pr-4 -mr-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            isAssistant={message.role === "assistant"}
            content={message.content}
            timestamp={new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        ))}
        <div ref={messagesEndRef} />
        {currentInstruction && (
          <ChatMessage
            isAssistant={true}
            content={
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <h3 className="text-base font-semibold text-blue-700">
                    {currentInstruction.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {currentInstruction.description}
                </p>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-medium text-blue-700 bg-white hover:bg-blue-50 border-blue-200"
                    onClick={onCloseGuide}
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
      
      {/* Input area */}
      <div className="mt-auto space-y-2">
        <div className="relative flex items-center bg-white rounded-2xl shadow-sm border p-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-transparent shrink-0">
            <Paperclip className="h-5 w-5 text-gray-400" />
          </Button>
          <div className="flex-1 min-w-0">
            <TextareaAutosize
              placeholder="Message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full py-1.5 px-2 focus:outline-none"
              minRows={1}
              maxRows={5}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-transparent">
              <Mic className="h-5 w-5 text-gray-400" />
            </Button>
            <Button onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-gray-500">
          Messages are processed by AI. Verify important information.
        </p>
      </div>
    </div>
  )
}

export default ChatBox
