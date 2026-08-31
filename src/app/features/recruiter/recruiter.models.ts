export const APPLICATION_STAGES = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offered",
  "Rejected",
] as const;

export type ApplicationStage = (typeof APPLICATION_STAGES)[number];

export const STAGE_TRANSITIONS: Record<ApplicationStage, ApplicationStage[]> = {
  Applied: ["Shortlisted", "Rejected"],
  Shortlisted: ["Interview", "Rejected"],
  Interview: ["Offered", "Rejected"],
  Offered: ["Rejected"],
  Rejected: [],
};

export const INTERVIEW_MODES = ["Video", "Phone", "Onsite"] as const;
export type InterviewMode = (typeof INTERVIEW_MODES)[number];

export const INTERVIEW_STATUSES = ["Scheduled", "Completed", "Cancelled"] as const;
export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number];

export const RECOMMENDATIONS = ["Hire", "Consider", "Reject"] as const;
export type Recommendation = (typeof RECOMMENDATIONS)[number];

export interface RecruiterJobPosting {
  id: string;
  title: string;
  company: string;
  location: string | null;
  workType: "Remote" | "Hybrid" | "Onsite";
  salaryRange: string | null;
  description: string;
  requiredSkills: string[];
  isActive: boolean;
  applicationCount: number;
  postedAtUtc: string;
}

export interface CreateJobPostingRequest {
  title: string;
  company: string;
  location: string | null;
  workType: "Remote" | "Hybrid" | "Onsite";
  salaryRange: string | null;
  description: string;
  requiredSkills: string[];
}

export interface UpdateJobPostingRequest extends CreateJobPostingRequest {
  isActive: boolean;
}

export interface Applicant {
  userId: string;
  fullName: string;
  email: string;
  status: string;
  appliedAtUtc: string;
}

export interface RecruiterDashboard {
  activeJobs: number;
  totalApplicants: number;
  interviewsScheduled: number;
  offersMade: number;
  recentApplications: RecentApplication[];
  jobs: JobSummary[];
}

export interface RecentApplication {
  applicationId: string;
  applicantName: string;
  jobTitle: string;
  status: string;
  appliedAtUtc: string;
}

export interface JobSummary {
  jobPostingId: string;
  title: string;
  isActive: boolean;
  applicationCount: number;
}

export interface ApplicantListItem {
  applicationId: string;
  userId: string;
  fullName: string;
  email: string;
  jobPostingId: string;
  jobTitle: string;
  status: string;
  statusUpdatedAtUtc: string | null;
  appliedAtUtc: string;
}

export interface ApplicantList {
  items: ApplicantListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApplicantDetail {
  applicationId: string;
  jobPostingId: string;
  jobTitle: string;
  status: string;
  appliedAtUtc: string;
  statusUpdatedAtUtc: string | null;
  candidate: CandidateSummary;
  resume: ResumeSummary | null;
  readiness: Readiness | null;
}

export interface CandidateSummary {
  fullName: string;
  email: string;
  headline: string | null;
  experienceLevel: string | null;
  currentRole: string | null;
  education: string | null;
  skills: string[];
  location: string | null;
  targetRole: string | null;
  linkedInUrl: string | null;
  portfolioUrl: string | null;
}

export interface ResumeSummary {
  fileName: string;
  displayName: string;
  score: number | null;
  status: string;
  createdAtUtc: string;
}

export interface Readiness {
  jobMatch: JobMatchReadiness | null;
  interview: InterviewReadiness | null;
}

export interface JobMatchReadiness {
  overallScore: number;
  matchLevel: string;
  createdAtUtc: string;
}

export interface InterviewReadiness {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  strongestArea: string | null;
  priorityArea: string | null;
  completedAtUtc: string | null;
}

export interface RecruiterInterview {
  id: string;
  jobApplicationId: string;
  jobPostingId: string;
  jobTitle: string;
  candidateUserId: string;
  candidateName: string;
  scheduledAtUtc: string;
  durationMinutes: number;
  mode: string;
  locationOrLink: string | null;
  status: InterviewStatus;
  cancelledAtUtc: string | null;
  rating: number | null;
  strengths: string | null;
  weaknesses: string | null;
  recommendation: string | null;
  feedbackSubmittedAtUtc: string | null;
}

export interface CreateInterviewRequest {
  jobApplicationId: string;
  scheduledAtUtc: string;
  durationMinutes: number;
  mode: InterviewMode;
  locationOrLink: string | null;
}

export interface UpdateInterviewRequest {
  scheduledAtUtc: string;
  durationMinutes: number;
  mode: InterviewMode;
  locationOrLink: string | null;
}

export interface SubmitFeedbackRequest {
  rating: number;
  strengths: string | null;
  weaknesses: string | null;
  recommendation: Recommendation;
}

export interface RecruiterProfile {
  fullName: string;
  email: string;
  organization: string | null;
  emailNotifications: boolean;
  pipelineUpdateNotifications: boolean;
  interviewReminderNotifications: boolean;
}

export interface UpdateRecruiterProfileRequest {
  fullName: string;
  organization: string | null;
  emailNotifications: boolean;
  pipelineUpdateNotifications: boolean;
  interviewReminderNotifications: boolean;
}
