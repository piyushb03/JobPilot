from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, deps

router = APIRouter(prefix="/api/nudges", tags=["nudges"])

@router.get("", response_model=List[schemas.NudgeResponse])
def read_nudges(db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    nudges = db.query(models.Nudge).filter(models.Nudge.user_id == current_user.id).order_by(models.Nudge.created_at.desc()).all()
    return nudges

@router.post("/{nudge_id}/complete", response_model=schemas.NudgeResponse)
def complete_nudge(nudge_id: str, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    nudge = db.query(models.Nudge).filter(models.Nudge.id == nudge_id, models.Nudge.user_id == current_user.id).first()
    if not nudge:
        raise HTTPException(status_code=404, detail="Nudge not found")
        
    nudge.status = "completed"
    db.commit()
    db.refresh(nudge)
    return nudge
