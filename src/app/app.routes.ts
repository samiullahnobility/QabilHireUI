import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing/landing-page.component';
import { FeaturesPageComponent } from './features/public/features-page.component';
import { HowItWorksPageComponent } from './features/public/how-it-works-page.component';
import { BenefitsPageComponent } from './features/public/benefits-page.component';
import { ResponsibleAiPageComponent } from './features/public/responsible-ai-page.component';
import { LoginPageComponent } from './features/auth/login-page.component';
import { RegisterPageComponent } from './features/auth/register-page.component';
import { ForgotPasswordPageComponent } from './features/auth/forgot-password-page.component';
import { ResetPasswordPageComponent } from './features/auth/reset-password-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'features', component: FeaturesPageComponent },
  { path: 'how-it-works', component: HowItWorksPageComponent },
  { path: 'benefits', component: BenefitsPageComponent },
  { path: 'responsible-ai', component: ResponsibleAiPageComponent },
  { path: 'auth/login', component: LoginPageComponent },
  { path: 'auth/register', component: RegisterPageComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordPageComponent },
  { path: 'auth/reset-password', component: ResetPasswordPageComponent },
  { path: '**', redirectTo: '' }
];
