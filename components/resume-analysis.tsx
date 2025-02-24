"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Circle,
  CircleX,
  GraduationCap,
  Key,
  UserRound,
  AlertTriangle,
  Wand2,
  ChevronDown,
  FileText,
  ArrowRight,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { ResumeContent, Responsibility } from '@/types/resume'

// -------------------------------------------------------------------------
// Updated component signature to receive resumeContent from props.
// -------------------------------------------------------------------------
interface ResumeAnalysisProps {
  resumeContent: ResumeContent
  analysis?: AnalysisData
}

// Rename the analysis interface (previously "ResumeData") to avoid confusion
interface AnalysisData {
  "Hard Skills": {
    Weight: number
    "Required Skills": string[]
    "Matched Skills": string[]
    Score: number
  }
  "Education Level": {
    Weight: number
    Explanation: string
    Score: number
  }
  "Job Title Match": {
    Weight: number
    "Resume Job Titles": string[]
    Explanation: string
    Score: number
  }
  "Soft Skills": {
    Weight: number
    "Required Skills": string[]
    "Matched Skills": string[]
    Score: number
  }
  "Other Keywords": {
    Weight: number
    "Industry-Specific Terms": string[]
    "Resume Matches": string[]
    Score: number
  }
  "Summary and recommendations": string
  "Final Score": number
}

