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
