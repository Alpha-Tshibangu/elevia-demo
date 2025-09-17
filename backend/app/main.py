from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from app.routers import organizations, financial_metrics, data_sources, model_scenarios, reports, transactions, enhanced_models

app = FastAPI(
    title="Elevia Financial Intelligence API",
    description="Sophisticated data solutions for asset managers and family offices",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    organizations.router,
    prefix="/api/v1/organizations",
    tags=["organizations"]
)
app.include_router(
    financial_metrics.router,
    prefix="/api/v1/financial-metrics",
    tags=["financial-metrics"]
)
app.include_router(
    data_sources.router,
    prefix="/api/v1/data-sources",
    tags=["data-sources"]
)
app.include_router(
    model_scenarios.router,
    prefix="/api/v1/model-scenarios",
    tags=["model-scenarios"]
)
app.include_router(
    reports.router,
    prefix="/api/v1/reports",
    tags=["reports"]
)
app.include_router(
    transactions.router,
    prefix="/api/v1/transactions",
    tags=["transactions"]
)
app.include_router(
    enhanced_models.router,
    prefix="/api/v1/bloomberg",
    tags=["bloomberg-enhanced-models"]
)

@app.get("/")
async def root():
    return {
        "message": "Elevia Financial Intelligence API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}