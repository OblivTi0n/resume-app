'use client';

import { FilePlus2, Upload, FileText, Settings, Home, Bell, HelpCircle, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const navigation = [
  { name: "Home", href: "/start", icon: Home, current: true },
  { name: "My Resumes", href: "#", icon: FileText, current: false },
  { name: "Templates", href: "#", icon: BarChart3, current: false },
  { name: "Notifications", href: "#", icon: Bell, current: false },
  { name: "Settings", href: "#", icon: Settings, current: false },
  { name: "Help", href: "#", icon: HelpCircle, current: false },
];

export default function StartPage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleNewResume = () => {
    router.push('/editor');
  };

  const handleUploadResume = () => {
    router.push('/import');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <AppSidebar />}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              AI Resume Builder
            </h1>
            <p className="text-xl text-gray-600">
              Create a professional resume in minutes with AI assistance
            </p>
          </div>

          {/* Cards Container */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Build New Resume Card */}
            <button
              onClick={handleNewResume}
              className="group relative bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                  <FilePlus2 className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Build Resume
                </h2>
                <p className="text-gray-600">
                  Create a new resume from scratch with AI assistance
                </p>
              </div>
            </button>

            {/* Import Resume Card */}
            <button
              onClick={handleUploadResume}
              className="group relative bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors duration-300">
                  <Upload className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Import Resume
                </h2>
                <p className="text-gray-600">
                  Upload your existing resume to get started
                </p>
              </div>
            </button>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500">
              Choose an option to get started with your professional resume journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}