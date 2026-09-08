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
    from_date = Column(DateTime(timezone=True))
    to_date = Column(DateTime(timezone=True))
    source_url = Column(String)
    
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    user = relationship("User", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    drafts = relationship("Draft", back_populates="job", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    job_id = Column(String, ForeignKey("job_postings.id"), index=True, nullable=False)
    application_date = Column(DateTime(timezone=True), default=get_utc_now, index=True)
    current_status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.Applied, index=True)
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    user = relationship("User", back_populates="applications")
    job = relationship("JobPosting", back_populates="applications")
    status_history = relationship("ApplicationStatusHistory", back_populates="application", cascade="all, delete-orphan")
    drafts = relationship("Draft", back_populates="application", cascade="all, delete-orphan")
    nudges = relationship("Nudge", back_populates="application", cascade="all, delete-orphan")

class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"

    id = Column(String, primary_key=True, default=generate_uuid)
    application_id = Column(String, ForeignKey("applications.id"), index=True, nullable=False)
    old_status = Column(SQLEnum(ApplicationStatus))
    new_status = Column(SQLEnum(ApplicationStatus), nullable=False)
    changed_at = Column(DateTime(timezone=True), default=get_utc_now)
    note = Column(Text)

    application = relationship("Application", back_populates="status_history")

class Draft(Base):
    __tablename__ = "drafts"

    id = Column(String, primary_key=True, default=generate_uuid)
    application_id = Column(String, ForeignKey("applications.id"), index=True, nullable=True)
    job_id = Column(String, ForeignKey("job_postings.id"), index=True, nullable=True)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    
    type = Column(SQLEnum(DraftType), nullable=False, index=True)
    contents = Column(Text, nullable=False)
    status = Column(SQLEnum(DraftStatus), default=DraftStatus.draft)
    
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)

    user = relationship("User", back_populates="drafts")
    job = relationship("JobPosting", back_populates="drafts")
    application = relationship("Application", back_populates="drafts")

class Nudge(Base):
    __tablename__ = "nudges"

    id = Column(String, primary_key=True, default=generate_uuid)
    application_id = Column(String, ForeignKey("applications.id"), index=True, nullable=False)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    
    scheduled_for = Column(DateTime(timezone=True), index=True, nullable=False)
    type = Column(String, nullable=False) # e.g. "follow_up_email_reminder"
    message = Column(Text)
    status = Column(String, default="pending") # pending, completed, cancelled
    
    created_at = Column(DateTime(timezone=True), default=get_utc_now)

    user = relationship("User", back_populates="nudges")
    application = relationship("Application", back_populates="nudges")

class ImportJob(Base):
    __tablename__ = "import_jobs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    filename = Column(String, nullable=False)
    status = Column(String, default="processing") # processing, completed, failed
    records_processed = Column(Integer, default=0)
    records_failed = Column(Integer, default=0)
    error_summary = Column(Text)
    
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    completed_at = Column(DateTime(timezone=True))

    user = relationship("User", back_populates="import_jobs")
