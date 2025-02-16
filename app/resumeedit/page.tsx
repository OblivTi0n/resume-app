'use client';

import { useEffect, useState, Suspense } from 'react';
import { FileText, Settings, Home, Bell, HelpCircle, BarChart3, Loader2 } from 'lucide-react';
import { AppSidebar } from '@/components/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/navbar';
import ResumeSection from '@/components/resume-section';
import ResumeStylingPage, { ResumeContent } from '@/components/resume-styling-page';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import JobList from '@/components/job-list';

const navigation = [
  { name: "Home", href: "/start", icon: Home, current: false },
  { name: "My Resumes", href: "/resumelist", icon: FileText, current: true },
  { name: "Templates", href: "#", icon: BarChart3, current: false },
  { name: "Notifications", href: "#", icon: Bell, current: false },
  { name: "Settings", href: "#", icon: Settings, current: false },
  { name: "Help", href: "#", icon: HelpCircle, current: false },
];

interface ResumeData {
  content: ResumeContent;
  chat_log: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  analysis?: any;
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

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) {
        router.push('/resumelist');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('content, chat_log, analysis')
          .eq('id', resumeId)
          .single();

        if (error || !data) {
          throw new Error('Resume not found');
        }

        setResumeData({
          content: data.content,
          chat_log: data.chat_log || [],
          analysis: data.analysis && data.analysis.length > 0 ? data.analysis[0] : undefined
        });
      } catch (error) {
        console.error('Error fetching resume:', error);
        router.push('/resumelist');
      }
    };

    fetchResume();
  }, [resumeId, router]);

  if (!resumeData) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <AppSidebar navigation={navigation} />}
      <div className="flex-1 min-h-screen bg-background flex flex-col">
        {/* <Navbar onJobMatchingClick={() => setShowJobList(true)} /> */}
        <main className="flex-1 overflow-hidden">
          {/* <ResizablePanelGroup direction="horizontal"> */}
            {/* <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full overflow-hidden">
                <ResumeSection 
                  resumeData={resumeData} 
                  activeInstruction={activeInstruction} 
                  onCloseGuide={() => setActiveInstruction(undefined)}
                  onUpdateResume={(path: string[], value: any) => {
                    setResumeData(prev => {
                      if (!prev) return prev;
                      
                      const newContent = { ...prev.content };
                      let current: any = newContent;
                      
                      for (let i = 0; i < path.length - 1; i++) {
                        current = current[path[i] as keyof typeof current];
                      }

                      const lastKey = path[path.length - 1];
                      if (Array.isArray(current[lastKey])) {
                        current[lastKey] = [...current[lastKey], value];
                      } else {
                        current[lastKey] = value;
                      }

                      return {
                        ...prev,
                        content: newContent
                      };
                    });
                  }}
                />
              </div>
            </ResizablePanel> */}
            {/* <ResizableHandle withHandle /> */}
            {/* <ResizablePanel defaultSize={50} minSize={30}> */}
              <div className="h-full overflow-hidden">
                <ResumeStylingPage 
                  data={resumeData.content} 
                  onUpdate={(newData) => {
                    setResumeData(prev => ({
                      ...prev!,
                      content: newData
                    }))
                  }}
                  onShowAIGuide={(type) => setActiveInstruction(type)}
                  chat_log = {resumeData.chat_log}
                />
              </div>
            {/* </ResizablePanel>
          </ResizablePanelGroup> */}
        </main>
      </div>
      {showJobList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowJobList(false)}
            >
              &times;
            </button>
            <JobList resumeId={resumeId!} />
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