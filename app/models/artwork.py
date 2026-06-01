import uuid

from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import ArtworkStatus


class Artwork(Base):
    __tablename__ = "artworks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    artist_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("artists.id", ondelete="RESTRICT"), nullable=False
    )
    year: Mapped[int | None] = mapped_column(Integer)
    medium: Mapped[str | None] = mapped_column(String(128))
    dimensions: Mapped[str | None] = mapped_column(String(64))
    description: Mapped[str | None] = mapped_column(Text)
    creation_story: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(512))
    status: Mapped[ArtworkStatus] = mapped_column(
        Enum(ArtworkStatus, name="artwork_status", values_callable=lambda x: [e.value for e in x]),
        default=ArtworkStatus.IN_GALLERY,
        nullable=False,
    )

    artist: Mapped["Artist"] = relationship("Artist", back_populates="artworks")
    inquiries: Mapped[list["Inquiry"]] = relationship("Inquiry", back_populates="artwork")
