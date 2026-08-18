# QabilHire — Codex Project Context and Implementation Guide

## 1. Product Overview

QabilHire is an AI-powered career and interview-preparation platform being developed for the First Alibaba Cloud AI Hackathon in Pakistan, hosted by Alkhidmat Foundation. It helps job seekers analyse their resumes, compare their profiles with job descriptions, practise AI-generated interviews, receive detailed feedback, follow personalised improvement plans, track progress, and obtain guidance from an AI career coach.

This repository uses the Modernize Angular Free template as its UI foundation. Retain useful layout and component infrastructure, but replace all template branding, navigation, demo content, placeholder data, and irrelevant pages with QabilHire functionality.

## 2. Project Goal

Build a stable, polished, demo-ready MVP in one week. Prioritise the complete candidate journey over implementing every screen in the Figma file.

Primary demo journey:

1. Register or sign in.
2. Complete a basic candidate profile.
3. Upload a PDF or DOCX resume.
4. Extract and review resume information.
5. Receive AI resume analysis.
6. Enter a job description.
7. Receive a job-match score, skill gaps, and recommendations.
8. Configure and begin a five-question mock interview.
9. Answer using recorded audio, with typed answers as a fallback.
10. Convert recorded answers to text.
11. Receive AI scores and question-level feedback.
12. View an overall interview result and improvement plan.

## 3. Figma Design Source

Main QabilHire Figma file:

https://www.figma.com/design/EOD24VaKYfglCwXtbq8Ynf

The Figma file is the visual source of truth for layouts, colours, typography, spacing, component appearance, responsive intent, states, and content hierarchy. It contains the broader QabilHire product vision, including screens that may be postponed until after the MVP.

### How to provide Figma designs to Codex

Use the main file link only for initial design discovery. For implementation, provide one node-specific screen link at a time.

To copy a node-specific link in Figma:

1. Open the QabilHire Figma file.
2. Select the complete screen frame, not a button, text layer, or nested group.
3. Right-click the frame and select **Copy/Paste as → Copy link to selection**, or use **Copy link** while the frame is selected.
4. Confirm that the copied URL contains a `node-id` parameter.
5. Paste that URL into the Codex task for the relevant screen.

Example implementation request:

```text
Implement the linked QabilHire Figma screen in this Angular project:

[PASTE THE NODE-SPECIFIC FIGMA LINK HERE]

Reuse the existing QabilHire layout, design tokens, and shared components. Use Angular standalone components, Reactive Forms, Signals where appropriate, OnPush change detection, strict typing, and accessible responsive markup. Match the Figma layout closely without duplicating an existing component. Use mock data through the feature's data-access abstraction until the backend endpoint is available. Run the relevant tests and production build, then report changed files and any remaining visual differences.
```

If the Codex environment has Figma MCP access, connect or configure Figma and ask Codex to inspect the linked node directly. If it cannot access the Figma file, export the selected frame as a PNG at 2x and place it under `docs/figma-references/`, then provide both the image path and the node link. Never provide only the filename of the Figma file.

### Figma implementation order

Implement screens in this order:

1. Authentication layout and sign-in
2. Registration
3. Candidate dashboard shell
4. Profile setup
5. Resume upload
6. Resume analysis
7. Extracted resume information editor
8. Job-description input
9. Job-match results
10. Interview setup
11. Microphone test
12. Interview room
13. Interview results
14. Question-level feedback
15. Improvement plan
16. Progress dashboard

Do not attempt to generate all Figma screens in one task. Implement and verify one coherent feature or a small related screen group at a time.

## 4. Visual System

Use the restored QabilHire teal and emerald visual identity.

| Token | Value |
|---|---|
| Primary | `#059669` |
| Primary dark/sidebar | `#064E3B` |
| Primary hover | `#047857` |
| Primary soft | `#ECFDF7` |
| Sidebar text | `#D1FAE5` |
| Accent | `#F59E0B` |
| Page background | `#F8FAFC` |
| Surface | `#FFFFFF` |
| Main text | `#0F172A` |
| Secondary text | `#64748B` |
| Border | `#E2E8F0` |
| Success | `#16A34A` |
| Warning | `#D97706` |
| Danger | `#DC2626` |

