from sqlalchemy import select

from app.database import SessionLocal
from app.models.artwork import Artwork

STORIES = {
    "Morning Harbor": "Painted over three winters from sketches made at dawn in Reykjavik harbour.",
    "Iron Bloom": "Built from scrap recovered after a factory closure in Birmingham.",
}

if __name__ == "__main__":
    db = SessionLocal()
    try:
        for title, story in STORIES.items():
            art = db.scalar(select(Artwork).where(Artwork.title == title))
            if art:
                art.creation_story = story
        db.commit()
        print("Stories updated.")
    finally:
        db.close()
