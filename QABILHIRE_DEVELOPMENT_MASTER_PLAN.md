# QabilHire Development Master Plan

Last updated: 2026-08-21

## 1. Purpose

This document is the single source of truth for QabilHire development. All planning, implementation status, architecture decisions, verification results, blockers, and next tasks must be maintained here.

The previous context and tracker documents remain useful historical references, but development progress must be tracked in this file from now on.

## 2. Product Goal

QabilHire is a candidate-focused career and interview-preparation platform. The MVP must let a candidate complete this journey:

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

The MVP is candidate-only. Recruiter and administrator portals are outside the current scope.

## 3. Delivery Strategy

Development is divided into two major stages.

### Stage A: complete the product without AI

Build and verify the entire candidate journey with deterministic local logic, mock results, and typed-answer fallbacks. Every page, API contract, database entity, authorization rule, and state transition must work before external AI services are introduced.

### Stage B: integrate AI and speech services

Replace the relevant deterministic implementations behind stable service interfaces with Qwen and Alibaba speech services. The non-AI implementations remain available as demo and failure fallbacks.

No AI integration should begin until the Stage A exit criteria are satisfied.

## 4. Repositories and Technology

| Area | Location | Technology |
|---|---|---|
| Frontend | `/QabilHireUI` | Angular 20, TypeScript 5.8, Angular Material, Signals, RxJS |
| Backend | `/QabilHireAPI` | ASP.NET Core 10, C#, Identity, JWT, Entity Framework Core |
| Database | PostgreSQL | Current implementation uses Npgsql and Supabase-compatible PostgreSQL |
| API deployment | Railway | Docker-based deployment |
| UI deployment | Vercel | Angular production build |

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

### Known baseline gaps

- [x] Authentication state is restored from a valid browser session after refresh.
- [x] Bearer-token HTTP interceptor exists.
- [x] Functional authentication and guest guards exist; protected candidate routes will use them when those routes are added.
- [x] Registration redirects to profile onboarding and login redirects to the candidate dashboard.
- [x] Forgot/reset-password pages are connected to backend endpoints.
- [x] Rotating refresh tokens and server-side revocation are implemented.
- [x] Candidate roles are included in the frontend auth response model.
- [ ] Automated authentication integration tests are deferred by the project owner; broader MVP tests remain planned for hardening.
- [x] Public and candidate layouts are separated; a dedicated auth layout remains pending.
- [ ] Major feature routes are not lazy-loaded.
- [ ] Candidate profile and all later workflow features are not implemented.

## 6. Immediate Security Blocker

A database credential and development JWT value are currently present in tracked API configuration. Before further feature development:

- [ ] Rotate the exposed database password.
- [ ] Remove the real connection string from tracked `appsettings.json`.
- [ ] Replace tracked secrets with safe placeholders.
- [ ] Configure local values through .NET User Secrets or an ignored development settings file.
- [ ] Configure production values through Railway environment variables.
- [ ] Confirm Vercel contains no provider or backend secrets.
- [ ] Review Git history and remove exposed credentials before publishing or sharing the repository.
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

## 9. Core Data Model

| Entity | Purpose |
|---|---|
| `ApplicationUser` | Identity account and authentication details |
| `CandidateProfile` | Candidate headline, contact details, location, experience, education summary, and onboarding state |
| `Resume` | Uploaded file metadata, safe storage reference, extracted text, and processing state |
| `ResumeAnalysis` | Structured resume feedback and scoring |
| `JobDescription` | Candidate-owned target job information and description |
| `JobMatchAnalysis` | Match score, matched skills, missing skills, strengths, and recommendations |
| `InterviewSession` | Configuration, status, timing, and overall result |
| `InterviewQuestion` | Ordered interview question and optional competency |
| `InterviewAnswer` | Typed answer, audio reference, transcript, and submission state |
| `InterviewEvaluation` | Per-question scores and feedback |
| `ImprovementPlan` | Candidate improvement plan linked to an interview |
| `ImprovementPlanItem` | Daily task, completion state, and learning objective |

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

Status: **In progress — onboarding persistence complete; profile management page pending**

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

Status: **Pending**

