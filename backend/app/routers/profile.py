from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, models, deps

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("", response_model=schemas.UserResponse)
def read_profile(current_user: models.User = Depends(deps.get_current_user)):
    return current_user

@router.put("", response_model=schemas.UserResponse)
def update_profile(profile_update: schemas.UserBase, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    for key, value in profile_update.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user
