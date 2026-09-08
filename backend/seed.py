import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import User, JobPosting, Application, ApplicationStatus, ApplicationStatusHistory, Draft, DraftType, DraftStatus, Nudge
from app.auth import get_password_hash

def seed_data():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if user exists
        existing_user = db.query(User).filter(User.email == "demo@example.com").first()
        if existing_user:
            print("Seed data already exists. Exiting.")
            return

        print("Seeding user...")
        demo_user = User(
            id=str(uuid.uuid4()),
            email="demo@example.com",
            hashed_password=get_password_hash("demo123"),
            name="Jane Doe",
            phone="555-0199",
            location="San Francisco, CA",
            professional_summary="Experienced Full Stack Developer with 5+ years building scalable web applications.",
            skills='["Python", "React", "TypeScript", "PostgreSQL", "GCP"]'
        )
        db.add(demo_user)
        db.commit()

        print("Seeding jobs...")
        now = datetime.now(timezone.utc)
        
        jobs = [
            JobPosting(id=str(uuid.uuid4()), user_id=demo_user.id, company="TechCorp", role="Senior Software Engineer", location="Remote", employment_type="Full-time", description="We are looking for a senior engineer with Python and React experience to lead our product team.", created_at=now - timedelta(days=10)),
            JobPosting(id=str(uuid.uuid4()), user_id=demo_user.id, company="StartupInc", role="Backend Developer", location="New York, NY", employment_type="Full-time", description="Fast-paced startup needs a backend developer proficient in FastAPI and Postgres.", created_at=now - timedelta(days=8)),
            JobPosting(id=str(uuid.uuid4()), user_id=demo_user.id, company="GlobalSoft", role="Full Stack Developer", location="San Francisco, CA", employment_type="Contract", description="6-month contract for a full stack dev.", created_at=now - timedelta(days=2)),
        ]
        
        for j in jobs:
            db.add(j)
        db.commit()

        print("Seeding applications...")
        apps = [
            Application(id=str(uuid.uuid4()), user_id=demo_user.id, job_id=jobs[0].id, current_status=ApplicationStatus.Interview, application_date=now - timedelta(days=9)),
            Application(id=str(uuid.uuid4()), user_id=demo_user.id, job_id=jobs[1].id, current_status=ApplicationStatus.Applied, application_date=now - timedelta(days=7)),
            Application(id=str(uuid.uuid4()), user_id=demo_user.id, job_id=jobs[2].id, current_status=ApplicationStatus.Applied, application_date=now - timedelta(days=1)),
        ]
        
        for a in apps:
            db.add(a)
            # Add history
            db.add(ApplicationStatusHistory(application_id=a.id, old_status=None, new_status=ApplicationStatus.Applied, note="Applied online"))
            
        # Add interview history for first app
        db.add(ApplicationStatusHistory(application_id=apps[0].id, old_status=ApplicationStatus.Applied, new_status=ApplicationStatus.Interview, note="Invited to phone screen", changed_at=now - timedelta(days=5)))
        db.commit()
        
        print("Seeding drafts and nudges...")
        db.add(Draft(user_id=demo_user.id, application_id=apps[0].id, job_id=jobs[0].id, type=DraftType.cover_letter, contents="Dear TechCorp Team, I am excited to apply...", status=DraftStatus.sent))
        
        db.add(Nudge(user_id=demo_user.id, application_id=apps[1].id, scheduled_for=now, type="stale_application_reminder", message=f"It's been 7 days since you applied to {jobs[1].company}. Time to check in on your application status!"))
        db.commit()

        print("Seeding completed successfully!")
        print("Login with email: demo@example.com / password: demo123")

    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