- [ ] Create dashboard summary API contract.
- [ ] Build welcome and profile-completion sections.
- [ ] Add quick actions for resume, job match, and interview setup.
- [ ] Add recent activity with a deterministic empty state.
- [ ] Add placeholder progress summary backed by real stored activity when available.

Exit criteria:

- Dashboard provides the correct next action for new and returning candidates.

### Phase 5: secure resume upload and extraction

Status: **In progress**

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

### Phase 6: extracted resume editor and deterministic analysis

Status: **In progress**

- [x] Define structured resume schema for contact, summary, skills, experience, education, projects, certifications, languages, and additional information.
- [x] Parse extracted text into editable sections using deterministic rules, with optional Groq extraction and local fallback.
- [x] Build contact, summary, experience, education, project, and skills editors, plus certification, language, and additional-information editors.
- [x] Save candidate corrections.
- [x] Implement deterministic checks for missing sections, length, contact information, action language, and measurable achievements.
- [ ] Persist a versioned `ResumeAnalysis` result.
- [x] Persist the current score and analysis JSON on the resume record.
- [x] Build score, strengths, issues, and recommendation UI.
- [ ] Clearly label deterministic fallback feedback as automated guidance and distinguish it from AI-generated feedback.
- [ ] Validate structured AI output beyond JSON parsing and score range checks.
- [ ] Add editor and analysis API/UI tests.

Exit criteria:

- Resume review and analysis work end-to-end without an AI provider.
- The service interface is ready for a later Qwen implementation.

### Phase 7: job description and deterministic matching

Status: **Pending**

- [ ] Add `JobDescription` and `JobMatchAnalysis` entities.
- [ ] Add job-description create/read/delete endpoints.
- [ ] Implement normalized keyword and skill matching.
- [ ] Calculate a transparent deterministic score.
- [ ] Return matched skills, missing skills, and recommendations.
- [ ] Build job-description input form.
- [ ] Build match result and skill-gap screens.
- [ ] Add ownership and integration tests.

Exit criteria:

- A candidate can compare a saved resume with a job description without AI.
- Match scoring is explainable and repeatable.

### Phase 8: interview setup and question bank

Status: **Pending**

- [ ] Add interview session and question entities.
- [ ] Create a curated local question bank by role/category and difficulty.
- [ ] Build interview setup page.
- [ ] Generate exactly five deterministic questions.
- [ ] Persist question order and session state.
- [ ] Add session resume/recovery behavior.

Exit criteria:

- A candidate can configure and start a persistent five-question interview without AI.

### Phase 9: microphone test and interview room

Status: **Pending**

- [ ] Build microphone permission and device test.
- [ ] Add recording consent notice.
- [ ] Handle denied, unavailable, and interrupted microphone states.
- [ ] Build interview timer and question navigation.
- [ ] Implement audio recording.
- [ ] Implement typed-answer fallback for every question.
- [ ] Prevent accidental session loss.
- [ ] Store answer state securely.
- [ ] Add browser SpeechSynthesis for reading questions when available.

Exit criteria:

- A candidate can complete all five questions using audio, typed answers, or a mixture.
- Typed answers always work when audio features fail.

### Phase 10: deterministic evaluation and results

Status: **Pending**

- [ ] Add answer and evaluation entities.
- [ ] Implement transparent non-AI scoring rules for answer completeness, length, structure, and job/resume keyword relevance.
- [ ] Build overall results page.
- [ ] Build question-level feedback page.
- [ ] Show score explanations and improvement suggestions.
- [ ] Support empty, incomplete, processing, failure, and success states.

Exit criteria:

- A completed interview produces stable, explainable mock evaluation results without AI.

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
- [ ] Configure Qwen credentials only on the backend.
- [ ] Add resilient typed HTTP clients, timeouts, and controlled retries.
- [ ] Add versioned prompt templates.
- [ ] Require structured JSON responses.
- [ ] Validate all model output as untrusted input.
- [ ] Record model, latency, status, and failure category without sensitive prompt content.
- [ ] Preserve deterministic fallback implementations.

### Phase 14: AI resume and job-match services

