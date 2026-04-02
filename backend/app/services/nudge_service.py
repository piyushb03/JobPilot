from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from ..models import Application, Nudge, ApplicationStatus

def check_and_create_nudges(db: Session):
    # Rule: If status = Applied, application date >= 5 days ago, no follow-up sent recently
    # Then create a nudge.
    
    five_days_ago = datetime.now(timezone.utc) - timedelta(days=5)
    
    # Find all applications that are in "Applied" state and older than 5 days
    stale_apps = db.query(Application).filter(
        Application.current_status == ApplicationStatus.Applied,
        Application.application_date <= five_days_ago
    ).all()
    
    nudges_created = []
    
    for app in stale_apps:
        # Check if a pending nudge already exists for this app
        existing_nudge = db.query(Nudge).filter(
            Nudge.application_id == app.id,
            Nudge.status == "pending"
        ).first()
        
