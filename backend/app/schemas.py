from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from .models import ApplicationStatus, DraftType, DraftStatus

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    professional_summary: Optional[str] = None
    education: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[str] = None
    projects: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Job Posting Schemas ---
class JobPostingBase(BaseModel):
    company: str
    role: str
    location: Optional[str] = None
    employment_type: Optional[str] = None
    description: Optional[str] = None
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None
    source_url: Optional[str] = None
    external_id: Optional[str] = None

class JobPostingCreate(JobPostingBase):
    pass

class JobPostingResponse(JobPostingBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Application Schemas ---
class ApplicationBase(BaseModel):
    job_id: str
    application_date: Optional[datetime] = None
    current_status: ApplicationStatus = ApplicationStatus.Applied
    notes: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
