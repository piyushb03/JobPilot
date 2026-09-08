# JobPilot — AI Job Application Tracker

## 1. Project Overview
JobPilot is a production-ready web application for job seekers to track job applications, generate tailored AI cover letters, import datasets, and receive scheduled smart nudges for stale applications.

## 2. Main Features
- **Application Tracking**: Pipeline view (Applied → Interview → Offer → Reject).
- **AI Generation**: Vertex AI Gemini-powered tailored cover letters.
- **Smart Nudges**: Automatic reminders for applications needing attention.
- **Data Ingestion**: Import bulk job postings via CSV/JSON.
- **Candidate Profile**: Centralized profile for AI context generation.

## 3. Architecture
The application uses a unified container approach for simple deployment. The Vite-built React frontend is served statically by the FastAPI backend. This ensures a single service deployment to Cloud Run while keeping a clean separation of concerns in development.

## 4. Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS v4, React Query, React Router, Lucide Icons.
- **Backend**: Python 3.13, FastAPI, SQLAlchemy, Alembic, Pydantic, JWT Auth.
- **Database**: PostgreSQL.

## 5. GCP Services Used
- **Cloud Run**: Serverless container hosting.
- **Cloud SQL (PostgreSQL)**: Managed relational database.
- **Vertex AI (Gemini)**: LLM for draft generation.
- **Cloud Scheduler**: Cron jobs for smart nudges.
- **Artifact Registry**: Docker image storage.
- **Secret Manager**: Secure environment variable injection.

## 6. Database Model
- `User`: Authentication and profile details.
- `JobPosting`: Company, role, and description.
- `Application`: Tracks the current state of a job application.
- `ApplicationStatusHistory`: Immutable log of state transitions.
- `Draft`: Saved AI-generated cover letters.
- `Nudge`: Scheduled reminders.
- `ImportJob`: Tracks data ingestion status.

## 7. AI Flow
1. User requests a cover letter.
2. `ai_service` constructs a prompt using the Candidate Profile + Job Description + Past Drafts (for style matching).
3. Sends request to Vertex AI Gemini (`gemini-2.5-flash`).
4. Result is saved as a Draft for user review and editing.

## 8. Import Flow
1. User uploads a `.csv` or `.json` file.
2. `import_service` parses the file, matches external IDs to prevent duplicates.
3. Successfully parsed rows are inserted into `JobPosting`.
4. Results and errors are aggregated and stored in `ImportJob`.

## 9. Scheduled Nudge Flow
1. Cloud Scheduler pings `POST /api/internal/scheduled-nudges` daily.
2. Backend checks for applications in `Applied` state for >5 days without activity.
3. Generates a `Nudge` record.
4. Dashboard alerts the user to take action.

## 10. Local Development
```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
alembic upgrade head
python seed.py
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

## 11. Environment Variables
See `.env.example`. Make sure to provide `DATABASE_URL` for PostgreSQL. Local dev defaults to SQLite if omitted.

## 12. Testing
```bash
cd backend
pytest tests/
```

## 13. GCP Setup
```bash
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
gcloud services enable run.googleapis.com sqladmin.googleapis.com aiplatform.googleapis.com secretmanager.googleapis.com cloudscheduler.googleapis.com
```

## 14. Deployment
```bash
# Build and Push
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/jobpilot

# Deploy to Cloud Run
gcloud run deploy jobpilot \
  --image gcr.io/[YOUR_PROJECT_ID]/jobpilot \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="USE_MOCK_AI=false,GCP_PROJECT=[YOUR_PROJECT_ID]" \
  --set-secrets="DATABASE_URL=DB_URL:latest,SECRET_KEY=JWT_SECRET:latest,INTERNAL_CRON_SECRET=CRON_SECRET:latest"
```

## 15. Cloud Scheduler Setup
```bash
gcloud scheduler jobs create http nudge-job \
  --schedule="0 9 * * *" \
  --uri="https://[YOUR_CLOUD_RUN_URL]/api/internal/scheduled-nudges" \
  --http-method=POST \
  --headers="Authorization=Bearer [YOUR_CRON_SECRET]" \
  --time-zone="America/New_York"
```

## 16. Security Considerations
- JWT-based authentication for all endpoints.
- Cloud Scheduler uses a secure shared secret header to prevent public triggering.
- SQL Injection prevented via SQLAlchemy ORM.
- Environment variables managed securely via Secret Manager in production.

## 17. Screenshots
<img width="959" height="503" alt="image" src="https://github.com/user-attachments/assets/c88848b8-1cee-4cc6-85d4-ac00249830b1" />

<img width="959" height="502" alt="image" src="https://github.com/user-attachments/assets/6452a562-cdae-4c27-9c9d-fc03cadc6a35" />

<img width="959" height="503" alt="image" src="https://github.com/user-attachments/assets/25470929-5ea7-4439-b995-bf2362da2254" />

<img width="959" height="504" alt="image" src="https://github.com/user-attachments/assets/3b246d77-6d9c-490f-9b00-cf4acf0eb41c" />

<img width="959" height="505" alt="image" src="https://github.com/user-attachments/assets/0a0aecf4-e61e-4568-9ed8-4631f179a006" />

<img width="959" height="503" alt="image" src="https://github.com/user-attachments/assets/31eb11f9-2a0b-417a-b475-2790413ae864" />

<img width="959" height="502" alt="image" src="https://github.com/user-attachments/assets/c2bcae78-9a68-4225-9aa1-5fbcb655a18a" />





## 18. Future Improvements
- Resume parsing (PDF to Candidate Profile).
- OAuth2 (Google Sign-In) integration.
