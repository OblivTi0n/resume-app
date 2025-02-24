'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { FileText, Settings, Home, Bell, HelpCircle, BarChart3, Loader2 } from 'lucide-react';
import { AppSidebar } from '@/components/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/navbar';
import ResumeSection from '@/components/resume-section';
import ResumeStylingPage from '@/components/resume-styling-page';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import JobList from '@/components/job-list';
import ResumeAnalysis from '@/components/resume-analysis';

// Import the common ResumeContent type:
import { ResumeContent } from "@/types/resume";

const navigation = [
  { name: "Home", href: "/start", icon: Home, current: false },
  { name: "My Resumes", href: "/resumelist", icon: FileText, current: true },
  { name: "Templates", href: "#", icon: BarChart3, current: false },
  { name: "Notifications", href: "#", icon: Bell, current: false },
  { name: "Settings", href: "#", icon: Settings, current: false },
  { name: "Help", href: "#", icon: HelpCircle, current: false },
];

interface ResumeData {
  title: string;
  content: ResumeContent;
  chat_log: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  analysis?: any;
  type: "base" | "tailored";
}

interface Job {
  id: string;
  title: string;
  location: string;
}

const ResizableHandle = dynamic(
  () => import('@/components/ui/resizable').then(mod => mod.ResizableHandle),
  { ssr: false }
);

const ResizablePanel = dynamic(
  () => import('@/components/ui/resizable').then(mod => mod.ResizablePanel),
  { ssr: false }
);

const ResizablePanelGroup = dynamic(
  () => import('@/components/ui/resizable').then(mod => mod.ResizablePanelGroup),
  { ssr: false }
);

function ResumeEditPageContent() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('id');
  const [activeInstruction, setActiveInstruction] = useState<string | undefined>();
  const [showJobList, setShowJobList] = useState(false);
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [isCreatingTailored, setIsCreatingTailored] = useState(false);
  const [linkedJobs, setLinkedJobs] = useState<Job[]>([]);

  // Fetch the resume data from Supabase.
  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) {
        router.push('/resumelist');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('content, chat_log, analysis, title, type')
          .eq('id', resumeId)
          .single();

        if (error || !data) {
          throw new Error('Resume not found');
        }

        setResumeData({
          content: data.content,
          chat_log: data.chat_log || [],
          analysis: data.analysis && data.analysis.length > 0 ? data.analysis[0] : undefined,
          title: data.title,
          type: data.type
        });
      } catch (error) {
        console.error('Error fetching resume:', error);
        router.push('/resumelist');
      }
    };

    fetchResume();
  }, [resumeId, router]);

  // Auto-save effect: save resumeData.content to Supabase 2 seconds after changes.
  const lastSavedContentRef = useRef<string | null>(null);

  useEffect(() => {
    if (resumeData && resumeId) {
      // Stringify current content for comparison
      const currentContentString = JSON.stringify(resumeData.content);
  
      // If there's no last saved content (e.g., first load), initialize it and do not auto-save.
      if (!lastSavedContentRef.current) {
        lastSavedContentRef.current = currentContentString;
        return;
      }
  
      // If the current content matches the last saved content, do nothing.
      if (currentContentString === lastSavedContentRef.current) {
        return;
      }
  
      // Content has changed, so set up a debounced auto-save
      const timer = setTimeout(() => {
        supabase
          .from('resumes')
          .update({ content: resumeData.content })
          .eq('id', resumeId)
          .then(({ error }) => {
            if (error) {
              console.error('Error auto-saving resume data:', error);
            } else {
              console.log('Auto-saved resume data.');
              // Update the ref to the latest saved content
              lastSavedContentRef.current = currentContentString;
            }
          });
      }, 2000); // 2-second debounce delay
  
      return () => clearTimeout(timer);
    }
  }, [resumeData, resumeId]);

  // Fetch the jobs linked to this resume from Supabase.
  useEffect(() => {
    const fetchLinkedJobs = async () => {
      if (!resumeId) return;
      const { data, error } = await supabase
        .from("resume_jobs")
        .select("job_id, jobs(*)")
        .eq("resume_id", resumeId);

      if (error) {
        console.error("Error fetching linked jobs:", error);
      } else if (data) {
        const jobsList = data.map((item: any) => ({
          id: item.job_id,
          title: item.jobs.title,
          location: item.jobs.location,
        }));
        setLinkedJobs(jobsList);
      }
    };
    fetchLinkedJobs();
  }, [resumeId]);

  if (!resumeData) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* {!isMobile && <AppSidebar navigation={navigation} />} */}
      <div className="flex-1 min-h-screen bg-background flex flex-col">
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <ResumeStylingPage 
              title={resumeData.title}
              data={resumeData.content} 
              onUpdate={(newData) => {
                // Defer the parent's state update until after the current render cycle.
                setTimeout(() => {
                  setResumeData(prev => ({
                    ...prev!,
                    content: newData
                  }));
                }, 0);
              }}
              onShowAIGuide={(type) => setActiveInstruction(type)}
              chat_log={resumeData.chat_log}
              linkedJobs={linkedJobs}
              onTailorToJob={() => {
                if (resumeData.type === "base") {
                  setShowTailorModal(true);
                } else {
                  setShowJobList(true);
                }
              }}
              resumeType={resumeData.type}
              onShowJobList={() => setShowJobList(true)}
              analysis={resumeData.analysis}
            />
          </div>
        </main>
      </div>
      {showJobList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl relative">
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-3xl font-bold"
              onClick={() => setShowJobList(false)}
            >
              &times;
            </button>
            <JobList resumeId={resumeId!} />
          </div>
        </div>
      )}
      {showTailorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <h2 className="text-xl font-bold mb-4">Create a separate tailored resume?</h2>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={async () => {
                  setIsCreatingTailored(true);
                  console.log("Create tailored resume clicked");

                  // Get the current user session to retrieve the user ID.
                  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                  if (sessionError || !session) {
                    console.error("Error getting user session:", sessionError);
                    setIsCreatingTailored(false);
                    setShowTailorModal(false);
                    return;
                  }
                  const userId = session.user.id;
                  
                  const { data, error } = await supabase
                    .from('resumes')
                    .insert({
                      user_id: userId,
                      title: resumeData.title,
                      content: resumeData.content,
                      chat_log: resumeData.chat_log,
                      type: 'tailored'
                    })
                    .select();
                  setIsCreatingTailored(false);
                  if (error) {
                    console.error("Error creating tailored resume:", error);
                    setShowTailorModal(false);
                    return;
                  }
                  const newResume = data[0];
                  setShowTailorModal(false);
                  router.push(`/resumeedit?id=${newResume.id}`);
                }}
                disabled={isCreatingTailored}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {isCreatingTailored ? "Creating..." : "Create"}
              </button>
              <button 
                onClick={() => setShowTailorModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResumeEditPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    }>
      <ResumeEditPageContent />
    </Suspense>
  );
}
