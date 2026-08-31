export interface AdminActivity {
  type: "User" | "Job" | "Application" | "Admin";
  title: string;
  detail: string;
  occurredAtUtc: string;
}

export interface AdminSummary {
  totalUsers: number;
  candidates: number;
  recruiters: number;
  admins: number;
  activeJobs: number;
  applications: number;
  lockedAccounts: number;
  completedInterviews: number;
  recentActivity: AdminActivity[];
}

export interface AdminJob {
  id: string;
  title: string;
  company: string;
  location: string | null;
  workType: string;
  isActive: boolean;
  postedAtUtc: string;
  updatedAtUtc: string;
  recruiterId: string;
  recruiterName: string;
  applicationCount: number;
}

export interface AdminTrendPoint {
  date: string;
  registrations: number;
  jobs: number;
  applications: number;
}

export interface AdminReports {
  totalResumes: number;
  analyzedResumes: number;
  jobMatches: number;
  interviewSessions: number;
  completedInterviews: number;
  improvementPlans: number;
  applicationPerJobRate: number;
  trend: AdminTrendPoint[];
}

export interface AdminServiceStatus {
  name: string;
  status: "Operational" | "Needs attention";
  detail: string;
}

export interface AdminAiOperationHealth {
  operation: string;
  requestCount: number;
  failureCount: number;
  averageLatencyMilliseconds: number;
}

export interface AdminSystemHealth {
  environment: string;
  checkedAtUtc: string;
  uptimeSeconds: number;
  services: AdminServiceStatus[];
  resumeAnalyses: number;
  jobMatchAnalyses: number;
  interviewEvaluations: number;
  averageAiLatencyMilliseconds: number | null;
  aiFailureCount: number;
  aiRequestCount: number;
  aiSuccessRate: number | null;
  aiOperations: AdminAiOperationHealth[];
}

export interface AdminSettings {
  environment: string;
  frontendUrl: string;
  allowedOrigins: string[];
  emailConfigured: boolean;
  aiConfigured: boolean;
  storageConfigured: boolean;
  aiPermitLimit: number;
  aiWindowMinutes: number;
  accessTokenMinutes: number;
  refreshTokenDays: number;
}
