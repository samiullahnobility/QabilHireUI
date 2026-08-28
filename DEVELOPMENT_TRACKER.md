# QabilHire Development Tracker

Last updated: 2026-08-21

## Repository layout

| Area                     | Location        | Repository      | Purpose                                            |
| ------------------------ | --------------- | --------------- | -------------------------------------------------- |
| Shared project documents | `/`             | Not tracked yet | Product context and cross-project planning         |
| Angular frontend         | `/QabilHireUI`  | `QabilHireUI`   | Candidate-facing web application                   |
| ASP.NET Core backend     | `/QabilHireAPI` | `QabilHireAPI`  | API, persistence, authentication, and integrations |

Git identity for both application repositories:

- Name: `samiullahnobility`
- Email: `samiullah.nobility@gmail.com`

## Current phase

Foundation and UX hardening. Complete deterministic candidate workflows and
validation before integrating Qwen or speech services.

## Work status

### Repository setup

- [x] Keep shared project context in the parent workspace.
- [x] Create the development tracker in the parent workspace.
- [x] Initialize the UI repository and commit the imported Angular baseline.
- [x] Initialize the API repository and commit its initial structure.
- [ ] Create and connect remote repositories.
- [ ] Decide how shared parent documents will be synchronized across systems.

### Frontend foundation

- [x] Audit the Angular template and retain reusable structural files.
- [x] Remove AdminMart demo pages, widgets, navigation, branding, and assets.
- [ ] Configure QabilHire design tokens and Angular Material theme.
- [ ] Establish public, authentication, and candidate layouts.
- [ ] Establish lazy-loaded feature routing.
- [x] Add reusable loading, empty, validation, error, and success states.
- [x] Verify production build after cleanup.

### Non-AI pages — first priority

- [x] Landing page.
- [x] Sign-in page.
- [x] Registration page.
- [ ] Forgot-password page.
- [ ] Candidate dashboard shell.
- [x] Profile setup and profile management.
- [x] Resume upload and local file validation UI.
- [ ] Extracted-resume information editor using mock data.
- [x] Job-description input form and AI-backed Job Match analysis.
- [x] Persisted Job Match results history with search and score/level filters.
- [x] Job Match input and persisted results screens with AI-backed API integration.
- [ ] Interview setup page.
- [ ] Microphone permission and device test page.
- [ ] Interview room UI with typed-answer fallback.
- [ ] Static/mock interview results and question feedback pages.
- [ ] Static/mock seven-day improvement-plan page.
- [ ] Progress, settings, privacy, and deletion-control pages.

### Backend foundation — no AI dependency

- [ ] Scaffold ASP.NET Core Web API.
- [ ] Add central exception handling and structured logging.
- [ ] Add SQL Server and Entity Framework Core.
- [ ] Add Identity, access tokens, refresh tokens, and ownership checks.
- [ ] Add candidate profile endpoints.
- [ ] Add secure resume upload and local PDF/DOCX extraction.
- [ ] Add job-description and interview-session persistence.
- [ ] Publish OpenAPI and connect a typed Angular client.

### AI and speech integration — later phase

- [ ] Qwen resume analysis.
- [ ] Qwen job matching.
- [ ] Interview-question generation.
- [ ] Alibaba speech-to-text.
- [ ] Answer evaluation and interview summary.
- [ ] Improvement-plan generation.
- [ ] Deterministic mock fallback for the live demonstration.

## Decision log

| Date       | Decision                                                              | Reason                                                                                |
| ---------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 2026-08-18 | Maintain separate UI and API repositories.                            | Allows independent history, deployment, and access control.                           |
| 2026-08-18 | Keep shared documents at the parent workspace level.                  | Gives both projects one common source of product and planning context.                |
| 2026-08-18 | Develop non-AI pages and workflows first.                             | Delivers a testable product shell before external service integration.                |
| 2026-08-18 | Preserve only the reusable Angular shell from the Modernize template. | Keeps proven layout infrastructure without carrying demo product code into QabilHire. |

## Update rules

1. Update this file after each completed development task.
2. Mark an item complete after manual verification and a successful build where applicable.
3. Record blockers and important architecture decisions in the decision log.
4. Keep credentials and candidate data out of this tracker and both repositories.
5. Use Material components for interactive UI and never add browser-native confirmation alerts.
6. Treat persisted select values as contracts: template option values must match API strings exactly.
7. Do not mark UX work complete without manually checking validation, success, error, dirty-state, and responsive states.
8. For resume extraction, preserve arbitrary source formats and validate structured output before saving.

## Next verified tasks

- [ ] Manual walkthrough across registration, onboarding, profile sections, resume upload/removal, and unsaved navigation.
- [ ] Verify desktop/mobile layouts and Material dialog behavior.
- [ ] Confirm resume size persistence and profile value round-tripping through the running application.
- [ ] Continue dashboard, interview, results, and improvement-plan implementation.
