from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from .. import schemas, models, deps

router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.get("", response_model=List[schemas.ApplicationResponse])
def read_applications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
):
    apps = (
        db.query(models.Application)
        .filter(models.Application.user_id == current_user.id)
        .order_by(models.Application.application_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return apps


@router.post("", response_model=schemas.ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    app: schemas.ApplicationCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
):
    # Verify job belongs to user
    job = (
        db.query(models.JobPosting)
        .filter(
            models.JobPosting.id == app.job_id,
            models.JobPosting.user_id == current_user.id,
        )
        .first()
    )
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Prevent duplicate applications for the same job
    existing = (
        db.query(models.Application)
        .filter(
            models.Application.job_id == app.job_id,
            models.Application.user_id == current_user.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You already have an application for this job.",
        )

    db_app = models.Application(**app.model_dump(), user_id=current_user.id)
    db.add(db_app)
    db.commit()
    db.refresh(db_app)

    # Record initial status in history
    history = models.ApplicationStatusHistory(
        application_id=db_app.id,
        old_status=None,
        new_status=db_app.current_status,
        note="Initial application status",
    )
    db.add(history)
    db.commit()

    return db_app


@router.get("/{app_id}", response_model=schemas.ApplicationResponse)
def read_application(
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
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.patch("/{app_id}", response_model=schemas.ApplicationResponse)
def update_application(
    app_id: str,
    update_data: schemas.ApplicationUpdate,
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
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")

    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(app, key, value)

    db.commit()
    db.refresh(app)
    return app


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
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
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(app)
    db.commit()
    return None


@router.post("/{app_id}/status", response_model=schemas.ApplicationStatusHistoryResponse)
def update_status(
    app_id: str,
    status_update: schemas.ApplicationStatusUpdate,
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
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = app.current_status
    app.current_status = status_update.status

    history = models.ApplicationStatusHistory(
        application_id=app.id,
        old_status=old_status,
        new_status=status_update.status,
        note=status_update.note,
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    return history


@router.get("/{app_id}/history", response_model=List[schemas.ApplicationStatusHistoryResponse])
def read_application_history(
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
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")

    history = (
        db.query(models.ApplicationStatusHistory)
        .filter(models.ApplicationStatusHistory.application_id == app_id)
        .order_by(models.ApplicationStatusHistory.changed_at.desc())
        .all()
    )
    return history


@router.get("/{app_id}/drafts", response_model=List[schemas.DraftResponse])
def read_application_drafts(
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
    if app is None:
        raise HTTPException(status_code=404, detail="Application not found")

    drafts = (
        db.query(models.Draft)
        .filter(models.Draft.application_id == app_id)
        .order_by(models.Draft.created_at.desc())
        .all()
    )
    return drafts


@router.put("/{app_id}/drafts/{draft_id}", response_model=schemas.DraftResponse)
def update_draft(
    app_id: str,
    draft_id: str,
    draft_update: schemas.DraftUpdateRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
):
    """Update the contents and/or status of a draft."""
    draft = (
        db.query(models.Draft)
        .filter(
            models.Draft.id == draft_id,
            models.Draft.user_id == current_user.id,
            models.Draft.application_id == app_id,
        )
        .first()
    )
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    for key, value in draft_update.model_dump(exclude_unset=True).items():
        setattr(draft, key, value)

    db.commit()
    db.refresh(draft)
    return draft


@router.post("/{app_id}/drafts/{draft_id}/mark-sent", response_model=schemas.DraftResponse)
def mark_draft_sent(
    app_id: str,
    draft_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
):
    """Mark a draft as sent."""
    draft = (
        db.query(models.Draft)
        .filter(
            models.Draft.id == draft_id,
            models.Draft.user_id == current_user.id,
            models.Draft.application_id == app_id,
        )
        .first()
    )
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    draft.status = models.DraftStatus.sent
    db.commit()
    db.refresh(draft)
    return draft
