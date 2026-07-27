from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db

from app.schemas.user import (
    UserRegister,
    UserLogin,
    UserResponse
)

from app.repositories.auth_repository import AuthRepository

from app.core.jwt import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    new_user = AuthRepository.register(
        db,
        user
    )

    if not new_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return new_user


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = AuthRepository.login(
        db,
        user.email,
        user.password
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role.value
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.full_name,
            "email": db_user.email,
            "role": db_user.role.value
        }
    }