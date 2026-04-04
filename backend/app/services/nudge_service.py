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
        
        if not existing_nudge:
            # Check if they already sent a follow up draft?
            # We assume if no "sent" follow_up draft exists, they haven't followed up
            from ..models import Draft, DraftType, DraftStatus
            sent_followup = db.query(Draft).filter(
                Draft.application_id == app.id,
                Draft.type == DraftType.follow_up_email,
                Draft.status == DraftStatus.sent
            ).first()
            
            if not sent_followup:
                new_nudge = Nudge(
                    application_id=app.id,
                    user_id=app.user_id,
                    scheduled_for=datetime.now(timezone.utc),
                    type="follow_up_email_reminder",
                    message=f"It's been over 5 days since you applied to {app.job.company}. Consider sending a follow-up email."
                )
                db.add(new_nudge)
                nudges_created.append(new_nudge)
                
    db.commit()
    for n in nudges_created:
        db.refresh(n)
        
    return nudges_created
