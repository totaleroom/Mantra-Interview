export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  linkedin_url: string;
  portfolio_url: string;
  tagline: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  type: 'kerja' | 'magang' | 'freelance' | 'organisasi' | 'volunteer';
}

export interface Education {
  id: string;
  institution: string;
  major: string;
  degree: string;
  graduation_year: string;
  gpa: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'Native' | 'Fluent' | 'Conversational' | 'Basic';
}

export interface Skills {
  hard_skills: string[];
  soft_skills: string[];
}

export interface CVData {
  personal_info: PersonalInfo;
  summary: string;
  target_position: string;
  years_experience: number;
  experiences: Experience[];
  education: Education[];
  skills: Skills;
  certifications: Certification[];
  languages: Language[];
}

export type { EnhanceResult, Change } from '@/lib/word-intelligence';

export interface AIAnalysis {
  scores: {
    ats_compatibility: number;
    keyword_optimization: number;
    achievement_vs_responsibility: number;
    storytelling_quality: number;
    skill_relevance: number;
    experience_depth: number;
    professional_summary: number;
    education_fit: number;
    formatting_structure: number;
    overall_impression: number;
  };
  total_score: number;
  recommendations: Record<string, string>;
  improvement_tips: string[];
}

export interface AIRewriteResult {
  summary?: string;
  experiences?: { id: string; description: string }[];
}

export const emptyCV: CVData = {
  personal_info: { full_name: '', email: '', phone: '', city: '', linkedin_url: '', portfolio_url: '', tagline: '' },
  summary: '',
  target_position: '',
  years_experience: 0,
  experiences: [],
  education: [],
  skills: { hard_skills: [], soft_skills: [] },
  certifications: [],
  languages: [],
};
