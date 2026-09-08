<div align="center">

# 🚀 JobPilot — AI Job Application Tracker

**A production-ready, AI-driven job application tracking platform with pipeline management, automated Gemini-powered cover letter drafting, scheduled follow-up nudges, and bulk dataset ingestion.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4.svg?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-Deploy-4285F4.svg?style=flat&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75C2.svg?style=flat&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1.svg?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

</div>

## 🎥 Live Demo & Walkthrough

<!-- ================================================================= -->
<!-- DEMO VIDEO / EMBED PLACEHOLDER:                                   -->
<!-- Replace the link and thumbnail below with your video or GIF demo  -->
<!-- ================================================================= -->

> 📺 **Watch the interactive walkthrough video & product demonstration:**

<div align="center">

🎥 Video Demo Link: https://drive.google.com/file/d/1kNoIclrSefDG-dUSBHHA33eh0hXGzIlv/view?usp=sharing

</div>

---

## 📸 Screenshots & Visual Tour

<!-- ================================================================= -->
<!-- SCREENSHOT GALLERY:                                               -->
<!-- Categorized walkthrough of all views with placeholders for more   -->
<!-- ================================================================= -->

### 1. 🌟 Public SaaS Landing Page
*Conversion-focused landing page with interactive pipeline preview, feature highlights, and clear onboarding CTAs.*

<!-- PLACEHOLDER: Landing Page Screenshot -->
<p align="center">
  <img width="1918" height="1015" alt="image" src="https://github.com/user-attachments/assets/36b4d141-75a5-4861-a693-6cc16f6f526b" />

</p>

---

### 2. 📊 Application Dashboard & Pipeline Management
*Real-time metrics, quick stats, smart follow-up alerts, and application pipeline tracking.*

<p align="center">
  <img width="954" height="472" alt="image" src="https://github.com/user-attachments/assets/85b88c27-01e8-4c3d-8789-91234cccf589" />

</p>

<p align="center">
  <img width="959" height="502" alt="Application Kanban Board" src="https://github.com/user-attachments/assets/6452a562-cdae-4c27-9c9d-fc03cadc6a35" />
</p>

---

### 3. 📝 Job Application Detail & Timeline
*Comprehensive application view with status progression, notes, interviews, and saved drafts.*

<p align="center">
  <img width="959" height="504" alt="AI Tailored Cover Letter Generator" src="https://github.com/user-attachments/assets/3b246d77-6d9c-490f-9b00-cf4acf0eb41c" />
</p>

---

### 4. ✨ Vertex AI Cover Letter Studio
*Context-aware cover letter generator using Google Gemini 2.5 Flash, matching candidate profile and company requirements.*

<p align="center">
  <img width="959" height="472" alt="image" src="https://github.com/user-attachments/assets/954624ff-c924-4294-b7db-06c402d2ec53" />

</p>

---

### 5. 🔔 Automated Smart Nudges & Reminders
*Intelligent alerts flagging stale applications in need of attention, powered by background cron automation.*

<p align="center">
  <img width="959" height="505" alt="Smart Nudges & Reminders" src="https://github.com/user-attachments/assets/0a0aecf4-e61e-4568-9ed8-4631f179a006" />
</p>

---

### 6. 📥 CSV / JSON Bulk Data Ingestion
*High-throughput dataset ingestion with schema validation, error aggregation, and duplicate detection.*

<p align="center">
  <img width="959" height="503" alt="Bulk Dataset Ingestion" src="https://github.com/user-attachments/assets/31eb11f9-2a0b-417a-b475-2790413ae864" />
</p>

---

### 7. 👤 Candidate Profile & AI Context Studio
*Structured resume summary, key skills, and personalized prompt context for hyper-tailored AI drafts.*

<p align="center">
  <img width="959" height="502" alt="Candidate Profile Setup" src="https://github.com/user-attachments/assets/c2bcae78-9a68-4225-9aa1-5fbcb655a18a" />
</p>

---

## ⚡ Key Features

