from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from app.api.router import api_router
from app.config import settings

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
UPLOAD_DIR = STATIC_DIR / "uploads"

app = FastAPI(title="Информационная система художественной галереи", debug=settings.debug)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.secret_key,
    max_age=settings.session_max_age,
    same_site="lax",
    https_only=False,
)
app.include_router(api_router)

if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _html_page(filename: str) -> HTMLResponse | FileResponse:
    path = STATIC_DIR / filename
    if path.exists():
        return FileResponse(path)
    return HTMLResponse(f"<h1>Скоро: {filename}</h1>", status_code=200)


@app.get("/", response_class=HTMLResponse)
def home():
    return _html_page("home.html")


@app.get("/gallery", response_class=HTMLResponse)
def gallery_page():
    return _html_page("gallery.html")


@app.get("/gallery/{artwork_id}", response_class=HTMLResponse)
def artwork_page(artwork_id: str):
    return _html_page("artwork.html")


@app.get("/contacts", response_class=HTMLResponse)
def contacts_page():
    return _html_page("contacts.html")


@app.get("/exhibitions", response_class=HTMLResponse)
@app.get("/events", response_class=HTMLResponse)
def exhibitions_page():
    return _html_page("exhibitions.html")


@app.get("/gallery.admin/login", response_class=HTMLResponse)
@app.get("/gallery.admin", response_class=HTMLResponse)
@app.get("/gallery.admin/{path:path}", response_class=HTMLResponse)
def gallery_admin(request: Request, path: str = ""):
    if path in ("login", "login.html") or not request.session.get("user_id"):
        return _html_page("admin/login.html")
    return _html_page("admin/index.html")


@app.get("/admin/login")
def admin_login_redirect():
    return RedirectResponse("/gallery.admin/login", status_code=302)


@app.get("/admin")
@app.get("/admin/{path:path}")
def admin_redirect(path: str = ""):
    target = "/gallery.admin/login" if path in ("login", "login.html", "") else f"/gallery.admin/{path}"
    return RedirectResponse(target, status_code=302)
