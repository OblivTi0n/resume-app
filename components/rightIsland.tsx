"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SectionTips } from "@/components/SectionTips";
import { Reorder, useDragControls } from "framer-motion";

import {
  Plus,
  PenLine,
  ArrowLeft,
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
  Languages,
  Award,
  Link as LinkIcon,
} from "lucide-react";
import ResumeAnalysis from "@/components/resume-analysis";
import { Responsibility, WorkExperience, Certification, ResumeContent } from "@/types/resume";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface RightIslandProps {
  title: string;
  resumeDatas: ResumeContent;
  analysis?: any;
  onUpdate: (newData: ResumeContent) => void;
  onLocalUpdate?: (newData: ResumeContent) => void;
  onShowAIGuide: (type: string, params?: { company?: string }) => void;
}

interface ResponsibilityListProps {
  responsibilities: { resp: Responsibility; index: number }[];
  experienceId: string;
  updateResponsibilityText: (experienceId: string, respIndex: number, text: string) => void;
  handleDeleteResponsibility: (experienceId: string, respIndex: number) => void;
}

function ResponsibilityList({
  responsibilities,
  experienceId,
  updateResponsibilityText,
  handleDeleteResponsibility,
}: ResponsibilityListProps) {
  const [editing, setEditing] = useState<{ [key: number]: boolean }>({});

  return (
    <ul className="list-disc pl-5 space-y-2">
      {responsibilities.map(({ resp, index }) => {
        const isEditing = editing[index] ?? false;
        return (
          <li key={index} className="flex items-start justify-between text-gray-700 space-x-2">
            {isEditing ? (
              <Textarea
                value={resp.text}
                onChange={(e) => updateResponsibilityText(experienceId, index, e.target.value)}
                className="flex-1 bg-gray-100 resize-y"
                rows={2}
                onBlur={() => setEditing((prev) => ({ ...prev, [index]: false }))}
              />
            ) : (
              <Input
                value={resp.text}
                onClick={() => setEditing((prev) => ({ ...prev, [index]: true }))}
                onChange={(e) => updateResponsibilityText(experienceId, index, e.target.value)}
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
              onClick={() => handleDeleteResponsibility(experienceId, index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

const Collapsible: React.FC<{ isOpen: boolean; children: React.ReactNode }> = ({
  isOpen,
  children,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState("0px");

  React.useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen, children]);

  return (
    <div style={{ overflow: "hidden", transition: "height 0.35s ease", height }}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

// New WorkExperienceItem component to handle individual work experience entries
const WorkExperienceItem: React.FC<{
  experience: WorkExperience;
  onUpdate: (id: string, field: keyof WorkExperience, value: string | Responsibility[]) => void;
  onDelete: (id: string) => void;
  onAddResponsibility: (id: string) => void;
  onRemoveResponsibility: (experienceId: string, respIndex: number) => void;
  onShowAIGuide: (type: string, params?: { company?: string }) => void;
}> = ({ experience, onUpdate, onDelete, onAddResponsibility, onRemoveResponsibility, onShowAIGuide }) => {
  const controls = useDragControls();

  const handleInputChange = (field: keyof WorkExperience, value: string) => {
    onUpdate(experience.id, field, value);
  };

  const updateResponsibilityText = (experienceId: string, respIndex: number, text: string) => {
    const newResponsibilities = experience.responsibilities.map((resp, i) =>
      i === respIndex ? { ...resp, text } : resp
    );
    onUpdate(experienceId, "responsibilities", newResponsibilities);
  };

  return (
    <Reorder.Item value={experience} dragListener={false} dragControls={controls}>
      <div className={cn("border rounded-lg p-4", experience.mode === "new" && "border-green-500")}>
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-500">Company</label>
            <Input
              value={experience.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="text-lg font-semibold bg-gray-100"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onPointerDown={(e) => controls.start(e)}>
              <GripVertical className="w-8 h-8" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(experience.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-500">Role</label>
            <Input
              value={experience.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="Role"
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-500">Location</label>
            <Input
              value={experience.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Location"
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-500">Start Date</label>
            <Input
              value={experience.start_date}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
              placeholder="Start Date"
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-500">End Date</label>
            <Input
              value={experience.end_date}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
              placeholder="End Date"
              className="bg-gray-100"
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Responsibilities:</h4>
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
            responsibilities={experience.responsibilities.map((resp, i) => ({ resp, index: i }))}
            experienceId={experience.id}
            updateResponsibilityText={updateResponsibilityText}
            handleDeleteResponsibility={onRemoveResponsibility}
          />
        </div>
        <div className="mt-4">
          <Button type="button" variant="outline" size="sm" onClick={() => onAddResponsibility(experience.id)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Responsibility
          </Button>
        </div>
      </div>
    </Reorder.Item>
  );
};

const ResumeEditor: React.FC<RightIslandProps> = ({
  title,
  resumeDatas,
  analysis,
  onUpdate,
  onLocalUpdate,
  onShowAIGuide,
}) => {
  const [resumeData, setResumeData] = useState<ResumeContent>(() => {
    let updatedData = { ...resumeDatas };
    // Convert legacy social_media_and_links if needed
    if (!Array.isArray(updatedData.social_media_and_links)) {
      const linksObject = updatedData.social_media_and_links as Record<string, string>;
      updatedData = {
        ...updatedData,
        social_media_and_links: Object.entries(linksObject).map(([label, url]) => ({
          label,
          url,
        })),
      };
    }
    if (!updatedData.languages) {
      updatedData = { ...updatedData, languages: [] };
    }
    if (
      updatedData.languages &&
      updatedData.languages.length > 0 &&
      typeof updatedData.languages[0] === "string"
    ) {
      // Cast languages to string[] for legacy array conversion
      const legacyLanguages = updatedData.languages as unknown as string[];
      updatedData = {
        ...updatedData,
        languages: legacyLanguages.map((lang: string) => ({
          language: lang,
          fluency: "",
        })),
      };
    }
    if (!updatedData.certifications) {
      updatedData = { ...updatedData, certifications: [] };
    }
    // Add unique IDs to work experiences
    updatedData.work_experience = updatedData.work_experience.map((exp, index) => ({
      ...exp,
      id: exp.id || `exp-${index}-${Date.now()}`,
    }));
    return updatedData;
  });
  const [sortByDate, setSortByDate] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    analysis: true,
    personal_info: true,
    work_experience: true,
    professional_summary: true,
    education: true,
    skills: true,
    social_media_and_links: true,
    languages: true,
    certifications: true,
  });

  // Tips states remain unchanged
  const [tipsOpen, setTipsOpen] = useState(false);
  const personalInfoTips = [
    "Use a professional email address",
    "Include your LinkedIn profile",
    "Make sure your phone number is correct",
    "Location should include city and country",
  ];
  const [workExpTipsOpen, setWorkExpTipsOpen] = useState(false);
  const workExpTips = [
    "Highlight key achievements.",
    "Use metrics to quantify impact.",
    "Detail your responsibilities.",
  ];
  const [professionalSummaryTipsOpen, setProfessionalSummaryTipsOpen] = useState(false);
  const professionalSummaryTips = [
    "Keep it concise and clear.",
    "Focus on your strengths.",
    "Tailor it for the job you're applying to.",
  ];
  const [educationTipsOpen, setEducationTipsOpen] = useState(false);
  const educationTips = [
    "Include relevant coursework.",
    "Mention any academic honors.",
    "List degrees in reverse chronological order.",
  ];
  const [skillsTipsOpen, setSkillsTipsOpen] = useState(false);
  const skillsTips = [
    "List only relevant skills.",
    "Use keywords from the job description.",
    "Don't overdo it—keep it concise.",
  ];
  const [socialMediaTipsOpen, setSocialMediaTipsOpen] = useState(false);
  const socialMediaTips = [
    "Include only professional links.",
    "Ensure all URLs are correct.",
    "Keep profiles updated.",
  ];
  const [languagesTipsOpen, setLanguagesTipsOpen] = useState(false);
  const languagesTips = [
    "List all languages you speak.",
    "Include proficiency levels if applicable.",
    "Be honest about your fluency.",
  ];
  const [certificationsTipsOpen, setCertificationsTipsOpen] = useState(false);
  const certificationsTips = ["Add any relevant certifications or courses with corresponding dates."];

  const toggleExpandSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (
    section: string,
    field: string,
    value: string | string[],
    id?: string | number
  ) => {
    setResumeData((prev) => {
      if (section === "work_experience" && typeof id === "string") {
        const newWorkExperience = prev.work_experience.map((exp) =>
          exp.id === id ? { ...exp, [field]: value } : exp
        );
        return { ...prev, work_experience: newWorkExperience };
      }
      if (section === "social_media_and_links" && typeof id === "number") {
        const newLinks = [...prev.social_media_and_links];
        newLinks[id] = { ...newLinks[id], [field]: value };
        return { ...prev, social_media_and_links: newLinks };
      }
      if (section === "personal_info" || section === "education") {
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

  // **Responsibility Functions**
  const updateResponsibilityText = (
    experienceId: string,
    respIndex: number,
    text: string
  ) => {
    setResumeData((prev) => {
      const newWorkExperience = prev.work_experience.map((exp) =>
        exp.id === experienceId
          ? {
              ...exp,
              responsibilities: exp.responsibilities.map((resp, i) =>
                i === respIndex ? { ...resp, text } : resp
              ),
            }
          : exp
      );
      return { ...prev, work_experience: newWorkExperience };
    });
  };

  const addResponsibility = (experienceId: string) => {
    setResumeData((prev) => {
      const newWorkExperience = prev.work_experience.map((exp) => {
        if (exp.id === experienceId) {
          const currResponsibilities = exp.responsibilities;
          if (
            currResponsibilities.length > 0 &&
            currResponsibilities[currResponsibilities.length - 1].mode === "new" &&
            currResponsibilities[currResponsibilities.length - 1].text === "New responsibility"
          ) {
            return exp;
          }
          return {
            ...exp,
            responsibilities: [
              ...currResponsibilities,
              { text: "New responsibility", mode: "new" } as Responsibility,
            ],
          };
        }
        return exp;
      });
      return { ...prev, work_experience: newWorkExperience };
    });
  };

  const removeResponsibility = (experienceId: string, respIndex: number) => {
    setResumeData((prev) => {
      const newWorkExperience = prev.work_experience.map((exp) =>
        exp.id === experienceId
          ? {
              ...exp,
              responsibilities: exp.responsibilities.filter((_, i) => i !== respIndex),
            }
          : exp
      );
      return { ...prev, work_experience: newWorkExperience };
    });
  };

  const handleKeepAllToBeDeleted = (experienceId: string) => {
    setResumeData((prev) => {
      const newWorkExperience = prev.work_experience.map((exp) =>
        exp.id === experienceId
          ? {
              ...exp,
              responsibilities: exp.responsibilities.map((resp) =>
                resp.mode === "deletion" ? { ...resp, mode: null } : resp
              ),
            }
          : exp
      );
      return { ...prev, work_experience: newWorkExperience };
    });
  };

  const handleDeleteAllToBeDeleted = (experienceId: string) => {
    setResumeData((prev) => {
      const newWorkExperience = prev.work_experience.map((exp) =>
        exp.id === experienceId
          ? {
              ...exp,
              responsibilities: exp.responsibilities.filter((resp) => resp.mode !== "deletion"),
            }
          : exp
      );
      return { ...prev, work_experience: newWorkExperience };
    });
  };

  // **Work Experience Functions**
  const addWorkExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      work_experience: [
        ...prev.work_experience,
        {
          id: `exp-${prev.work_experience.length}-${Date.now()}`,
          company: "New Company",
          location: "New Location",
          role: "New Role",
          start_date: "Start Date",
          end_date: "End Date",
          responsibilities: [{ text: "New Responsibility", mode: "new" }],
          mode: "new",
        },
      ],
    }));
  };

  const removeWorkExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      work_experience: prev.work_experience.filter((exp) => exp.id !== id),
    }));
  };

  const handleReorder = (newOrder: WorkExperience[]) => {
    setResumeData((prev) => ({ ...prev, work_experience: newOrder }));
  };

  const handleWorkExperienceUpdate = (
    id: string,
    field: keyof WorkExperience,
    value: string | Responsibility[]
  ) => {
    setResumeData((prev) => {
      const newWorkExperience = prev.work_experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      );
      return { ...prev, work_experience: newWorkExperience };
    });
  };

  // **Skills, Social Media, Languages, Certifications Functions remain unchanged**
  const addSkill = () => {
    setResumeData((prev) => ({ ...prev, skills: [...prev.skills, "New Skill"] }));
  };

  const removeSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addSocialMediaLink = () => {
    setResumeData((prev) => ({
      ...prev,
      social_media_and_links: [...prev.social_media_and_links, { label: "", url: "" }],
    }));
  };

  const removeSocialMediaLink = (index: number) => {
    setResumeData((prev) => {
      const newLinks = [...prev.social_media_and_links];
      newLinks.splice(index, 1);
      return { ...prev, social_media_and_links: newLinks };
    });
  };

  const addLanguage = () => {
    setResumeData((prev) => ({
      ...prev,
      languages: [...prev.languages, { language: "New Language", fluency: "" }],
    }));
  };

  const removeLanguage = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const updateCertificationField = (index: number, field: keyof Certification, value: string) => {
    setResumeData((prev) => {
      const newCertifications = [...prev.certifications];
      newCertifications[index] = { ...newCertifications[index], [field]: value };
      return { ...prev, certifications: newCertifications };
    });
  };

  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          course_name: "Course",
          institution: "Institution",
          start_date: "start date MM/YY",
          end_date: "end date MM/YY",
        },
      ],
    }));
  };

  const removeCertification = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  // Sync local state when the resumeDatas prop changes (e.g., after a JSON update from ChatBox)
  useEffect(() => {
    // Only update if resumeDatas has truly changed (deep compare)
    if (JSON.stringify(resumeDatas) !== JSON.stringify(resumeData)) {
      setResumeData(resumeDatas);
    }
  }, [resumeDatas]);

  // Optionally, remove the auto-save effect if the parent is already handling updates.
  // useEffect(() => {
  //   if (onLocalUpdate) onLocalUpdate(resumeData);
  //   const timer = setTimeout(() => onUpdate(resumeData), 3000);
  //   return () => clearTimeout(timer);
  // }, [resumeData, onLocalUpdate, onUpdate]);

  return (
    <div
      className="min-h-screen bg-gray-100 pt-0 pl-3 pb-8 overflow-auto custom-scrollbar"
      style={{ direction: "rtl" }}
    >
      <div style={{ direction: "ltr" }}>
        <header className="bg-white rounded-bl-[15px] rounded-br-[15px] p-4 shadow-md mb-8">
          <div className="flex items-center justify-between">
            <Link href="/resumelist" className="p-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="flex-1 text-xl font-semibold text-gray-900 text-center">{title}</h1>
            <button onClick={() => console.log("Edit title")} className="p-2">
              <PenLine className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="mt-4">
          
            <div className="mt-2 flex justify-center">
              <Button
                onClick={() => console.log("Check my Resume clicked")}
                className="bg-blue-600 text-white rounded-[980px] px-4 py-2"
              >
                Check my Resume
              </Button>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full space-y-8">
          {/* Analysis Section */}
          <section className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div
              className="flex items-center justify-between p-6 cursor-pointer"
              onClick={() => toggleExpandSection("analysis")}
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Job Matching</h2>
              </div>
              {expandedSections.analysis ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <Collapsible isOpen={expandedSections.analysis}>
              <div className="p-6 pt-0">
                <ResumeAnalysis resumeContent={resumeData} analysis={analysis} />
              </div>
            </Collapsible>
          </section>

          {/* Personal Information */}
          <div>
            <SectionTips tips={personalInfoTips} isOpen={tipsOpen} onToggle={() => setTipsOpen(!tipsOpen)} />
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => toggleExpandSection("personal_info")}
              >
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                </div>
                
                {expandedSections.personal_info ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <Collapsible isOpen={expandedSections.personal_info}>
                <div className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 flex justify-between items-start">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-500">Job Title</label>
                        <Input
                          placeholder="The role you want"
                          value={resumeData.personal_info.role || ""}
                          onChange={(e) => handleInputChange("personal_info", "role", e.target.value)}
                          className="bg-gray-100"
                        />
                      </div>
                      <div className="text-center">
                        <div className="mb-2">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src="/placeholder.svg" alt={resumeData.personal_info.name} />
                            <AvatarFallback>
                              {resumeData.personal_info.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <Button variant="link" className="text-blue-500">
                          Upload photo
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-500">First Name</label>
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
                          handleInputChange("personal_info", "name", `${firstName} ${lastName}`);
                          handleInputChange("personal_info", "firstName", firstName);
                        }}
                        className="bg-gray-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-500">Last Name</label>
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
                          handleInputChange("personal_info", "name", `${firstName} ${lastName}`);
                          handleInputChange("personal_info", "lastName", lastName);
                        }}
                        className="bg-gray-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <Input
                        value={resumeData.personal_info.email}
                        onChange={(e) => handleInputChange("personal_info", "email", e.target.value)}
                        className="bg-gray-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      <Input
                        value={resumeData.personal_info.phone}
                        onChange={(e) => handleInputChange("personal_info", "phone", e.target.value)}
                        className="bg-gray-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-500">Country</label>
                      <Input
                        value={resumeData.personal_info.country || ""}
                        onChange={(e) => handleInputChange("personal_info", "country", e.target.value)}
                        className="bg-gray-100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-500">City</label>
                      <Input
                        value={resumeData.personal_info.location}
                        onChange={(e) => handleInputChange("personal_info", "location", e.target.value)}
                        className="bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </Collapsible>
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <SectionTips
              tips={workExpTips}
              isOpen={workExpTipsOpen}
              onToggle={() => setWorkExpTipsOpen(!workExpTipsOpen)}
            />
            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => toggleExpandSection("work_experience")}
              >
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
                </div>
                {expandedSections.work_experience ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <Collapsible isOpen={expandedSections.work_experience}>
                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <Button variant="outline" className="flex items-center" onClick={addWorkExperience}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Work Experience
                    </Button>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Sort by Date</span>
                      <Switch checked={sortByDate} onCheckedChange={setSortByDate} />
                    </div>
                  </div>
                  <Reorder.Group
                    axis="y"
                    values={resumeData.work_experience}
                    onReorder={handleReorder}
                    className="space-y-4"
                  >
                    {resumeData.work_experience.map((experience) => (
                      <WorkExperienceItem
                        key={experience.id}
                        experience={experience}
                        onUpdate={handleWorkExperienceUpdate}
                        onDelete={removeWorkExperience}
                        onAddResponsibility={addResponsibility}
                        onRemoveResponsibility={removeResponsibility}
                        onShowAIGuide={onShowAIGuide}
                      />
                    ))}
                  </Reorder.Group>
                </div>
              </Collapsible>
            </section>
          </div>

          {/* Professional Summary */}
          <div>
            <SectionTips
              tips={professionalSummaryTips}
              isOpen={professionalSummaryTipsOpen}
              onToggle={() => setProfessionalSummaryTipsOpen(!professionalSummaryTipsOpen)}
            />
            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => toggleExpandSection("professional_summary")}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Professional Summary</h2>
                </div>
                {expandedSections.professional_summary ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <Collapsible isOpen={expandedSections.professional_summary}>
                <div className="p-6 pt-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-500">
                      Professional Summary
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => onShowAIGuide("enhance_professional_summary")}
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      write with AI
                    </Button>
                  </div>
                  <Textarea
                    value={resumeData.professional_summary}
                    onChange={(e) =>
                      handleInputChange("professional_summary", "", e.target.value)
                    }
                    className="w-full min-h-[150px] bg-gray-100"
                  />
                </div>
              </Collapsible>
            </section>
          </div>

          {/* Education */}
          <div>
            <SectionTips
              tips={educationTips}
              isOpen={educationTipsOpen}
              onToggle={() => setEducationTipsOpen(!educationTipsOpen)}
            />
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
              <Collapsible isOpen={expandedSections.education}>
                <div className="p-6 pt-0">
                  <div className="space-y-4">
                    {Object.entries(resumeData.education).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <strong className="text-sm font-medium text-gray-500 uppercase">
                          {key.replace("_", " ")}:
                        </strong>
                        <Input
                          value={value}
                          onChange={(e) => handleInputChange("education", key, e.target.value)}
                          className="mt-1 bg-gray-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Collapsible>
            </section>
          </div>

          {/* Skills */}
          <div>
            <SectionTips
              tips={skillsTips}
              isOpen={skillsTipsOpen}
              onToggle={() => setSkillsTipsOpen(!skillsTipsOpen)}
            />
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
              <Collapsible isOpen={expandedSections.skills}>
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
                          <Button variant="ghost" size="sm" onClick={() => removeSkill(index)}>
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
              </Collapsible>
            </section>
          </div>

          {/* Languages */}
          <div>
            <SectionTips
              tips={languagesTips}
              isOpen={languagesTipsOpen}
              onToggle={() => setLanguagesTipsOpen(!languagesTipsOpen)}
            />
            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => toggleExpandSection("languages")}
              >
                <div className="flex items-center space-x-3">
                  <Languages className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Languages</h2>
                </div>
                {expandedSections.languages ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <Collapsible isOpen={expandedSections.languages}>
                <div className="p-6 pt-0">
                  <div className="space-y-4">
                    {resumeData.languages.map((lang, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-500">Language</label>
                          <Input
                            value={lang.language}
                            onChange={(e) => {
                              const newLanguages = [...resumeData.languages];
                              newLanguages[index] = { ...newLanguages[index], language: e.target.value };
                              setResumeData((prev) => ({ ...prev, languages: newLanguages }));
                            }}
                            className="w-32 bg-gray-100"
                            placeholder="Language"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-500">Fluency</label>
                          <Input
                            value={lang.fluency}
                            onChange={(e) => {
                              const newLanguages = [...resumeData.languages];
                              newLanguages[index] = { ...newLanguages[index], fluency: e.target.value };
                              setResumeData((prev) => ({ ...prev, languages: newLanguages }));
                            }}
                            className="w-32 bg-gray-100"
                            placeholder="Fluency"
                          />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeLanguage(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" onClick={addLanguage} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Language
                  </Button>
                </div>
              </Collapsible>
            </section>
          </div>

          {/* Social Media and Links */}
          <div>
            <SectionTips
              tips={socialMediaTips}
              isOpen={socialMediaTipsOpen}
              onToggle={() => setSocialMediaTipsOpen(!socialMediaTipsOpen)}
            />
            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => toggleExpandSection("social_media_and_links")}
              >
                <div className="flex items-center space-x-3">
                  <LinkIcon className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Social Media and Links</h2>
                </div>
                {expandedSections.social_media_and_links ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <Collapsible isOpen={expandedSections.social_media_and_links}>
                <div className="p-6 pt-0">
                  <div className="space-y-4">
                    {resumeData.social_media_and_links.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        {(() => {
                          const lowerLabel = item.label.toLowerCase();
                          if (lowerLabel === "linkedin")
                            return <Linkedin className="w-5 h-5 text-gray-400" />;
                          if (lowerLabel === "portfolio")
                            return <Globe className="w-5 h-5 text-gray-400" />;
                          return <LinkIcon className="w-5 h-5 text-gray-400" />;
                        })()}
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-500">Label</label>
                          <Input
                            placeholder="Label"
                            value={item.label}
                            onChange={(e) =>
                              handleInputChange("social_media_and_links", "label", e.target.value, index)
                            }
                            className="mt-1 bg-gray-100"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-500">Link</label>
                          <Input
                            placeholder="Link"
                            value={item.url}
                            onChange={(e) =>
                              handleInputChange("social_media_and_links", "url", e.target.value, index)
                            }
                            className="mt-1 bg-gray-100"
                          />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeSocialMediaLink(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addSocialMediaLink} className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </div>
              </Collapsible>
            </section>
          </div>

          {/* Certifications */}
          <div>
            <SectionTips
              tips={certificationsTips}
              isOpen={certificationsTipsOpen}
              onToggle={() => setCertificationsTipsOpen(!certificationsTipsOpen)}
            />
            <section className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => toggleExpandSection("certifications")}
              >
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
                </div>
                {expandedSections.certifications ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <Collapsible isOpen={expandedSections.certifications}>
                <div className="p-6 pt-0">
                  <div className="space-y-4">
                    {resumeData.certifications.map((cert, index) => (
                      <div key={index} className="border p-4 rounded-md space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-500">Course Name</label>
                            <Input
                              value={cert.course_name}
                              onChange={(e) => updateCertificationField(index, "course_name", e.target.value)}
                              className="bg-gray-100"
                            />
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeCertification(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-sm font-medium text-gray-500">Institution</label>
                          <Input
                            value={cert.institution}
                            onChange={(e) => updateCertificationField(index, "institution", e.target.value)}
                            className="mt-2 bg-gray-100"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-500">
                              Start Date (MM/YYYY)
                            </label>
                            <Input
                              value={cert.start_date}
                              onChange={(e) => updateCertificationField(index, "start_date", e.target.value)}
                              className="bg-gray-100 w-32"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-500">
                              End Date (MM/YYYY)
                            </label>
                            <Input
                              value={cert.end_date}
                              onChange={(e) => updateCertificationField(index, "end_date", e.target.value)}
                              className="bg-gray-100 w-32"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" onClick={addCertification} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
              </Collapsible>
            </section>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
        }
      `}</style>
    </div>
  );
};

export default ResumeEditor;