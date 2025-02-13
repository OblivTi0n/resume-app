'use client'

import { useState } from "react"
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ResumeCard } from "./resume-card"

export default function ResumeList() {
  const [activeTab, setActiveTab] = useState("base")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <Tabs defaultValue="base" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="base">Base Resumes</TabsTrigger>
              <TabsTrigger value="tailored">Job Tailored Resumes</TabsTrigger>
            </TabsList>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Resume
            </Button>
          </div>

          <TabsContent value="base" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ResumeCard
                title="Software Developer Resume - Entry Level"
                subtitle="Software Developer"
                lastEdited="20 minutes ago"
                isSelected={true}
              />
              <ResumeCard
                title="Software Developer Resume - Entry Level"
                subtitle="Software Developer"
                lastEdited="16 days ago"
              />
            </div>
          </TabsContent>

          <TabsContent value="tailored" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <ResumeCard
                title="Frontend Developer - Company XYZ"
                subtitle="Software Developer"
                lastEdited="2 days ago"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