Define these colours once through CSS custom properties and the Angular Material theme. Do not scatter raw colour values throughout components. Follow the Figma typography where available; otherwise use Plus Jakarta Sans with sensible fallbacks. Preserve accessible contrast and visible keyboard focus states.

## 5. Technology Stack

### Frontend

- Angular, using the version already supported by the Modernize template
- TypeScript strict mode
- Angular standalone components
- Angular Router with lazy-loaded feature routes
- Angular Material and CDK
- Angular Reactive Forms
- Angular Signals for local and derived UI state
- RxJS for HTTP, streaming, and asynchronous workflows
- Chart.js or the chart library already included by Modernize
- Playwright for critical end-to-end flows when practical
- Existing unit-test framework configured by the template

Do not perform a major Angular or Angular Material upgrade during the one-week MVP unless the current project cannot build or contains a critical vulnerability that blocks development.

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- ASP.NET Core Identity
- JWT access and refresh tokens, preferably delivered through secure cookies
- Swagger/OpenAPI
- Background processing for long-running AI operations where necessary
- Structured logging and central exception handling

### AI and document services

- Alibaba Cloud Model Studio/Qwen for resume analysis, job matching, interview generation, answer evaluation, improvement plans, and coaching
- Alibaba speech-to-text for interview transcription
- Browser SpeechSynthesis for MVP interviewer voice; Alibaba TTS may replace it later
- Local PDF/DOCX text extraction first
- Qwen OCR/vision only as a fallback for scanned or image-based resumes

All AI provider calls must be made by the ASP.NET Core backend. Never expose provider API keys in Angular, source control, browser storage, logs, or client responses.

## 6. MVP Scope

### Required

- Landing page or simple product introduction
- Registration and sign-in
- Candidate profile
- Resume PDF/DOCX upload
- Resume text extraction
- AI resume analysis
- Editable extracted resume information
- Job-description input
- Job-match score and explanation
- Interview configuration
- Five-question mock interview
- Audio recording and typed-answer fallback
- Speech-to-text transcription
- AI answer evaluation
- Overall result and question-level feedback
- Basic seven-day improvement plan
- Candidate dashboard with recent activity
- Loading, empty, validation, processing, success, and failure states
- Responsive behaviour for desktop, tablet, and mobile

### Explicitly postponed

- Recruiter portal
- Full admin user and role management
- Public job marketplace
- Application tracking
- Payments and subscriptions
- Realtime conversational voice interview
- Advanced attempt comparison
- Advanced career-coach memory
- Complex analytics
- Email and notification automation
- Full implementation of every Figma screen

Postponed modules may remain represented in the architecture or navigation plan, but they must not delay the MVP journey.

## 7. Recommended Angular Routes

```text
/
/auth/login
/auth/register
/auth/forgot-password
/auth/reset-password
/onboarding/profile
/app/dashboard
/app/resume/upload
/app/resume/analysis/:analysisId
/app/resume/edit/:analysisId
/app/job-match
/app/job-match/:matchId
/app/interviews/setup
/app/interviews/microphone-test
/app/interviews/session/:sessionId
/app/interviews/results/:sessionId
/app/interviews/results/:sessionId/questions
/app/improvement-plan/:sessionId
/app/progress
/app/profile
/app/settings
```

Use functional authentication guards. Keep future recruiter and administrator route trees separate from the candidate application.

## 8. Recommended Navigation

```text
Dashboard
Resume Analysis
Job Match
Mock Interviews
Interview Results
Improvement Plan
Progress
AI Career Coach (post-MVP or limited preview)
Profile
Settings
```

## 9. Suggested Angular Architecture

Adapt this structure to the existing template rather than reorganising working infrastructure without reason.

```text
src/app/
  core/
    auth/
    configuration/
    guards/
    interceptors/
    models/
    services/
  layouts/
    public-layout/
    auth-layout/
    candidate-layout/
  shared/
    components/
    directives/
    pipes/
    ui/
    validators/
  features/
    landing/
    authentication/
    onboarding/
    dashboard/
    resume-analysis/
      data-access/
      models/
      pages/
      ui/
    job-match/
      data-access/
      models/
      pages/
      ui/
    interviews/
      data-access/
      models/
      pages/
      services/
      ui/
    improvement-plan/
    progress/
    profile/
    settings/
```

