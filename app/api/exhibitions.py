from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from app.core.deps import DbSession, require_staff
from app.models.exhibition import Exhibition
from app.schemas.exhibition import ExhibitionCreate, ExhibitionRead, ExhibitionUpdate

router = APIRouter(prefix="/api/exhibitions", tags=["exhibitions"])


@router.get("", response_model=list[ExhibitionRead])
def list_exhibitions(db: DbSession):
    stmt = select(Exhibition).order_by(Exhibition.start_date.desc())
    return db.scalars(stmt).all()


@router.get("/{exhibition_id}", response_model=ExhibitionRead)
def get_exhibition(exhibition_id: UUID, db: DbSession):
    exhibition = db.get(Exhibition, exhibition_id)
    if not exhibition:
        raise HTTPException(status_code=404, detail="Выставка не найдена")
    return exhibition


@router.post("", response_model=ExhibitionRead, status_code=status.HTTP_201_CREATED)
def create_exhibition(payload: ExhibitionCreate, db: DbSession, _: object = Depends(require_staff)):
    exhibition = Exhibition(**payload.model_dump())
    db.add(exhibition)
    db.commit()
    db.refresh(exhibition)
    return exhibition


@router.put("/{exhibition_id}", response_model=ExhibitionRead)
def update_exhibition(
    exhibition_id: UUID, payload: ExhibitionUpdate, db: DbSession, _: object = Depends(require_staff)
):
    exhibition = db.get(Exhibition, exhibition_id)
    if not exhibition:
        raise HTTPException(status_code=404, detail="Выставка не найдена")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(exhibition, key, value)
    db.commit()
    db.refresh(exhibition)
    return exhibition


@router.delete("/{exhibition_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exhibition(exhibition_id: UUID, db: DbSession, _: object = Depends(require_staff)):
    exhibition = db.get(Exhibition, exhibition_id)
    if not exhibition:
        raise HTTPException(status_code=404, detail="Выставка не найдена")
    db.delete(exhibition)
    db.commit()
