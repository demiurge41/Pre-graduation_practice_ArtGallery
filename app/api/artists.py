from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from app.core.deps import DbSession, require_staff
from app.models.artist import Artist
from app.schemas.artist import ArtistCreate, ArtistListItem, ArtistRead, ArtistUpdate

router = APIRouter(prefix="/api/artists", tags=["artists"])


@router.get("", response_model=list[ArtistListItem])
def list_artists(db: DbSession):
    return db.scalars(select(Artist).order_by(Artist.full_name)).all()


@router.get("/{artist_id}", response_model=ArtistRead)
def get_artist(artist_id: UUID, db: DbSession):
    artist = db.get(Artist, artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist


@router.post("", response_model=ArtistRead, status_code=status.HTTP_201_CREATED)
def create_artist(payload: ArtistCreate, db: DbSession, _: object = Depends(require_staff)):
    artist = Artist(**payload.model_dump())
    db.add(artist)
    db.commit()
    db.refresh(artist)
    return artist


@router.put("/{artist_id}", response_model=ArtistRead)
def update_artist(
    artist_id: UUID, payload: ArtistUpdate, db: DbSession, _: object = Depends(require_staff)
):
    artist = db.get(Artist, artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(artist, key, value)
    db.commit()
    db.refresh(artist)
    return artist


@router.delete("/{artist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_artist(artist_id: UUID, db: DbSession, _: object = Depends(require_staff)):
    artist = db.get(Artist, artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    db.delete(artist)
    db.commit()
