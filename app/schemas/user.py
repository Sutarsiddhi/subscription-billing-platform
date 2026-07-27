from pydantic import BaseModel, EmailStr, ConfigDict

from app.models.user import UserRole


class UserRegister(BaseModel):

    full_name: str

    email: EmailStr

    password: str

    role: UserRole = UserRole.CUSTOMER


class UserLogin(BaseModel):

    email: EmailStr

    password: str


class UserResponse(BaseModel):

    id: int

    full_name: str

    email: EmailStr

    role: UserRole

    is_active: bool

    model_config = ConfigDict(from_attributes=True)