"use client";

import * as React from "react";
import { useState, useEffect, useLayoutEffect } from "react";
import ResumeView from "@/components/Resumeview";
import ResumeEditor from "@/components/rightIsland";
import ChatBox from "@/components/chatbox"
import ResumeAnalysis from "./resume-analysis";
import AnalysisScore from "@/components/analysis-score";

// Import the common types:
import { ResumeContent, Responsibility, WorkExperience } from "@/types/resume";

// ---------------------
// Define Interfaces & Types
// ---------------------
export interface ResumeStylingProps {
  title: string;
  data: ResumeContent;
  onUpdate: (newData: ResumeContent) => void;
  onChatUpdate?: (message: { role: string; content: string; timestamp: string }) => void;
  onShowAIGuide: (type: string, params?: { company?: string }) => void;
  chat_log?: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  linkedJobs: {
    id: string;
    title: string;
    location: string;
  }[];
  onTailorToJob?: () => void;
  resumeType: "base" | "tailored";
  onShowJobList?: () => void;
  analysis?: any
}

export default function ResumeStylingPage({
  title,
  data,
  onUpdate,
  onShowAIGuide,
  chat_log,
  linkedJobs,
  onTailorToJob,
  resumeType,
  onShowJobList,
  analysis
}: ResumeStylingProps) {
  // Local state for resume data (syncs with parent)
  const [resumeData, setResumeData] = useState<ResumeContent>(data);

  // Added useLayoutEffect to scroll to top on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setResumeData(data);
  }, [data]);

  // New state for controlling the active AI instruction
  const [activeInstruction, setActiveInstruction] = useState<{ type: string; company?: string } | null>(null);

  // Local function to update resume data.
  // Updated to call onUpdate with the fresh state value.
  const handleUpdateResume = (path: string[], value: any) => {
    setResumeData(prev => {
      const updated = { ...prev, [path[0]]: value };
      if (onUpdate) {
        onUpdate(updated);
      }
      return updated;
    });
  };

  // Update the active instruction and call parent's onShowAIGuide if needed
  const handleShowAIGuide = (type: string, params?: { company?: string }) => {
    if (onShowAIGuide) onShowAIGuide(type, params);
    setActiveInstruction({ type, company: params?.company });
  };

  const handleCloseAIGuide = () => {
    setActiveInstruction(null);
  };

  return (
      <div className="w-full h-full flex-grow grid grid-cols-5 md:grid-cols-[40%_25%_35%] gap-4 overflow-hidden bg-gray-100 overflow-y-auto">
          
          <ResumeEditor
            title={title}
            resumeDatas={resumeData}
            analysis={analysis}
            onLocalUpdate={(newData) => setResumeData(newData)}
            onUpdate={(newData) => {
              // Auto-save update, e.g., saving to Supabase.
              onUpdate(newData);
            }}
            onShowAIGuide={handleShowAIGuide}
          />
  <div className="mt-5 mb-5 overflow-hidden">
            <ChatBox 
              chatLog={chat_log || []} 
              activeInstruction={activeInstruction}
              onCloseGuide={handleCloseAIGuide}
              resumeData={resumeData}
              onUpdateResume={handleUpdateResume}
            />
          </div>
        <ResumeView data={resumeData} allignment={true} />
      </div>
  );
}
