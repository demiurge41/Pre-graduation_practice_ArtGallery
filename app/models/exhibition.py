import uuid
from datetime import date

from sqlalchemy import Date, Enum, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.enums import ExhibitionStatus


class Exhibition(Base):
    __tablename__ = "exhibitions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    cover_image_url: Mapped[str | None] = mapped_column(String(512))
    status: Mapped[ExhibitionStatus] = mapped_column(
        Enum(ExhibitionStatus, name="exhibition_status", values_callable=lambda x: [e.value for e in x]),
        default=ExhibitionStatus.UPCOMING,
        nullable=False,
    )
