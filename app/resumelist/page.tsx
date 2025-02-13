'use client';

import { FileText, Settings, Home, Bell, HelpCircle, BarChart3 } from 'lucide-react';
import { AppSidebar } from '@/components/sidebar';
import ResumeList from '@/components/ResumeList';
import { useIsMobile } from '@/hooks/use-mobile';

const navigation = [
  { name: "Home", href: "/start", icon: Home, current: false },
  { name: "My Resumes", href: "/resumelist", icon: FileText, current: true },
  { name: "Templates", href: "#", icon: BarChart3, current: false },
  { name: "Notifications", href: "#", icon: Bell, current: false },
  { name: "Settings", href: "#", icon: Settings, current: false },
  { name: "Help", href: "#", icon: HelpCircle, current: false },
];

export default function ResumeListPage() {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <AppSidebar navigation={navigation} />}
      <div className="flex-1 overflow-auto">
        <ResumeList />
      </div>
    </div>
  );
}