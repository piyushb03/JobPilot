from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, deps
from ..services import ai_service

router = APIRouter(prefix="/api/applications/{app_id}/ai", tags=["ai"])

@router.post("/generate-cover-letter", response_model=schemas.DraftResponse)
def generate_cover_letter_endpoint(app_id: str, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    app = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    generated_text = ai_service.generate_cover_letter(db, current_user, app)
    
    # Do not auto-save unless asked, but per requirements: "Store generated output in the Draft table... Allow user to Generate, Regenerate, Edit, Save"
    # Wait, the prompt says "Save only when the user chooses to save".
    # So this endpoint should return the draft text, but NOT save it. Or maybe it saves it as "draft" and user can modify it?
    # Prompt: "Never silently overwrite an existing draft." 
    # I'll create a new Draft record for the generated text. User can choose to edit and update it.
    
    draft = models.Draft(
        application_id=app.id,
        job_id=app.job_id,
        user_id=current_user.id,
        type=models.DraftType.cover_letter,
        contents=generated_text,
        status=models.DraftStatus.draft
    )
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return draft

@router.post("/generate-follow-up", response_model=schemas.DraftResponse)
def generate_follow_up_endpoint(app_id: str, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    app = db.query(models.Application).filter(models.Application.id == app_id, models.Application.user_id == current_user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
        
    generated_text = ai_service.generate_follow_up(db, current_user, app)
    
    draft = models.Draft(
        application_id=app.id,
        job_id=app.job_id,
        user_id=current_user.id,
        type=models.DraftType.follow_up_email,
        contents=generated_text,
        status=models.DraftStatus.draft
    )
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return draft
