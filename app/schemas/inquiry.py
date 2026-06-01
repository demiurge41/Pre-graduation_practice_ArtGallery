from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.enums import InquiryStatus


class InquiryCreate(BaseModel):
    visitor_name: str
    visitor_email: EmailStr
    message: str
    artwork_reference_id: UUID | None = None


class InquiryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    visitor_name: str
    visitor_email: str
    message: str
    artwork_reference_id: UUID | None
    created_at: datetime
    status: InquiryStatus


class InquiryStatusPatch(BaseModel):
    status: InquiryStatus
