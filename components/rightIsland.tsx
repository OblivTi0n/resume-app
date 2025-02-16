"use client";

import React, { useState } from "react";
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
  ChevronDown,
  Save,
  Mail,
  Globe,
  Phone,
  Linkedin,
  Wand2,
  MapPin,
  Check,
  X,
  User,
  Briefcase,
  FileText,
  GraduationCap,
  Wrench,
  Link as LinkIcon,
} from "lucide-react";

// A simple helper to join class names.
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ---------------------
// Define Interfaces
// ---------------------
interface Responsibility {
  text: string;
  oldText?: string;
  mode?: "new" | "deletion" | "edit" | null;
}

interface WorkExperience {
  company: string;
  location: string;
  role: string;
  start_date: string;
  end_date: string;
  responsibilities: Responsibility[];
  mode?: "new" | null;
}

export interface ResumeContent {
  personal_info: {
    name: string;
    location: string;
    linkedin: string;
    phone: string;
    email: string;
    portfolio: string;
    // Added extra fields for this design:
    role?: string;
    country?: string;
    firstName?: string;
    lastName?: string;
  };
  professional_summary: string;
  education: {
    university: string;
    location: string;
    degree: string;
    graduation_date: string;
    scholarship: string;
  };
  work_experience: WorkExperience[];
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
  onShowAIGuide: (type: string, params?: { company?: string }) => void;
}

interface ResponsibilityListProps {
  responsibilities: { resp: Responsibility; globalIndex: number }[];
  experienceIndex: number;
  updateResponsibilityText: (
    experienceIndex: number,
    globalIndex: number,
    text: string
  ) => void;
  handleDeleteResponsibility: (experienceIndex: number, globalIndex: number) => void;
}

