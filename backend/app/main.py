from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.core.config import settings
from app.core.database import init_db
from app.api.v1 import telephony, encounters, triage, catalog, doctors, qr, a2ui

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    await init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production Python FastAPI & PostgreSQL Backend for DrGodly AI Clinical Counter Assist.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Enable CORS for React Native Expo & Web
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Routers
app.include_router(telephony.router, prefix=settings.API_V1_STR)
app.include_router(encounters.router, prefix=settings.API_V1_STR)
app.include_router(triage.router, prefix=settings.API_V1_STR)
app.include_router(catalog.router, prefix=settings.API_V1_STR)
app.include_router(doctors.router, prefix=settings.API_V1_STR)
app.include_router(qr.router, prefix=settings.API_V1_STR)
app.include_router(a2ui.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "PostgreSQL (Asyncpg / SQLAlchemy 2.0)",
        "jurisdiction": "CDSCO 2026 / DPDP Act 2023 / Telemedicine Practice Guidelines 2020",
        "timestamp": datetime.utcnow().isoformat(),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
