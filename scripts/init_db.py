"""Создание таблиц (для SQLite / локальной разработки): python -m scripts.init_db"""
from app.database import Base, engine
from app.models import Artist, Artwork, Exhibition, Inquiry, User  # noqa: F401


def init_db():
    Base.metadata.create_all(bind=engine)
    print("Tables created.")


if __name__ == "__main__":
    init_db()
