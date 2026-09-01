# QabilHire Development Master Plan

Last updated: 2026-09-01

## 1. Purpose

This document is the single source of truth for QabilHire development. All planning, implementation status, architecture decisions, verification results, blockers, and next tasks must be maintained here.

The previous context and tracker documents remain useful historical references, but development progress must be tracked in this file from now on.

## 2. Product Goal

QabilHire is a role-based hiring and career platform. The MVP supports candidates, recruiters, and administrators. A candidate must be able to complete this journey:

1. Create an account or sign in.
2. Complete a candidate profile.
3. Upload a PDF or DOCX resume.
4. Review and edit extracted resume information.
5. Receive resume feedback.
6. enter a target job description.
7. Review a job-match result and skill gaps.
8. Configure a five-question mock interview.
9. Answer through audio or typed input.
10. Review transcripts, scores, and question feedback.
11. Receive a seven-day improvement plan.
12. Track recent activity and progress.

Recruiters can publish jobs, manage applicants and pipelines, and record interview activity. Administrators can manage users, roles, jobs, platform activity, reports, configuration visibility, AI telemetry, and audit history.

## 3. Delivery Strategy

Development is divided into two major stages.

### Stage A: complete the product without AI

Build and verify the entire candidate journey with deterministic local logic, mock results, and typed-answer fallbacks. Every page, API contract, database entity, authorization rule, and state transition must work before external AI services are introduced.

### Stage B: integrate AI and speech services

Replace the relevant deterministic implementations behind stable service interfaces with Qwen and Alibaba speech services. Qwen resume extraction, resume analysis, and job matching were introduced early by owner decision on 2026-08-27. These workflows now return explicit provider errors and do not use local AI-result fallbacks. Speech and AI interview work remain later phases.

## 4. Repositories and Technology

| Area           | Location                   | Technology                                                            |
| -------------- | -------------------------- | --------------------------------------------------------------------- |
| Frontend       | `/QabilHireUI`             | Angular 20, TypeScript 5.8, Angular Material, Signals, RxJS           |
| Backend        | `/QabilHireAPI`            | ASP.NET Core 10, C#, Identity, JWT, Entity Framework Core             |
| Database       | PostgreSQL                 | Current implementation uses Npgsql and Supabase-compatible PostgreSQL |
| API deployment | Railway                    | Docker-based deployment                                               |
| UI deployment  | Vercel                     | Angular production build                                              |
| AI provider    | Alibaba Cloud Model Studio | Qwen through the Singapore OpenAI-compatible endpoint                 |

The UI and API are separate Git repositories. This master plan lives at the shared workspace root.

## 5. Current Implementation Baseline

### Completed frontend work

- [x] Angular repository initialized.
- [x] Imported template audited and demo content removed.
- [x] Landing page implemented.
- [x] Features page implemented.
- [x] How It Works page implemented.
- [x] Candidate Benefits page implemented.
- [x] Responsible AI page implemented.
- [x] Login page implemented.
- [x] Registration page implemented.
- [x] Forgot-password UI implemented.
- [x] Reset-password UI implemented.
- [x] Login and registration connected to the live API.
- [x] Access token stored for the browser session.
- [x] Toast notifications implemented.
- [x] Angular production build verified on 2026-08-19.
- [x] Candidate dashboard, interview flow, improvement plan, progress, settings, privacy, job marketplace, and AI career coach implemented.
- [x] Recruiter portal implemented: dashboard, job management, applicants, pipeline, interviews, and settings.
- [x] Admin portal implemented: dashboard, users, roles, job moderation, activity, reports, system health, and settings.
- [x] Admin dashboard uses Material icons and operational summaries; the Material Icons font is loaded globally.

### Completed backend work

- [x] Layered ASP.NET Core solution initialized.
- [x] PostgreSQL and Entity Framework Core configured.
- [x] Initial Identity migration added.
- [x] ASP.NET Core Identity configured.
- [x] Registration endpoint implemented.
- [x] Login endpoint implemented.
- [x] JWT generation implemented.
- [x] `Candidate` role seeded.
- [x] New registrations assigned the `Candidate` role.
- [x] Demo candidate accounts seeded in development.
- [x] CORS configured for local and deployed UI origins.
- [x] Swagger/OpenAPI enabled in development.
- [x] Health endpoint implemented.
- [x] Docker and Railway deployment configuration added.
- [x] Candidate, Recruiter, and Admin roles seeded; public registration remains Candidate-only.
- [x] Marketplace, recruiter, admin, AI telemetry, and admin audit endpoints implemented.
- [x] `AddRecruiterPortal` and `AddTelemetryAndAdminAudit` migrations created; telemetry/audit migration applied to the local database.

### Known baseline gaps

- [x] Authentication state is restored from a valid browser session after refresh.
- [x] Bearer-token HTTP interceptor exists.
- [x] Functional authentication and guest guards exist; protected candidate routes will use them when those routes are added.
- [x] Registration redirects to profile onboarding and login redirects to the candidate dashboard.
- [x] Forgot/reset-password pages are connected to backend endpoints.
- [x] Rotating refresh tokens and server-side revocation are implemented.
- [x] Candidate roles are included in the frontend auth response model.
- [ ] Automated authentication integration tests are deferred by the project owner; broader MVP tests remain planned for hardening.
- [x] Public, authentication, and role-aware application layouts are separated.
- [x] Major feature routes are lazy-loaded.
- [x] Candidate profile, resume management/analysis, and manual job-match workflows are implemented.
- [x] Interviews, results, improvement plans, progress, account settings, and privacy/data deletion workflows are implemented.
- [ ] Automated integration, unit, and end-to-end coverage remains pending by owner decision.
- [ ] Deployed Railway/Vercel smoke testing and migration verification remain pending.

## 6. Immediate Security Blocker

Database, JWT, SMTP, storage-provider, and AI credentials have appeared in tracked configuration or chat. Before production release or repository sharing:

- [ ] Rotate the exposed database password.
- [ ] Remove the real connection string from tracked `appsettings.json`.
- [ ] Replace tracked secrets with safe placeholders.
- [ ] Configure local values through .NET User Secrets or an ignored development settings file.
- [ ] Configure production values through Railway environment variables.
- [ ] Confirm Vercel contains no provider or backend secrets.
- [ ] Review Git history and remove exposed credentials before publishing or sharing the repository.
- [ ] Rotate the exposed SMTP, Supabase service-role, Groq, and Alibaba Model Studio credentials.
- [ ] Record completion in the decision log.

Feature development must not continue using a credential that has already been committed.

## 7. Target Architecture

### Frontend structure

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
    validators/
    ui/
  features/
    landing/
    auth/
    onboarding/
    dashboard/
    profile/
    resume/
    job-match/
    interviews/
    improvement-plan/
    progress/
    settings/
```

Major features must use lazy-loaded route files. Components remain standalone and use `ChangeDetectionStrategy.OnPush`. Forms use Reactive Forms. Signals manage local state, while RxJS manages HTTP and asynchronous workflows.

### Backend structure

```text
QabilHire.Domain/
  Entities and domain rules

QabilHire.Application/
  Feature contracts, commands, queries, validation, and interfaces

QabilHire.Infrastructure/
  EF Core, Identity, file storage, extraction, and external providers

QabilHire.Api/
  Controllers, authentication, middleware, configuration, and composition
