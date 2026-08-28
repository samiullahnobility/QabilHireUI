import { Routes } from "@angular/router";
import {
  authGuard,
  guestGuard,
  profileCompleteGuard,
} from "./core/auth/auth.guard";
import { ForgotPasswordPageComponent } from "./features/auth/forgot-password-page.component";
import { LoginPageComponent } from "./features/auth/login-page.component";
import { RegisterPageComponent } from "./features/auth/register-page.component";
import { ResetPasswordPageComponent } from "./features/auth/reset-password-page.component";
import { DashboardPageComponent } from "./features/dashboard/dashboard-page.component";
import { LandingPageComponent } from "./features/landing/landing-page.component";
import { ProfileBasicsPageComponent } from "./features/onboarding/profile-basics-page.component";
import { ProfileCareerGoalsPageComponent } from "./features/onboarding/profile-career-goals-page.component";
import { ProfileEducationPageComponent } from "./features/onboarding/profile-education-page.component";
import { ProfileExperiencePageComponent } from "./features/onboarding/profile-experience-page.component";
import { ProfileReviewPageComponent } from "./features/onboarding/profile-review-page.component";
import { BenefitsPageComponent } from "./features/public/benefits-page.component";
import { FeaturesPageComponent } from "./features/public/features-page.component";
import { HowItWorksPageComponent } from "./features/public/how-it-works-page.component";
import { ResponsibleAiPageComponent } from "./features/public/responsible-ai-page.component";
import { ProfilePageComponent } from "./features/profile/profile-page.component";
import { ProfileManagementPageComponent } from "./features/profile/profile-management-page.component";
import { ProfileSectionPageComponent } from "./features/profile/profile-section-page.component";
import { ResumeAnalysisPageComponent } from "./features/resume/resume-analysis-page.component";
import { ResumeEditPageComponent } from "./features/resume/resume-edit-page.component";
import { ResumeUploadPageComponent } from "./features/resume/resume-upload-page.component";
import { ResumeManagementPageComponent } from "./features/resume/resume-management-page.component";
import { JobMatchInputPageComponent } from "./features/job-match/job-match-input-page.component";
import { JobMatchResultsPageComponent } from "./features/job-match/job-match-results-page.component";
import { JobMatchHistoryPageComponent } from "./features/job-match/job-match-history-page.component";
import { InterviewSetupPageComponent } from "./features/interviews/interview-setup-page.component";
import { InterviewSessionPageComponent } from "./features/interviews/interview-session-page.component";
import { MicrophoneTestPageComponent } from "./features/interviews/microphone-test-page.component";
import { InterviewRoomPageComponent } from "./features/interviews/interview-room-page.component";
import { InterviewCompletePageComponent } from "./features/interviews/interview-complete-page.component";
import { InterviewResultsPageComponent } from "./features/interviews/interview-results-page.component";
import { InterviewFeedbackPageComponent } from "./features/interviews/interview-feedback-page.component";
import { CandidateLayoutComponent } from "./layouts/candidate-layout/candidate-layout.component";
import { PublicLayoutComponent } from "./layouts/public-layout/public-layout.component";
import { unsavedChangesGuard } from "./core/guards/unsaved-changes.guard";

