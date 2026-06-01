"""Обновить обложку Horizons of Light в существующей БД."""
from sqlalchemy import select

from app.database import SessionLocal
from app.models.exhibition import Exhibition

NEW_URL = "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80"


def patch():
    db = SessionLocal()
    try:
        ex = db.scalar(select(Exhibition).where(Exhibition.title == "Horizons of Light"))
        if ex:
            ex.cover_image_url = NEW_URL
            db.commit()
            print("Updated Horizons of Light cover.")
        else:
            print("Exhibition not found.")
    finally:
        db.close()


if __name__ == "__main__":
    patch()