Each feature should own its pages, UI components, models, routes, and data-access layer. Keep generic primitives in `shared`; do not move domain-specific components there prematurely.

## 10. Shared UI Components

Prefer adapting existing Modernize components before building replacements.

- Application sidebar
- Top navigation
- Page header and breadcrumbs
- Form field and validation message
- Primary and secondary buttons
- Empty state
- Loading skeleton
- Error state and retry action
- Score card
- Score ring
- Skill tag
- Match indicator
- Resume uploader
- Audio recorder
- Interview question panel
- Transcript panel
- Feedback accordion
- Improvement-plan item
- Progress chart
- Confirmation dialog
- Toast or snack-bar notification

Do not create a wrapper for every Angular Material component. Create shared wrappers only when QabilHire requires consistent styling or repeated behaviour.

## 11. Frontend Engineering Rules

- Use standalone components unless the existing template requires a justified module boundary.
- Use `ChangeDetectionStrategy.OnPush`.
- Enable and maintain strict TypeScript settings.
- Do not use `any`; define interfaces and discriminated unions.
- Use Reactive Forms for all user-input forms.
- Use Signals for local UI state and computed values.
- Use RxJS for HTTP calls, WebSockets, and multi-step asynchronous workflows.
- Use `takeUntilDestroyed()` for manual observable subscriptions.
- Keep API calls out of components.
- Lazy-load major features.
- Use functional route guards and HTTP interceptors.
- Centralise route definitions, navigation items, and permissions.
- Store API URLs and runtime settings in environment configuration.
- Preserve a compatible interface between mock and production data services.
- Include accessible labels, semantic markup, keyboard support, focus management, and adequate contrast.
- Avoid copying template demo code into QabilHire features.
- Remove unused demo pages and dependencies only after confirming they have no references.

## 12. Backend Engineering Rules

- Use a clean feature-oriented or layered structure consistently.
- Keep controllers thin and place business logic in application services.
- Use typed request and response DTOs.
- Validate requests before processing.
- Never accept user ownership identifiers solely from the client; derive them from authenticated claims.
- Apply file-size, extension, MIME-type, and content validation to uploads.
- Store uploaded files outside the public web root or in private object storage.
- Use cancellation tokens for asynchronous operations.
- Use resilient HTTP clients with timeouts and controlled retries for AI APIs.
- Do not blindly retry non-idempotent operations.
- Record AI request status, provider model, latency, and failure category without logging resumes, access tokens, or confidential prompts.
- Use database migrations and seed only safe demo data.
- Generate a typed Angular client from OpenAPI when the API stabilises.

## 13. AI Processing Design

Use one main Qwen text-generation integration for multiple tasks, separated through explicit prompt templates and typed schemas.

Required AI operations:

```text
AnalyseResume
MatchResumeToJob
GenerateInterviewQuestions
GenerateFollowUpQuestion
EvaluateInterviewAnswer
SummariseInterview
GenerateImprovementPlan
CareerCoachChat (post-MVP or limited preview)
```

Every AI operation must request structured JSON and validate the returned schema before saving it. Treat model output as untrusted input. Scores should include explanations and evidence from the supplied resume, job description, question, answer, or rubric.

Suggested evaluation categories:

- Relevance
- Communication clarity
- Structure
- Technical or role-specific accuracy
- Evidence and examples
- Confidence indicators based on language, not personality claims

AI results are coaching guidance, not hiring decisions. Avoid unsupported claims about personality, health, protected characteristics, honesty, or employability.

## 14. Core Data Entities

At minimum, plan for:

```text
User
CandidateProfile
Resume
ResumeAnalysis
JobDescription
JobMatchAnalysis
InterviewSession
InterviewQuestion
InterviewAnswer
InterviewEvaluation
ImprovementPlan
ImprovementPlanItem
```

Store AI provider payloads selectively. Prefer normalised result fields plus a versioned structured result over saving unrestricted prompts containing sensitive candidate data.

## 15. Required UI States

Every major workflow must support:

