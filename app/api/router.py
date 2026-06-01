from fastapi import APIRouter

from app.api import artists, artworks, auth, exhibitions, inquiries, uploads

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(artworks.router)
api_router.include_router(artists.router)
api_router.include_router(exhibitions.router)
api_router.include_router(inquiries.router)
api_router.include_router(uploads.router)
