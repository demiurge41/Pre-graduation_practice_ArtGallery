"""Заполнение демо-данными: python -m scripts.seed"""
from datetime import date

from app.core.security import hash_password
from app.database import SessionLocal
from app.models import Artist, Artwork, Exhibition, Inquiry, User
from app.models.enums import (
    ArtworkStatus,
    ExhibitionStatus,
    InquiryStatus,
    UserRole,
)


def seed():
    db = SessionLocal()
    try:
        if db.query(User).count():
            print("DB already seeded, skip.")
            return

        admin = User(
            email="admin@gallery.local",
            password_hash=hash_password("admin123"),
            role=UserRole.ADMIN,
        )
        db.add(admin)

        artists = [
            Artist(
                full_name="Elena Vasquez",
                biography="Contemporary painter focused on light and urban landscapes.",
                birth_year=1978,
                profile_image_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
                video_interview_url="https://www.youtube.com/embed/dQw4w9WgXcQ",
            ),
            Artist(
                full_name="James Okonkwo",
                biography="Sculptor working with reclaimed metal and stone.",
                birth_year=1965,
                death_year=None,
                profile_image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            ),
            Artist(
                full_name="Mira Chen",
                biography="Digital and photography-based installations.",
                birth_year=1990,
                profile_image_url="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
            ),
        ]
        db.add_all(artists)
        db.flush()

        artworks = [
            Artwork(
                title="Morning Harbor",
                artist_id=artists[0].id,
                year=2023,
                medium="Oil on Canvas",
                dimensions="120 x 80 cm",
                description="Soft morning light over a quiet harbor, layered glazes and muted blues.",
                creation_story="Painted over three winters from sketches made at dawn in Reykjavik harbour.",
                image_url="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
                status=ArtworkStatus.IN_GALLERY,
            ),
            Artwork(
                title="Iron Bloom",
                artist_id=artists[1].id,
                year=2021,
                medium="Sculpture",
                dimensions="90 x 60 x 45 cm",
                description="Welded steel forms suggesting organic growth from industrial roots.",
                creation_story="Built from scrap recovered after a factory closure in Birmingham.",
                image_url="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
                status=ArtworkStatus.ON_EXHIBITION,
            ),
            Artwork(
                title="Signal Garden",
                artist_id=artists[2].id,
                year=2024,
                medium="Digital",
                dimensions="4K projection",
                description="Generative flora responding to ambient sound in the gallery space.",
                image_url="https://images.unsplash.com/photo-1549490349-8643362247b5?w=800",
                status=ArtworkStatus.IN_GALLERY,
            ),
            Artwork(
                title="Winter Studio",
                artist_id=artists[0].id,
                year=2020,
                medium="Oil on Canvas",
                dimensions="100 x 70 cm",
                description="Interior study with cool northern light.",
                image_url="https://images.unsplash.com/photo-1515405296620-991d55bded21?w=800",
                status=ArtworkStatus.IN_STORAGE,
            ),
        ]
        db.add_all(artworks)

        exhibitions = [
            Exhibition(
                title="Horizons of Light",
                description="A survey of contemporary painting exploring coastal atmospheres.",
                start_date=date(2026, 3, 1),
                end_date=date(2026, 6, 30),
                cover_image_url="https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
                status=ExhibitionStatus.CURRENT,
            ),
            Exhibition(
                title="Material Voices",
                description="Sculpture and installation from reclaimed industrial materials.",
                start_date=date(2026, 9, 1),
                end_date=date(2026, 11, 15),
                cover_image_url="https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800",
                status=ExhibitionStatus.UPCOMING,
            ),
            Exhibition(
                title="Digital Fields",
                description="Past showcase of screen-based and generative works.",
                start_date=date(2024, 1, 10),
                end_date=date(2024, 4, 20),
                cover_image_url="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                status=ExhibitionStatus.PAST,
            ),
        ]
        db.add_all(exhibitions)
        db.flush()

        db.add(
            Inquiry(
                visitor_name="Alex Rivera",
                visitor_email="alex@example.com",
                message="Interested in viewing Morning Harbor privately.",
                artwork_reference_id=artworks[0].id,
                status=InquiryStatus.NEW,
            )
        )

        db.commit()
        print("Seed OK. Admin: admin@gallery.local / admin123")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
