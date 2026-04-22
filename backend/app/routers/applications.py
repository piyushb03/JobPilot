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

@router.get("/{app_id}", response_model=schemas.ApplicationResponse)
def read_application(app_id: str, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    app = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == current_user.id).first()
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(app_id: str, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    app = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == current_user.id).first()
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    db.delete(app)
    db.commit()
    return None

@router.post("/{app_id}/status", response_model=schemas.ApplicationStatusHistoryResponse)
def update_status(app_id: str, status_update: schemas.ApplicationStatusUpdate, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    app = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == current_user.id).first()
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    old_status = app.current_status
    app.current_status = status_update.status
    
    history = models.ApplicationStatusHistory(
        application_id=app.id,
        old_status=old_status,
        new_status=status_update.status,
        note=status_update.note
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    
    # Nudge logic (removing old nudges if moving past applied, etc) could be triggered here
    return history

@router.get("/{app_id}/history", response_model=List[schemas.ApplicationStatusHistoryResponse])
def read_application_history(app_id: str, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    app = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == current_user.id).first()
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    history = db.query(models.ApplicationStatusHistory).filter(models.ApplicationStatusHistory.application_id == app_id).order_by(models.ApplicationStatusHistory.changed_at.desc()).all()
    return history

@router.get("/{app_id}/drafts", response_model=List[schemas.DraftResponse])
def read_application_drafts(app_id: str, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    app = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == current_user.id).first()
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")
        
    drafts = db.query(models.Draft).filter(models.Draft.application_id == app_id).order_by(models.Draft.created_at.desc()).all()
    return drafts
