export interface CreateJobMatchRequest {
  targetJobTitle: string;
  company: string | null;
  jobDescription: string;
}
export interface JobMatch {
  id: string;
  targetJobTitle: string;
  company: string | null;
  jobDescription: string;
  overallScore: number;
  matchLevel: string;
  technicalScore: number;
  experienceScore: number;
  educationScore: number;
  toolsScore: number;
  softSkillsScore: number;
  matchedSkills: string[];
  matchedStrengths: string[];
  gaps: string[];
  priorities: string[];
  likelyQuestions: string[];
  summary: string;
  recommendedNextStep: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}
