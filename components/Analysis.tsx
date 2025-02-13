"use client"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, PenLine, Plus, Save } from "lucide-react"

export default function Analysis() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full overflow-y-auto">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-start gap-8">
          {/* Progress Circle */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="stroke-muted fill-none"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="46"
              />
              <circle
                className="stroke-emerald-600 fill-none"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={289}
                strokeDashoffset={289 - (289 * 57) / 100}
                cx="50"
                cy="50"
                r="46"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">57%</span>
              <span className="text-sm text-muted-foreground">Overall Score</span>
            </div>
          </div>

          {/* Analysis Bars */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Resume Structure</span>
                <span className="text-muted-foreground">3 issues</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-black w-[75%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Measurable Results</span>
                <span className="text-muted-foreground">8 issues</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-black w-[45%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Keyword Usage</span>
                <span className="text-muted-foreground">1 issues</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-black w-[25%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="text-sm font-medium mb-4">12 Issues</div>
        <Collapsible className="bg-white rounded-xl shadow-sm">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-4 h-auto rounded-xl hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-600" />
                <span className="font-medium">RESUME STRUCTURE</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Professional Summary Missing</h3>
              <p className="text-muted-foreground">
                Please ensure that your resume has an active Blurb / Professional
                Summary
              </p>
              <div className="flex justify-end">
                <Button className="rounded-full bg-gray-900 hover:bg-gray-700">
                  Resolve Manually
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}