function ResponsibilityList({
  responsibilities,
  experienceIndex,
  updateResponsibilityText,
  handleDeleteResponsibility,
}: ResponsibilityListProps) {
  const [editing, setEditing] = useState<{ [key: number]: boolean }>({});

  return (
    <ul className="list-disc pl-5 space-y-2">
      {responsibilities.map(({ resp, globalIndex }) => {
        const isEditing = editing[globalIndex] ?? false;
        return (
          <li
            key={globalIndex}
            className="flex items-start justify-between text-gray-700 space-x-2"
          >
            {isEditing ? (
              <Textarea
                value={resp.text}
                onChange={(e) =>
                  updateResponsibilityText(experienceIndex, globalIndex, e.target.value)
                }
                className="flex-1 bg-gray-100 resize-y"
                rows={2}
                onBlur={() =>
                  setEditing((prev) => ({ ...prev, [globalIndex]: false }))
                }
              />
            ) : (
              <Input
                value={resp.text}
                onClick={() =>
                  setEditing((prev) => ({ ...prev, [globalIndex]: true }))
                }
                onChange={(e) =>
                  updateResponsibilityText(experienceIndex, globalIndex, e.target.value)
                }
                className="flex-1 bg-gray-100"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              title="improve with ai"
              className="text-blue-600 mt-1"
              onClick={() => console.log("Improve responsibility with AI")}
            >
              <Wand2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 mt-1"
              onClick={() => handleDeleteResponsibility(experienceIndex, globalIndex)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

const ResumeEditor: React.FC<RightIslandProps> = ({
  resumeDatas,
  onUpdate,
  onShowAIGuide,
}) => {
  const [resumeData, setResumeData] = useState<ResumeContent>(resumeDatas);
  const [sortByDate, setSortByDate] = useState(false);

  // Expanded sections for toggling
  const [expandedSections, setExpandedSections] = useState({
    personal_info: true,
    work_experience: true,
    professional_summary: true,
    education: true,
    skills: true,
    social_media_and_links: true,
  });

  const toggleExpandSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (
    section: string,
    field: string,
    value: string | string[],
    index?: number
  ) => {
    setResumeData((prev) => {
      if (section === "work_experience" && typeof index === "number") {
        const newWorkExperience = [...prev.work_experience];
        newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
        return { ...prev, work_experience: newWorkExperience };
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
            [field]: value,
          },
        };
      }
      return { ...prev, [section]: value };
    });
  };

  // -------------------------------
  // Responsibility functions
  // -------------------------------
  const updateResponsibilityText = (
    experienceIndex: number,
    respGlobalIndex: number,
    text: string
  ) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience];
      newWorkExperience[experienceIndex].responsibilities[respGlobalIndex].text = text;
      return { ...prev, work_experience: newWorkExperience };
    });
  };

  const addResponsibility = (experienceIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience];
      newWorkExperience[experienceIndex].responsibilities.push({
        text: "New responsibility",
        mode: "new",
      });
      return { ...prev, work_experience: newWorkExperience };
    });
  };

  const removeResponsibility = (experienceIndex: number, globalRespIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience];
      newWorkExperience[experienceIndex].responsibilities.splice(globalRespIndex, 1);
      return { ...prev, work_experience: newWorkExperience };
    });
  };

  const handleKeepAllToBeDeleted = (experienceIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience];
      newWorkExperience[experienceIndex].responsibilities = newWorkExperience[
        experienceIndex
      ].responsibilities.map((resp) =>
        resp.mode === "deletion" ? { ...resp, mode: null } : resp
      );
      return { ...prev, work_experience: newWorkExperience };
    });
  };

  const handleDeleteAllToBeDeleted = (experienceIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = [...prev.work_experience];
      newWorkExperience[experienceIndex].responsibilities = newWorkExperience[
        experienceIndex
      ].responsibilities.filter((resp) => resp.mode !== "deletion");
      return { ...prev, work_experience: newWorkExperience };
    });
  };

  // -------------------------------
  // Work Experience & Skills functions
  // -------------------------------
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
    }));
  };

  const removeWorkExperience = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, "New Skill"],
    }));
  };

  const removeSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 overflow-auto">
      <div className="mx-auto w-full space-y-8">
        {/* Personal Information */}
        <section className="bg-white rounded-lg shadow-sm overflow-auto">
          <div
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => toggleExpandSection("personal_info")}
          >
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
            </div>
            {expandedSections.personal_info ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          {expandedSections.personal_info && (
            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 flex justify-between items-start">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-500">
                      Job Title
                    </label>
                    <Input
                      placeholder="The role you want"
                      value={resumeData.personal_info.role || ""}
                      onChange={(e) =>
                        handleInputChange("personal_info", "role", e.target.value)
                      }
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="text-center">
                    <div className="mb-2">
                      <Avatar className="w-24 h-24">
                        <AvatarImage
                          src="/placeholder.svg"
                          alt={resumeData.personal_info.name}
                        />
                        <AvatarFallback>
                          {resumeData.personal_info.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <Button variant="link" className="text-blue-500">
                      Upload photo
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-500">
                    First Name
                  </label>
                  <Input
                    value={
                      resumeData.personal_info.firstName ||
                      resumeData.personal_info.name.split(" ")[0]
                    }
                    onChange={(e) => {
                      const firstName = e.target.value;
                      const lastName =
                        resumeData.personal_info.lastName ||
                        resumeData.personal_info.name.split(" ").slice(1).join(" ");
                      handleInputChange(
                        "personal_info",
                        "name",
                        `${firstName} ${lastName}`
                      );
                      handleInputChange("personal_info", "firstName", firstName);
                    }}
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-500">
                    Last Name
                  </label>
                  <Input
                    value={
                      resumeData.personal_info.lastName ||
                      resumeData.personal_info.name.split(" ").slice(1).join(" ")
                    }
                    onChange={(e) => {
                      const lastName = e.target.value;
                      const firstName =
                        resumeData.personal_info.firstName ||
                        resumeData.personal_info.name.split(" ")[0];
                      handleInputChange(
                        "personal_info",
                        "name",
                        `${firstName} ${lastName}`
                      );
                      handleInputChange("personal_info", "lastName", lastName);
                    }}
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <Input
                    value={resumeData.personal_info.email}
                    onChange={(e) =>
                      handleInputChange("personal_info", "email", e.target.value)
                    }
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <Input
                    value={resumeData.personal_info.phone}
                    onChange={(e) =>
                      handleInputChange("personal_info", "phone", e.target.value)
                    }
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-500">
                    Country
                  </label>
                  <Input
                    value={resumeData.personal_info.country || ""}
                    onChange={(e) =>
                      handleInputChange("personal_info", "country", e.target.value)
                    }
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-500">
                    City
                  </label>
                  <Input
                    value={resumeData.personal_info.location}
                    onChange={(e) =>
                      handleInputChange("personal_info", "location", e.target.value)
                    }
                    className="bg-gray-100"
                  />
                </div>

              
              </div>
            </div>
          )}
        </section>

        {/* Work Experience */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => toggleExpandSection("work_experience")}
          >
            <div className="flex items-center space-x-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Work Experience
              </h2>
            </div>
            {expandedSections.work_experience ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          {expandedSections.work_experience && (
            <div className="p-6 pt-0">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={addWorkExperience}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Work Experience
                </Button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by Date</span>
                  <Switch checked={sortByDate} onCheckedChange={setSortByDate} />
                </div>
              </div>
              <div className="space-y-6">
                {resumeData.work_experience.map((experience, index) => (
                  <div
                    key={index}
                    className={cn(
                      "border rounded-lg p-4",
                      experience.mode === "new" && "border-green-500"
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        <Input
                          value={experience.company}
                          onChange={(e) =>
                            handleInputChange(
                              "work_experience",
                              "company",
                              e.target.value,
                              index
                            )
                          }
                          className="font-semibold bg-gray-100"
                        />
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <GripVertical className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWorkExperience(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <>
                        <Input
                          value={experience.role}
                          onChange={(e) =>
                            handleInputChange(
                              "work_experience",
                              "role",
                              e.target.value,
                              index
                            )
                          }
                          placeholder="Role"
                          className="bg-gray-100"
                        />
                        <Input
                          value={experience.location}
                          onChange={(e) =>
                            handleInputChange(
                              "work_experience",
                              "location",
                              e.target.value,
                              index
                            )
                          }
                          placeholder="Location"
                          className="bg-gray-100"
                        />
                        <Input
                          value={experience.start_date}
                          onChange={(e) =>
                            handleInputChange(
                              "work_experience",
                              "start_date",
                              e.target.value,
                              index
                            )
                          }
                          placeholder="Start Date"
                          className="bg-gray-100"
                        />
                        <Input
                          value={experience.end_date}
                          onChange={(e) =>
                            handleInputChange(
                              "work_experience",
                              "end_date",
                              e.target.value,
                              index
                            )
                          }
                          placeholder="End Date"
                          className="bg-gray-100"
                        />
                      </>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          Responsibilities:
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => onShowAIGuide("enhance_work_experience", { company: experience.company })}
                        >
                          <Wand2 className="w-4 h-4 mr-2" />
                          write with AI
                        </Button>
                      </div>
                      <ResponsibilityList
                        responsibilities={experience.responsibilities.map((resp, i) => ({
                          resp,
                          globalIndex: i,
                        }))}
                        experienceIndex={index}
                        updateResponsibilityText={updateResponsibilityText}
                        handleDeleteResponsibility={removeResponsibility}
                      />
                    </div>
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addResponsibility(index);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Responsibility
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Professional Summary */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => toggleExpandSection("professional_summary")}
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Professional Summary
              </h2>
            </div>
            {expandedSections.professional_summary ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          {expandedSections.professional_summary && (
            <div className="p-6 pt-0">
              <Textarea
                value={resumeData.professional_summary}
                onChange={(e) =>
                  handleInputChange(
                    "professional_summary",
                    "",
                    e.target.value
                  )
                }
                className="w-full min-h-[150px] bg-gray-100"
              />
            </div>
          )}
        </section>

        {/* Education */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => toggleExpandSection("education")}
          >
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Education</h2>
            </div>
            {expandedSections.education ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          {expandedSections.education && (
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {Object.entries(resumeData.education).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <strong className="text-sm font-medium text-gray-500 uppercase">
                      {key.replace("_", " ")}:
                    </strong>
                    <Input
                      value={value}
                      onChange={(e) =>
                        handleInputChange("education", key, e.target.value)
                      }
                      className="mt-1 bg-gray-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Skills */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => toggleExpandSection("skills")}
          >
            <div className="flex items-center space-x-3">
              <Wrench className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
            </div>
            {expandedSections.skills ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          {expandedSections.skills && (
            <div className="p-6 pt-0">
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...resumeData.skills];
                          newSkills[index] = e.target.value;
                          handleInputChange("skills", "", newSkills);
                        }}
                        className="w-32 bg-gray-100"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <Button variant="outline" onClick={addSkill}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Social Media and Links */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => toggleExpandSection("social_media_and_links")}
          >
            <div className="flex items-center space-x-3">
              <LinkIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Social Media and Links
              </h2>
            </div>
            {expandedSections.social_media_and_links ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          {expandedSections.social_media_and_links && (
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {Object.entries(resumeData.social_media_and_links).map(
                  ([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      {key === "linkedin" && (
                        <Linkedin className="w-5 h-5 text-gray-400" />
                      )}
                      {key === "portfolio" && (
                        <Globe className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex-grow">
                        <strong className="text-sm font-medium text-gray-500 uppercase">
                          {key}:
                        </strong>
                        <Input
                          value={value}
                          onChange={(e) =>
                            handleInputChange(
                              "social_media_and_links",
                              key,
                              e.target.value
                            )
                          }
                          className="mt-1 bg-gray-100"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResumeEditor;
