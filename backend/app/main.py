import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .database import engine, Base
from .routers import auth, jobs, applications, profile, ai, nudges, internal, imports

# Create all tables on startup (Alembic handles production migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JobPilot API",
    description="AI-powered job application tracker",
    version="1.0.0",
)

# CORS configuration — restrict in production via ALLOWED_ORIGINS env var
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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


# Serve the React SPA in production (when frontend is built into backend/static/)
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.exists(static_dir):
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Do not intercept API routes
        if full_path.startswith("api") or full_path == "health":
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Not Found")
        index_path = os.path.join(static_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"detail": "Frontend not built yet. Run: cd frontend && npm run build"}
