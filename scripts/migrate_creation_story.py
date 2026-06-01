"""Добавить колонку creation_story в SQLite."""
import sqlalchemy as sa

from app.config import settings
from app.database import engine

if not settings.database_url.startswith("sqlite"):
    print("Run alembic for PostgreSQL.")
else:
    with engine.connect() as conn:
        cols = [r[1] for r in conn.execute(sa.text("PRAGMA table_info(artworks)")).fetchall()]
        if "creation_story" not in cols:
            conn.execute(sa.text("ALTER TABLE artworks ADD COLUMN creation_story TEXT"))
            conn.commit()
            print("Column creation_story added.")
        else:
            print("Column already exists.")
