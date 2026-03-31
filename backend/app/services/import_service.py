import csv
import json
import io
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from ..models import User, JobPosting, ImportJob
from .. import schemas
from datetime import datetime, timezone

def process_upload(file: UploadFile, db: Session, user: User) -> schemas.ImportJobResponse:
    content = file.file.read()
    
    # Store original in mock GCS if configured, else skip
    # (Since GCP creds are not guaranteed, we skip real GCS upload in this basic logic)
    
    import_job = ImportJob(
        user_id=user.id,
        filename=file.filename,
        status="processing"
    )
    db.add(import_job)
    db.commit()
    db.refresh(import_job)
    
    processed = 0
    failed = 0
    errors = []
    
    try:
        if file.filename.endswith(".csv"):
            text_content = content.decode("utf-8")
            reader = csv.DictReader(io.StringIO(text_content))
            for row in reader:
                try:
                    # Expected minimal columns: id, from, to, type, description, company, role
                    # Mapping generic CSV to JobPosting
                    external_id = row.get("id") or row.get("external_id")
                    company = row.get("company", "Unknown Company")
                    role = row.get("role", "Unknown Role")
                    desc = row.get("description", "")
                    
                    if not external_id:
                        failed += 1
                        continue
                        
                    # Check for duplicate by external_id for this user
                    existing = db.query(JobPosting).filter(
                        JobPosting.user_id == user.id,
                        JobPosting.external_id == str(external_id)
                    ).first()
                    
                    if existing:
                        # Update
                        existing.company = company
                        existing.role = role
                        existing.description = desc
                        db.add(existing)
                    else:
                        # Insert
                        new_job = JobPosting(
