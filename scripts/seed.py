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
            print("БД уже заполнена, пропуск.")
            return

        admin = User(
            email="admin@gallery.local",
            password_hash=hash_password("admin123"),
            role=UserRole.ADMIN,
        )
        db.add(admin)

        artists = [
            Artist(
                full_name="Елена Васкес",
                biography="Современная художница, исследующая свет и городские пейзажи.",
                birth_year=1978,
                profile_image_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
                video_interview_url="https://www.youtube.com/embed/dQw4w9WgXcQ",
            ),
            Artist(
                full_name="Джеймс Оконкво",
                biography="Скульптор, работающий с переработанным металлом и камнем.",
                birth_year=1965,
                death_year=None,
                profile_image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            ),
            Artist(
                full_name="Мира Чен",
                biography="Цифровые инсталляции и фотографические проекты.",
                birth_year=1990,
                profile_image_url="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
            ),
        ]
        db.add_all(artists)
        db.flush()

        artworks = [
            Artwork(
                title="Утренний порт",
                artist_id=artists[0].id,
                year=2023,
                medium="Масло на холсте",
                dimensions="120 × 80 см",
                description="Мягкий утренний свет над тихой гаванью, наслоенные лессировки и приглушённые синие тона.",
                creation_story="Писалась три зимы по эскизам, сделанным на рассвете в гавани Рейкьявика.",
                image_url="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800",
                status=ArtworkStatus.IN_GALLERY,
            ),
            Artwork(
                title="Железный цветок",
                artist_id=artists[1].id,
                year=2021,
                medium="Скульптура",
                dimensions="90 × 60 × 45 см",
                description="Сваренные стальные формы, напоминающие органический рост из индустриальных корней.",
                creation_story="Создана из металлолома, собранного после закрытия завода в Бирмингеме.",
                image_url="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
                status=ArtworkStatus.ON_EXHIBITION,
            ),
            Artwork(
                title="Сад сигналов",
                artist_id=artists[2].id,
                year=2024,
                medium="Цифровое искусство",
                dimensions="4K-проекция",
                description="Генеративная флора, реагирующая на звук в выставочном пространстве.",
                image_url="https://images.unsplash.com/photo-1549490349-8643362247b5?w=800",
                status=ArtworkStatus.IN_GALLERY,
            ),
            Artwork(
                title="Зимняя мастерская",
                artist_id=artists[0].id,
                year=2020,
                medium="Масло на холсте",
                dimensions="100 × 70 см",
                description="Интерьерный этюд в холодном северном свете.",
                image_url="https://images.unsplash.com/photo-1515405296620-991d55bded21?w=800",
                status=ArtworkStatus.IN_STORAGE,
            ),
        ]
        db.add_all(artworks)

        exhibitions = [
            Exhibition(
                title="Горизонты света",
                description="Обзор современной живописи, исследующей прибрежную атмосферу.",
                start_date=date(2026, 3, 1),
                end_date=date(2026, 6, 30),
                cover_image_url="https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
                status=ExhibitionStatus.CURRENT,
            ),
            Exhibition(
                title="Голоса материала",
                description="Скульптура и инсталляции из переработанных промышленных материалов.",
                start_date=date(2026, 9, 1),
                end_date=date(2026, 11, 15),
                cover_image_url="https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800",
                status=ExhibitionStatus.UPCOMING,
            ),
            Exhibition(
                title="Цифровые поля",
                description="Прошедшая выставка экранных и генеративных работ.",
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
                visitor_name="Алекс Ривера",
                visitor_email="alex@example.com",
                message="Хотел бы посмотреть «Утренний порт» в частном порядке.",
                artwork_reference_id=artworks[0].id,
                status=InquiryStatus.NEW,
            )
        )

        db.commit()
        print("Seed OK. Админ: admin@gallery.local / admin123")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