- **Public SaaS Landing Page**: Modern, high-converting public storefront showcasing product features, live interactive pipeline previews, and fast login/signup flows.
- **Visual Application Pipeline**: Seamlessly organize job applications across stages (`Applied` → `Interviewing` → `Offered` → `Rejected`) with full history audit trails.
- **AI Cover Letter Studio**:
  - Leverages Google Gemini (`gemini-2.5-flash`) via Google AI Studio API or Google Cloud Vertex AI.
  - Combines Candidate Profile + Target Job Description + Past Drafts for consistent tone and style matching.
  - Generates editable, copyable, and downloadable markdown drafts.
- **Automated Smart Nudges**:
  - Automatically identifies applications stuck in `Applied` status with no activity for >5 days.
  - Secure cron endpoint (`/api/internal/scheduled-nudges`) integrated with Cloud Scheduler.
- **Bulk Job Ingestion**:
  - Upload CSV or JSON files with automated deduplication via `external_id`.
  - Detailed audit reports with row-by-row failure/success reporting.
- **Single Container Deployment**:
  - Production Vite React SPA is compiled and mounted directly to FastAPI static files.
  - Eliminates CORS issues, simplifies SSL setup, and allows one-command Cloud Run deploys.

---

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer"]
        A[React 19 + Vite SPA]
    end

    subgraph Service ["FastAPI Application (Single Container)"]
        B[FastAPI REST API]
        C[Static SPA File Server]
        D[JWT Authentication]
        E[AI Service Orchestrator]
        F[Import Engine]
        G[Nudge Service]
    end

    subgraph Database ["Persistence Layer"]
        H[(PostgreSQL / SQLite)]
    end

    subgraph External ["External Services"]
        I[Google Gemini / Vertex AI]
        J[GCP Cloud Scheduler]
    end

    A -->|Browse SPA / Assets| C
    A -->|API Requests + Bearer Token| B
    B --> D
    B --> E
    B --> F
    B --> G
    B --> H
    E -->|Prompt + Context| I
    J -->|Daily Cron Webhook| G
```

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite | Fast, modern client SPA with strict type safety |
| **Styling** | Tailwind CSS v4, Lucide Icons | Responsive utility-first design with curated palette |
| **State & Query**| React Query, Context API | Server state synchronization, caching, and auth context |
| **Backend** | Python 3.11+, FastAPI, Uvicorn | High-performance asynchronous REST API |
| **ORM & Database**| SQLAlchemy 2.0, Alembic, PostgreSQL | Production ORM with migrations (SQLite for local dev) |
| **AI / LLM** | Google Gemini 2.5 Flash / Vertex AI | Intelligent cover letter generation with fallback modes |
| **Cloud & DevOps** | Google Cloud Run, Cloud Scheduler, Docker | Serverless container runtime and automated cron scheduler |

---

## 📂 Database Schema

```
Users ──────────────────────────┬──< Applications ──┬──< Status History
  │                             │                   └──< Drafts (AI Cover Letters)
  ├──< Candidate Profile        └──< Nudges (Follow-up alerts)
  └──< Import Jobs
                                Job Postings (Reusable job repository)
