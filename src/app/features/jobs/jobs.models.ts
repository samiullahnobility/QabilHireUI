export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string | null;
  workType: "Remote" | "Hybrid" | "Onsite";
  salaryRange: string | null;
  description: string;
  requiredSkills: string[];
  isActive: boolean;
  postedAtUtc: string;
  recruiterName: string;
  hasApplied: boolean;
  isSaved: boolean;
}

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

export interface JobApplication {
  id: string;
  jobPostingId: string;
  jobTitle: string;
  company: string;
  location: string | null;
  workType: string;
  salaryRange: string | null;
  status: string;
  appliedAtUtc: string;
}

export interface SavedJob {
  id: string;
  jobPostingId: string;
  jobTitle: string;
  company: string;
  location: string | null;
  workType: string;
  salaryRange: string | null;
  postedAtUtc: string;
}

export interface Applicant {
  userId: string;
  fullName: string;
  email: string;
  status: string;
  appliedAtUtc: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  emailConfirmed: boolean;
  lockedOut: boolean;
  createdAtUtc: string;
  roles: string[];
}

export interface AdminRole {
  name: string;
  description: string;
  memberCount: number;
  permissions: string[];
}
