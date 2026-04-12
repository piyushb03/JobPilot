from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, deps

router = APIRouter(prefix="/api/applications", tags=["applications"])

@router.get("", response_model=List[schemas.ApplicationResponse])
def read_applications(skip: int = 0, limit: int = 100, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    apps = db.query(models.Application).filter(models.Application.user_id == current_user.id).offset(skip).limit(limit).all()
    return apps

@router.post("", response_model=schemas.ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(app: schemas.ApplicationCreate, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    # Verify job belongs to user
    job = db.query(models.JobPosting).filter(models.JobPosting.id == app.job_id, models.JobPosting.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db_app = models.Application(**app.model_dump(), user_id=current_user.id)
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    
    # Record initial status
    history = models.ApplicationStatusHistory(
        application_id=db_app.id,
        old_status=None,
        new_status=db_app.current_status,
        note="Initial application status"
    )
    db.add(history)
    db.commit()
    
    return db_app
