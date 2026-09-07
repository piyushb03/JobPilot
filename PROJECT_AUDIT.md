# JobPilot — Project Audit

## A. What the Application Does

JobPilot is an AI-powered job application tracker. Users can:
1. Track job applications (Applied → Interview → Offer → Reject → Withdrawn)
2. Generate AI cover letters and follow-up emails (Vertex AI / Gemini)
3. Import bulk job postings via CSV/JSON
4. Receive smart nudges for stale applications needing follow-up
5. Maintain a centralized candidate profile used for AI context

## B. Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Registration / Login (JWT) | Working | |
| Job CRUD | Working | Missing source_url display |
| Application CRUD | Working | |
| Application status history | Working | |
| AI draft generation | Mock only | Real Vertex AI behind flag |
| Draft save/edit | BROKEN | "Save Changes" button has no onClick |
| Candidate profile CRUD | Partial | Missing education, projects, linkedin, github, portfolio fields in form |
| Smart nudges | Working | Backend + frontend functional |
| CSV/JSON import | Working | |
| Scheduled nudges endpoint | Working | |
| Dashboard statistics | Working | |
| Job -> Apply button | BROKEN | Shows alert() — no application created |

## C. Critical Bugs

1. **Jobs page "Apply" button** — calls `alert()`, no API call, no application created
2. **ApplicationDetail "Save Changes" button** — `onClick` is missing, changes are lost on refresh
3. **No draft update API endpoint** — `PUT /api/drafts/{id}` does not exist
4. **Profile form missing fields** — education, projects, linkedin_url, github_url, portfolio_url not shown
5. **Profile success uses alert()** — jarring UX
6. **Import drag-and-drop mentioned but not wired** — no dragover/drop handlers

## D. Incomplete Functionality

1. Source URL not displayed on job cards
2. Draft "sent" status not settable from UI  
3. No AI provider fallback for local dev without GCP credentials
4. No nudge badge count in sidebar

## E. Security Issues

1. CORS `allow_origins=["*"]` — too permissive for production
2. SECRET_KEY has a hardcoded fallback — dangerous
3. INTERNAL_CRON_SECRET has hardcoded fallback — dangerous
4. No input length validation on profile text fields

## F. UI/UX Issues

1. No toast notification system — uses alert() or raw inline text
2. Plain text loading states ("Loading applications...")
3. No mobile sidebar/hamburger menu — layout breaks on mobile
4. Dashboard lacks visual charts/progress bars
5. Empty states have minimal styling and no CTAs
6. No confirmation for destructive actions

## G. Implementation Plan

### Phase 1: Backend Fixes
- Add `PUT /api/drafts/{draft_id}` endpoint for editing draft content
- Add `POST /api/drafts/{draft_id}/mark-sent` endpoint
- Add GEMINI_API_KEY fallback in ai_service.py using google-genai SDK
- Improve CORS to use ALLOWED_ORIGINS env var

### Phase 2: Frontend Critical Fixes
- Fix "Apply" button in Jobs page — create application via modal
- Fix "Save Changes" in ApplicationDetail — wire to PUT /api/drafts/{id}
- Complete Profile form with all fields
- Replace all alert() with toast notifications

### Phase 3: UI/UX Redesign
- Dark sidebar with brand colors, nudge badge
- Professional card designs, loading skeletons
- Mobile responsive navigation
- Rich dashboard with status bars
- Polished modals, forms, empty states

### Phase 4: Testing & Documentation
- Run existing tests, fix any failures
- Update .env.example with GEMINI_API_KEY
- Update README
