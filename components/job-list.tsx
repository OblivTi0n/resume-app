"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Briefcase, Building2, Clock, ChevronDown, Search, MapPin, Star, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

// Define the Job interface based on your jobs table schema
interface Job {
  id: string
  company: string
  position: string
  description: string
  location: string
  applied_at?: string
  created_at: string
  updated_at: string
}

// Props: resumeId is needed to know which resume to link the job to.
interface JobListProps {
  resumeId: string
}

export default function JobList({ resumeId }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [linkedJobs, setLinkedJobs] = useState<string[]>([])
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch all jobs from Supabase.
  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase.from("jobs").select("*")
      if (error) {
        console.error("Error fetching jobs:", error)
      } else {
        setJobs(data as Job[])
      }
    }
    fetchJobs()
  }, [])

  // Fetch jobs already linked to the resume.
  useEffect(() => {
    const fetchLinkedJobs = async () => {
      const { data, error } = await supabase
        .from("resume_jobs")
        .select("job_id")
        .eq("resume_id", resumeId)
      if (error) {
        console.error("Error fetching linked jobs:", error)
      } else if (data) {
        const jobIds = data.map((entry: { job_id: string }) => entry.job_id)
        setLinkedJobs(jobIds)
      }
    }
    fetchLinkedJobs()
  }, [resumeId])

  // Handler to add a job to the resume.
  const addJobToResume = async (job: Job) => {
    if (linkedJobs.length >= 5) {
      alert("You have reached the maximum of 5 jobs linked to your resume.")
      return
    }
    if (linkedJobs.includes(job.id)) {
      alert("This job is already linked to your resume.")
      return
    }
    const { error } = await supabase
      .from("resume_jobs")
      .insert({ resume_id: resumeId, job_id: job.id })
    if (error) {
      alert("Error linking job: " + error.message)
    } else {
      setLinkedJobs([...linkedJobs, job.id])
    }
  }

  // Handler to remove (unlink) a job from the resume.
  const removeJobFromResume = async (jobId: string) => {
    const { error } = await supabase
      .from("resume_jobs")
      .delete()
      .eq("resume_id", resumeId)
      .eq("job_id", jobId)
    if (error) {
      alert("Error removing job: " + error.message)
    } else {
      setLinkedJobs(prev => prev.filter(id => id !== jobId))
    }
  }

  // Filter jobs based on search term.
  const filteredJobs = jobs.filter((job) =>
    job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Compute dream job slots: if a linked job exists for a slot, display its position and company; otherwise, show a placeholder.
  const dreamJobSlots = Array.from({ length: 5 }, (_, index) => {
    if (index < linkedJobs.length) {
      const jobData = jobs.find(job => job.id === linkedJobs[index]);
      return jobData ? `${jobData.position} at ${jobData.company}` : `Dream Job ${index + 1}`;
    } else {
      return `Dream Job ${index + 1}`;
    }
  });

  return (
    <div className="container mx-auto py-8">
      <div className="bg-background rounded-lg border shadow-lg">
        <div className="flex flex-col">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <h1 className="text-2xl font-semibold">Job List</h1>
          </div>

          <div className="grid grid-cols-3 gap-6 p-6">
            {/* Dream Jobs Section */}
            <div className="col-span-1 space-y-4 sticky top-6">
              <h2 className="text-lg font-semibold mb-3">Your Dream Jobs</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add your 5 dream jobs so we know what type of applications to tailor your resume and cover letter to:
              </p>
              {dreamJobSlots.map((slot, index) => (
                <div key={index} className="p-3 bg-muted rounded-md flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <p className="text-sm font-medium">{slot}</p>
                  {index < linkedJobs.length && (
                    <button onClick={() => removeJobFromResume(linkedJobs[index])} className="hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Search and Job Cards Section */}
            <div className="col-span-2 space-y-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border bg-background pl-10 pr-4 py-2 text-base outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="group overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="bg-background/50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h2 className="text-xl font-semibold">{job.position}</h2>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {job.created_at ? new Date(job.created_at).toLocaleDateString() : ""}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {linkedJobs.includes(job.id) ? (
                            <Button variant="outline" size="sm" disabled>
                              Added
                            </Button>
                          ) : (
                            <Button onClick={() => addJobToResume(job)} variant="outline" size="sm">
                              Add to Resume
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                          >
                            {expandedJob === job.id ? "Hide Details" : "Show Details"}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${expandedJob === job.id ? "rotate-180" : ""}`}
                            />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {expandedJob === job.id && (
                      <CardContent className="animate-in fade-in slide-in-from-top-1 bg-background p-4">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Briefcase className="mt-1 h-4 w-4 flex-shrink-0" />
                          <p className="text-sm leading-relaxed">{job.description}</p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

