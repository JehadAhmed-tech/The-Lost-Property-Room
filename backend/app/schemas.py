from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)
    role: str = Field(default="passenger")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class LostItemCreate(BaseModel):
    item_name: str = Field(min_length=1, max_length=120)
    category: str = Field(min_length=1, max_length=80)
    color: str = Field(min_length=1, max_length=50)
    route: str = Field(min_length=1, max_length=100)
    bus_time: Optional[str] = None
    lost_date: date
    description: str = Field(min_length=3)
    reporter_name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=7, max_length=30)

class LostItemOut(LostItemCreate):
    id: int
    user_id: int
    status: str
    model_config = ConfigDict(from_attributes=True)

class FoundItemCreate(BaseModel):
    item_name: str = Field(min_length=1, max_length=120)
    category: str = Field(min_length=1, max_length=80)
    color: str = Field(min_length=1, max_length=50)
    route: str = Field(min_length=1, max_length=100)
    bus_time: Optional[str] = None
    found_date: date
    description: str = Field(min_length=3)
    reporter_name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=7, max_length=30)

class FoundItemOut(FoundItemCreate):
    id: int
    user_id: int
    status: str
    model_config = ConfigDict(from_attributes=True)

class MatchOut(BaseModel):
    id: int
    lost_item_id: int
    found_item_id: int
    score: float
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MatchStatusUpdate(BaseModel):
    status: str
