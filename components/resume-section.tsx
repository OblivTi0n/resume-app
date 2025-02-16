"use client"

import { useState } from "react"
import {
  Plus,
  PenLine,
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Paperclip,
  Mic,
  Send,
} from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import ChatBox from "@/components/chatbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { supabase } from '@/lib/supabase'
import Analysis from "@/components/Analysis"
import ResumeAnalysis from "@/components/resume-analysis"

interface ResumeData {
  personal_info: {
    name: string
    location: string
    linkedin: string
    phone: string
    email: string
    portfolio: string
  }
  professional_summary: string
  education: {
    university: string
    location: string
    degree: string
    graduation_date: string
    scholarship: string
  }
  work_experience: Array<{
    company: string
    location: string
    role: string
    start_date: string
    end_date: string
    responsibilities: string[]
  }>
  volunteer_experience: any[]
  skills: string[]
  projects: any[]
  social_media_and_links: {
    linkedin: string
    portfolio: string
  }
}

interface ResumeSectionProps {
  resumeData?: {
    content: any
    chat_log?: Array<{
      role: string
      content: string
      timestamp: string
    }>
    analysis?: any
  }
  showAIGuide?: boolean
  onCloseAIGuide?: () => void
  activeInstruction?: string
  onCloseGuide?: () => void
  onUpdateResume?: (path: string[], value: any) => void
}

