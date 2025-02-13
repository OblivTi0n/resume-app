 "use client";

import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  PenLine,
  GripVertical,
  Trash2,
  ChevronUp,
  Save,
  Mail,
  Globe,
  Phone,
  Linkedin,
  MapPin,
  Mic,
  Check,
  X,
} from "lucide-react";

// ---------------------
// Define Interfaces
// ---------------------
interface Responsibility {
    text: string
    oldText?: string
    mode?: "new" | "deletion" | "edit" | null
  }
interface WorkExperience {
    company: string
    location: string
    role: string
    start_date: string
    end_date: string
    responsibilities: Responsibility[]
    mode?: "new" | null
  }
export interface ResumeContent {
  personal_info: {
    name: string;
    location: string;
    linkedin: string;
    phone: string;
    email: string;
    portfolio: string;
  };
  professional_summary: string;
  education: {
    university: string;
    location: string;
    degree: string;
    graduation_date: string;
    scholarship: string;
  };
  work_experience: WorkExperience[]
  volunteer_experience: any[];
  skills: string[];
  projects: any[];
  social_media_and_links: {
    linkedin: string;
    portfolio: string;
  };
}

interface RightIslandProps {
  resumeDatas: ResumeContent;
  onUpdate: (newData: ResumeContent) => void;
  onShowAIGuide: (type: string) => void;
}
interface ResponsibilityListProps {
    responsibilities: { resp: Responsibility; globalIndex: number }[]
    experienceIndex: number
    isEdit: boolean
    updateResponsibilityText: (experienceIndex: number, globalIndex: number, text: string) => void
    handleKeepResponsibility: (experienceIndex: number, globalIndex: number) => void
    handleDeleteResponsibility: (experienceIndex: number, globalIndex: number) => void
    confirmEditResponsibility: (experienceIndex: number, globalIndex: number) => void
    cancelEditResponsibility: (experienceIndex: number, globalIndex: number) => void
  }
  
  function ResponsibilityList({
    responsibilities,
    experienceIndex,
    isEdit,
    updateResponsibilityText,
    handleKeepResponsibility,
    handleDeleteResponsibility,
    confirmEditResponsibility,
    cancelEditResponsibility,
  }: ResponsibilityListProps) {
    return (
      <div className="flex flex-col gap-2">
        {responsibilities.map(({ resp, globalIndex }) => {
          if (resp.mode === "edit") {
            return (
              <div key={globalIndex} className="flex flex-col gap-1 p-2 rounded">
                <div className="text-sm text-gray-600">
                  Original: {resp.oldText}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={resp.text}
                    onChange={(e) =>
                      updateResponsibilityText(
                        experienceIndex,
                        globalIndex,
                        e.target.value
                      )
                    }
                    className="w-full max-w-[1024px] border border-yellow-500"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-500"
                    onClick={() =>
                      confirmEditResponsibility(experienceIndex, globalIndex)
                    }
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() =>
                      cancelEditResponsibility(experienceIndex, globalIndex)
                    }
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          } else if (resp.mode === "new") {
            return (
              <div
                key={globalIndex}
                className="flex items-center gap-2 p-2 rounded"
              >
                {isEdit ? (
                  <>
                    <Input
                      value={resp.text}
                      onChange={(e) =>
                        updateResponsibilityText(
                          experienceIndex,
                          globalIndex,
                          e.target.value
                        )
                      }
                      className="w-full max-w-[1024px] border border-green-500"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-500"
                      onClick={() =>
                        handleKeepResponsibility(experienceIndex, globalIndex)
                      }
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() =>
                        handleDeleteResponsibility(experienceIndex, globalIndex)
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <span>{resp.text}</span>
                )}
              </div>
            )
          } else {
            // Normal responsibilities (mode is null)
            return (
              <div
                key={globalIndex}
                className="flex items-center gap-2 p-2 rounded"
              >
                {isEdit ? (
                  <>
                    <Input
                      value={resp.text}
                      onChange={(e) =>
                        updateResponsibilityText(
                          experienceIndex,
                          globalIndex,
                          e.target.value
                        )
                      }
                      className="w-full max-w-[1024px] border" // default border styling only
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() =>
                        handleDeleteResponsibility(experienceIndex, globalIndex)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <span>{resp.text}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 ml-auto"
                      onClick={() =>
                        handleDeleteResponsibility(experienceIndex, globalIndex)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )
          }
        })}
      </div>
    )
  }
  


const RightIsland: React.FC<RightIslandProps> = ({ resumeDatas, onUpdate, onShowAIGuide }) => {
    const [sortByDate, setSortByDate] = useState(false)

  const [resumeData, setResumeData] = useState<ResumeContent>(resumeDatas)

  // Set work experience edit mode to true by default.
  const [editMode, setEditMode] = useState({
    personal_info: false,
    professional_summary: false,
    education: false,
    work_experience: Array(resumeData.work_experience.length).fill(true),
    skills: false,
    social_media_and_links: false,
  })

  const toggleEditMode = (section: string, index?: number) => {
    setEditMode((prev) => {
      if (section === "work_experience" && typeof index === "number") {
        const newWorkExperience = [...prev.work_experience]
        newWorkExperience[index] = !newWorkExperience[index]
        return { ...prev, work_experience: newWorkExperience }
      }
      return { ...prev, [section]: !prev[section as keyof typeof prev] }
    })
  }

  const handleInputChange = (
    section: string,
    field: string,
    value: string | string[],
    index?: number,
  ) => {
    setResumeData((prev) => {
      if (section === "work_experience" && typeof index === "number") {
        const newWorkExperience = [...prev.work_experience]
        newWorkExperience[index] = { ...newWorkExperience[index], [field]: value }
        return { ...prev, work_experience: newWorkExperience }
      }
      if (
        section === "personal_info" ||
        section === "education" ||
        section === "social_media_and_links"
      ) {
        return { 
          ...prev, 
          [section]: { 
            ...(prev[section as keyof ResumeContent] as Record<string, any>), 
            [field]: value 
          } 
        }
      }
      return { ...prev, [section]: value }
    })
  }

  // Update a responsibility's text by its global index.
  const updateResponsibilityText = (
    experienceIndex: number,
    respGlobalIndex: number,
    text: string,
  ) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience]
      newWorkExperience[experienceIndex].responsibilities[respGlobalIndex].text = text
      return { ...prev, work_experience: newWorkExperience }
    })
  }

  // Add a new responsibility with mode "new"
  const addResponsibility = (experienceIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience]
      newWorkExperience[experienceIndex].responsibilities.push({
        text: "New responsibility",
        mode: "new",
      })
      return { ...prev, work_experience: newWorkExperience }
    })
  }

  // Remove a responsibility completely.
  const removeResponsibility = (experienceIndex: number, globalRespIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience]
      newWorkExperience[experienceIndex].responsibilities.splice(globalRespIndex, 1)
      return { ...prev, work_experience: newWorkExperience }
    })
  }

  // For responsibilities with mode "new" or "deletion": keep them (i.e. remove the mode flag)
  const handleKeepResponsibility = (experienceIndex: number, globalRespIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience]
      newWorkExperience[experienceIndex].responsibilities[globalRespIndex].mode = null
      return { ...prev, work_experience: newWorkExperience }
    })
  }

  // For responsibilities with mode "new" or "deletion": delete them entirely
  const handleDeleteResponsibility = (experienceIndex: number, globalRespIndex: number) => {
    removeResponsibility(experienceIndex, globalRespIndex)
  }

  // For responsibilities in edit mode: confirm the edit (replace the old text with the new one and clear the mode)
  const confirmEditResponsibility = (experienceIndex: number, globalRespIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience]
      // On confirm, update text remains as entered; remove the oldText and clear mode.
      delete newWorkExperience[experienceIndex].responsibilities[globalRespIndex].oldText
      newWorkExperience[experienceIndex].responsibilities[globalRespIndex].mode = null
      return { ...prev, work_experience: newWorkExperience }
    })
  }

  // For responsibilities in edit mode: cancel the edit (revert the new text to the old text and clear the mode)
  const cancelEditResponsibility = (experienceIndex: number, globalRespIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience]
      const responsibility = newWorkExperience[experienceIndex].responsibilities[globalRespIndex]
      responsibility.text = responsibility.oldText || responsibility.text
      delete responsibility.oldText
      responsibility.mode = null
      return { ...prev, work_experience: newWorkExperience }
    })
  }

  // Bulk actions for the "To Be Deleted" section.
  const handleKeepAllToBeDeleted = (experienceIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience]
      newWorkExperience[experienceIndex].responsibilities = newWorkExperience[
        experienceIndex
      ].responsibilities.map((resp) =>
        resp.mode === "deletion" ? { ...resp, mode: null } : resp,
      )
      return { ...prev, work_experience: newWorkExperience }
    })
  }

  const handleDeleteAllToBeDeleted = (experienceIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience]
      newWorkExperience[experienceIndex].responsibilities = newWorkExperience[
        experienceIndex
      ].responsibilities.filter((resp) => resp.mode !== "deletion")
      return { ...prev, work_experience: newWorkExperience }
    })
  }

  const addWorkExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      work_experience: [
        ...prev.work_experience,
        {
          company: "New Company",
          location: "New Location",
          role: "New Role",
          start_date: "Start Date",
          end_date: "End Date",
          responsibilities: [
            {
              text: "New Responsibility",
              mode: "new",
            },
          ],
          mode: "new",
        },
      ],
    }))
    setEditMode((prev) => ({
      ...prev,
      work_experience: [...prev.work_experience, true],
    }))
  }

  const removeWorkExperience = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index),
    }))
    setEditMode((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index),
    }))
  }

  const addSkill = () => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, "New Skill"],
    }))
  }

  const removeSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const handleDeleteNewExperience = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index),
    }))
    setEditMode((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index),
    }))
  }

  const handleConfirmNewExperience = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((exp, i) =>
        i === index ? { ...exp, mode: null } : exp,
      ),
    }))
    setEditMode((prev) => ({
      ...prev,
      work_experience: prev.work_experience.map((_, i) => (i === index ? false : _)),
    }))
  }

  return (
<div className="bg-white rounded-xl shadow-sm p-6 h-full overflow-y-auto">
<Accordion type="single" collapsible className="space-y-4">
        {/* Contact Information */}
        <AccordionItem value="contact" className="border rounded-lg">
          <AccordionTrigger className="px-4">Contact Information</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder.svg" alt={resumeData.personal_info.name} />
                    <AvatarFallback>
                      {resumeData.personal_info.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{resumeData.personal_info.name}</h2>
                    <p className="text-muted-foreground">{resumeData.personal_info.location}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(resumeData.personal_info).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      {key === "email" && <Mail className="w-4 h-4 text-muted-foreground" />}
                      {key === "phone" && <Phone className="w-4 h-4 text-muted-foreground" />}
                      {key === "location" && <MapPin className="w-4 h-4 text-muted-foreground" />}
                      {key === "linkedin" && <Linkedin className="w-4 h-4 text-muted-foreground" />}
                      {key === "portfolio" && <Globe className="w-4 h-4 text-muted-foreground" />}
                      {editMode.personal_info ? (
                        <Input
                          value={value}
                          onChange={(e) => handleInputChange("personal_info", key, e.target.value)}
                          className="w-full max-w-[1024px]"
                        />
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  ))}
                </div>
                <Button onClick={() => toggleEditMode("personal_info")} className="mt-4">
                  {editMode.personal_info ? <Save className="w-4 h-4 mr-2" /> : <PenLine className="w-4 h-4 mr-2" />}
                  {editMode.personal_info ? "Save" : "Edit"}
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Professional Summary */}
        <AccordionItem value="summary" className="border rounded-lg">
          <AccordionTrigger className="px-4">Professional Summary</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Card>
              <CardContent className="pt-6">
                {editMode.professional_summary ? (
                  <Textarea
                    value={resumeData.professional_summary}
                    onChange={(e) => handleInputChange("professional_summary", "", e.target.value)}
                    className="w-full max-w-[1024px] min-h-[100px]"
                  />
                ) : (
                  <p className="text-muted-foreground">{resumeData.professional_summary}</p>
                )}
                <Button onClick={() => toggleEditMode("professional_summary")} className="mt-4">
                  {editMode.professional_summary ? (
                    <Save className="w-4 h-4 mr-2" />
                  ) : (
                    <PenLine className="w-4 h-4 mr-2" />
                  )}
                  {editMode.professional_summary ? "Save" : "Edit"}
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="border rounded-lg">
          <AccordionTrigger className="px-4">Education</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {Object.entries(resumeData.education).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <strong className="text-sm text-muted-foreground uppercase">{key.replace("_", " ")}:</strong>
                      {editMode.education ? (
                        <Input
                          value={value}
                          onChange={(e) => handleInputChange("education", key, e.target.value)}
                          className="w-full max-w-[1024px] mt-1"
                        />
                      ) : (
                        <span className="text-lg">{value}</span>
                      )}
                    </div>
                  ))}
                  <Button onClick={() => toggleEditMode("education")} className="mt-2">
                    {editMode.education ? <Save className="w-4 h-4 mr-2" /> : <PenLine className="w-4 h-4 mr-2" />}
                    {editMode.education ? "Save" : "Edit"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Work Experience */}
        <AccordionItem value="experience" className="border rounded-lg">
          <AccordionTrigger className="px-4">Work Experience</AccordionTrigger>
          <AccordionContent>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" className="flex items-center gap-2" onClick={addWorkExperience}>
                  <Plus className="w-4 h-4" />
                  Add Work Experience
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by Date</span>
                  <Switch checked={sortByDate} onCheckedChange={setSortByDate} />
                </div>
              </div>

              <div className="space-y-4">
                {resumeData.work_experience.map((experience, expIndex) => {
                  // Split responsibilities into two groups:
                  // normalResp: responsibilities that are not marked for deletion
                  // toBeDeleted: responsibilities with mode "deletion"
                  const normalResp: { resp: Responsibility; globalIndex: number }[] = []
                  const toBeDeleted: { resp: Responsibility; globalIndex: number }[] = []
                  experience.responsibilities.forEach((resp, i) => {
                    if (resp.mode === "deletion") {
                      toBeDeleted.push({ resp, globalIndex: i })
                    } else {
                      normalResp.push({ resp, globalIndex: i })
                    }
                  })

                  return (
                    <div
                      key={expIndex}
                      className={`border rounded-lg ${experience.mode === "new" ? "border-green-500 border-2" : ""}`}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">
                            {editMode.work_experience[expIndex] ? (
                              <Input
                                value={experience.company}
                                onChange={(e) =>
                                  handleInputChange("work_experience", "company", e.target.value, expIndex)
                                }
                                className="w-full max-w-[1024px]"
                              />
                            ) : (
                              experience.company
                            )}
                          </h3>
                          <div className="flex items-center gap-2">
                            {experience.mode === "new" ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-500"
                                  onClick={() => handleConfirmNewExperience(expIndex)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500"
                                  onClick={() => handleDeleteNewExperience(expIndex)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleEditMode("work_experience", expIndex)}
                                >
                                  {editMode.work_experience[expIndex] ? (
                                    <Save className="w-4 h-4" />
                                  ) : (
                                    <PenLine className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <GripVertical className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => removeWorkExperience(expIndex)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <ChevronUp className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Role, Location, Start Date, End Date */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          {editMode.work_experience[expIndex] || experience.mode === "new" ? (
                            <>
                              <Input
                                value={experience.role}
                                onChange={(e) =>
                                  handleInputChange("work_experience", "role", e.target.value, expIndex)
                                }
                                className="w-full max-w-[1024px]"
                              />
                              <Input
                                value={experience.location}
                                onChange={(e) =>
                                  handleInputChange("work_experience", "location", e.target.value, expIndex)
                                }
                                className="w-full max-w-[1024px]"
                              />
                              <Input
                                value={experience.start_date}
                                onChange={(e) =>
                                  handleInputChange("work_experience", "start_date", e.target.value, expIndex)
                                }
                                className="w-full max-w-[1024px]"
                              />
                              <Input
                                value={experience.end_date}
                                onChange={(e) =>
                                  handleInputChange("work_experience", "end_date", e.target.value, expIndex)
                                }
                                className="w-full max-w-[1024px]"
                              />
                            </>
                          ) : (
                            <>
                              <span>{experience.role}</span>
                              <span>{experience.location}</span>
                              <span>
                                {experience.start_date} - {experience.end_date}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Responsibilities */}
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                              <strong className="mb-2">Responsibilities</strong>
                              {/* Render normal (non-deletion) responsibilities using the ResponsibilityList component */}
                              <ResponsibilityList
                                responsibilities={normalResp}
                                experienceIndex={expIndex}
                                isEdit={editMode.work_experience[expIndex]}
                                updateResponsibilityText={updateResponsibilityText}
                                handleKeepResponsibility={handleKeepResponsibility}
                                handleDeleteResponsibility={handleDeleteResponsibility}
                                confirmEditResponsibility={confirmEditResponsibility}
                                cancelEditResponsibility={cancelEditResponsibility}
                              />
                              {editMode.work_experience[expIndex] && (
                                <Button
                                  variant="ghost"
                                  className="flex items-center gap-2 mt-2"
                                  onClick={() => addResponsibility(expIndex)}
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Responsibility
                                </Button>
                              )}
                            </div>

                            {toBeDeleted.length > 0 && (
                              <div className="border-t pt-4">
                                <strong className="mb-2 block text-red-600">To Be Deleted</strong>
                                {toBeDeleted.map(({ resp, globalIndex }) => (
                                  <div key={globalIndex} className="flex items-center gap-2 p-2 rounded">
                                    {editMode.work_experience[expIndex] ? (
                                      <>
                                        <Input
                                          value={resp.text}
                                          onChange={(e) =>
                                            updateResponsibilityText(expIndex, globalIndex, e.target.value)
                                          }
                                          className="w-full max-w-[1024px] border border-red-500"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-green-500"
                                          onClick={() => handleKeepResponsibility(expIndex, globalIndex)}
                                        >
                                          <Check className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-red-500"
                                          onClick={() => handleDeleteResponsibility(expIndex, globalIndex)}
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </>
                                    ) : (
                                      <span>{resp.text}</span>
                                    )}
                                  </div>
                                ))}
                                {editMode.work_experience[expIndex] && (
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleKeepAllToBeDeleted(expIndex)}
                                    >
                                      <Check className="w-4 h-4 mr-1" />
                                      Keep All
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteAllToBeDeleted(expIndex)}
                                    >
                                      <X className="w-4 h-4 mr-1" />
                                      Delete All
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="border rounded-lg">
          <AccordionTrigger className="px-4">Skills</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      {editMode.skills ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={skill}
                            onChange={(e) => {
                              const newSkills = [...resumeData.skills]
                              newSkills[index] = e.target.value
                              handleInputChange("skills", "", newSkills)
                            }}
                            className="w-full max-w-[1024px]"
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeSkill(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  <Button onClick={() => toggleEditMode("skills")}>
                    {editMode.skills ? <Save className="w-4 h-4 mr-2" /> : <PenLine className="w-4 h-4 mr-2" />}
                    {editMode.skills ? "Save" : "Edit"}
                  </Button>
                  {editMode.skills && (
                    <Button variant="outline" onClick={addSkill}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Social Media and Links */}
        <AccordionItem value="links" className="border rounded-lg">
          <AccordionTrigger className="px-4">Social Media and Links</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {Object.entries(resumeData.social_media_and_links).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      {key === "linkedin" && <Linkedin className="w-4 h-4 text-muted-foreground" />}
                      {key === "portfolio" && <Globe className="w-4 h-4 text-muted-foreground" />}
                      <div className="flex-grow">
                        <strong className="text-sm text-muted-foreground uppercase">{key}:</strong>
                        {editMode.social_media_and_links ? (
                          <Input
                            value={value}
                            onChange={(e) => handleInputChange("social_media_and_links", key, e.target.value)}
                            className="w-full max-w-[1024px] mt-1"
                          />
                        ) : (
                          <p className="text-sm">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button onClick={() => toggleEditMode("social_media_and_links")} className="mt-2">
                    {editMode.social_media_and_links ? (
                      <Save className="w-4 h-4 mr-2" />
                    ) : (
                      <PenLine className="w-4 h-4 mr-2" />
                    )}
                    {editMode.social_media_and_links ? "Save" : "Edit"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default RightIsland;
