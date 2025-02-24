export interface Responsibility {
  text: string;
  oldText?: string;
  mode?: "new" | "deletion" | "edit" | null;
}

export interface WorkExperience {
  id: string;
  company: string;
  location: string;
  role: string;
  start_date: string;
  end_date: string;
  responsibilities: Responsibility[];
  mode?: "new" | null;
}

export interface Certification {
  course_name: string;
  institution: string;
  start_date: string;
  end_date: string;
}

export interface PersonalInfo {
  name: string;
  location: string;
  linkedin: string;
  phone: string;
  email: string;
  portfolio: string;
  // Extra fields for this design:
  role?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
}

export interface Education {
  university: string;
  location: string;
  degree: string;
  graduation_date: string;
  scholarship: string;
}

export interface Language {
  language: string;
  fluency: string;
}

export interface SocialMediaLink {
  label: string;
  url: string;
}

export interface ResumeContent {
  personal_info: PersonalInfo;
  professional_summary: string;
  education: Education;
  work_experience: WorkExperience[];
  volunteer_experience: any[];
  skills: string[];
  languages: Language[];
  projects: any[];
  social_media_and_links: SocialMediaLink[];
  certifications: Certification[];
} 