// -------------------------------------------------------------------------
// Updated component signature to receive resumeContent from props.
// -------------------------------------------------------------------------
export default function ResumeAnalysis({ resumeContent, analysis }: ResumeAnalysisProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | undefined>(analysis)

  const [showHardSkillsDetails, setShowHardSkillsDetails] = useState(false)
  const [showSoftSkillsDetails, setShowSoftSkillsDetails] = useState(false)
  const [showOtherKeywordsDetails, setShowOtherKeywordsDetails] = useState(false)

  // New state for "analyzing" status and handler for Analyze Resume button
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const handleAnalyzeResume = async () => {
    console.log("Analyze Resume clicked");
    setIsAnalyzing(true);
    try {
      const res = await fetch("https://untitled19-916323492822.australia-southeast2.run.app/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `resume: ${JSON.stringify(resumeContent)}`,
        }),
      });
      const analysisResponse = await res.json();
      console.log("Received analysis:", analysisResponse);
      // If the received analysis is an array, use the first element.
      const analysisObj = Array.isArray(analysisResponse) ? analysisResponse[0] : analysisResponse;
      // Update local analysis state to re-render the Analysis card
      setAnalysisData(analysisObj);

      // Get resume id from URL query parameters
      const url = new URL(window.location.href);
      const resumeId = url.searchParams.get("id");

      if (!resumeId) {
        console.error("Resume id missing from URL query parameters");
      } else {
        // Update the analysis column in the "resumes" table for the given resume id
        const { data: resumeUpdateData, error: resumeUpdateError } = await supabase
          .from("resumes")
          .update({ analysis: analysisResponse })
          .eq("id", resumeId);

        if (resumeUpdateError) {
          console.error("Error updating analysis in resumes table:", resumeUpdateError);
        } else {
          console.log("Analysis updated in resumes table:", resumeUpdateData);
        }
      }
    } catch (error) {
      console.error("Error during resume analysis:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // If analysis is empty or null, show a blank page with a detailed "Analyze Resume" card
  if (!analysisData) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-full flex items-center justify-center overflow-y-hidden">
        <div className="max-w-md w-full bg-white rounded-xl p-6">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Resume Analysis</h2>
            <p className="mt-2 text-sm text-gray-600">
              Analyze your resume to see how well it matches job requirements
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm">
              <Button
                onClick={handleAnalyzeResume}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  "Analyzing..."
                ) : (
                  <>
                    Analyze Resume
                    <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-center">
              
            </div>
          </div>
        </div>
      </div>
    )
  }

  const calculateScoreOutOf10 = (score: number, weight: number) => {
    return ((score / weight) * 10).toFixed(1)
  }

  const isMaxScore = (score: number, weight: number) => {
    return Number.parseFloat(calculateScoreOutOf10(score, weight)) === 10
  }

  const getScoreColor = (score: number, weight: number) => {
    return isMaxScore(score, weight) ? "text-green-500" : "text-blue-500"
  }

  const getProgressColor = (score: number, weight: number) => {
    return isMaxScore(score, weight) ? "bg-blue-500" : "bg-blue-500"
  }

  // Generic function that returns an array of locations where the given skill/keyword is found.
  const getHardSkillLocations = (skill: string) => {
    const parts = skill.split("/").map((part) => part.trim().toLowerCase())
    const matches: { role: string; company: string; text: string }[] = []

    resumeContent.work_experience.forEach((work) => {
      work.responsibilities.forEach((resp) => {
        // Support both plain string or object with a text property (legacy data may be a string)
        const respText = (typeof resp === "string" ? resp : (resp as Responsibility).text).toLowerCase()
        if (parts.some((part) => respText.includes(part))) {
          const displayText = typeof resp === "string" ? resp : (resp as Responsibility).text
          matches.push({
            role: work.role,
            company: work.company,
            text: displayText,
          })
        }
      })
    })

    if (matches.length === 0) {
      const foundInSkills = resumeContent.skills.some((s) =>
        parts.some((part) => s.toLowerCase().includes(part))
      )
      if (foundInSkills) {
        matches.push({
          role: "Resume",
          company: "",
          text: "Only Found in skills list",
        })
      } else {
        matches.push({
          role: "Resume",
          company: "",
          text: "Not found in resume",
        })
      }
    }
    return matches
  }

  // Sort the skills in the required order:
  //  - Skills with "Not found in resume" come first,
  //  - then "Found in skills list",
  //  - then those with an actual match from responsibilities.
  const sortSkills = (skills: string[]): string[] => {
    return skills.sort((a, b) => {
      const aMatches = getHardSkillLocations(a)
      const bMatches = getHardSkillLocations(b)

      const aStatus = aMatches[0]?.text
      const bStatus = bMatches[0]?.text

      if (aStatus === "Not found in resume" && bStatus !== "Not found in resume") return -1
      if (bStatus === "Not found in resume" && aStatus !== "Not found in resume") return 1
      if (aStatus === "Only Found in skills list" && bStatus !== "Only Found in skills list") return -1
      if (bStatus === "Only Found in skills list" && aStatus !== "Only Found in skills list") return 1
      return 0
    })
  }

  // Renders an icon based on where the skill/keyword was found.
  const renderSkillIcon = (skill: string) => {
    const matches = getHardSkillLocations(skill)
    const hasWorkMatch = matches.some((match) => match.role !== "Resume")
    if (hasWorkMatch) {
      return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
    } else if (
      matches.some((match) => match.role === "Resume" && match.text === "Only Found in skills list")
    ) {
      return <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
    } else {
      return <CircleX className="w-4 h-4 text-red-500 flex-shrink-0" />
    }
  }

  // Define hard skills recommendations from the provided list.
  const hardSkillsRecommendations: Record<
    string,
    { company: string; responsibility: string; reasoning: string }
  > = {
    React: {
      company: "Retr CRM - AI Customer Relationship Management Software Agency",
      responsibility:
        "Led end-to-end development using Node.js, Express.js, and Next.js (React) for scalable frontend and backend architecture.",
      reasoning:
        "Next.js is a React framework, thus mentioning React clarifies the frontend technology used in this role.",
    },
    Python: {
      company: "Cekat AI - AI Chatbot Builder",
      responsibility:
        "Engineered infrastructure for AI chatbot integration using ChatGPT, LangChain, and vector databases in Python.",
      reasoning:
        "Langchain is most commonly used with Python, making it a plausible addition to this backend-focused role.",
    },
    sql: {
      company: "Fit-3047 & Fit-3048 Industry Experience (Monash Uni Subject)",
      responsibility:
        "Managed deployment and database administration through cPanel and phpMyAdmin, utilizing SQL for database interactions.",
      reasoning:
        "phpMyAdmin is used for managing MySQL databases, therefore SQL was used for interactions.",
    },
  }

  // Get sorted hard skills array for the "more details" section.
  const sortedHardSkills = sortSkills(analysisData["Hard Skills"]["Required Skills"].slice())

  const data: AnalysisData = analysisData!

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Resume Analysis
      </h1>

      {/* Overall Match Circle */}
      <div className="flex justify-center mb-8 ">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-8 border-blue-500" />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold">{data["Final Score"].toFixed(1)}%</span>
            <span className="text-sm text-muted-foreground">Overall Score</span>
          </div>
        </div>
      </div>

      {/* Skills Sections */}
      <Card className="p-4 space-y-6">
        {/* Hard Skills Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Hard Skills</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setShowHardSkillsDetails((prev) => !prev)}
            >
              <ChevronDown
                className={`w-4 h-4 mr-2 transition-transform duration-400 ${
                  showHardSkillsDetails ? "rotate-180" : ""
                }`}
              />
              {showHardSkillsDetails ? "less details" : "more details"}
            </Button>
          </div>
          {/* When details are hidden, show a simple grid of required skills */}
          {!showHardSkillsDetails && (
            <div className="space-y-2">
              <div className="text-sm">Required Skills</div>
              <div className="grid grid-cols-2 gap-2">
                {sortedHardSkills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2 text-sm">
                    {renderSkillIcon(skill)}
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* More details section */}
          <div
            className={`mt-4 space-y-3 transition-all duration-500 ${
              showHardSkillsDetails ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            {showHardSkillsDetails &&
              sortedHardSkills.map((skill) => {
                const recommendation = hardSkillsRecommendations[skill]
                const skillMatches = getHardSkillLocations(skill)
                const responsibilityMatchExists = skillMatches.some(match => match.role !== "Resume")
                return (
                  <div key={skill} className="border p-3 rounded">
                    <div className="font-semibold text-base flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {renderSkillIcon(skill)}
                        {skill}
                      </div>
                      {recommendation ? (
                        // If an AI recommendation exists, show a green check and red X button
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-green-100 text-green-600"
                            onClick={() => console.log(`Accepted recommendation for ${skill}`)}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full bg-red-100 text-red-600"
                            onClick={() => console.log(`Rejected recommendation for ${skill}`)}
                          >
                            <CircleX className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() =>
                            console.log(`${responsibilityMatchExists ? "Improving" : "Fixing"} ${skill} with AI`)
                          }
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          {responsibilityMatchExists ? "Improve with AI" : "Fix with AI"}
                        </Button>
                      )}
                    </div>
                    {recommendation ? (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Wand2 className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-xs font-semibold text-blue-600 uppercase">
                            AI Recommendation
                          </span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div>
                            <span className="font-semibold">Company:</span> {recommendation.company}
                          </div>
                          <div>
                            <span className="font-semibold">Responsibility:</span> {recommendation.responsibility}
                          </div>
                          <div>
                            <span className="font-semibold">Reasoning:</span> {recommendation.reasoning}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {skillMatches.map((match, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground">
                            {match.role !== "Resume" ? (
                              <>
                                Found in <span className="font-semibold">{match.role}</span>{" "}
                                {match.company && (
                                  <>
                                    at <span className="font-semibold">{match.company}</span>
                                  </>
                                )}
                                : <span className="italic">{match.text}</span>
                              </>
                            ) : (
                              <>{match.text}</>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>

        {/* Job Title Match Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserRound className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Job Title Match</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => console.log("Fixing Job Title Match with AI")}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Fix with AI
            </Button>
          </div>
          <div className="space-y-1">
            <div className="text-sm">Score</div>
            <Progress
              value={(data["Job Title Match"].Score / data["Job Title Match"].Weight) * 100}
              className={`h-2 ${
                isMaxScore(data["Job Title Match"].Score, data["Job Title Match"].Weight)
                  ? "bg-blue-500"
                  : "bg-blue-500"
              }`}
            />
            <div className={`text-sm ${getScoreColor(data["Job Title Match"].Score, data["Job Title Match"].Weight)}`}>
              {calculateScoreOutOf10(data["Job Title Match"].Score, data["Job Title Match"].Weight)}/10
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{data["Job Title Match"].Explanation}</div>
          <div className="space-y-2">
            <div className="text-sm">Resume Job Titles</div>
            <div className="space-y-1">
              {data["Job Title Match"]["Resume Job Titles"].map((title, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  • {title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Soft Skills Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Soft Skills</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setShowSoftSkillsDetails((prev) => !prev)}
            >
              <ChevronDown
                className={`w-4 h-4 mr-2 transition-transform duration-400 ${
                  showSoftSkillsDetails ? "rotate-180" : ""
                }`}
              />
              {showSoftSkillsDetails ? "less details" : "more details"}
            </Button>
          </div>
          <div className="space-y-1">
            <div className="text-sm">Score</div>
            <Progress
              value={(data["Soft Skills"].Score / data["Soft Skills"].Weight) * 100}
              className={`h-2 ${getProgressColor(data["Soft Skills"].Score, data["Soft Skills"].Weight)}`}
            />
            <div className={`text-sm ${getScoreColor(data["Soft Skills"].Score, data["Soft Skills"].Weight)}`}>
              {calculateScoreOutOf10(data["Soft Skills"].Score, data["Soft Skills"].Weight)}/10
            </div>
          </div>
          {!showSoftSkillsDetails && (
            <div className="space-y-2">
              <div className="text-sm">Required Skills</div>
              <div className="grid grid-cols-2 gap-2">
                {data["Soft Skills"]["Required Skills"].map((skill) => (
                  <div key={skill} className="flex items-center gap-2 text-sm">
                    {renderSkillIcon(skill)}
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div
            className={`mt-4 space-y-3 transition-all duration-500 ${
              showSoftSkillsDetails ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            {showSoftSkillsDetails &&
              data["Soft Skills"]["Required Skills"].map((skill) => (
                <div key={skill} className="border p-3 rounded">
                  <div className="font-semibold text-base flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {renderSkillIcon(skill)}
                      {skill}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => console.log(`Fixing ${skill} with AI`)}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Fix with AI
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {getHardSkillLocations(skill).map((match, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground">
                        {match.role !== "Resume" ? (
                          <>
                            Found in <span className="font-semibold">{match.role}</span>{" "}
                            {match.company && (
                              <>
                                at <span className="font-semibold">{match.company}</span>
                              </>
                            )}
                            : <span className="italic">{match.text}</span>
                          </>
                        ) : (
                          <>{match.text}</>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Other Keywords Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Other Keywords</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setShowOtherKeywordsDetails((prev) => !prev)}
            >
              <ChevronDown
                className={`w-4 h-4 mr-2 transition-transform duration-400 ${
                  showOtherKeywordsDetails ? "rotate-180" : ""
                }`}
              />
              {showOtherKeywordsDetails ? "less details" : "more details"}
            </Button>
          </div>
          <div className="space-y-1">
            <div className="text-sm">Score</div>
            <Progress
              value={(data["Other Keywords"].Score / data["Other Keywords"].Weight) * 100}
              className={`h-2 ${getProgressColor(data["Other Keywords"].Score, data["Other Keywords"].Weight)}`}
            />
            <div className={`text-sm ${getScoreColor(data["Other Keywords"].Score, data["Other Keywords"].Weight)}`}>
              {calculateScoreOutOf10(data["Other Keywords"].Score, data["Other Keywords"].Weight)}/10
            </div>
          </div>
          {!showOtherKeywordsDetails && (
            <div className="space-y-2">
              <div className="text-sm">Industry-Specific Terms</div>
              <div className="grid grid-cols-2 gap-2">
                {data["Other Keywords"]["Industry-Specific Terms"].map((term) => (
                  <div key={term} className="flex items-center gap-2 text-sm">
                    {renderSkillIcon(term)}
                    {term}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div
            className={`mt-4 space-y-3 transition-all duration-500 ${
              showOtherKeywordsDetails ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            {showOtherKeywordsDetails &&
              data["Other Keywords"]["Industry-Specific Terms"].map((term) => (
                <div key={term} className="border p-3 rounded">
                  <div className="font-semibold text-base flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {renderSkillIcon(term)}
                      {term}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => console.log(`Fixing ${term} with AI`)}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Fix with AI
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {getHardSkillLocations(term).map((match, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground">
                        {match.role !== "Resume" ? (
                          <>
                            Found in <span className="font-semibold">{match.role}</span>{" "}
                            {match.company && (
                              <>
                                at <span className="font-semibold">{match.company}</span>
                              </>
                            )}
                            : <span className="italic">{match.text}</span>
                          </>
                        ) : (
                          <>{match.text}</>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Education Level Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Education Level</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => console.log("Fixing Education Level with AI")}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Fix with AI
            </Button>
          </div>
          <div className="space-y-1">
            <div className="text-sm">Score</div>
            <Progress
              value={(data["Education Level"].Score / data["Education Level"].Weight) * 100}
              className={`h-2 ${getProgressColor(data["Education Level"].Score, data["Education Level"].Weight)}`}
            />
            <div className={`text-sm ${getScoreColor(data["Education Level"].Score, data["Education Level"].Weight)}`}>
              {calculateScoreOutOf10(data["Education Level"].Score, data["Education Level"].Weight)}/10
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{data["Education Level"].Explanation}</div>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Recommendations</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="min-w-4">→</div>
              Add Django and PostgreSQL expertise to your technical skills section
            </li>
            <li className="flex items-start gap-2">
              <div className="min-w-4">→</div>
              Explicitly list soft skills like time management and problem-solving
            </li>
            <li className="flex items-start gap-2">
              <div className="min-w-4">→</div>
              Incorporate industry-specific terms like SDLC and pathology workflows
            </li>
          </ul>
        </div>
      </Card>

      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .transition-all {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  )
}
