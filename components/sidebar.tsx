"use client";

import * as React from "react";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  navigation?: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
    current: boolean;
  }>;
}

export function AppSidebar({ navigation = [] }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative h-screen bg-[#FFFFFF] shadow-lg transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
        style={{
          borderRadius: "0 24px 24px 0",
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-white shadow-md"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        <header className="flex items-center gap-2 p-4">
          <div className="rounded-full bg-blue-600 p-1">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                fill="white"
                fillOpacity="0.2"
              />
              <path
                d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                fill="white"
              />
            </svg>
          </div>
          {!isCollapsed && <span className="text-xl font-semibold">Resume Builder</span>}
        </header>
        <nav className="px-2">
          <ul>
            <li className="border-b border-gray-300 mb-2"></li>
            {navigation.map((item) => (
              <li key={item.name} className="mb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={item.href}
                      className={cn(
                        "relative flex h-12 items-center gap-3 rounded-full px-4 text-left transition-colors",
                        item.current
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="flex-1">{item.name}</span>}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10}>
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>
        <footer className={cn(
          "absolute bottom-0 left-0 right-0 border-t p-4",
          isCollapsed ? "flex justify-center" : "flex items-center justify-between"
        )}>
          {isCollapsed ? (
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Welcome back 👋</span>
                  <span className="font-medium">John Doe</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </>
          )}
        </footer>
      </div>
    </TooltipProvider>
  );
}