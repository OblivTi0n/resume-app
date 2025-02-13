"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import ResumeView from "@/components/Resumeview";
import RightIsland from "@/components/rightIsland";

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
  onShowAIGuide: (type: string) => void;
}

export default function ResumeStylingPage({
  data,
  onUpdate,
  onShowAIGuide,
}: ResumeStylingProps) {
  // Local state for resume data (syncs with parent)
  const [resumeData, setResumeData] = useState<ResumeContent>(data);

  useEffect(() => {
    setResumeData(data);
  }, [data]);

  // --- Other UI states ---
  const [viewOption, setViewOption] = useState<"both" | "left" | "right">("both");
  const activeIndex = viewOption === "left" ? 0 : viewOption === "both" ? 1 : 2;

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Segmented Control */}
      <div className="container mx-auto py-4 flex justify-center">
        <div className="relative flex w-[300px] bg-gray-200 p-1 rounded-full">
          <span
            className="absolute top-0 left-0 bg-white w-1/3 h-full rounded-full shadow transition-all duration-200 ease-in-out"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          <button
            onClick={() => setViewOption("left")}
            className="relative z-10 w-1/3 text-center py-2 text-sm font-medium"
          >
            Left
          </button>
          <button
            onClick={() => setViewOption("both")}
            className="relative z-10 w-1/3 text-center py-2 text-sm font-medium"
          >
            Both
          </button>
          <button
            onClick={() => setViewOption("right")}
            className="relative z-10 w-1/3 text-center py-2 text-sm font-medium"
          >
            Right
          </button>
        </div>
      </div>

      {/* Conditional Rendering based on viewOption */}
      {viewOption === "both" && (
        <div className="container mx-auto max-w-[95%] max-h-[95%] flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ResumeView data={resumeData} allignment={true} />
            <RightIsland
              resumeDatas={resumeData}
              onUpdate={onUpdate}
              onShowAIGuide={onShowAIGuide}
            />
        </div>
      )}
      {viewOption === "left" && (
        <div className="container mx-auto max-w-[95%] max-h-[95%] flex-grow grid grid-cols-1 gap-4 mb-6">
          <div className="overflow-auto">
            <ResumeView data={resumeData} allignment={false} />
          </div>
        </div>
      )}
      {viewOption === "right" && (
        <div className="container mx-auto max-w-[95%] max-h-[95%] flex-grow grid grid-cols-1 gap-4 mb-6">
          <div className="overflow-auto">
            <RightIsland
              resumeDatas={resumeData}
              onUpdate={onUpdate}
              onShowAIGuide={onShowAIGuide}
            />
          </div>
        </div>
      )}
    </div>
  );
}
