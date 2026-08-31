export interface DashboardActivity {
  type: string;
  title: string;
  description: string;
  occurredAtUtc: string;
  route: string;
}

export interface DashboardTrendPoint {
  label: string;
  score: number;
}

export interface DashboardNextAction {
  title: string;
  description: string;
  route: string;
  buttonLabel: string;
}

export interface DashboardSummary {
  greeting: string;
  firstName: string;
  profileComplete: boolean;
  resumeScore?: number | null;
  jobMatchScore?: number | null;
  interviewsCompleted: number;
  averageInterviewScore?: number | null;
  readinessScore?: number | null;
  readinessFocus?: string | null;
  recentActivity: DashboardActivity[];
  trend: DashboardTrendPoint[];
  nextAction: DashboardNextAction;
}
