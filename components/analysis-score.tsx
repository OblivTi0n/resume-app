"use client";

import React, { useState } from "react";
import { FileText, ArrowRight, TextSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define a prop interface for AnalysisScore.
interface AnalysisScoreProps {
  linkedJobs: {
    id: string;
    title: string;
    location: string;
  }[];
  onTailorToJob?: () => void;
  resumeType: "base" | "tailored";
  onShowJobList?: () => void;
}

const AnalysisScore: React.FC<AnalysisScoreProps> = ({ linkedJobs, onTailorToJob, resumeType, onShowJobList }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeResume = async () => {
    setIsAnalyzing(true);
    // Simulate an asynchronous analysis process (replace with your actual analysis logic)
    setTimeout(() => {
      setIsAnalyzing(false);
      // Optionally, handle analysis result here.
    }, 2000);
  };

  // New handler to trigger tailoring when no jobs are linked.
  const handleTailorToJob = () => {
    if (onTailorToJob) {
      onTailorToJob();
    }
  };

  // Compute button text and click handler based on resumeType.
  const buttonText =
    resumeType === "base" ? "Tailor to a job" : (linkedJobs.length > 0 ? "Analyze Resume" : "Tailor to a job");

  const handleClick =
    resumeType === "base" ? handleTailorToJob : (linkedJobs.length > 0 ? handleAnalyzeResume : handleTailorToJob);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-xl p-6">
        <div className="text-center">
          <TextSearch className="mx-auto h-12 w-12 text-gray-400" />
          
          {/* <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {resumeType === "base" ? "Base Resume Analysis" : "Tailored Resume Analysis"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Analyze your resume to see how well it matches job requirements
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {linkedJobs.length > 0
              ? `You have ${linkedJobs.length} linked job${linkedJobs.length > 1 ? "s" : ""}.`
              : "No jobs are linked to your resume."}
          </p> */}
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-[980px] shadow-sm">
            <Button
              onClick={handleClick}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-[980px] text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                "Analyzing..."
              ) : (
                <>
                  {buttonText}
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </div>
        {linkedJobs.length > 0 && onShowJobList && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Linked Job: {linkedJobs[0].title} ({linkedJobs[0].location})
            </p>
            <Button 
              onClick={onShowJobList}
              variant="outline"
              size="sm"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-[980px] text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Change Job
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisScore;
