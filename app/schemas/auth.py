import re

from pydantic import BaseModel, Field, field_validator

from app.models.enums import UserRole

_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class LoginRequest(BaseModel):
    email: str = Field(max_length=255)
    password: str = Field(min_length=1)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        email = v.strip().lower()
        if not _EMAIL_RE.match(email):
            raise ValueError("Invalid email format")
        return email


class UserRead(BaseModel):
    id: str
    email: str
    role: UserRole


class LoginResponse(BaseModel):
    user: UserRead
    message: str = "Login successful"
