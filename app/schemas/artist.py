from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ArtistBase(BaseModel):
    full_name: str
    biography: str | None = None
    birth_year: int | None = None
    death_year: int | None = None
    profile_image_url: str | None = None
    video_interview_url: str | None = None


class ArtistCreate(ArtistBase):
    pass


class ArtistUpdate(ArtistBase):
    full_name: str | None = None


class ArtistRead(ArtistBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID


class ArtistListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    full_name: str
    profile_image_url: str | None = None
