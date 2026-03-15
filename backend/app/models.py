from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
import uuid

from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

def get_utc_now():
    return datetime.now(timezone.utc)

class ApplicationStatus(str, enum.Enum):
    Applied = "Applied"
    Interview = "Interview"
    Offer = "Offer"
    Reject = "Reject"
    Withdrawn = "Withdrawn"

class DraftType(str, enum.Enum):
    cover_letter = "cover_letter"
    follow_up_email = "follow_up_email"

class DraftStatus(str, enum.Enum):
    draft = "draft"
    sent = "sent"
    archived = "archived"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String)
    
    # Profile fields
    phone = Column(String)
    location = Column(String)
    professional_summary = Column(Text)
    education = Column(Text) # Stored as JSON string
    skills = Column(Text) # Stored as JSON string
    experience = Column(Text) # Stored as JSON string
    projects = Column(Text) # Stored as JSON string
    linkedin_url = Column(String)
    github_url = Column(String)
    portfolio_url = Column(String)

    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    jobs = relationship("JobPosting", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    drafts = relationship("Draft", back_populates="user", cascade="all, delete-orphan")
    nudges = relationship("Nudge", back_populates="user", cascade="all, delete-orphan")
    import_jobs = relationship("ImportJob", back_populates="user", cascade="all, delete-orphan")

class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    external_id = Column(String, index=True) # Source ID if imported
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    location = Column(String)
    employment_type = Column(String)
    description = Column(Text)