- [ ] Implement Qwen resume analysis.
- [ ] Implement Qwen structured resume extraction fallback.
- [ ] Implement Qwen job matching.
- [ ] Compare AI outputs against deterministic results.
- [ ] Add safe fallback and retry UI states.

### Phase 15: AI interview and speech services

- [ ] Generate interview questions with Qwen.
- [ ] Integrate Alibaba speech-to-text.
- [ ] Allow transcript review and correction before evaluation.
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

| Risk | Mitigation |
|---|---|
| External AI or speech provider fails during demo | Maintain deterministic and typed-answer fallbacks |
| Sensitive resume/audio data leaks | Private storage, ownership checks, deletion controls, and safe logging |
| Scope becomes too broad | Candidate-only MVP and phase exit criteria |
| UI is built before API contracts stabilize | Use typed feature data services and stable mock/real interfaces |
| Model returns invalid or unsafe output | Structured schemas, validation, safety rules, and deterministic fallback |
| Running API locks build outputs | Stop the local API before build verification |
| Tracker becomes outdated | Update this document in the same task that changes implementation status |

## 19. Decision Log

| Date | Decision | Reason |
|---|---|---|
| 2026-08-18 | Maintain separate UI and API repositories. | Independent deployment and history. |
| 2026-08-18 | Preserve only useful Modernize template infrastructure. | Avoid carrying unrelated demo product code. |
| 2026-08-18 | Build non-AI workflows before integrations. | Produce a stable, testable candidate journey first. |
| 2026-08-19 | Use PostgreSQL for the current MVP implementation. | The API is already implemented with EF Core Npgsql and deployed against PostgreSQL. |
| 2026-08-19 | Assign `Candidate` during public registration. | Public registration must never allow privilege selection. |
| 2026-08-19 | Use this file as the single development tracker. | Keep scope, status, decisions, and verification in one maintained document. |
| 2026-08-19 | Use one rotating refresh session per candidate for the MVP. | Keeps revocation simple by using Identity's existing user-token store without a new token table. A new login invalidates the previous refresh session. |

## 20. Active Work Queue

Only one item should normally be marked **In progress**.

| Priority | Work item | Status | Verification |
|---|---|---|---|
| P0 | Rotate and remove committed database/JWT secrets | Deferred by owner | Repository scan, local API start, deployed health check |
| P1 | Complete authentication lifecycle and guards | In progress | Manual auth verification and production builds; integration tests deferred by owner |
| P2 | Build layouts, design system, and candidate shell | In progress | Responsive and accessibility checks, UI build |
| P3 | Implement candidate onboarding/profile end-to-end | Pending | API tests, UI flow, ownership test |
| P4 | Implement dashboard foundation | Pending | UI states and API response verification |
| P5 | Finish resume upload/extraction hardening | In progress | File-signature validation, failed state, storage deletion, ownership and extraction tests |
| P6 | Finish extracted editor and analysis hardening | Partially implemented | Versioned analysis, provider labeling, output validation, end-to-end resume tests |
| P7 | Implement deterministic job matching | Pending | Repeatable scoring and ownership tests |
| P8 | Implement deterministic interview journey | Pending | Five-question typed/audio flow |
| P9 | Implement results and improvement plan | Pending | Completed session through seven-day plan |
| P10 | Harden and verify the complete non-AI MVP | Pending | Full automated critical path |
| P11 | Integrate Qwen and Alibaba speech services | Blocked by Stage A | AI quality and fallback tests |

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

- Added persisted Job Match entity, API contracts, ownership-filtered CRUD endpoints, Groq analysis service, migration, designer, and model snapshot metadata.
- Added Job Match input, results, and history screens based on the supplied Figma screens.
- Added strong/developing/limited match presentation, score breakdowns, matched skills, strengths, gaps, priorities, likely questions, and recommended next step.
- Added history search, match-level filter, minimum-score filter, clear filters, and detail navigation.
- Added routes for `/app/job-match`, `/app/job-match/history`, and `/app/job-match/:id`.

Next manual work:

- Verify the migration applies cleanly in PostgreSQL.
- Verify Groq success and failure states.
- Walk through creating, reopening, filtering, and deleting persisted job matches.
- Continue dashboard, interview, results, and improvement-plan features.
