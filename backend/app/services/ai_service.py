import os
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from fastapi import HTTPException
from ..models import User, JobPosting, Application, Draft, DraftType
from sqlalchemy.orm import Session

# Initialize Vertex AI
# Note: For local dev without credentials, we provide a fallback mock.
PROJECT_ID = os.getenv("GCP_PROJECT", "mock-project-id")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")

# Check if we should use the mock (e.g. if we don't have real GCP credentials)
USE_MOCK_AI = os.getenv("USE_MOCK_AI", "true").lower() == "true"

if not USE_MOCK_AI:
    try:
        vertexai.init(project=PROJECT_ID, location=LOCATION)
        model = GenerativeModel("gemini-1.5-flash")
    except Exception as e:
        print(f"Failed to initialize Vertex AI: {e}")
        USE_MOCK_AI = True

def _build_candidate_context(user: User) -> str:
    ctx = f"Name: {user.name}\n"
    if user.professional_summary: ctx += f"Summary: {user.professional_summary}\n"
    if user.skills: ctx += f"Skills: {user.skills}\n"
    if user.experience: ctx += f"Experience: {user.experience}\n"
    if user.education: ctx += f"Education: {user.education}\n"
    if user.projects: ctx += f"Projects: {user.projects}\n"
    return ctx

def _build_job_context(job: JobPosting) -> str:
    return f"Role: {job.role}\nCompany: {job.company}\nDescription: {job.description or 'N/A'}"

