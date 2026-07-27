from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr


class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    billing_country: str


class CustomerUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    billing_country: str | None = None


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    billing_country: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)