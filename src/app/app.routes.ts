import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';
import { ForgotPasswordPageComponent } from './features/auth/forgot-password-page.component';
import { LoginPageComponent } from './features/auth/login-page.component';
import { RegisterPageComponent } from './features/auth/register-page.component';
import { ResetPasswordPageComponent } from './features/auth/reset-password-page.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { LandingPageComponent } from './features/landing/landing-page.component';
import { ProfileBasicsPageComponent } from './features/onboarding/profile-basics-page.component';
import { ProfileCareerGoalsPageComponent } from './features/onboarding/profile-career-goals-page.component';
import { ProfileEducationPageComponent } from './features/onboarding/profile-education-page.component';
import { ProfileExperiencePageComponent } from './features/onboarding/profile-experience-page.component';
import { ProfileReviewPageComponent } from './features/onboarding/profile-review-page.component';
import { BenefitsPageComponent } from './features/public/benefits-page.component';
import { FeaturesPageComponent } from './features/public/features-page.component';
import { HowItWorksPageComponent } from './features/public/how-it-works-page.component';
import { ResponsibleAiPageComponent } from './features/public/responsible-ai-page.component';
import { ProfilePageComponent } from './features/profile/profile-page.component';
import { ProfileManagementPageComponent } from './features/profile/profile-management-page.component';
import { ProfileSectionPageComponent } from './features/profile/profile-section-page.component';
import { ResumeAnalysisPageComponent } from './features/resume/resume-analysis-page.component';
import { ResumeEditPageComponent } from './features/resume/resume-edit-page.component';
import { ResumeUploadPageComponent } from './features/resume/resume-upload-page.component';
import { ResumeManagementPageComponent } from './features/resume/resume-management-page.component';
import { CandidateLayoutComponent } from './layouts/candidate-layout/candidate-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: '', component: PublicLayoutComponent, children: [
      { path: '', component: LandingPageComponent },
      { path: 'features', component: FeaturesPageComponent },
      { path: 'how-it-works', component: HowItWorksPageComponent },
      { path: 'benefits', component: BenefitsPageComponent },
      { path: 'responsible-ai', component: ResponsibleAiPageComponent },
      { path: 'auth/login', component: LoginPageComponent, canActivate: [guestGuard] },
      { path: 'auth/register', component: RegisterPageComponent, canActivate: [guestGuard] },
      { path: 'auth/forgot-password', component: ForgotPasswordPageComponent, canActivate: [guestGuard] },
      { path: 'auth/reset-password', component: ResetPasswordPageComponent, canActivate: [guestGuard] }
    ]
  },
  {
    path: 'onboarding', component: CandidateLayoutComponent, canActivate: [authGuard], children: [
      { path: 'profile', component: ProfileBasicsPageComponent, canDeactivate: [unsavedChangesGuard] },
      { path: 'profile/experience', component: ProfileExperiencePageComponent, canDeactivate: [unsavedChangesGuard] },
      { path: 'profile/education', component: ProfileEducationPageComponent, canDeactivate: [unsavedChangesGuard] },
      { path: 'profile/career-goals', component: ProfileCareerGoalsPageComponent, canDeactivate: [unsavedChangesGuard] },
      { path: 'profile/review', component: ProfileReviewPageComponent },
      { path: '**', redirectTo: 'profile' }
    ]
  },
  {
    path: 'app', component: CandidateLayoutComponent, canActivate: [authGuard], children: [
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'profile', component: ProfileManagementPageComponent },
      { path: 'resume', component: ResumeUploadPageComponent },
      { path: 'resume/:id/analysis', component: ResumeAnalysisPageComponent },
      { path: 'resume/:id/edit', component: ResumeEditPageComponent },
      { path: 'profile/edit', component: ProfilePageComponent, canDeactivate: [unsavedChangesGuard] },
      { path: 'profile/personal', component: ProfileSectionPageComponent, data: { section: 'personal' }, canDeactivate: [unsavedChangesGuard] },
      { path: 'profile/career', component: ProfileSectionPageComponent, data: { section: 'career' }, canDeactivate: [unsavedChangesGuard] },
      { path: 'profile/skills-experience', component: ProfileSectionPageComponent, data: { section: 'skills' }, canDeactivate: [unsavedChangesGuard] },
      { path: 'profile/interview-preferences', component: ProfileSectionPageComponent, data: { section: 'interview' }, canDeactivate: [unsavedChangesGuard] },
      { path: 'profile/resume', component: ResumeManagementPageComponent },
      { path: 'profile/security', component: ProfileSectionPageComponent, data: { section: 'security' } },
      { path: 'profile/privacy', component: ProfileSectionPageComponent, data: { section: 'privacy' } },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: '**', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: '' }
];