- Initial or empty state
- Loading state
- Validation error
- API failure with retry
- Successful completion
- Resume-processing state
- AI-processing state
- Microphone permission denied
- Microphone unavailable
- Recording in progress
- Upload failure
- Transcription failure
- Network interruption
- Typed-answer fallback

Do not allow the interview timer or recording state to disappear silently during navigation or network failure.

## 16. Security and Privacy

- Never commit secrets, API keys, connection strings, or production tokens.
- Keep AI calls and file processing on the backend.
- Validate and safely store uploaded resumes.
- Apply authentication and ownership checks to every candidate resource.
- Restrict allowed origins and configure CORS explicitly.
- Apply rate limits to authentication, upload, transcription, and AI endpoints.
- Provide a clear consent notice before recording audio.
- Provide deletion controls for resumes, recordings, transcripts, and interview results.
- Do not use candidate data for model training without explicit consent.
- Do not expose detailed provider errors to end users.

## 17. Testing and Completion Criteria

For each implemented feature:

1. Compare the page with the corresponding Figma node.
2. Verify desktop, tablet, and mobile layouts.
3. Test keyboard navigation and validation.
4. Test loading, error, empty, and success states.
5. Run the relevant unit tests.
6. Run the production Angular build.
7. Report remaining visual or functional differences.

Critical end-to-end scenario:

```text
Register
→ complete profile
→ upload resume
→ receive resume analysis
→ enter job description
→ receive match result
→ configure interview
→ answer five questions
→ receive transcript and feedback
→ view improvement plan
```

Use typed answers and deterministic mock AI responses as a backup demo mode if an external speech or model service becomes unavailable during the hackathon presentation.

## 18. Seven-Day Delivery Plan

| Day | Target |
|---|---|
| 1 | Inspect template, create Git baseline, configure theme, layouts, routes, authentication shell, and shared states |
| 2 | Candidate profile, resume upload, local PDF/DOCX extraction, and resume-analysis API |
| 3 | Resume-analysis UI, extracted-data editor, job-description input, and job-match API/UI |
| 4 | Interview setup, question generation, microphone test, recording UI, and typed fallback |
| 5 | Speech-to-text, answer evaluation, transcript display, question-level feedback, and overall scoring |
| 6 | Improvement plan, dashboard integration, responsive fixes, privacy controls, and demo data |
| 7 | End-to-end QA, bug fixing, deployment, presentation rehearsal, seed account, and backup recording |

## 19. Git and Change-Control Rules

- Create a baseline commit before modifying the Modernize template.
- Keep commits focused by feature or infrastructure concern.
- Do not rewrite or discard existing user changes.
- Review `git diff` before committing.
- Never perform destructive Git operations without explicit approval.
- Run tests and a production build before marking a phase complete.

Suggested baseline commit:

```text
chore: add Modernize Angular template baseline
```

## 20. Instructions for Codex at the Start of Work

When first opening the repository, Codex must:

1. Read this file completely.
2. Inspect `package.json`, `angular.json`, routing, layouts, theme configuration, and existing shared components.
3. Identify the installed Angular, Material, Node, and TypeScript compatibility requirements.
4. Run only safe read-only inspection commands initially.
5. Report existing architecture, reusable components, demo code, risks, and build prerequisites.
6. Propose a route map and phased implementation plan.
7. Wait for approval before making broad structural changes.

Initial Codex prompt:

```text
Read QABILHIRE_CODEX_CONTEXT.md completely and inspect this Angular repository. Do not modify files yet.

Report:
1. Installed Angular, Angular Material, Node, and TypeScript versions
2. Existing template architecture and routing
3. Layouts and components that can be reused
4. Demo pages, assets, and dependencies that can eventually be removed
5. Gaps between the current template and the QabilHire MVP
6. Proposed final route map and feature-folder structure
7. A practical seven-day implementation plan
8. Immediate build or compatibility risks

Wait for my approval after the report.
```

## 21. Definition of MVP Success

The MVP is successful when a candidate can reliably complete the primary demo journey from registration through improvement plan, the interface visibly follows the QabilHire Figma design, AI and speech failures have safe fallbacks, no secret is exposed to the browser or repository, and both the Angular production build and core end-to-end scenario pass before the hackathon demonstration.
