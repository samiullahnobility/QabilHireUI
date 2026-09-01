# QabilHire Development Tracker

Last updated: 2026-09-01

This is the short operational tracker. The detailed scope, history, and decisions live in `QABILHIRE_DEVELOPMENT_MASTER_PLAN.md`.

## Current Product State

QabilHire now supports three protected roles:

| Role | Implemented experience |
| ---- | ---------------------- |
| Candidate | Onboarding, profile, resume AI analysis, job matching, AI interview, results, improvement plans, progress, job marketplace, career coach, settings, privacy, and data deletion |
| Recruiter | Dashboard, job posting CRUD, applicants, applicant detail, pipeline, interviews, and settings |
| Admin | Dashboard, users, roles, account locks, job moderation, activity, reports, AI/system health, and settings |

## Completed Locally

- [x] ASP.NET Core layered API, Identity/JWT/refresh sessions, role-aware authorization, rate limiting, security headers, safe error handling, and CORS allowlist.
- [x] Candidate, Recruiter, and Admin roles seeded; public registration creates only a Candidate.
- [x] Candidate career journey, including typed and voice-assisted interview paths with transcript editing and fallback states.
- [x] Private resume storage, PDF/DOCX signature validation, extraction, analysis, retry, and deletion behavior.
- [x] Job marketplace and recruiter portal, backed by `JobPosting`, `JobApplication`, `SavedJob`, and recruiter-profile persistence.
- [x] Admin operations portal, backed by role management, account-lock, moderation, reporting, system-health, telemetry, and audit endpoints.
- [x] Persistent AI provider telemetry (`AiProviderRequestLog`) and administrator audit logs (`AdminAuditLog`).
- [x] EF migrations created for candidate, interview, improvement-plan, recruiter, telemetry, and audit data. `AddTelemetryAndAdminAudit` was applied to the local database.
- [x] Lazy-loaded Angular feature routes, role-aware navigation, dedicated auth layout, and Material Icons global font setup.
- [x] Latest API Release build and Angular production build completed successfully.

## Pending Verification

- [ ] Rotate all credentials that were exposed in tracked configuration or chat. Remove secrets from tracked files and Git history before any public release.
- [ ] Apply all outstanding migrations to Railway PostgreSQL and smoke-test the deployed API.
- [ ] Confirm Railway Swagger/OpenAPI exposure is configured as intended for production; a 404 at `/swagger/index.html` is expected when Swagger is development-only.
- [ ] Verify Vercel UI deployment against the deployed API for Candidate, Recruiter, and Admin accounts.
- [ ] Verify live Alibaba AI workflows and temporary Supabase audio storage with production configuration.
- [ ] Add deferred API integration, Angular unit, and Playwright critical-path tests.
- [ ] Complete desktop/tablet/mobile, keyboard-focus, loading, error, retry, and empty-state walkthroughs.

## Next Work Order

1. Resolve credential hygiene and Railway migration/deployment verification.
2. Smoke-test all three role journeys with deployed accounts.
3. Add automated coverage for auth, profile, resume, job application, recruiter pipeline, and admin operations.
4. Complete responsive and accessibility hardening from the manual test findings.

## Update Rules

1. Update this tracker and the master plan after a meaningful implementation or verification task.
2. Mark an item complete only when the stated verification has actually run.
3. Keep secrets, tokens, connection strings, and personal candidate data out of documentation.
4. Preserve role boundaries: only authenticated claims determine candidate, recruiter, or admin access.
