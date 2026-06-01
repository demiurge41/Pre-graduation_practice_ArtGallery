# Art Gallery Information System

Веб-каталог художественной галереи (без e-commerce). Спецификация: [`specification.md`](specification.md).

## Стек

- **Backend:** FastAPI + SQLAlchemy + Alembic
- **DB:** PostgreSQL 16
- **Frontend:** HTML5, CSS3, vanilla JS (ES modules)

## Быстрый старт

### Быстрый старт (без Docker — SQLite)

Дважды кликните **`run.bat`** или в PowerShell:

```powershell
cd e:\Projecy
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m scripts.init_db
.\.venv\Scripts\python.exe -m scripts.seed
.\.venv\Scripts\uvicorn.exe app.main:app --reload
```

| Страница | URL |
|----------|-----|
| Главная | http://127.0.0.1:8000/ |
| Галерея | http://127.0.0.1:8000/gallery |
| Картина | http://127.0.0.1:8000/gallery/{id} |
| Контакты | http://127.0.0.1:8000/contacts |
| Админка | http://127.0.0.1:8000/gallery.admin/login |

### PostgreSQL (опционально, для продакшена)

```bash
docker compose up -d
# в .env: DATABASE_URL=postgresql://gallery:gallery@localhost:5432/gallery_db
alembic upgrade head
python -m scripts.seed
```

**Админ:** `admin@gallery.local` / `admin123` → http://127.0.0.1:8000/admin/login

## API (основное)

| Метод | Путь |
|-------|------|
| GET | `/api/artworks` |
| GET | `/api/artworks/{id}` |
| GET | `/api/artists` |
| GET | `/api/exhibitions` |
| POST | `/api/inquiries` |
| POST | `/api/auth/login` |

CRUD для staff/admin — те же ресурсы с `POST`/`PUT`/`DELETE` (требуется сессия).

## Структура

```
app/           # FastAPI, модели, API
alembic/       # миграции
static/        # CSS, JS, HTML
scripts/       # seed
specification.md
```

## Итерации

1. ✅ Backend + PostgreSQL  
2. ✅ Глобальный CSS + a11y  
3. ✅ Публичный портал  
4. ✅ Админ-панель (логин, CRUD artworks, inquiries)
