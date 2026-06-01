import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.core.deps import require_staff

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "static" / "uploads"
ALLOWED = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_BYTES = 8 * 1024 * 1024


@router.post("")
async def upload_image(
    file: UploadFile = File(...),
    _: object = Depends(require_staff),
):
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="Invalid image type")
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="File too large (max 8MB)")
    ext = {".jpg": "jpg", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}.get(
        file.content_type, "jpg"
    )
    if file.filename and "." in file.filename:
        ext = file.filename.rsplit(".", 1)[-1].lower()[:4]
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    name = f"{uuid.uuid4().hex}.{ext}"
    path = UPLOAD_DIR / name
    path.write_bytes(data)
    return {"url": f"/static/uploads/{name}"}