```

Controllers must remain thin. Business workflows belong in application services. Ownership comes from authenticated claims, never from a client-supplied user ID.

## 8. Target Routes

### Public and authentication routes

```text
/
/features
/how-it-works
/benefits
/responsible-ai
/auth/login
/auth/register
/auth/forgot-password
/auth/reset-password
```

### Protected candidate routes

```text
/onboarding/profile
/app/dashboard
/app/profile
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
/app/settings
/app/privacy
```

### Protected recruiter routes

```text
/app/recruiter
/app/recruiter/jobs
/app/recruiter/jobs/new
/app/recruiter/jobs/:id/edit
/app/recruiter/applicants
/app/recruiter/applicants/:id
/app/recruiter/pipeline
/app/recruiter/interviews
/app/recruiter/settings
```

### Protected administrator routes

```text
/app/admin/dashboard
/app/admin/users
/app/admin/roles
/app/admin/jobs
/app/admin/activity
/app/admin/health
/app/admin/reports
/app/admin/settings
```

## 9. Core Data Model

| Entity                | Purpose                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `ApplicationUser`     | Identity account and authentication details                                                        |
| `CandidateProfile`    | Candidate headline, contact details, location, experience, education summary, and onboarding state |
| `Resume`              | Uploaded file metadata, safe storage reference, extracted text, and processing state               |
| `ResumeAnalysis`      | Structured resume feedback and scoring                                                             |
| `JobDescription`      | Candidate-owned target job information and description                                             |
| `JobMatchAnalysis`    | Match score, matched skills, missing skills, strengths, and recommendations                        |
| `InterviewSession`    | Configuration, status, timing, and overall result                                                  |
| `InterviewQuestion`   | Ordered interview question and optional competency                                                 |
| `InterviewAnswer`     | Typed answer, audio reference, transcript, and submission state                                    |
| `InterviewEvaluation` | Per-question scores and feedback                                                                   |
| `ImprovementPlan`     | Candidate improvement plan linked to an interview                                                  |
| `ImprovementPlanItem` | Daily task, completion state, and learning objective                                               |
| `JobPosting`          | Recruiter-owned job listing, status, skills, and job details                                       |
| `JobApplication`      | Candidate application to a posting, with pipeline stage                                            |
| `SavedJob`            | Candidate bookmark for a job posting                                                               |
| `RecruiterProfile`    | Recruiter organization and contact settings                                                        |
| `AiProviderRequestLog`| Persistent AI request outcome, latency, provider, and operation telemetry                          |
| `AdminAuditLog`       | Persistent role, lock, job-moderation, and security audit event                                    |

All candidate-owned entities must include a user ownership relationship, creation timestamp, and appropriate update timestamp.

## 10. Non-AI Development Roadmap

### Phase 0: security and tracker alignment

Status: **Deferred by project owner on 2026-08-19**

- [ ] Rotate and remove committed secrets.
- [ ] Add safe configuration templates and documentation.
- [ ] Confirm both repositories have clean working trees.
- [ ] Update deployment environment variables.
- [ ] Verify deployed API health after secret rotation.
- [ ] Record PostgreSQL as the selected MVP database.

Exit criteria:

- No real secret exists in tracked files or current shared Git history.
- Local and production applications receive secrets from secure configuration.
- UI production build and API build pass.

### Phase 1: production-ready authentication

Status: **In progress**

Backend tasks:

- [x] Add strongly validated authentication request models.
- [ ] Normalize emails consistently.
- [x] Add cancellation tokens to authentication actions.
- [x] Include roles in the authentication response.
- [ ] Include profile-completion status after the profile entity exists.
- [x] Add a current-user endpoint: `GET /api/auth/me`.
- [x] Implement secure refresh-token rotation.
- [x] Implement logout/revocation.
- [x] Implement forgot-password and reset-password endpoints.
- [x] Add configurable SMTP delivery for welcome, password-reset, and password-changed emails.
- [x] Add an `Email:Enabled` feature flag and keep SMTP credentials in deployment variables.
- [ ] Verify welcome and password-recovery delivery from the deployed environment with a verified sender.
- [x] Add authentication rate limiting for registration and login.
- [x] Extend authentication rate limiting to forgot-password and reset-password.
- [x] Add centralized exception handling with safe problem responses.
- [ ] Add authentication integration tests. **Deferred by project owner on 2026-08-19.**

Frontend tasks:

- [x] Restore the session safely when the application starts.
- [x] Add a bearer-token interceptor.
- [x] Add an authentication guard.
- [x] Add a guest-only guard.
- [x] Remove locally expired sessions and prevent expired tokens from being sent.
- [x] Implement client-side logout/session clearing.
- [x] Connect forgot/reset-password pages.
- [ ] Redirect new users to `/onboarding/profile`.
- [ ] Redirect returning users to `/app/dashboard`.
- [ ] Add form-level API validation messages.

Exit criteria:

- Register, refresh, login, logout, forgot-password, and reset-password flows work.
- Protected routes reject unauthenticated users.
- Public registration can only create a `Candidate`.
- Automated tests cover successful and unsuccessful authentication cases.

### Phase 2: design system and candidate application shell

Status: **In progress**

- [x] Define QabilHire CSS tokens once.
- [ ] Configure the Angular Material theme.
- [ ] Add Plus Jakarta Sans with safe fallbacks.
- [x] Create the public layout.
- [ ] Create the authentication layout.
- [x] Create the responsive candidate layout.
- [x] Add sidebar navigation and mobile navigation.
- [x] Add candidate header, identity summary, and sign-out behavior.
- [ ] Establish lazy-loaded feature routes.
- [ ] Add page header and breadcrumbs.
- [x] Add a centralized API activity overlay with endpoint-specific messages and concurrent-request tracking.
- [ ] Add reusable content loading skeletons where blocking overlays are not appropriate.
- [ ] Add reusable empty state.
- [ ] Add reusable error and retry state.
- [ ] Add reusable confirmation dialog.
- [ ] Verify keyboard focus and responsive behavior.

Exit criteria:

- Public, authentication, and candidate screens use the correct layouts.
- Candidate navigation works on desktop, tablet, and mobile.
- Loading, empty, error, and success primitives are reusable.

### Phase 3: candidate onboarding and profile

Status: **Implemented; automated tests pending**

Backend tasks:

- [x] Add `CandidateProfile` entity and migration.
- [x] Add `GET /api/profile`.
- [x] Add `PUT /api/profile`.
- [x] Add profile-completion calculation.
- [x] Enforce candidate ownership using JWT claims.
- [ ] Add profile validation and integration tests.

Frontend tasks:

- [x] Build onboarding profile form.
- [x] Build profile view/edit page.
- [x] Add completion state to authentication responses and onboarding routing.
- [x] Prevent accidental loss of unsaved changes.
- [x] Add profile loading, validation, saving, failure, and success behavior.

Exit criteria:

- A newly registered candidate completes onboarding and reaches the dashboard.
- Profile data persists and can only be accessed by its owner.

### Phase 4: dashboard foundation

Status: **Partially implemented — candidate dashboard UI exists; real summary API and activity data pending**

- [ ] Create dashboard summary API contract.
- [ ] Build welcome and profile-completion sections.
- [ ] Add quick actions for resume, job match, and interview setup.
- [ ] Add recent activity with a deterministic empty state.
- [ ] Add placeholder progress summary backed by real stored activity when available.

Exit criteria:

- Dashboard provides the correct next action for new and returning candidates.

### Phase 5: secure resume upload and extraction

Status: **Implemented with Alibaba Qwen; persistence and validation hardening pending**

Backend tasks:

- [x] Add `Resume` entity and migration.
- [x] Implement private Supabase file-storage abstraction.
- [x] Add PDF and DOCX upload endpoint.
- [ ] Complete validation: extension, declared MIME type, and size are checked; file-signature/content verification remains.
- [ ] Generate a fully server-controlled object filename; storage is isolated by user and generated GUID path, but retains the sanitized client filename as the final segment.
- [x] Extract text locally from supported documents.
- [ ] Complete state tracking: uploaded, processing, and completed are persisted; failed-state persistence remains.
- [x] Add resume list, details, and soft-delete endpoints.
- [x] Enforce candidate ownership on implemented resume endpoints.
- [ ] Delete the private storage object when a resume is deleted or purged.
- [ ] Add upload and extraction tests.

Frontend tasks:

- [ ] Complete accessible upload UI: file picker exists; drag-and-drop and accessibility verification remain.
- [x] Show type and size requirements.
- [ ] Complete upload feedback: uploading and extraction states exist; byte-level progress remains.
- [ ] Add explicit failure and retry behavior; errors currently use shared notifications and re-extraction is available in the editor.
- [ ] Add resume deletion confirmation; management currently deletes immediately.
- [x] Add resume management for list, active selection, archive toggle, edit, analysis, and delete.
- [x] Show the candidate's existing resume library on the upload screen with status, score, and review/analysis actions.

Exit criteria:

- A candidate can securely upload, extract, view, and delete PDF/DOCX resumes.
- Invalid and malicious-looking files are rejected safely.

### Phase 6: extracted resume editor and AI analysis

Status: **In progress**

- [x] Define structured resume schema for contact, summary, skills, experience, education, projects, certifications, languages, and additional information.
- [x] Parse extracted text into editable sections using Alibaba Qwen structured extraction.
- [x] Build contact, summary, experience, education, project, and skills editors, plus certification, language, and additional-information editors.
- [x] Save candidate corrections.
- [x] Implement deterministic checks for missing sections, length, contact information, action language, and measurable achievements.
- [ ] Persist a versioned `ResumeAnalysis` result.
- [x] Persist the current score and analysis JSON on the resume record.
- [x] Build score, strengths, issues, and recommendation UI.
- [x] Return an explicit provider error when Alibaba extraction or analysis fails; no local AI-result fallback is used.
- [ ] Validate structured AI output beyond JSON parsing and score range checks.
- [ ] Add editor and analysis API/UI tests.

Exit criteria:

- Resume review and Alibaba Qwen analysis work end-to-end with explicit provider-failure behavior.
- Stored model output passes strict schema, range, collection, and content validation before persistence.

### Phase 7: manual job description and AI matching

Status: **Implemented; validation and integration tests pending**

- [x] Add a candidate-owned persisted `JobMatch` entity containing the submitted job details and analysis result.
- [x] Add job-match create/read/list/delete endpoints.
- [x] Accept manually entered target job title, company, and job description.
- [x] Analyze and score the match with Alibaba Qwen.
- [x] Return matched skills, strengths, gaps, priorities, likely questions, and a recommended next step.
- [x] Build job-description input, history, result, and skill-gap screens.
- [x] Enforce candidate ownership on job-match endpoints.
- [ ] Add strict structured-output validation and API/UI integration tests.

Exit criteria:

- A candidate can compare their saved profile/resume with a manually entered job description.
- The submitted job information and complete match result persist and can be reopened or deleted.

### Phase 8: AI interview setup and question generation

Status: **Implemented; provider and end-to-end tests pending**

- [x] Add interview session and question entities.
- [x] Build the Figma-aligned interview setup page.
- [x] Generate exactly five questions with Alibaba Qwen using the candidate profile, active resume, target role, interview category, and difficulty.
- [x] Require structured question JSON with order, question text, category, competency, difficulty, and evaluation criteria.
- [x] Validate generated questions for count, ordering, uniqueness, requested category/difficulty, field limits, and required content before persistence.
- [x] Return an explicit provider error when question generation fails; do not substitute local questions.
- [x] Persist setup choices, question order, and ready session state.
- [x] Add candidate-owned session list/detail endpoints for resume/recovery.
- [ ] Add provider-failure, malformed-output, ownership, and setup-to-session integration tests.

Exit criteria:

- A candidate can configure and start a persistent five-question interview generated by Alibaba Qwen.
- Invalid or unavailable AI output never creates a partial interview session.

### Phase 9: microphone test and interview room

Status: **Implemented for persisted typed-answer completion; Alibaba speech transcription pending**

- [x] Build the Figma-aligned microphone permission, input-level, and device test.
- [x] Add an in-context recording/privacy notice.
- [x] Handle denied and unavailable microphone states with a text-mode fallback.
- [x] Build the Figma-aligned practice/realistic rooms, fifteen-minute timer, and one-question-at-a-time navigation.
- [x] Add browser audio capture controls; durable audio upload and Alibaba transcription remain Phase 15 work.
- [x] Implement typed-answer fallback for every question.
- [x] Persist every submitted answer and current question so completed progress survives refresh/reconnection.
- [x] Add Figma-aligned preparation and network-interruption states.
- [x] Enforce candidate ownership and active-question-only answer submission.
- [x] Add browser SpeechSynthesis for repeating questions when available.

Exit criteria:

- A candidate can complete all five questions using audio, typed answers, or a mixture.
- Typed answers always work when audio features fail.

### Phase 10: AI evaluation and results

Status: **Implemented; migration application and live Alibaba verification pending**

- [x] Add persistent answer, per-question evaluation, and session-result entities.
- [x] Evaluate completed interviews with Alibaba Qwen using strict evidence-based scoring instructions and validated JSON.
- [x] Store six category scores, overall scores, strengths, improvements, and improved answers.
- [x] Build the Figma-aligned overall results page.
- [x] Build the Figma-aligned expandable question-feedback page.
- [x] Show AI labels, score explanations, improvement suggestions, and a focused four-item roadmap.
- [x] Support loading, unavailable, retry, processing, provider-failure, and success states without fabricated fallback scores.
- [x] Make evaluation idempotent so saved results are reused instead of billed twice.

Exit criteria:

- A completed interview produces a stored, evidence-based Alibaba evaluation and can reopen its results without another model call.

### Phase 11: improvement plan, progress, settings, and privacy

Status: **Pending**

- [ ] Generate a deterministic seven-day improvement plan from stored gaps.
- [ ] Build plan item completion tracking.
- [ ] Build progress summary and activity history.
- [ ] Build account settings.
- [ ] Add resume, recording, transcript, result, and account deletion controls.
- [ ] Add privacy and recording consent information.
- [ ] Verify deletion ownership and cascading behavior.

Exit criteria:

- The complete candidate journey works from registration through improvement tracking.
- Candidate-owned sensitive data can be deleted.

### Phase 12: non-AI MVP hardening

Status: **Pending**

- [ ] Add API integration test project.
- [ ] Add frontend unit tests for core state and forms.
- [ ] Add Playwright critical-path tests.
- [ ] Test desktop, tablet, and mobile layouts.
- [ ] Test keyboard-only use and visible focus.
- [ ] Test network errors and retry flows.
- [ ] Add structured logging without sensitive content.
- [ ] Add API rate limits.
- [ ] Add security headers and explicit CORS verification.
- [ ] Verify database migrations from an empty database.
- [ ] Verify production deployments.
- [ ] Rehearse the complete deterministic demo.

Stage A exit criteria:

- Registration through improvement plan passes end-to-end.
- All major workflows include loading, empty, error, and success states.
- Audio failure never blocks typed interview completion.
- No AI or speech provider is required for the demonstration.
- No secrets or candidate-sensitive values appear in source control or logs.
- API tests, Angular production build, and critical Playwright scenario pass.

## 11. AI and Speech Roadmap

This work starts only after Stage A is complete.

### Phase 13: AI provider foundation

- [ ] Define provider-neutral AI interfaces.
- [x] Configure Qwen only from the backend through Alibaba Model Studio's Singapore endpoint.
- [x] Add typed HTTP clients, five-minute timeouts, SSE streaming, and cancellation handling.
- [ ] Add versioned prompt templates.
- [x] Require structured JSON responses.
- [ ] Validate all model output as untrusted input.
- [ ] Record model, latency, status, and failure category without sensitive prompt content.
- [x] Return explicit API errors on provider failure; local AI-result fallback was removed by owner decision.

### Phase 14: AI resume and job-match services

- [x] Implement Qwen resume analysis.
- [x] Implement Qwen structured resume extraction.
- [x] Implement Qwen job matching for manually entered jobs.
- [ ] Compare AI outputs against deterministic results.
- [ ] Add safe fallback and retry UI states.

### Phase 15: AI interview and speech services

- [ ] Refine and quality-test the Qwen interview-question generation introduced in Phase 8.
- [x] Integrate Alibaba `qwen3-asr-flash` for short interview-answer transcription using temporary private Supabase storage and immediate cleanup.
- [x] Allow transcript review and correction before evaluation (the interview room places the transcript in an editable answer textarea before submit).
- [ ] Evaluate answers with structured rubrics.
- [ ] Generate overall interview summary.
- [ ] Generate the seven-day improvement plan.
- [ ] Keep typed answers and deterministic results available during provider outages.

### Phase 16: AI quality and safety verification

- [ ] Test malformed model responses.
- [ ] Test timeouts, rate limits, and provider downtime.
- [ ] Test prompt-injection content inside resumes and job descriptions.
- [ ] Ensure feedback avoids protected-characteristic and personality claims.
- [ ] Verify users understand that results are coaching guidance, not hiring decisions.
- [ ] Rehearse the live AI demo and deterministic backup demo.

## 12. API Standards

- Use `/api` as the route prefix.
- Use typed request and response contracts.
- Return RFC-compatible problem details for failures.
- Validate at the API boundary and again where domain rules require it.
- Accept cancellation tokens for asynchronous work.
- Use UTC timestamps.
- Use authenticated claims for ownership.
- Paginate collections that may grow.
- Never return storage paths, provider errors, password details, or secrets.
- Document stable endpoints through OpenAPI.
- Generate or maintain a typed Angular client after contracts stabilize.

## 13. UI Standards

- Use Angular standalone components.
- Use `ChangeDetectionStrategy.OnPush`.
- Maintain strict TypeScript and avoid `any`.
- Use Reactive Forms for user input.
- Use Signals for local and derived state.
- Keep HTTP access in data-access services, not page components.
- Lazy-load major features.
- Use semantic HTML, accessible names, keyboard operation, and visible focus.
- Support desktop, tablet, and mobile.
- Centralize QabilHire colors and spacing through design tokens.
- Do not scatter hard-coded theme colors across components.

## 14. Required States for Every Workflow

Each major feature must explicitly support all relevant states:

- [ ] Initial/empty
- [ ] Loading
- [ ] Validation error
- [ ] API failure
- [ ] Retry
- [ ] Success
- [ ] Unauthorized/session expired
- [ ] Network interruption
- [ ] Processing
- [ ] Deletion confirmation

Resume workflows must additionally support invalid file, upload progress, extraction failure, and deletion. Interview workflows must additionally support permission denied, unavailable microphone, recording, transcription failure, and typed fallback.

## 15. Definition of Done

A task may be marked complete only when:

1. Implementation is complete and reviewed against its acceptance criteria.
2. Authentication and ownership rules are applied where relevant.
3. Loading, error, empty, and success states are implemented where relevant.
4. Keyboard and responsive behavior have been checked.
5. Relevant automated tests pass.
6. The API or Angular production build passes.
7. No secrets or sensitive candidate data were added to source or logs.
8. This master plan is updated with the result.

## 16. Verification Commands

Frontend:

```powershell
cd D:\Projects\QabilHire\QabilHireUI
npm test
npm run build
```

Backend:

```powershell
cd D:\Projects\QabilHire\QabilHireAPI
dotnet test QabilHire.slnx
dotnet build QabilHire.slnx
```

Stop the locally running API before rebuilding when its output DLLs are locked.

## 17. Out of Scope Until After the MVP

- Recruiter portal
- Administrator portal and role-management UI
- Public job marketplace
- Application tracking
- Payments and subscriptions
- Realtime conversational voice interview
- Advanced attempt comparison
- Advanced analytics
- Long-term career-coach memory
- Email and notification automation
- Full implementation of every available Figma screen

## 18. Risks and Mitigations

| Risk                                             | Mitigation                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| External AI or speech provider fails during demo | Maintain deterministic and typed-answer fallbacks                        |
| Sensitive resume/audio data leaks                | Private storage, ownership checks, deletion controls, and safe logging   |
| Scope becomes too broad                          | Candidate-only MVP and phase exit criteria                               |
| UI is built before API contracts stabilize       | Use typed feature data services and stable mock/real interfaces          |
| Model returns invalid or unsafe output           | Structured schemas, validation, safety rules, and deterministic fallback |
| Running API locks build outputs                  | Stop the local API before build verification                             |
| Tracker becomes outdated                         | Update this document in the same task that changes implementation status |

## 19. Decision Log

| Date       | Decision                                                               | Reason                                                                                                                                                                                                 |
| ---------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-08-18 | Maintain separate UI and API repositories.                             | Independent deployment and history.                                                                                                                                                                    |
| 2026-08-18 | Preserve only useful Modernize template infrastructure.                | Avoid carrying unrelated demo product code.                                                                                                                                                            |
| 2026-08-18 | Build non-AI workflows before integrations.                            | Produce a stable, testable candidate journey first.                                                                                                                                                    |
| 2026-08-19 | Use PostgreSQL for the current MVP implementation.                     | The API is already implemented with EF Core Npgsql and deployed against PostgreSQL.                                                                                                                    |
| 2026-08-19 | Assign `Candidate` during public registration.                         | Public registration must never allow privilege selection.                                                                                                                                              |
| 2026-08-19 | Use this file as the single development tracker.                       | Keep scope, status, decisions, and verification in one maintained document.                                                                                                                            |
| 2026-08-19 | Use one rotating refresh session per candidate for the MVP.            | Keeps revocation simple by using Identity's existing user-token store without a new token table. A new login invalidates the previous refresh session.                                                 |
| 2026-08-27 | Replace direct Groq calls with Alibaba Model Studio and `qwen3.8-max`. | Use the selected Alibaba workspace and strongest available Qwen model for structured resume and job-match tasks.                                                                                       |
| 2026-08-27 | Keep job entry manual for the MVP.                                     | Live job discovery needs a reliable job API or enabled web search; manual descriptions are simpler and verifiable.                                                                                     |
| 2026-08-27 | Do not use local AI-result fallbacks.                                  | Provider failures must be visible to the user through explicit API errors.                                                                                                                             |
| 2026-08-27 | Use temporary interview-audio storage only.                            | Audio is needed for transcription but permanent retention adds privacy, consent, deletion, and storage risk. Store transcripts and evaluations; delete audio after successful transcription or expiry. |

## 20. Active Work Queue

Only one item should normally be marked **In progress**.

| Priority | Work item | Status | Verification |
| -------- | --------- | ------ | ------------ |
| P0 | Rotate and remove all exposed credentials | Deferred by owner | Repository/history scan, deployment configuration review, deployed health check |
| P1 | Apply all outstanding migrations to Railway PostgreSQL | Pending | `dotnet ef database update` against the deployed connection and endpoint smoke test |
| P2 | Verify deployed candidate, recruiter, and admin role journeys | Pending | Manual role-based smoke test across desktop and mobile |
| P3 | Verify live Alibaba AI and temporary audio storage | Pending | Resume, match, interview, evaluation, career-coach, and transcription flows |
| P4 | Add automated API, Angular, and Playwright critical-path tests | Pending | CI test execution |
| P5 | Accessibility and responsive hardening | Pending | Keyboard/focus and desktop/tablet/mobile manual passes |
| P6 | Admin telemetry and audit reporting | Implemented locally | Local migration applied; dashboard and activity endpoints verified by build |

## 21. Progress Update Template

Add a dated entry after each meaningful completed task.

```text
### YYYY-MM-DD — Task name

