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
                            user_id=user.id,
                            external_id=str(external_id),
                            company=company,
                            role=role,
                            description=desc,
                            employment_type=row.get("type"),
                        )
                        db.add(new_job)
                    processed += 1
                except Exception as e:
                    failed += 1
                    errors.append(f"Row error: {str(e)}")
                    
        elif file.filename.endswith(".json"):
            data = json.loads(content)
            if not isinstance(data, list):
                raise ValueError("JSON must be an array of objects")
                
            for item in data:
                try:
                    external_id = item.get("id")
                    if not external_id:
                        failed += 1
                        continue
                        
                    company = item.get("company", "Unknown")
                    role = item.get("role", "Unknown")
                    
                    existing = db.query(JobPosting).filter(
                        JobPosting.user_id == user.id,
                        JobPosting.external_id == str(external_id)
                    ).first()
                    
                    if existing:
                        existing.company = company
                        existing.role = role
                        existing.description = item.get("description")
                    else:
                        new_job = JobPosting(
                            user_id=user.id,
                            external_id=str(external_id),
                            company=company,
                            role=role,
                            description=item.get("description"),
                        )
                        db.add(new_job)
                    processed += 1
                except Exception as e:
                    failed += 1
                    errors.append(f"Item error: {str(e)}")
        else:
            raise ValueError("Unsupported file type. Use .csv or .json")
            
        db.commit()
        import_job.status = "completed"
        
    except Exception as e:
        db.rollback()
        import_job.status = "failed"
        errors.append(f"Fatal error: {str(e)}")
        
    import_job.records_processed = processed
    import_job.records_failed = failed
    import_job.error_summary = "\n".join(errors[:5]) # Store first 5 errors max
    import_job.completed_at = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(import_job)
    return import_job