export default function ResumeSection({ resumeData, showAIGuide, onCloseAIGuide, activeInstruction, onCloseGuide, onUpdateResume }: ResumeSectionProps) {
  // Control which islands are shown
  const [viewOption, setViewOption] = useState<"both" | "left" | "right">("both")

  // Segment control active index for slide animation
  const activeIndex = viewOption === "left" ? 0 : viewOption === "both" ? 1 : 2

  // For sorting (example in Work Experience)
  const [sortByDate, setSortByDate] = useState(false)

  // Resume Data
  const [resumeDataState, setResumeDataState] = useState<ResumeData>({
    personal_info: {
      name: "Philip Russell Widjaja",
      location: "Melbourne",
      linkedin: "https://www.linkedin.com/in/philip-r-w/",
      phone: "+61 435141239",
      email: "widjayaphilip7@gmail.com",
      portfolio: "https://philipportfolio-three.vercel.app/",
    },
    professional_summary:
      "A passionate Full Stack Developer with extensive experience in designing and deploying scalable web applications and AI-integrated solutions. Over 1,000 hours of hands-on developing scalable web applications using React, Next.js, Node.js, etc. Skilled in CI/CD practices, AWS cloud services, and Agile methodologies. Adept at collaborating with cross-functional teams to deliver high-quality, performant solutions.",
    education: {
      university: "Monash University",
      location: "Melbourne, Australia",
      degree: "Bachelor of Information Technology - Major in Software Development",
      graduation_date: "December 2024",
      scholarship: "Monash University Undergraduate Scholarship of $10,000",
    },
    work_experience: [
      {
        company: "Retr CRM",
        location: "Melbourne, Australia",
        role: "Full Stack Developer",
        start_date: "Jan 2024",
        end_date: "Dec 2024",
        responsibilities: [
          "Architected and deployed a full-stack AI-powered CRM integrating chatbot functionality, capable of handling hundreds of customer interactions simultaneously.",
          "Led end-to-end development using Node.js, Express.js, and Next.js for scalable frontend and backend architecture.",
          "Implemented cloud infrastructure with Google Cloud Run, Cloud Functions, and AWS EC2 for robust deployment and scalability.",
          "Developed comprehensive API testing and documentation workflows using Postman.",
          "Mastered JavaScript, TypeScript, HTML, and HTTPS protocols through over 1,000 hours of hands-on development.",
          "Integrated Meta's Messenger and Instagram DM APIs, navigating complex app review processes and extensive documentation.",
          "Implemented CI/CD pipelines for seamless deployment using Docker and AWS.",
        ],
      },
      {
        company: "Fit-3047 & Fit-3048 Industry Experience (Monash Uni Subject)",
        location: "Melbourne, Australia",
        role: "Full Stack Developer",
        start_date: "Jul 2024",
        end_date: "Nov 2024",
        responsibilities: [
          "Developed a booking system for L'Aquila Consulting, featuring a custom calendar and Stripe payment integration using CakePHP.",
          "Collaborated in a cross-functional team of five, following Agile methodologies and engaging in weekly client meetings for requirement gathering.",
          "Managed deployment and database administration through cPanel and phpMyAdmin.",
          "Implemented Test-Driven Development (TDD) with CakePHP's testing framework, reducing regression bugs and ensuring robust functionality.",
          "Conducted User Acceptance Testing (UAT) with client to validate system quality and expectations.",
        ],
      },
      {
        company: "Cekat AI - AI Chatbot Builder",
        location: "Jakarta, Indonesia",
        role: "Back-end Developer",
        start_date: "Jul 2023",
        end_date: "Sep 2023",
        responsibilities: [
          "Engineered infrastructure for AI chatbot integration using ChatGPT, LangChain, and vector databases.",
          "Implemented Retrieval Augmented Generation (RAG) systems to enhance chatbot accuracy and integrated with WhatsApp Business API.",
          "Developed web scraping tools for data collection from business websites and marketplaces like Tokopedia.",
        ],
      },
    ],
    volunteer_experience: [],
    skills: [
      "Python",
      "Java",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "PHP",
      "SQL",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Angularjs",
      "C++",
      "Next.js",
      "CakePHP",
      "React.js",
      "Google Cloud Run",
      "Google Cloud Functions",
      "AWS EC2",
      "Supabase",
      "Postman",
      "phpMyAdmin",
      "Git",
      "OOP",
      "RESTful API",
      "Docker",
      "CI/CD pipeline",
    ],
    projects: [],
    social_media_and_links: {
      linkedin: "https://www.linkedin.com/in/philip-r-w/",
      portfolio: "https://philipportfolio-three.vercel.app/",
    },
  })

  // Edit states


  // Add or remove fields in Work Experience



  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Segmented Control with Slide Animation */}
      <div className="container mx-auto py-4 flex justify-center">
        <div className="relative flex w-[300px] bg-gray-200 p-1 rounded-full">
          {/* Sliding indicator */}
          <span
            className="absolute top-0 left-0 bg-white w-1/3 h-full rounded-full shadow transition-all duration-200 ease-in-out"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
          {/* Segment Buttons */}
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

      {/* CONDITIONAL RENDERING */}
      {viewOption === "both" && (
        <div className="container mx-auto max-w-[95%] max-h-[95%] flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="overflow-auto">
            <ResumeAnalysis 
              resumeContent={resumeData ? resumeData.content : resumeDataState} 
              analysis={resumeData ? resumeData.analysis : undefined} 
            />
          </div>
          <div className="overflow-auto">
            <ChatBox 
              chatLog={resumeData?.chat_log || []} 
              activeInstruction={typeof activeInstruction === 'string' ? { type: activeInstruction } : activeInstruction}
              onCloseGuide={onCloseGuide}
              onUpdateResume={onUpdateResume}
              resumeData={resumeData?.content}
            />
          </div>
        </div>
      )}

      {viewOption === "left" && (
        <div className="container mx-auto max-w-[95%] max-h-[95%] flex-grow grid grid-cols-1 gap-4 mb-6">
          <div className="overflow-auto">
            <ResumeAnalysis 
              resumeContent={resumeData ? resumeData.content : resumeDataState}
              analysis={resumeData ? resumeData.analysis : undefined}
            />
          </div>
        </div>
      )}

      {viewOption === "right" && (
        <div className="container mx-auto max-w-[95%] max-h-[95%] flex-grow grid grid-cols-1 gap-4 mb-6">
          <div className="overflow-auto">
            <ChatBox 
              chatLog={resumeData?.chat_log || []} 
              activeInstruction={typeof activeInstruction === 'string' ? { type: activeInstruction } : activeInstruction}
              onCloseGuide={onCloseGuide}
              onUpdateResume={onUpdateResume}
              resumeData={resumeData?.content}
            />
          </div>
        </div>
      )}
    </div>
  )
}