Status: Complete / Blocked

Implemented:
- ...

Verified:
- Command or manual check and result

Remaining:
- ...

Decisions or blockers:
- ...
```

## 22. Progress History

### 2026-08-20 — Resume library, global API activity, and authentication email delivery

Status: Complete locally; deployment configuration pending

Implemented:

- Added a responsive resume library to the upload screen with filename, size, upload date, active/archive state, score, and review/analysis actions.
- Replaced feature-specific loading overlays with centralized tracking for every request made through the shared Angular API service.
- Added endpoint-aware loading messages for authentication, password recovery, profile, upload, extraction, analysis, archive, activation, and deletion operations.
- Generalized email delivery into one SMTP service for welcome, password-reset, and password-changed messages.
- Added branded HTML email templates, a verified-sender configuration, and an `Email:Enabled` feature flag.
- Kept the SMTP password out of committed configuration; production reads it from `Email__Smtp__Password`.

Verified:

- Angular production build completed successfully after the centralized loader and resume-library changes.
- API Release build completed successfully with zero warnings and zero errors after the authentication-email integration.

Remaining:

- Configure the rotated SMTP credential and enable email in Railway service variables.
- Verify the sender and end-to-end welcome, forgot-password, and password-changed messages in the deployed environment.
- Railway Free, Trial, and Hobby plans block outbound SMTP; use a Pro plan or replace SMTP with Brevo's HTTPS transactional-email API.

### 2026-08-20 — Resume upload, extraction, editing, analysis, and management scan

Status: In progress

Implemented:

- Added the persisted `Resume` model and migrations, private Supabase storage integration, authenticated PDF/DOCX upload, local text extraction, structured extraction, and rule-based analysis.
- Added optional Groq structured extraction and analysis with local deterministic fallbacks when the provider is unavailable or not configured.
- Added ownership-scoped list, detail, extracted-data update, metadata update, active selection, archive toggle, and soft-delete endpoints.
- Added Angular upload, extracted-data review/edit, analysis-result, and resume-management screens and routes.
- Updated Phases 5 and 6 and the execution queue to match the implementation found in the UI and API repositories.

Verified:

- Inspected the resume routes, Angular service/models/components, API controllers, extraction and analysis services, storage contract, entity, and migrations.
- Confirmed that the UI targets the deployed API base URL and that resume operations use authenticated `/api/resumes` endpoints.

Remaining:

- Add file-signature/content validation, persistent extraction failure state, physical storage cleanup, upload progress, explicit retry UX, and delete confirmation.
- Add automated upload, extraction, ownership, editor, analysis, deletion, and provider-fallback tests.
- Introduce versioned analysis persistence, stronger structured AI-output validation, and clear UI labeling of AI versus deterministic feedback.

Decisions or blockers:

- The current optional AI integration uses Groq, while the planned production provider remains Qwen; provider-neutral interfaces and the Phase 13 foundation are still required before treating Phase 14 as complete.

### 2026-08-19 — Registration default role

Status: Complete

Implemented:

- Public registration assigns the fixed `Candidate` role.
- Failed role assignment removes the newly created user and returns validation details.
- JWT generation reads assigned roles after registration.

Verified:

- Source flow inspected.
- The API build reached the API output-copy stage; final output was blocked because the running API process had locked its DLLs.

Remaining:

- Add registration integration tests.
- Add role-aware navigation when the candidate application shell is implemented.

### 2026-08-19 — Frontend production build

Status: Complete

Verified:

- `npm run build` completed successfully.
- Output generated under `QabilHireUI/dist/qabilhire-ui`.

### 2026-08-19 — Authentication lifecycle foundation

Status: In progress

Implemented:

- Added validation annotations to registration and login contracts.
- Added roles to authentication user responses.
- Added authenticated `GET /api/auth/me` endpoint.
- Added frontend session restoration with expiry validation.
- Added bearer-token HTTP interceptor.
- Added functional authentication and guest guards.
- Added client-side logout/session clearing behavior.

Verified:

- API build completed with zero warnings and zero errors using an alternate output directory because the locally running API locked the normal output.
- Frontend TypeScript check completed successfully.
- Angular production build completed successfully.

Remaining:

- Configure SMTP host and credentials in the deployment environment and verify delivery.
- Automated authentication tests are deferred by the project owner.
- Onboarding/dashboard redirects after their Figma designs are supplied and pages are implemented.

### 2026-08-19 — Safe structured API request logging

Status: Complete

Implemented:

- Added request logging middleware for HTTP method, path, response status, elapsed time, and trace ID.
- Logging intentionally excludes request/response bodies, authorization headers, query strings, passwords, tokens, resumes, and other candidate content.

Verified:

- API build completed successfully with zero warnings and zero errors.

### 2026-08-19 — Centralized API exception handling

Status: Complete

Implemented:

- Added a global ASP.NET Core exception handler.
- Unexpected exceptions return a consistent HTTP 500 `ProblemDetails` response.
- Client responses contain a trace ID for support correlation.
- Stack traces, exception messages, provider details, and sensitive internal information are not returned to clients.

Verified:

- API build completed successfully with zero warnings and zero errors.

### 2026-08-19 — Authentication rate limiting

Status: Complete for current authentication endpoints

Implemented:

- Added configurable, IP-partitioned fixed-window policies for login and registration.
- Login permits 10 attempts per minute by default.
- Registration permits 5 attempts per 5 minutes by default.
- Rejected requests return HTTP 429 `ProblemDetails` with a trace ID.
- Rate-limit responses do not expose account existence or internal details.

Verified:

- API build completed successfully with zero warnings and zero errors.

Remaining:

- Apply dedicated policies to forgot-password and reset-password when those endpoints are implemented.

### 2026-08-19 — Refresh-token rotation and logout

Status: Complete

Implemented:

- Added cryptographically random refresh tokens stored only as SHA-256 hashes through ASP.NET Identity's user-token store.
- Added secure HttpOnly refresh cookies scoped to `/api/auth`.
- Added refresh-token expiration and rotation.
- Added `POST /api/auth/refresh` and `POST /api/auth/logout`.
- Added server-side revocation and browser cookie deletion.
- Added a dedicated rate-limit policy for session endpoints.
- Added Angular credential handling and one refresh/retry attempt after unauthorized API responses.
- Added local-session clearing when refresh fails.

Verified:

- API build completed successfully with zero warnings and zero errors.
- Frontend TypeScript check completed successfully.
- Angular production build completed successfully.

Behavior note:

- The MVP supports one active refresh session per user. Signing in on another browser invalidates the earlier browser's refresh token.

### 2026-08-19 — Password recovery

Status: Implemented; SMTP deployment configuration pending

Implemented:

- Added validated forgot-password and reset-password API contracts.
- Added non-enumerating forgot-password responses.
- Added ASP.NET Identity password-reset token generation and validation.
- Added an SMTP email abstraction and reset-link delivery implementation.
- Added dedicated password-recovery rate limiting.
- Revokes the user's refresh session after a successful password reset.
- Connected the Angular forgot-password and reset-password forms to the API.
- Added invalid/incomplete-link, password-match, submitting, success, and failure behavior.

Verified:

- API build completed successfully with zero warnings and zero errors.
- Frontend TypeScript check completed successfully.
- Angular production build completed successfully.

Remaining:

- Configure `Email__Smtp__Host`, SMTP credentials, `Email__FromAddress`, and `Frontend__BaseUrl` in Railway.
- Verify delivery using the selected SMTP provider.

### 2026-08-19 — Figma-based candidate shell and supplied screens

Status: In progress

Implemented:

- Added separate public and protected candidate layouts.
- Added the Figma-based desktop sidebar, header, candidate identity area, CTA, responsive drawer behavior, and sign-out action.
- Added protected onboarding and candidate route trees.
- Registration now enters profile onboarding; login enters the candidate dashboard.
- Implemented the supplied Profile Setup — Basics screen.
- Implemented the supplied Profile Setup — Career Goals screen.
- Added session-backed onboarding draft state between supplied steps.
- Implemented the supplied Candidate Dashboard with deterministic placeholder metrics and recommendations.
- Preserved public and authentication pages under the public layout.

Verified:

- Frontend TypeScript check completed successfully.
- Angular production build completed successfully.

Remaining:

- Figma MCP context was unavailable because the connected Starter account reached its tool-call limit; implementation used the three user-exported PNG references.
- Profile setup steps 2, 3, and 5 were not present in Figma; they were subsequently created using the established visual system with project-owner approval.
- Candidate profile API persistence is still pending; onboarding currently persists only in session storage.
- Dashboard values are deterministic placeholders until dashboard/profile feature APIs exist.
- Dedicated auth layout, Material theme refinement, lazy-loaded feature routes, and browser visual QA remain pending.

### 2026-08-19 — Complete five-step onboarding UI

Status: Complete for session-backed UI

Implemented:

- Added Step 2 for professional experience, responsibilities, and a measurable achievement.
- Added Step 3 for institution, qualification, LinkedIn, and portfolio/GitHub links.
- Updated Step 4 with backward navigation and review routing.
- Added Step 5 to review and confirm the complete profile.
- Added backward navigation and session-backed draft preservation across all five steps.
- Matched the spacing, cards, controls, progress indicators, colors, and responsive behavior of the supplied Figma exports.

Verified:

- Frontend TypeScript check completed successfully.
- Angular production build completed successfully.

Remaining:

- Add the separate `/app/profile` management page; onboarding persistence now uses the profile API while session storage remains a navigation/network resilience draft.

### 2026-08-19 — Candidate profile API persistence

Status: Complete for onboarding

Implemented:

- Added the candidate-owned `CandidateProfile` domain entity.
- Added EF Core configuration and the `AddCandidateProfile` PostgreSQL migration.
- Added authenticated Candidate-only `GET /api/profile` and `PUT /api/profile` endpoints.
- Derives ownership exclusively from authenticated Identity claims.
- Added server-side normalization, list deduplication, field limits, completion state, and timestamps.
- Added profile-completion state to authentication responses.
- Returning users with incomplete profiles are routed to onboarding after login.
- Existing profiles load into onboarding; completing Step 5 persists the full profile through the API.
- Session storage remains only as a draft fallback between onboarding steps.

Verified:

- Release API build completed with zero warnings and zero errors.
- EF Core generated the migration and updated the model snapshot successfully.
- Frontend TypeScript check completed successfully.
- Angular production build completed successfully.

Remaining:

- Dashboard/profile foundation is complete; proceed to the next non-AI workflow after final shell refinements.
- Apply the migration in the target deployment through the existing startup migration flow.

### 2026-08-19 — Candidate profile management page

Status: Complete

Implemented:

- Added protected `/app/profile` route.
- Added a unified profile editor covering basics, experience, education, professional links, career direction, interview preferences, and goals.
- Loads the candidate-owned profile from `GET /api/profile`.
- Saves edits through `PUT /api/profile`.
- Added loading, validation, saving, success, and API failure behavior.
- Updated candidate sidebar navigation to open the profile-management page.
- Added responsive section and sticky save-action layouts matching the candidate visual system.

Verified:

- Frontend TypeScript check completed successfully.
- Angular production build completed successfully.

### 2026-08-19 — Unsaved profile changes guard

Status: Complete

Implemented:

- Added a reusable functional `CanDeactivate` guard for editable forms.
- Applied it to onboarding Steps 1–4 and `/app/profile`.
- Tracks ordinary fields and interview-preference changes.
- Normal Back/Continue actions persist the session draft and navigate without an unnecessary prompt.
- Successful profile saves reset the dirty state.

Verified:

- Frontend TypeScript check completed successfully.
- Angular production build completed successfully.

### 2026-08-19 — Local PostgreSQL development configuration

Status: Complete

Implemented:

- Replaced the tracked live Supabase connection string with a localhost PostgreSQL connection.
- Local defaults use database `qabilhire`, username `postgres`, and password `postgres` on port `5432`.
- The live connection string was removed rather than commented because JSON does not support comments and committed production credentials are unsafe.
- Railway must supply `ConnectionStrings__DefaultConnection` through its environment configuration.

Verified:

- API configuration JSON parses successfully.

### 2026-08-19 — Daily API file logging

Status: Complete

Implemented:

- Added a daily UTF-8 file logging provider while retaining console and Visual Studio logging.
- Logs are written under `QabilHire.Api/logs` using names such as `qabilhire-20260819.log`.
- Entries contain UTC timestamp, level, category, message, and exception details when present.
- Existing request logging adds HTTP method, path, status, duration, and trace ID to these files.
- The logs directory and `*.log` files remain excluded by the API `.gitignore`.

Verified:

- API build completed successfully with zero warnings and zero errors.
- API configuration JSON parses successfully.

### 2026-08-19 — ASP.NET Core 10 record validation fix

Status: Complete

Implemented:

- Corrected Data Annotations on authentication and profile request records so validation metadata targets primary-constructor parameters.
- Removed explicit `property:` targets that ASP.NET Core 10 rejects during model validation.
- Fixes the registration HTTP 500 identified by trace ID `40000009-000b-fe00-b63f-84710c7967bb`.
- Applied the correction to every affected request contract to prevent the same failure on login, password recovery, and profile updates.

Verified:

- Release API build completed successfully with zero warnings and zero errors.

### 2026-08-19 — New-user profile request cleanup

Status: Complete

Implemented:

- Onboarding no longer requests `GET /api/profile` when authentication state indicates the new candidate has not completed a profile.
- Onboarding is now strictly draft-based and never loads the saved profile; completed candidates edit persisted data through `/app/profile`.
- Removes the expected but noisy browser-console 404 for newly registered candidates.

Verified:

- Frontend TypeScript check completed successfully.

### 2026-08-19 — Supplied onboarding and profile-management Figma screens

Status: Complete

Implemented:

- Replaced the invented onboarding Step 2 with the supplied Education & Experience screen.
- Added degree, institution, graduation year, company, role, duration, and key-achievement fields.
- Replaced the invented onboarding Step 3 with the supplied Skills & Expertise screen.
- Added skill search, selectable skill chips, proficiency levels, and resume-suggestion choices.
- Replaced `/app/profile` with the supplied preparation-profile management hub.
- Preserved the full profile editor at `/app/profile/edit` behind Manage actions.
- Added graduation year, experience duration, and skill proficiency to the persisted profile model.
- Generated the `AddProfileEducationAndSkillDetails` database migration.

Verified:

- Release API build completed successfully with zero warnings and zero errors.
- Frontend TypeScript check completed successfully.
- Angular production build completed successfully.

### 2026-08-19 — Local development Git exclusions

Status: Complete

Implemented:

- Expanded API ignore rules for local IDE state, alternate build output, logs, test results, coverage, local settings, and operating-system files.
- Expanded UI ignore rules for local IDE state, package-manager caches, local environment files, logs, temporary files, test reports, screenshots, and generated build output.
- Preserved `.env.example` files so safe configuration templates can still be committed.

Verified:

- Reviewed both repository statuses with ignored files displayed.
- Existing source changes remain visible to Git while generated and machine-local files remain ignored.

### 2026-08-19 — Focused profile-management destinations

Status: Complete

Implemented:

- Replaced the temporary shared `/app/profile/edit` destinations with focused Personal Information, Career Preferences, Skills & Experience, and Interview Preferences screens.
- Each editable screen loads the candidate profile, updates only its relevant controls, persists through the existing profile API, and warns before discarding unsaved changes.
- Added dedicated routes for Resume Management, Password & Security, and Privacy & Data.
- These three future backend-dependent areas now show explicit planned-feature states instead of redirecting to unrelated or nonexistent pages.
- Updated every Manage action on the profile hub to open its correct destination.

Verified:

- Angular production build completed successfully.

## 2026-08-21 â€” UX feedback, form rules, and upload flow hardening

Status: In progress

Implemented:

- Standardized profile and onboarding forms on Angular Material controls and explicit select option values.
- Added required-field summaries, inline errors, required markers, and spacing so validation messages do not overlap fields.
- Replaced browser confirmation alerts with an Angular Material unsaved-changes dialog.
- Standardized skill-catalog search, selected pills, expand/collapse actions, and action-row placement.
- Added Terms of Use and Privacy Policy dialogs on registration.
- Added resume upload success feedback, file-size fallback from `File.size`, and in-place resume removal.
- Corrected profile-section header alignment and back-arrow sizing.

Rules for future implementation:

1. Use Angular Material for buttons, fields, selects, checkboxes, dialogs, and progress controls; do not use browser alerts for confirmations.
2. Consent checkboxes must be independently clickable; legal text and links must not toggle them.
3. Required fields need explicit validators, required markers, inline errors, and a page-level summary after submit.
4. Selects must use explicit `[value]` bindings matching persisted API strings exactly.
5. Preserve drafts while navigating; prompt only when dirty and clear dirty state after successful save.
6. Catalog search, pills, expand/collapse, and save/navigation controls must remain separated and responsive.
7. Successful mutations must show feedback and update visible UI without refresh; destructive actions must be labeled clearly.
8. Resume size uses uploaded `File.size` when API data is missing/zero, while API persistence is still verified.
9. AI extraction prompts must be format-agnostic, preserve all sections and meaning, validate structured JSON, and provide deterministic fallback.

Next plan:

1. Run a manual pass for registration, onboarding, profile sections, resume upload/removal, and unsaved navigation.
2. Verify desktop/mobile layouts for headers, catalogs, validation spacing, and Material dialogs.
3. Confirm resume size persistence and profile value round-tripping through the running application.
4. Continue dashboard, interview, results, and improvement-plan implementation.

## 2026-08-21 - Job Match implementation update

Status: Implemented

Completed:

- Added persisted Job Match entity, API contracts, ownership-filtered CRUD endpoints, the original Groq analysis service, migration, designer, and model snapshot metadata. The provider was replaced with Alibaba Qwen on 2026-08-27.
- Added Job Match input, results, and history screens based on the supplied Figma screens.
- Added strong/developing/limited match presentation, score breakdowns, matched skills, strengths, gaps, priorities, likely questions, and recommended next step.
- Added history search, match-level filter, minimum-score filter, clear filters, and detail navigation.
- Added routes for `/app/job-match`, `/app/job-match/history`, and `/app/job-match/:id`.

Next manual work:

- Verify the migration applies cleanly in PostgreSQL.
- Verify Alibaba Qwen success, timeout, malformed-output, and failure states.
- Walk through creating, reopening, filtering, and deleting persisted job matches.
- Continue dashboard, interview, results, and improvement-plan features.

### 2026-08-27 — Alibaba Qwen migration and next-feature alignment

Status: Complete for current resume and job-match AI integration

Implemented:

- Replaced the Groq endpoint and model configuration with Alibaba Model Studio's Singapore OpenAI-compatible endpoint and `qwen3.8-max`.
- Added a shared streamed chat-completion client using SSE, JSON mode, non-thinking execution, cancellation, and a five-minute client timeout.
- Updated resume extraction, resume analysis, and job matching to use Alibaba Qwen.
- Strengthened prompts with strict schemas, evidence rules, scoring rubrics, prompt-injection resistance, keyword-gap rules, and hallucination constraints.
- Removed local AI-result fallback behavior. Resume extraction and analysis now return explicit provider errors when Alibaba fails.
- Confirmed that manually entered job details and complete AI match results persist in PostgreSQL through the candidate-owned `JobMatch` entity.
- Kept automatic live job discovery outside the current MVP; it requires a reliable job API or explicitly enabled search capability.

Verified:

- API build completed successfully with zero warnings and zero errors using an alternate output directory while the development API was running.

Next feature in sequence:

1. Implement Phase 8 interview setup and persistence.
2. Add `InterviewSession` and `InterviewQuestion` entities and migration.
3. Add Alibaba Qwen structured question generation based on profile, active resume, target role, category, and difficulty.
4. Build the interview setup screen and persist exactly five validated, ordered questions.
5. Persist session status and add resume/recovery behavior before microphone or evaluation work begins.

Security requirement:

- Rotate every credential exposed in tracked configuration or chat and move secrets to ignored local configuration or deployment environment variables before production release or repository sharing.

### 2026-08-27 — AI interview setup and persisted question generation

Status: Implemented; runtime provider and end-to-end tests pending

Implemented:

- Reviewed the supplied Figma interview setup, practice room, realistic room, results, question feedback, microphone, preparing, permission-error, network-interruption, and adaptive-follow-up screens.
- Added candidate-owned `InterviewSession` and `InterviewQuestion` entities, EF configuration, and the `AddInterviewSessions` migration.
- Added create/list/detail interview API endpoints with profile, active-resume, and ownership requirements.
- Added Alibaba Qwen question generation using profile, active resume, target role, interview type, and difficulty.
- Requires exactly five ordered, unique, structured questions and validates every field before the session is saved.
- Persists interview type, difficulty, practice/realistic mode, voice/text response mode, ready status, and evaluation criteria.
- Added the Figma-aligned Angular setup page and persisted interview-ready question view.
- Replaced the pre-interview question preview with generic generation-success information; setup/list/detail responses expose only the question count, not question text or evaluation criteria.
- Added explicit provider errors with no local question fallback.

Verified:

- Release API build completed with zero warnings and zero errors.
- Angular production build completed successfully.
- EF Core generated `AddInterviewSessions` and updated the model snapshot.

Next feature in sequence:

- Implement Phase 9 from the supplied microphone-test, permission-error, practice-room, realistic-room, preparing-question, and network-interruption screens.

### 2026-08-27 — Figma interview room and persisted answer flow

Status: Implemented for typed-answer MVP; Alibaba speech transcription pending

Implemented:

- Added `InterviewAnswer` persistence plus session start/current-question/completion state and the `AddInterviewAnswers` migration.
- Added candidate-owned start, active-question, and answer-submission endpoints.
- Future questions remain hidden; the API reveals only the currently active question and advances only after the answer is saved.
- Added the supplied Figma microphone test and blocked-permission experiences with text fallback.
- Added Figma-aligned Practice and Realistic interview rooms, countdown timer, question progress, preparation transition, network interruption, retry, and completion state.
- Added browser microphone capture controls and browser question repetition through SpeechSynthesis.
- Added persistent typed answers for all five questions; completed answers and current position recover after refresh or network interruption.

Verified:

- Release API build completed with zero warnings and zero errors.
- Angular production build completed successfully.
- EF Core generated `AddInterviewAnswers` and updated the model snapshot.

Remaining:

- Alibaba short-audio speech-to-text is now integrated using a private temporary Supabase bucket, backend-only upload, ownership checks, strict format/size limits, and immediate deletion after transcription attempts. Audio is not retained permanently for the MVP.

### 2026-08-27 — Temporary interview audio and Alibaba transcription

Status: Implemented; private bucket provisioning and live provider verification required

Implemented:

- Added backend-only temporary audio upload to the private Supabase `interview-audio-temp` bucket.
- Added active-session, active-question, candidate ownership, MIME-type, and 10 MB validation.
- Added Alibaba `qwen3-asr-flash` transcription through the Singapore OpenAI-compatible endpoint.
- Recordings are capped below five minutes, uploaded only after recording stops, transcribed, and deleted in a `finally` cleanup path on success or failure.
- Only the editable transcript and submitted answer are retained; audio paths are not stored in PostgreSQL.
- Added recording, stop-and-transcribe, transcription progress, retry/text fallback, and explicit temporary-audio messaging in the interview room.

Verified:

- Release API build completed with zero warnings and zero errors.
- Angular production build completed successfully.

Deployment requirement:

- Create a private Supabase Storage bucket named `interview-audio-temp`, or set `Supabase__TemporaryAudioBucket` to another private bucket name before testing voice transcription.
- Adaptive follow-up generation from the supplied Figma screen remains future AI interview refinement work.

Next feature in sequence:

- Apply the `AddInterviewEvaluations` migration and verify one completed interview against Alibaba Model Studio.
- Then implement Phase 11 progress tracking, settings, privacy, and deletion controls; the four-item results roadmap is already available as the starting point.

### 2026-08-27 — AI interview evaluation and results

Status: Implemented; database deployment and live provider verification required

Implemented:

- Added Alibaba Qwen evaluation for all five saved answers with validated 0–100 technical, communication, relevance, problem-solving, confidence-evidence, professionalism, and overall scores.
- Added persistent `InterviewEvaluation` and `InterviewResult` records plus the `AddInterviewEvaluations` EF Core migration.
- Added idempotent evaluate and read-only results endpoints with candidate ownership and completion checks.
- Added explicit provider failure handling with no local or invented evaluation fallback.
- Added Figma-aligned Interview Results and Question Feedback screens, including expandable original/improved answers and retry/loading states.

Verified:

- Release API build completed with zero warnings and zero errors.
- Angular production build completed successfully.

### 2026-08-29 - Interview history and seven-day improvement plan

Status: Implemented; database deployment verification required

Implemented:

- Added interview history page listing every interview with type, score, date, and status-aware actions (view results, generate results, continue, start).
- Added interview session list score from stored evaluation averages.
- Added deterministic seven-day improvement plan generated from the stored four-item results roadmap plus fixed communication, mock interview, and review days.
- Added ImprovementPlan and ImprovementPlanItem entities with completion tracking endpoints and the AddImprovementPlans EF Core migration.
- Added Figma-aligned Progress screen with readiness goal banner, progress bar, and Completed/Today/Upcoming daily activity statuses.
- Added results-to-plan navigation and interview history link from the Progress screen.

Verified:

- Release API build completed with zero warnings and zero errors.
- Angular production build completed successfully.

Remaining:

- Apply the AddImprovementPlans migration to the deployed database.
- Then implement Phase 11 account settings, privacy, and deletion controls.

### 2026-08-29 - Account settings, privacy, and deletion controls

Status: Implemented; database deployment verification required

Implemented:

- Added authenticated change-password endpoint that revokes refresh tokens, clears the session cookie, and optionally sends a confirmation email.
- Added authenticated account-deletion endpoint that removes the identity record and uploaded resume files.
- Added PrivacyController with personal-data export (JSON) and delete-all-data endpoints that purge every owned record in FK-safe order.
- Added Figma 20-aligned Password & security screen with current/new/confirm password validation and sign-out-on-change behavior.
- Added Figma 39-aligned Privacy & data screen with consent summary, JSON data export download, and two-step delete-my-data and delete-my-account confirmations.

Verified:

- Release API build completed with zero warnings and zero errors.
- Angular production build completed successfully.

Remaining:

- Apply the AddImprovementPlans migration to the deployed database.

### 2026-08-29 - Resume/AI-output hardening and auth/shell/privacy gap fixes

Status: Implemented; database deployment verification required

Implemented:

- P6: Added PDF/DOCX magic-byte signature validation, server-controlled storage paths, storage rollback when the upload database save fails, and storage-object deletion when a resume is deleted.
- P6: Extraction failures now persist a Failed resume status; AI extraction and analysis outputs are strictly validated (structure, score ranges, required lists) before persistence.
- P6: Resume upload now supports drag-and-drop, client-side file validation, byte-level upload progress, extraction retry from the resume library, and two-step delete confirmation on the management screen.
- P7: Account deletion now purges every owned record in FK-safe order before removing the identity record (previously failed for users with data).
- P7: Reset-password screen now enforces the 8-character minimum and password-match validation with inline errors.
- P7: Candidate shell nav links expose aria-current for screen readers; logout always returns to the login screen even when the logout call fails.

Verified:

- API compile check completed with zero warnings and zero errors.
- Angular type-check (tsc --noEmit) completed with zero errors.

Remaining:

- Apply the AddImprovementPlans migration to the deployed database.
- Run end-to-end upload/extraction and auth-flow verification against the deployed API.

### 2026-08-29 - P8 MVP hardening subset: security headers, AI rate limits, and audits

Status: Implemented; tests and deployment verification pending

Implemented:

- Added SecurityHeadersMiddleware applying X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy, Strict-Transport-Security (HTTPS only), and a Content-Security-Policy (strict for API responses, Swagger-compatible for docs paths).
- Added an AiProvider fixed-window rate limit (default 10/minute, configurable) applied to every AI-calling endpoint: resume extract, resume analyze, job-match create, interview create, interview evaluate, and audio transcribe.
- Verified the CORS policy uses an explicit origin allowlist with credentials and the configured origins are present.
- Audited every controller endpoint for candidate ownership filters (profile, resume, job-match, interview, improvement-plan, dashboard, privacy) with no gaps found.
- Verified request logging and the global exception handler emit no sensitive content (method/path/status/trace only).

Verified:

- API compile check completed with zero warnings and zero errors.

Remaining:

- Automated API integration, Angular unit, and Playwright critical-path tests (deferred per owner instruction).
- Desktop/tablet/mobile layout and keyboard-only/focus manual passes against the running app.
- Migrations-from-empty-database and production deployment verification.

### 2026-08-29 - Critical P8 leftovers: route lazy-loading and upload Remove confirmation

Status: Implemented; production build verification pending

Implemented:

- Converted every feature route (public, auth, onboarding, and app sections) to loadComponent lazy loading while keeping the two layouts and guards eager; all route data (titles, subtitles, hideSearch) and canDeactivate/canActivate guards preserved.
- Added a two-step confirmation (Yes, remove / Cancel) to the resume library Remove action on the upload screen, matching the management screen behavior.

Verified:

- Angular type-check (tsc --noEmit) completed with zero errors.

Remaining:

- Run the Angular production build and smoke-test navigation between lazy routes.
- Apply the AddImprovementPlans migration to the deployed database.

### 2026-08-29 - Dedicated auth layout and P9 speech remainder verification

Status: Implemented; production build verification pending

Implemented:

- Added a dedicated AuthLayoutComponent (bare router-outlet shell) so auth pages render without the public marketing topbar; moved login, register, forgot-password, and reset-password under the top-level auth route group with URLs unchanged, and updated the shared auth-layout to use 100vh now that the topbar no longer applies.
- Verified the P9 transcript review item: the interview room already places the ASR transcript into the editable answer textarea for correction before submit, so the remaining speech gap is closed; marked Phase 15 done and promoted P9 to Implemented in the queue.

Verified:

- Angular type-check (tsc --noEmit) completed with zero errors.

Remaining:

- Run the Angular production build and visually verify all four auth screens without the marketing topbar.
- Apply the AddImprovementPlans migration to the deployed database.
### 2026-08-29 - AI Career Coach screen and microphone-permission error state

Status: Implemented; production build verification pending

Implemented:

- Added a backend career-coach endpoint (CareerCoachController, CareerCoachAdvisor) that grounds advice in the candidate's profile, latest resume, and recent job matches; extended AlibabaChatCompletionClient with a plain-text completion path and applied the AiProvider rate limit.
- Added the Career Coach screen (Figma 19): chat UI with quick prompts, optimistic message append, and context-aware replies; wired the existing nav link to /app/career-coach.
- Added a dedicated microphone-permission error state in the interview room (Figma 34): a NotAllowedError from getUserMedia now renders a dedicated explanation screen with Retry microphone and Type my answers instead actions.

Verified:

- API compile check completed with zero warnings and zero errors.
- Angular type-check (tsc --noEmit) completed with zero errors.

Remaining:

- Run the Angular production build and exercise the career-coach chat and mic-error fallback flows against the deployed API.

### 2026-08-29 - Job marketplace, recruiter dashboard, admin RBAC, and attempt comparison

Status: Implemented; EF migration and production build verification pending

Implemented:

- Added JobPosting, JobApplication, and SavedJob entities with EF Fluent configuration (jsonb skills, unique application/save indexes, cascades) plus repository and unit-of-work wiring.
- Added candidate marketplace endpoints (search, detail, apply/withdraw, save/unsave, applications, saved jobs), recruiter endpoints (CRUD and applicants with counts), and admin endpoints (user list, role change, account lock, role catalog) with ownership filtering and self-protection guards.
- Seeded Candidate, Recruiter, and Admin roles with five demo users (recruiter@qabilhire.com and admin@qabilhire.com added).
- Built the job marketplace screens (Figma 21-24: search, details, applications, saved jobs), recruiter dashboard (Figma 25), user management and roles screens (Figma 26-27), and compare interview attempts (Figma 38) with a delta column for score changes.
- Added a withRoles route guard, role-filtered navigation, a role-aware profile-complete guard (Recruiter/Admin bypass candidate onboarding), and wired eight new lazy routes; added a Compare attempts entry point on interview history.

Verified:

- API compile check completed with zero warnings and zero errors.
- Angular type-check (tsc --noEmit) completed with zero errors.

Remaining:

- Generate and apply a new EF migration for JobPosting, JobApplication, and SavedJob on the deployed database.
- Run the Angular production build and smoke-test marketplace, recruiter, and admin flows with seeded demo users.
- Apply the AddImprovementPlans migration to the deployed database.
### 2026-08-29 - Landing pages updated for the new workflow with animations

Status: Implemented; production build verification pending

Implemented:

- Updated the landing page for the expanded workflow: hero copy now mentions finding matching roles, a Search jobs card joins the workflow cards row, and two new sections cover the job marketplace (search, match, apply, saved jobs) and the AI career coach with attempt comparison.
- Generated two new marketing illustrations in the existing style (job-marketplace.png, career-coach.png) and added them to the assets.
- Updated the features page with three new cards (job marketplace, application tracking, AI career coach) and the how-it-works page with two new steps (find your next role, track your growth), now six steps.
- Added a reusable RevealDirective (IntersectionObserver scroll reveal with optional stagger delay) and global reveal styles, applied across the landing, features, and how-it-works pages.
- Added load animations: hero entrance with staggered preview, animated hero metric progress bars, floating preview card, pulsing stat dots, card hover lift, image hover zoom, animated trust-strip gradient, and prefers-reduced-motion support.

Verified:

- Angular type-check (tsc --noEmit) completed with zero errors.

Remaining:

- Run the Angular production build and visually verify the landing, features, and how-it-works pages across breakpoints.

### 2026-09-01 - Project scan, role portals, and admin operations reconciliation

Status: Implemented locally; deployed verification and automated tests pending

This entry supersedes older candidate-only scope statements and earlier remaining-item notes where they conflict.

Implemented:

- Candidate flow is implemented through authentication, onboarding, profile, resume extraction/analysis, job match, AI interview, results, improvement plan, progress, career coach, settings, privacy export, and deletion controls.
- Job marketplace is implemented with job search, job detail, apply/withdraw, saved jobs, and application tracking.
- Recruiter flow is implemented with dashboard, job CRUD, applicants, applicant detail, pipeline, interviews, and profile/settings screens.
- Admin flow is implemented with a distinct dashboard, user/role management, account lock controls, job moderation, platform activity, reports, system health, and settings screens.
- Persistent `AiProviderRequestLog` telemetry records AI provider operation outcomes and latency. Persistent `AdminAuditLog` records role, lock, job-moderation, and administrator security events.
- `AddRecruiterPortal` and `AddTelemetryAndAdminAudit` migrations exist. `AddTelemetryAndAdminAudit` was applied to the local database.
- The Angular admin dashboard has been improved with Material icons, metrics, activity indicators, quick actions, and operational highlight panels. The global Material Icons font configuration was added.

Verified:

- Release API build completed with zero warnings and zero errors after telemetry/audit implementation.
- Angular production build completed successfully after the admin dashboard update.

Remaining:

- Deploy and apply all pending migrations to Railway PostgreSQL, then smoke-test the deployed API and UI.
- Verify each AI provider workflow with configured production credentials and the private temporary-audio bucket.
- Add the deferred API integration, Angular unit, and Playwright critical-path tests.
- Complete manual responsive, keyboard-focus, and accessible-state verification.
- Rotate and remove exposed credentials before sharing or production release.