```

- **`users`**: Authentication credentials, email, hashed password.
- **`candidate_profiles`**: User's resume summary, target roles, top skills, and AI style preferences.
- **`job_postings`**: Company name, role title, location, salary range, description, and external ID.
- **`applications`**: Active application records linking user to job posting, with current status, notes, and application date.
- **`application_status_histories`**: Immutable audit log of status changes with timestamps.
- **`drafts`**: AI-generated cover letters with full version history and content.
- **`nudges`**: Scheduled reminders for stale or inactive applications.
- **`import_jobs`**: Status, file type, total rows, processed rows, and failure logs for dataset imports.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11 or higher
- Node.js 18+ & npm
- *(Optional)* Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository
```bash
git clone https://github.com/piyushb03/JobPilot.git
cd JobPilot
```

### 2. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment configuration
cp .env.example .env

# Run database migrations and seed sample data
alembic upgrade head
python seed.py

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
> The API will be available at [http://localhost:8000](http://localhost:8000) and interactive Swagger docs at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
> The React development application will be running at [http://localhost:5173](http://localhost:5173).

---

## ⚙️ Environment Variables Reference

Create a `backend/.env` file with the following configurations:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | SQLAlchemy connection string | `sqlite:///./sql_app.db` (Local) or `postgresql://user:pass@host/db` |
| `SECRET_KEY` | Secret key used to sign JWT auth tokens | `python -c "import secrets; print(secrets.token_hex(32))"` |
| `INTERNAL_CRON_SECRET`| Shared secret for scheduled cron endpoints | Set a strong random string |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:5173,http://localhost:3000` |
| `USE_MOCK_AI` | Toggle between mock responses and live Gemini | `false` |
| `GEMINI_API_KEY` | Google Gemini API key (easiest option) | Get from [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `GCP_PROJECT` | GCP Project ID (if using Vertex AI mode) | `your-gcp-project-id` |
| `GCP_LOCATION` | GCP Region for Vertex AI (easiest: `us-central1`) | `us-central1` |

---

## 📡 API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/health` | Health check endpoint |
| **Auth** | `POST` | `/api/auth/register` | Register a new user |
| **Auth** | `POST` | `/api/auth/token` | Login and receive JWT access token |
| **Auth** | `GET` | `/api/auth/me` | Current authenticated user info |
| **Profile** | `GET` / `PUT` | `/api/profile` | Read or update candidate profile |
| **Applications**| `GET` / `POST`| `/api/applications/` | List or create job applications |
| **Applications**| `GET` / `PATCH`| `/api/applications/{id}` | Read application or update status |
| **Applications**| `DELETE` | `/api/applications/{id}` | Delete job application |
| **AI Generation**| `POST` | `/api/ai/cover-letter` | Generate tailored cover letter draft |
| **AI Generation**| `GET` | `/api/ai/drafts/{id}` | Retrieve saved cover letter drafts |
| **Nudges** | `GET` | `/api/nudges/` | Fetch user's active smart nudges |
| **Nudges** | `PATCH` | `/api/nudges/{id}/dismiss` | Dismiss a specific nudge alert |
| **Imports** | `POST` | `/api/imports/upload` | Upload CSV or JSON dataset |
| **Internal** | `POST` | `/api/internal/scheduled-nudges`| Cloud Scheduler daily cron trigger |

---

## 🧪 Testing & Validation

Run the automated test suite with full database isolation:

```bash
cd backend
# Run test suite
pytest tests/ -v
```

Build and test frontend assets:
```bash
cd frontend
# TypeScript & Vite production build
npm run build
```

---

## ☁️ Production Deployment (Google Cloud Run)

### 1. Build & Push Container Image
```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/jobpilot
```

### 2. Deploy to Cloud Run
```bash
gcloud run deploy jobpilot \
  --image gcr.io/[PROJECT_ID]/jobpilot \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="USE_MOCK_AI=false,GCP_PROJECT=[PROJECT_ID]" \
  --set-secrets="DATABASE_URL=DB_URL:latest,SECRET_KEY=JWT_SECRET:latest,INTERNAL_CRON_SECRET=CRON_SECRET:latest"
```

### 3. Configure Cloud Scheduler (Smart Nudges)
```bash
gcloud scheduler jobs create http jobpilot-daily-nudges \
  --schedule="0 9 * * *" \
  --uri="https://[YOUR_CLOUD_RUN_URL]/api/internal/scheduled-nudges" \
  --http-method=POST \
  --headers="Authorization=Bearer [YOUR_CRON_SECRET]" \
  --time-zone="America/New_York"
```

---

## 🔒 Security Best Practices
- **JWT Authentication**: Passwords hashed with bcrypt; access tokens signed with HMAC-SHA256.
- **Protected Internal Hooks**: Scheduled nudge webhooks require a cryptographically secure Bearer secret.
- **Zero SQL Injection**: All queries executed via SQLAlchemy ORM parameterized queries.
- **Production Asset Isolation**: Production React SPA build served safely with strict API path exclusion.
- **Secrets Management**: Sensitive credentials managed through Google Cloud Secret Manager.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