export const routes: Routes = [
  {
    path: "",
    component: PublicLayoutComponent,
    children: [
      { path: "", component: LandingPageComponent },
      { path: "features", component: FeaturesPageComponent },
      { path: "how-it-works", component: HowItWorksPageComponent },
      { path: "benefits", component: BenefitsPageComponent },
      { path: "responsible-ai", component: ResponsibleAiPageComponent },
      {
        path: "auth/login",
        component: LoginPageComponent,
        canActivate: [guestGuard],
      },
      {
        path: "auth/register",
        component: RegisterPageComponent,
        canActivate: [guestGuard],
      },
      {
        path: "auth/forgot-password",
        component: ForgotPasswordPageComponent,
        canActivate: [guestGuard],
      },
      {
        path: "auth/reset-password",
        component: ResetPasswordPageComponent,
        canActivate: [guestGuard],
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
        component: ProfileBasicsPageComponent,
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: "profile/experience",
        component: ProfileExperiencePageComponent,
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: "profile/education",
        component: ProfileEducationPageComponent,
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: "profile/career-goals",
        component: ProfileCareerGoalsPageComponent,
        canDeactivate: [unsavedChangesGuard],
      },
      { path: "profile/review", component: ProfileReviewPageComponent },
      { path: "**", redirectTo: "profile" },
    ],
  },
  {
    path: "app",
    component: CandidateLayoutComponent,
    canActivate: [authGuard, profileCompleteGuard],
    children: [
      { path: "dashboard", component: DashboardPageComponent },
      { path: "profile", component: ProfileManagementPageComponent },
      {
        path: "resume",
        component: ResumeUploadPageComponent,
        data: {
          title: "Upload your resume",
          subtitle: "Get specific, actionable AI feedback",
        },
      },
      {
        path: "job-match",
        component: JobMatchInputPageComponent,
        data: {
          title: "Analyze a target opportunity",
          subtitle: "Paste a job description to understand your fit",
        },
      },
      {
        path: "job-match/history",
        component: JobMatchHistoryPageComponent,
        data: {
          title: "Job Match history",
          subtitle: "Review every opportunity you have analyzed",
        },
      },
      {
        path: "job-match/:id",
        component: JobMatchResultsPageComponent,
        data: {
          title: "Job-match analysis",
          subtitle: "Understand your fit and improvement priorities",
        },
      },
      {
        path: "interviews/setup",
        component: InterviewSetupPageComponent,
        data: {
          title: "Configure your interview",
          subtitle: "Choose practice or realistic simulation",
        },
      },
      {
        path: "interviews/session/:id",
        component: InterviewSessionPageComponent,
        data: {
          title: "Interview ready",
          subtitle: "Review your generated question set",
        },
      },
      {
        path: "interviews/:id/microphone-test",
        component: MicrophoneTestPageComponent,
        data: {
          title: "Microphone test",
          subtitle: "Check audio before starting your voice interview",
        },
      },
      {
        path: "interviews/:id/room",
        component: InterviewRoomPageComponent,
        data: { hideSearch: true },
      },
      {
        path: "interviews/:id/complete",
        component: InterviewCompletePageComponent,
        data: {
          title: "Interview completed",
          subtitle: "Your answers were saved",
        },
      },
      {
        path: "interviews/:id/results",
        component: InterviewResultsPageComponent,
        data: { hideSearch: true },
      },
      {
        path: "interviews/:id/feedback",
        component: InterviewFeedbackPageComponent,
        data: { hideSearch: true },
      },
      {
        path: "resume/:id/analysis",
        component: ResumeAnalysisPageComponent,
        data: {
          title: "Resume analysis",
          subtitle: "Specific improvements for your target role",
        },
      },
      {
        path: "resume/:id/edit",
        component: ResumeEditPageComponent,
        data: {
          title: "Review extracted information",
          subtitle: "Confirm or correct what the AI found in your resume",
          hideSearch: true,
        },
      },
      {
        path: "profile/edit",
        component: ProfilePageComponent,
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: "profile/personal",
        component: ProfileSectionPageComponent,
        data: { section: "personal" },
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: "profile/career",
        component: ProfileSectionPageComponent,
        data: { section: "career" },
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: "profile/skills-experience",
        component: ProfileSectionPageComponent,
        data: { section: "skills" },
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: "profile/interview-preferences",
        component: ProfileSectionPageComponent,
        data: { section: "interview" },
        canDeactivate: [unsavedChangesGuard],
      },
      { path: "profile/resume", component: ResumeManagementPageComponent },
      {
        path: "profile/security",
        component: ProfileSectionPageComponent,
        data: { section: "security" },
      },
      {
        path: "profile/privacy",
        component: ProfileSectionPageComponent,
        data: { section: "privacy" },
      },
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
      { path: "**", redirectTo: "dashboard" },
    ],
  },
  { path: "**", redirectTo: "" },
];
