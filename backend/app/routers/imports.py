from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, deps
from ..services import import_service

router = APIRouter(prefix="/api/import", tags=["import"])

@router.post("/jobs", response_model=schemas.ImportJobResponse)
def import_jobs(file: UploadFile = File(...), db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    if not (file.filename.endswith(".csv") or file.filename.endswith(".json")):
        raise HTTPException(status_code=400, detail="Only .csv and .json files are supported")
        
    result = import_service.process_upload(file, db, current_user)
    return result

@router.get("/jobs/{import_id}", response_model=schemas.ImportJobResponse)
def get_import_job(import_id: str, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    import_job = db.query(models.ImportJob).filter(
        models.ImportJob.id == import_id,
        models.ImportJob.user_id == current_user.id
    ).first()
    
    if not import_job:
        raise HTTPException(status_code=404, detail="Import job not found")
        
    return import_job
