"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import ResumeView from "@/components/Resumeview";
import ResumeEditor from "@/components/rightIsland";
import ChatBox from "@/components/chatbox"

// ---------------------
// Define Interfaces & Types
// ---------------------
interface Responsibility {
  text: string;
  oldText?: string;
  mode?: "new" | "deletion" | "edit" | null;
}
interface WorkExperience {
  company: string;
  location: string;
  role: string;
  start_date: string;
  end_date: string;
  responsibilities: Responsibility[];
  mode?: "new" | null;
}
export interface ResumeContent {
  personal_info: {
    name: string;
    location: string;
    linkedin: string;
    phone: string;
    email: string;
    portfolio: string;
  };
  professional_summary: string;
  education: {
    university: string;
    location: string;
    degree: string;
    graduation_date: string;
    scholarship: string;
  };
  work_experience: WorkExperience[];
  volunteer_experience: any[];
  skills: string[];
  projects: any[];
  social_media_and_links: {
    linkedin: string;
    portfolio: string;
  };
}

export interface ResumeStylingProps {
  data: ResumeContent;
  onUpdate: (newData: ResumeContent) => void;
  onChatUpdate?: (message: { role: string; content: string; timestamp: string }) => void;
  onShowAIGuide: (type: string, params?: { company?: string }) => void;
  chat_log?: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
}

export default function ResumeStylingPage({
  data,
  onUpdate,
  onShowAIGuide,
  chat_log
}: ResumeStylingProps) {
  // Local state for resume data (syncs with parent)
  const [resumeData, setResumeData] = useState<ResumeContent>(data);

  useEffect(() => {
    setResumeData(data);
  }, [data]);

  // New state for controlling the active AI instruction
  const [activeInstruction, setActiveInstruction] = useState<{ type: string; company?: string } | null>(null);

  // Update the active instruction and call parent's onShowAIGuide if needed
  const handleShowAIGuide = (type: string, params?: { company?: string }) => {
    if (onShowAIGuide) onShowAIGuide(type, params);
    setActiveInstruction({ type, company: params?.company });
  };

  const handleCloseAIGuide = () => {
    setActiveInstruction(null);
  };

  return (
      <div className="w-full h-full flex-grow grid grid-cols-1 md:grid-cols-[40%_20%_40%] gap-4 overflow-auto">
        <ResumeEditor
          resumeDatas={resumeData}
          onUpdate={onUpdate}
          onShowAIGuide={handleShowAIGuide}
        />
        <div className="overflow-auto">
          <ChatBox 
            chatLog={chat_log || []} 
            activeInstruction={activeInstruction}
            onCloseGuide={handleCloseAIGuide}
            resumeData={resumeData}
          />
        </div>
        <ResumeView data={resumeData} allignment={true} />
      </div>
  );
}
