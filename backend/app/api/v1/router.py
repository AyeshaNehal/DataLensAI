from fastapi import APIRouter
from app.api.v1.endpoints import auth, datasets, eda, ai

api_router = APIRouter()

# Include Authentication endpoints under /auth prefix
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Include Dataset management endpoints under /datasets prefix
api_router.include_router(datasets.router, prefix="/datasets", tags=["Datasets"])

# Include EDA & Visualizations endpoints under /eda prefix
api_router.include_router(eda.router, prefix="/eda", tags=["EDA & Analytics"])

# Include AI Insights & Natural Language Query endpoints under /ai prefix
api_router.include_router(ai.router, prefix="/ai", tags=["AI Analyst & Queries"])
