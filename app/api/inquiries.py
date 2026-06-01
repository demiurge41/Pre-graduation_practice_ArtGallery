from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from app.core.deps import DbSession, require_staff
from app.models.inquiry import Inquiry
from app.schemas.inquiry import InquiryCreate, InquiryRead, InquiryStatusPatch

router = APIRouter(prefix="/api/inquiries", tags=["inquiries"])


@router.post("", response_model=InquiryRead, status_code=status.HTTP_201_CREATED)
def create_inquiry(payload: InquiryCreate, db: DbSession):
    inquiry = Inquiry(**payload.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.get("", response_model=list[InquiryRead])
def list_inquiries(db: DbSession, _: object = Depends(require_staff)):
    stmt = select(Inquiry).order_by(Inquiry.created_at.desc())
    return db.scalars(stmt).all()


@router.patch("/{inquiry_id}", response_model=InquiryRead)
def patch_inquiry(
    inquiry_id: UUID, payload: InquiryStatusPatch, db: DbSession, _: object = Depends(require_staff)
):
    inquiry = db.get(Inquiry, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inquiry.status = payload.status
    db.commit()
    db.refresh(inquiry)
    return inquiry
