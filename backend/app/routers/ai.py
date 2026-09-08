from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, deps
from ..services import ai_service

router = APIRouter(prefix="/api/applications/{app_id}/ai", tags=["ai"])


@router.get("/mode")
def get_ai_mode(current_user: models.User = Depends(deps.get_current_user)):
    """Return the current AI provider mode (mock, genai, vertex)."""
    return {"mode": ai_service.get_ai_mode()}


@router.post("/generate-cover-letter", response_model=schemas.DraftResponse)
def generate_cover_letter_endpoint(
    app_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
):
    app = (
        db.query(models.Application)
        .filter(
            models.Application.id == app_id,
            models.Application.user_id == current_user.id,
        )
        .first()
    )
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    generated_text = ai_service.generate_cover_letter(db, current_user, app)

    draft = models.Draft(
        application_id=app.id,
        job_id=app.job_id,
        user_id=current_user.id,
        type=models.DraftType.cover_letter,
        contents=generated_text,
        status=models.DraftStatus.draft,
    )
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return draft

