import os
from dotenv import load_dotenv
from fastapi import HTTPException
from ..models import User, JobPosting, Application, Draft, DraftType
from sqlalchemy.orm import Session

# Load environment variables (.env)
load_dotenv()

# Configuration
PROJECT_ID = os.getenv("GCP_PROJECT", "")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")
USE_MOCK_AI = os.getenv("USE_MOCK_AI", "true").lower() == "true"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Determine which provider to use
_provider = "mock"
_client = None
_model_name = "gemini-2.5-flash"

if not USE_MOCK_AI:
    if GEMINI_API_KEY:
        # Use google-genai SDK with API key (no GCP auth required)
        try:
            from google import genai  # type: ignore
            _client = genai.Client(api_key=GEMINI_API_KEY)
            _model_name = "gemini-2.5-flash"
            _provider = "genai"
            print("AI provider: google-genai SDK (Gemini API key)")
        except ImportError:
            print("google-genai not installed, falling back to mock AI.")
        except Exception as e:
            print(f"Failed to init google-genai: {e}, falling back to mock AI.")
    elif PROJECT_ID:
        # Use Vertex AI via google-genai (requires GCP credentials)
        try:
            from google import genai  # type: ignore
            _client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
            _model_name = "gemini-2.5-flash"
            _provider = "vertex"
            print(f"AI provider: Vertex AI (project={PROJECT_ID})")
        except Exception as e:
            print(f"Failed to initialize Vertex AI: {e}, falling back to mock AI.")
    else:
        print("No AI credentials configured (GEMINI_API_KEY or GCP_PROJECT). Running with mock AI.")


def get_ai_mode() -> str:
    """Return the current AI provider mode."""
    return _provider


def _call_ai(prompt: str) -> str:
    """Route prompt to the appropriate AI provider."""
    if _provider in ("genai", "vertex") and _client is not None:
        response = _client.models.generate_content(
            model=_model_name,
            contents=prompt,
        )
        return (response.text or "").strip()
    else:
        raise ValueError("Mock mode — should not call _call_ai directly")


def _build_candidate_context(user: User) -> str:
    ctx = f"Name: {user.name or 'Not provided'}\n"
    if user.professional_summary:
        ctx += f"Summary: {user.professional_summary}\n"
    if user.skills:
        ctx += f"Skills: {user.skills}\n"
    if user.experience:
        ctx += f"Experience: {user.experience}\n"
    if user.education:
        ctx += f"Education: {user.education}\n"
    if user.projects:
        ctx += f"Projects: {user.projects}\n"
    return ctx


def _build_job_context(job: JobPosting) -> str:
    return (
        f"Role: {job.role}\n"
        f"Company: {job.company}\n"
        f"Location: {job.location or 'Not specified'}\n"
        f"Employment Type: {job.employment_type or 'Not specified'}\n"
        f"Description: {job.description or 'No description provided'}"
    )


def generate_cover_letter(db: Session, user: User, application: Application) -> str:
    job = application.job
    candidate_ctx = _build_candidate_context(user)
    job_ctx = _build_job_context(job)

    # Get past cover letters for style matching
    past_drafts = (
        db.query(Draft)
        .filter(Draft.user_id == user.id, Draft.type == DraftType.cover_letter)
        .order_by(Draft.created_at.desc())
        .limit(2)
        .all()
    )
    past_ctx = ""
    if past_drafts:
        past_ctx = "\nHere are examples of my past cover letters for style reference ONLY (do not copy facts from them):\n"
        for d in past_drafts:
            past_ctx += f"---\n{d.contents[:500]}\n"

    prompt = f"""You are an expert career coach writing a highly tailored cover letter.

Candidate Profile (Use ONLY these facts — do NOT invent experience, employers, degrees, or certifications):
{candidate_ctx}

Job Description:
{job_ctx}
{past_ctx}

Instructions:
- Write a professional, concise cover letter tailored to the job description.
- Highlight how the candidate's specific skills and experience match the role.
- Do not include placeholder text like [Company Name]; use the actual company name from the job description.
- Keep it under 400 words.
- Format with a greeting, 2-3 body paragraphs, and a closing.
- DO NOT hallucinate or invent any qualifications or experience not explicitly listed in the Candidate Profile.
"""

    if _provider == "mock":
        name = user.name or "Applicant"
        return (
            f"Dear Hiring Manager at {job.company},\n\n"
            f"I am writing to express my strong interest in the {job.role} position at {job.company}. "
            f"With my background in {user.skills or 'relevant technologies'}, I am confident I would be a valuable addition to your team.\n\n"
            f"Your job description aligns closely with my experience, particularly in areas that drive meaningful impact. "
            f"I am excited about the opportunity to contribute to {job.company}'s mission and would welcome the chance to discuss how my skills can benefit your team.\n\n"
            f"Thank you for your consideration.\n\nSincerely,\n{name}"
        )

    try:
        return _call_ai(prompt)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI generation failed: {str(e)}. Check your AI API configuration."
        )

