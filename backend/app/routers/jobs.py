from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, deps

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.get("", response_model=List[schemas.JobPostingResponse])
def read_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    jobs = db.query(models.JobPosting).filter(models.JobPosting.user_id == current_user.id).offset(skip).limit(limit).all()
    return jobs

@router.post("", response_model=schemas.JobPostingResponse, status_code=status.HTTP_201_CREATED)
def create_job(job: schemas.JobPostingCreate, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    db_job = models.JobPosting(**job.model_dump(), user_id=current_user.id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
