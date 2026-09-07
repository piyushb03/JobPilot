from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator
from typing import Optional, List
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
    password: str = Field(..., min_length=6, max_length=128)

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and len(v.strip()) == 0:
            raise ValueError("Name cannot be empty")
        return v


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
    company: str = Field(..., min_length=1, max_length=200)
    role: str = Field(..., min_length=1, max_length=200)
    location: Optional[str] = Field(None, max_length=200)
    employment_type: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=10000)
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None
    source_url: Optional[str] = Field(None, max_length=2000)
    external_id: Optional[str] = Field(None, max_length=200)


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
    notes: Optional[str] = Field(None, max_length=5000)


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    notes: Optional[str] = Field(None, max_length=5000)
    current_status: Optional[ApplicationStatus] = None


class ApplicationResponse(ApplicationBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    job: JobPostingResponse

    model_config = ConfigDict(from_attributes=True)


class ApplicationStatusHistoryResponse(BaseModel):
    id: str
    application_id: str
    old_status: Optional[ApplicationStatus]
    new_status: ApplicationStatus
    changed_at: datetime
    note: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
    note: Optional[str] = Field(None, max_length=500)


# --- Draft Schemas ---
class DraftBase(BaseModel):
    type: DraftType
    contents: str = Field(..., min_length=1)
    status: DraftStatus = DraftStatus.draft


class DraftCreate(DraftBase):
    application_id: Optional[str] = None
    job_id: Optional[str] = None


class DraftUpdateRequest(BaseModel):
    contents: Optional[str] = Field(None, min_length=1)
    status: Optional[DraftStatus] = None


class DraftResponse(DraftBase):
    id: str
    application_id: Optional[str] = None
    job_id: Optional[str] = None
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Nudge Schemas ---
class NudgeBase(BaseModel):
    scheduled_for: datetime
    type: str
    message: Optional[str] = None
    status: str = "pending"


class NudgeCreate(NudgeBase):
    application_id: str


class NudgeResponse(NudgeBase):
    id: str
    application_id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- ImportJob Schemas ---
class ImportJobResponse(BaseModel):
    id: str
    user_id: str
    filename: str
    status: str
    records_processed: int
    records_failed: int
    error_summary: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
