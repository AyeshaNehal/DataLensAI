from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserBase(BaseModel):
    """
    Shared user properties used across schemas.
    """
    email: EmailStr
    full_name: str | None = None


class UserCreate(UserBase):
    """
    Schema for user registration.
    """
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")


class UserLogin(BaseModel):
    """
    Schema for JSON login payload (optional alternative to OAuth2 form data).
    """
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """
    Schema returned to the client after signup, login, or profile fetch.
    Never exposes the hashed password.
    """
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """
    Schema for JWT access token response.
    Includes user data so the frontend doesn't need a second roundtrip immediately after login.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    """
    Schema for decoded JWT payload contents.
    """
    sub: str | None = None
