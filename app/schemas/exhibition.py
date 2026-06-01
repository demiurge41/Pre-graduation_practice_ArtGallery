from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.enums import ExhibitionStatus


class ExhibitionBase(BaseModel):
    title: str
    description: str | None = None
    start_date: date
    end_date: date
    cover_image_url: str | None = None
    status: ExhibitionStatus = ExhibitionStatus.UPCOMING


class ExhibitionCreate(ExhibitionBase):
    pass


class ExhibitionUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    cover_image_url: str | None = None
    status: ExhibitionStatus | None = None


class ExhibitionRead(ExhibitionBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
