from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select

from app.core.deps import DbSession, get_current_user
from app.core.security import verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, UserRead

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, request: Request, db: DbSession):
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверные учётные данные")
    request.session["user_id"] = str(user.id)
    return LoginResponse(
        user=UserRead(id=str(user.id), email=user.email, role=user.role),
    )


@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "Выход выполнен"}


@router.get("/me", response_model=UserRead)
def me(user: User = Depends(get_current_user)):
    return UserRead(id=str(user.id), email=user.email, role=user.role)
