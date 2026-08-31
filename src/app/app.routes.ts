import { Routes } from "@angular/router";
import {
  authGuard,
  guestGuard,
  profileCompleteGuard,
} from "./core/auth/auth.guard";
import { unsavedChangesGuard } from "./core/guards/unsaved-changes.guard";
import { withRoles } from "./core/auth/role.guard";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { CandidateLayoutComponent } from "./layouts/candidate-layout/candidate-layout.component";
import { PublicLayoutComponent } from "./layouts/public-layout/public-layout.component";

export const routes: Routes = [
  {
    path: "",
    component: PublicLayoutComponent,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./features/landing/landing-page.component").then(
            (m) => m.LandingPageComponent,
          ),
      },
      {
        path: "features",
        loadComponent: () =>
          import("./features/public/features-page.component").then(
            (m) => m.FeaturesPageComponent,
          ),
      },
      {
        path: "how-it-works",
        loadComponent: () =>
          import("./features/public/how-it-works-page.component").then(
            (m) => m.HowItWorksPageComponent,
          ),
      },
      {
        path: "benefits",
        loadComponent: () =>
          import("./features/public/benefits-page.component").then(
            (m) => m.BenefitsPageComponent,
          ),
      },
      {
        path: "responsible-ai",
        loadComponent: () =>
          import("./features/public/responsible-ai-page.component").then(
            (m) => m.ResponsibleAiPageComponent,
          ),
      },
    ],
  },
  {
    path: "auth",
    component: AuthLayoutComponent,
    children: [
      {
        path: "login",
        canActivate: [guestGuard],
        loadComponent: () =>
          import("./features/auth/login-page.component").then(
            (m) => m.LoginPageComponent,
          ),
      },
      {
        path: "register",
        canActivate: [guestGuard],
        loadComponent: () =>
          import("./features/auth/register-page.component").then(
            (m) => m.RegisterPageComponent,
          ),
      },
      {
        path: "forgot-password",
        canActivate: [guestGuard],
        loadComponent: () =>
          import("./features/auth/forgot-password-page.component").then(
            (m) => m.ForgotPasswordPageComponent,
          ),
      },
      {
        path: "reset-password",
        canActivate: [guestGuard],
        loadComponent: () =>
          import("./features/auth/reset-password-page.component").then(
            (m) => m.ResetPasswordPageComponent,
          ),
      },
    ],
  },
  {
    path: "onboarding",
    component: CandidateLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "profile",
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import("./features/onboarding/profile-basics-page.component").then(
            (m) => m.ProfileBasicsPageComponent,
          ),
      },
      {
        path: "profile/experience",
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import("./features/onboarding/profile-experience-page.component").then(
            (m) => m.ProfileExperiencePageComponent,
          ),
      },
      {
        path: "profile/education",
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import("./features/onboarding/profile-education-page.component").then(
            (m) => m.ProfileEducationPageComponent,
          ),
      },
      {
        path: "profile/career-goals",
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import("./features/onboarding/profile-career-goals-page.component").then(
            (m) => m.ProfileCareerGoalsPageComponent,
          ),
      },
      {
        path: "profile/review",
        loadComponent: () =>
          import("./features/onboarding/profile-review-page.component").then(
            (m) => m.ProfileReviewPageComponent,
          ),
      },
      { path: "**", redirectTo: "profile" },
    ],
  },
  {
    path: "app",
    component: CandidateLayoutComponent,
    canActivate: [authGuard, profileCompleteGuard],
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./features/dashboard/dashboard-page.component").then(
            (m) => m.DashboardPageComponent,
          ),
      },
      {
        path: "progress",
        data: {
          title: "Progress",
          subtitle: "Track readiness and improve day by day",
        },
        loadComponent: () =>
          import("./features/progress/progress-page.component").then(
            (m) => m.ProgressPageComponent,
          ),
      },
      {
        path: "career-coach",
        data: {
          title: "Your personalized AI guide",
          subtitle: "Uses your profile, resume, matches, and results",
        },
        loadComponent: () =>
          import("./features/career-coach/career-coach-page.component").then(
            (m) => m.CareerCoachPageComponent,
          ),
      },
      {
        path: "profile",
        loadComponent: () =>
          import("./features/profile/profile-management-page.component").then(
            (m) => m.ProfileManagementPageComponent,
          ),
      },
      {
        path: "resume",
        data: {
          title: "Upload your resume",
          subtitle: "Get specific, actionable AI feedback",
        },
        loadComponent: () =>
          import("./features/resume/resume-upload-page.component").then(
            (m) => m.ResumeUploadPageComponent,
          ),
      },
      {
        path: "job-match",
        data: {
          title: "Analyze a target opportunity",
          subtitle: "Paste a job description to understand your fit",
        },
        loadComponent: () =>
          import("./features/job-match/job-match-input-page.component").then(
            (m) => m.JobMatchInputPageComponent,
          ),
      },
      {
        path: "job-match/history",
        data: {
          title: "Job Match history",
          subtitle: "Review every opportunity you have analyzed",
        },
        loadComponent: () =>
          import("./features/job-match/job-match-history-page.component").then(
            (m) => m.JobMatchHistoryPageComponent,
          ),
      },
      {
        path: "job-match/:id",
        data: {
          title: "Job-match analysis",
          subtitle: "Understand your fit and improvement priorities",
        },
        loadComponent: () =>
          import("./features/job-match/job-match-results-page.component").then(
            (m) => m.JobMatchResultsPageComponent,
          ),
      },
      {
        path: "interviews/setup",
        data: {
          title: "Configure your interview",
          subtitle: "Choose practice or realistic simulation",
        },
        loadComponent: () =>
          import("./features/interviews/interview-setup-page.component").then(
            (m) => m.InterviewSetupPageComponent,
          ),
      },
      {
        path: "interviews/history",
        data: {
          title: "Interview history",
          subtitle: "Review every practice interview you completed",
        },
        loadComponent: () =>
          import("./features/interviews/interview-history-page.component").then(
            (m) => m.InterviewHistoryPageComponent,
          ),
      },
      {
        path: "interviews/session/:id",
        data: {
          title: "Interview ready",
          subtitle: "Review your generated question set",
        },
        loadComponent: () =>
          import("./features/interviews/interview-session-page.component").then(
            (m) => m.InterviewSessionPageComponent,
          ),
      },
      {
        path: "interviews/:id/microphone-test",
        data: {
          title: "Microphone test",
          subtitle: "Check audio before starting your voice interview",
        },
        loadComponent: () =>
          import("./features/interviews/microphone-test-page.component").then(
            (m) => m.MicrophoneTestPageComponent,
          ),
      },
      {
        path: "interviews/:id/room",
        data: { hideSearch: true },
        loadComponent: () =>
          import("./features/interviews/interview-room-page.component").then(
            (m) => m.InterviewRoomPageComponent,
          ),
      },
      {
        path: "interviews/:id/complete",
        data: {
          title: "Interview completed",
          subtitle: "Your answers were saved",
        },
        loadComponent: () =>
          import("./features/interviews/interview-complete-page.component").then(
            (m) => m.InterviewCompletePageComponent,
          ),
      },
      {
        path: "interviews/:id/results",
        data: { hideSearch: true },
        loadComponent: () =>
          import("./features/interviews/interview-results-page.component").then(
            (m) => m.InterviewResultsPageComponent,
          ),
      },
      {
        path: "interviews/:id/feedback",
        data: { hideSearch: true },
        loadComponent: () =>
          import("./features/interviews/interview-feedback-page.component").then(
            (m) => m.InterviewFeedbackPageComponent,
          ),
      },
      {
        path: "interviews/compare",
        canActivate: [withRoles("Candidate")],
        data: { hideSearch: true },
        loadComponent: () =>
          import("./features/interviews/compare-attempts-page.component").then(
            (m) => m.CompareAttemptsPageComponent,
          ),
      },
      {
        path: "jobs",
        canActivate: [withRoles("Candidate")],
        data: {
          title: "Job search",
          subtitle: "Find roles that match your profile",
        },
        loadComponent: () =>
          import("./features/jobs/job-search-page.component").then(
            (m) => m.JobSearchPageComponent,
          ),
      },
      {
        path: "jobs/:id",
        canActivate: [withRoles("Candidate")],
        data: {
          title: "Job details",
          subtitle: "Review the role and apply",
        },
        loadComponent: () =>
          import("./features/jobs/job-details-page.component").then(
            (m) => m.JobDetailsPageComponent,
          ),
      },
      {
        path: "applications",
        canActivate: [withRoles("Candidate")],
        data: {
          title: "My applications",
          subtitle: "Track every role you applied to",
        },
        loadComponent: () =>
          import("./features/jobs/my-applications-page.component").then(
            (m) => m.MyApplicationsPageComponent,
          ),
      },
      {
        path: "saved-jobs",
        canActivate: [withRoles("Candidate")],
        data: {
          title: "Saved jobs",
          subtitle: "Roles you want to revisit",
        },
        loadComponent: () =>
          import("./features/jobs/saved-jobs-page.component").then(
            (m) => m.SavedJobsPageComponent,
          ),
      },
      {
        path: "recruiter",
        canActivate: [withRoles("Recruiter")],
        data: {
          title: "Recruiter dashboard",
          subtitle: "Post roles and review applicants",
        },
        loadComponent: () =>
          import("./features/jobs/recruiter-dashboard-page.component").then(
            (m) => m.RecruiterDashboardPageComponent,
          ),
      },
      {
        path: "admin/users",
        canActivate: [withRoles("Admin")],
        data: {
          title: "User management",
          subtitle: "Manage accounts, roles, and access",
        },
        loadComponent: () =>
          import("./features/admin/user-management-page.component").then(
            (m) => m.UserManagementPageComponent,
          ),
      },
      {
        path: "admin/roles",
        canActivate: [withRoles("Admin")],
        data: {
          title: "Roles & permissions",
          subtitle: "What each role can do",
        },
        loadComponent: () =>
          import("./features/admin/roles-permissions-page.component").then(
            (m) => m.RolesPermissionsPageComponent,
          ),
      },
      {
        path: "resume/:id/analysis",
        data: {
          title: "Resume analysis",
          subtitle: "Specific improvements for your target role",
        },
        loadComponent: () =>
          import("./features/resume/resume-analysis-page.component").then(
            (m) => m.ResumeAnalysisPageComponent,
          ),
      },
      {
        path: "resume/:id/edit",
        data: {
          title: "Review extracted information",
          subtitle: "Confirm or correct what the AI found in your resume",
          hideSearch: true,
        },
        loadComponent: () =>
          import("./features/resume/resume-edit-page.component").then(
            (m) => m.ResumeEditPageComponent,
          ),
      },
      {
        path: "profile/edit",
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import("./features/profile/profile-page.component").then(
            (m) => m.ProfilePageComponent,
          ),
      },
      {
        path: "profile/personal",
        data: { section: "personal" },
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import("./features/profile/profile-section-page.component").then(
            (m) => m.ProfileSectionPageComponent,
          ),
      },
      {
        path: "profile/career",
        data: { section: "career" },
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import("./features/profile/profile-section-page.component").then(
            (m) => m.ProfileSectionPageComponent,
          ),
      },
      {
        path: "profile/skills-experience",
        data: { section: "skills" },
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import("./features/profile/profile-section-page.component").then(
            (m) => m.ProfileSectionPageComponent,
          ),
      },
      {
        path: "profile/interview-preferences",
        data: { section: "interview" },
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import("./features/profile/profile-section-page.component").then(
            (m) => m.ProfileSectionPageComponent,
          ),
      },
      {
        path: "profile/resume",
        loadComponent: () =>
          import("./features/resume/resume-management-page.component").then(
            (m) => m.ResumeManagementPageComponent,
          ),
      },
      {
        path: "profile/security",
        data: { section: "security" },
        loadComponent: () =>
          import("./features/profile/profile-section-page.component").then(
            (m) => m.ProfileSectionPageComponent,
          ),
      },
      {
        path: "profile/privacy",
        data: { section: "privacy" },
        loadComponent: () =>
          import("./features/profile/profile-section-page.component").then(
            (m) => m.ProfileSectionPageComponent,
          ),
      },
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
      { path: "**", redirectTo: "dashboard" },
    ],
  },
  { path: "**", redirectTo: "" },
];
