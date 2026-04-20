import os
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from .. import deps
from ..services import nudge_service

router = APIRouter(prefix="/api/internal", tags=["internal"])

# In a real GCP deployment, we'd verify OIDC tokens from Cloud Scheduler.
# For simplicity and given environment constraints, we use a shared secret.
INTERNAL_SECRET = os.getenv("INTERNAL_CRON_SECRET", "super-secret-cron-key-do-not-use-in-prod")

@router.post("/scheduled-nudges")
def trigger_scheduled_nudges(authorization: str = Header(None), db: Session = Depends(deps.get_db)):
    if authorization != f"Bearer {INTERNAL_SECRET}":
        raise HTTPException(status_code=401, detail="Unauthorized internal request")
        
    nudges = nudge_service.check_and_create_nudges(db)
    return {"status": "success", "nudges_created": len(nudges)}
