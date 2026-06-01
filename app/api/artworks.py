from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import joinedload

from app.core.deps import DbSession, require_staff
from app.models.artwork import Artwork
from app.models.artist import Artist
from app.models.enums import ArtworkStatus
from app.schemas.artwork import (
    ArtworkCatalogItem,
    ArtworkCreate,
    ArtworkDetail,
    ArtworkRead,
    ArtworkUpdate,
)

router = APIRouter(prefix="/api/artworks", tags=["artworks"])


def _to_catalog(artwork: Artwork) -> ArtworkCatalogItem:
    return ArtworkCatalogItem(
        id=artwork.id,
        title=artwork.title,
        year=artwork.year,
        medium=artwork.medium,
        dimensions=artwork.dimensions,
        description=artwork.description,
        creation_story=artwork.creation_story,
        image_url=artwork.image_url,
        status=artwork.status,
        artist_id=artwork.artist_id,
        artist_name=artwork.artist.full_name,
    )


def _to_detail(artwork: Artwork) -> ArtworkDetail:
    a = artwork.artist
    return ArtworkDetail(
        **_to_catalog(artwork).model_dump(),
        artist_biography=a.biography,
        artist_birth_year=a.birth_year,
        artist_death_year=a.death_year,
        artist_profile_image_url=a.profile_image_url,
    )


@router.get("", response_model=list[ArtworkCatalogItem])
def list_artworks(
    db: DbSession,
    q: str | None = Query(None, description="Search title or artist name"),
    artist: UUID | None = None,
    medium: str | None = None,
    status: ArtworkStatus | None = None,
    year_from: int | None = None,
    year_to: int | None = None,
):
    stmt = select(Artwork).options(joinedload(Artwork.artist)).join(Artist)
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(or_(Artwork.title.ilike(pattern), Artist.full_name.ilike(pattern)))
    if artist:
        stmt = stmt.where(Artwork.artist_id == artist)
    if medium:
        stmt = stmt.where(Artwork.medium.ilike(f"%{medium}%"))
    if status:
        stmt = stmt.where(Artwork.status == status)
    if year_from is not None:
        stmt = stmt.where(Artwork.year >= year_from)
    if year_to is not None:
        stmt = stmt.where(Artwork.year <= year_to)
    stmt = stmt.order_by(Artwork.title)
    rows = db.scalars(stmt).unique().all()
    return [_to_catalog(a) for a in rows]


@router.get("/{artwork_id}", response_model=ArtworkDetail)
def get_artwork(artwork_id: UUID, db: DbSession):
    artwork = db.scalar(
        select(Artwork).options(joinedload(Artwork.artist)).where(Artwork.id == artwork_id)
    )
    if not artwork:
        raise HTTPException(status_code=404, detail="Artwork not found")
    return _to_detail(artwork)


@router.post("", response_model=ArtworkRead, status_code=status.HTTP_201_CREATED)
def create_artwork(payload: ArtworkCreate, db: DbSession, _: object = Depends(require_staff)):
    if not db.get(Artist, payload.artist_id):
        raise HTTPException(status_code=400, detail="Artist not found")
    artwork = Artwork(**payload.model_dump())
    db.add(artwork)
    db.commit()
    db.refresh(artwork)
    return artwork


@router.put("/{artwork_id}", response_model=ArtworkRead)
def update_artwork(
    artwork_id: UUID, payload: ArtworkUpdate, db: DbSession, _: object = Depends(require_staff)
):
    artwork = db.get(Artwork, artwork_id)
    if not artwork:
        raise HTTPException(status_code=404, detail="Artwork not found")
    data = payload.model_dump(exclude_unset=True)
    if "artist_id" in data and not db.get(Artist, data["artist_id"]):
        raise HTTPException(status_code=400, detail="Artist not found")
    for key, value in data.items():
        setattr(artwork, key, value)
    db.commit()
    db.refresh(artwork)
    return artwork


@router.delete("/{artwork_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_artwork(artwork_id: UUID, db: DbSession, _: object = Depends(require_staff)):
    artwork = db.get(Artwork, artwork_id)
    if not artwork:
        raise HTTPException(status_code=404, detail="Artwork not found")
    db.delete(artwork)
    db.commit()
