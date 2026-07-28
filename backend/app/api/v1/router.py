from fastapi import APIRouter
from app.api.v1.endpoints import auth, datasets

api_router = APIRouter()

# Include Authentication endpoints under /auth prefix
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Include Dataset management endpoints under /datasets prefix
api_router.include_router(datasets.router, prefix="/datasets", tags=["Datasets"])
