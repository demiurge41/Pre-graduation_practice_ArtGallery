from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.enums import ArtworkStatus


class ArtworkBase(BaseModel):
    title: str
    artist_id: UUID
    year: int | None = None
    medium: str | None = None
    dimensions: str | None = None
    description: str | None = None
    creation_story: str | None = None
    image_url: str | None = None
    status: ArtworkStatus = ArtworkStatus.IN_GALLERY


class ArtworkCreate(ArtworkBase):
    pass


class ArtworkUpdate(BaseModel):
    title: str | None = None
    artist_id: UUID | None = None
    year: int | None = None
    medium: str | None = None
    dimensions: str | None = None
    description: str | None = None
    creation_story: str | None = None
    image_url: str | None = None
    status: ArtworkStatus | None = None


class ArtworkRead(ArtworkBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID


class ArtworkCatalogItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    title: str
    year: int | None
    medium: str | None
    dimensions: str | None
    description: str | None
    creation_story: str | None = None
    image_url: str | None
    status: ArtworkStatus
    artist_id: UUID
    artist_name: str


class ArtworkDetail(ArtworkCatalogItem):
    artist_biography: str | None = None
    artist_birth_year: int | None = None
    artist_death_year: int | None = None
    artist_profile_image_url: str | None = None
