from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from .database import engine, Base
from .routers import auth, jobs, applications, profile, ai, nudges, internal, imports

# Create all tables (in a real app, use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="JobPilot API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(profile.router)
app.include_router(ai.router)
app.include_router(nudges.router)
app.include_router(internal.router)
app.include_router(imports.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Mount React App
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Ignore API routes
        if full_path.startswith("api"):
            return {"detail": "Not Found"}
        index_path = os.path.join(static_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"detail": "Frontend not built yet"}
