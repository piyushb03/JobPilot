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

def generate_cover_letter(db: Session, user: User, application: Application) -> str:
    job = application.job
    candidate_ctx = _build_candidate_context(user)
    job_ctx = _build_job_context(job)
    
    # Get past cover letters for context (to match style, avoiding blind copying)
    past_drafts = db.query(Draft).filter(Draft.user_id == user.id, Draft.type == DraftType.cover_letter).limit(2).all()
    past_ctx = ""
    if past_drafts:
        past_ctx = "\nHere are examples of my past cover letters for style reference ONLY (do not copy facts from them):\n"
        for d in past_drafts:
            past_ctx += f"---\n{d.contents}\n"

    prompt = f"""
    You are an expert career coach writing a highly tailored cover letter.
    
    Candidate Profile (Use only these facts, do NOT invent experience, employers, degrees, or certifications):
    {candidate_ctx}
    
    Job Description:
    {job_ctx}
    {past_ctx}
    
    Instructions:
    - Write a professional, concise cover letter tailored to the job description.
    - Highlight how the candidate's specific skills and experience match the role.
    - Do not include placeholder text like [Company Name], infer it from the context if possible, or omit it.
    - Keep it under 400 words.
    - DO NOT hallucinate or invent any qualifications or experience not explicitly listed in the Candidate Profile.
    """
    
    if USE_MOCK_AI:
        return f"Dear Hiring Manager at {job.company},\n\nI am writing to express my strong interest in the {job.role} position. Based on my background...\n\n[MOCK AI GENERATED CONTENT]"
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

def generate_follow_up(db: Session, user: User, application: Application) -> str:
    job = application.job
    days_since = (Application.application_date - application.application_date).days # Mock diff
    # We should calculate real days since application
    from datetime import datetime, timezone
    days_since = (datetime.now(timezone.utc) - application.application_date).days
    
    prompt = f"""
    You are an expert career coach writing a polite follow-up email for a job application.
    
    Candidate Name: {user.name}
    Role: {job.role}
    Company: {job.company}
    Days since applied: {days_since}
    Current Status: {application.current_status}
    
    Instructions:
    - Write a short, professional follow-up email to check on the application status.
    - Be polite and concise.
    - Do not invent any additional facts.
    """
    
    if USE_MOCK_AI:
        return f"Hi Hiring Team at {job.company},\n\nI'm following up on my application for the {job.role} position submitted {days_since} days ago. I remain very interested...\n\n[MOCK AI GENERATED CONTENT]"
        
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
