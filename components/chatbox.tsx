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
  activeInstruction?: { type: string; company?: string } | null
  onCloseGuide?: () => void
  onUpdateResume?: (path: string[], value: any) => void
  resumeData?: any
}

function ChatBox({ chatLog = [], activeInstruction, onCloseGuide, onUpdateResume, resumeData }: ChatBoxProps) {
  // Add a default assistant instructory message
  const defaultAssistantMessage: ChatMessage = {
    role: "assistant",
    content: "Welcome! How can I assist you in improving your resume?",
    timestamp: new Date().toISOString(),
  };

  // Initialize messages state with existing chatLog or the default message if empty
  const [messages, setMessages] = useState<ChatMessage[]>(
    chatLog.length > 0 ? chatLog : [defaultAssistantMessage]
  );
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const resumeId = searchParams.get("id")

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
  enhance_work_experience: {
    name: "Enhance Work Experience Responsibilities",
    description: "I can help you enhance the responsibilities for your work experience. Please provide details regarding your work experience to improve your responsibilities.",
    prompt: `You are an expert resume writer. 
    You will receive the user's current resume in JSON format along with the specific work experience company they want to enhance. Your task is to craft responsibilities for that work experience based on the user's instructions, ensuring you follow these guidelines:

    user's Resume:
   ${JSON.stringify(resumeData)}
   user's work experience company: ${activeInstruction?.company}
    STAR Method:
    
    Use the STAR method (Situation, Task, Action, Result) when writing the responsibilities. If the user provides comprehensive STAR details or key keywords for each role, craft one separate bullet point per role. If the explanation is vague or incomplete, ask minimal follow-up questions to obtain the necessary STAR details.
    
    Remember you should ask questions leading to get information that is usefull to create good list of responsibilities so that a recruiter will understand what did they do in that work experience well.
    
    XYZ Method:
    
    Once you have sufficient information, create concise and impactful bullet points using the XYZ method:
    X: The achievement or accomplishment
    Y: The context or scope of the project or responsibility
    Z: The measurable or specific outcome
    Each bullet point should focus on a unique skill set or role and include missing keywords naturally, quantifying results wherever possible.
    Incomplete Information:
    
    If the user doesn't provide complete information regarding the STAR method, do not ask any additional questions beyond the minimal follow-ups. Instead, create the responsibilities list/bullet points with the available details.
    Output Format:
    
    Deliver the final bullet points in the following JSON format so that the user can directly add them to their resume:
    
    {
      "work_experience": [
        {
          "role": "Full Stack Developer",
          "company": "Retr CRM - AI Customer Relationship Management Software Agency",
          "end_date": "December 2024",
          "location": "Melbourne, Australia",
          "start_date": "January 2024",
          "responsibilities": [
            {
              "mode": null,
              "text": "responsibility 1"
            },
            {
              "mode": null,
              "text": "responsibility 2"
            },
            {
              "mode": null,
              "text": "responsibility 3"
            }
          ]
        }
      ]
    }
    
    For the instruction ask the user regarding their work experience`
  },
};
  // Sync with incoming prop changes: if chatLog is empty, use the default message.
  useEffect(() => {
    if (chatLog.length > 0) {
      setMessages(chatLog)
    } else {
      setMessages([defaultAssistantMessage])
    }
  }, [chatLog])

  // Add this useEffect to scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Get current instruction
  const currentInstruction = activeInstruction ? AI_INSTRUCTIONS[activeInstruction.type] : null;
console.log(currentInstruction)
  // Send message
  const handleSendMessage = async () => {
    if (onCloseGuide) onCloseGuide(); // This will set activeInstruction to null in parent
    if (!inputMessage.trim() || !resumeId) return;
  
    setIsLoading(true);
  
    try {
      // Create a local updatedChatLog variable from current messages
      const prevMessages = [...messages];
      const userMessageObject = {
        role: "user",
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };
      // Append the user's message locally
      const updatedChatLog = [...prevMessages, userMessageObject];
      setMessages(updatedChatLog);
    
      // Prepare payload to send to the server
      const requestBody: Record<string, string | undefined> = {
        resumeId,
        userMessage: inputMessage,
        resumeData: JSON.stringify(resumeData), 
        chatLog: JSON.stringify(updatedChatLog),
      };
      if (currentInstruction) {
        console.log(`currentInstruction: ${currentInstruction}`);
        requestBody.assistantMessage = currentInstruction.description;
        requestBody.prompt =
          currentInstruction.prompt +
          (activeInstruction?.company ? `\n\nCompany: ${activeInstruction.company}` : '');
      }
    
      // Send message to your server
      const response = await fetch("https://untitled19-916323492822.australia-southeast2.run.app/chat", {
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
      
      // Ensure that if aiMessage.json exists as a string, we parse it into a JSON object
      let jsonData = aiMessage.json;
      if (jsonData && typeof jsonData === 'string') {
        try {
          jsonData = JSON.parse(jsonData);
        } catch (err) {
          console.error("Error parsing aiMessage.json:", err);
        }
      }
      
      // If a JSON object is returned from the server, update the corresponding resume section(s)
      if (jsonData && typeof jsonData === "object") {
        Object.entries(jsonData).forEach(([section, value]) => {
          if (onUpdateResume) {
            onUpdateResume([section], value);
          }
        });
      }
      
      // Override the assistant's message if JSON updates exist
      let messageToDisplay = aiMessage.message;
      if (
        jsonData &&
        typeof jsonData === "object" &&
        Object.keys(jsonData).length > 0
      ) {
        const updateMessages = Object.keys(jsonData).map((section) => {
          if (section === "skills") return "skills list updated";
          if (section === "work_experience") return "work experience updated";
          // For any additional sections, use a generic update message
          return `${section} updated`;
        });
        messageToDisplay = updateMessages.join(", ");
      }

      // Always use the (potentially overridden) message field for the assistant's message
      const assistantMessageObject = {
        role: "assistant",
        content: messageToDisplay,
        timestamp: new Date().toISOString(),
      };

      // Append the assistant's message locally
      updatedChatLog.push(assistantMessageObject);
      setMessages(updatedChatLog);

      // Update the chat log in Supabase with the new messages array
      const { error: updateError } = await supabase
        .from("resumes")
        .update({ chat_log: updatedChatLog })
        .eq("id", resumeId);
      if (updateError) {
        console.error("Failed to update chat log in Supabase:", updateError);
      }

      setInputMessage("");
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

  // Function to clear the chat log
  const handleClearChat = async () => {
    const clearMessages = [defaultAssistantMessage];
    setMessages(clearMessages);
    if (resumeId) {
      const { error: updateError } = await supabase
        .from("resumes")
        .update({ chat_log: clearMessages })
        .eq("id", resumeId);
      if (updateError) {
        console.error("Failed to clear chat log:", updateError);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-end mb-4">
        <Button variant="outline" size="sm" onClick={handleClearChat}>
          Clear Chat
        </Button>
      </div>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2 -mr-4 custom-scrollbar">
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
      
      {/* Prewritten question bubbles */}
      <div className="flex space-x-2 mb-2">
        <button
          type="button"
          onClick={() => setInputMessage("How can I improve my skills section?")}
          className="rounded-[980px] bg-blue-100 px-4 py-2 text-blue-700 text-sm shadow"
        >
          Improve Skills
        </button>
        <button
          type="button"
          onClick={() => setInputMessage("What should I add to my work experience?")}
          className="rounded-[980px] bg-blue-100 px-4 py-2 text-blue-700 text-sm shadow"
        >
          Work Experience Help
        </button>
        <button
          type="button"
          onClick={() => setInputMessage("Can you help me tailor my resume for a new job?")}
          className="rounded-[980px] bg-blue-100 px-4 py-2 text-blue-700 text-sm shadow"
        >
          Tailor Resume
        </button>
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

      {/* Add the scrollbar styling similar to rightIsland.tsx */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
        }
      `}</style>
    </div>
  )
}

export default ChatBox
