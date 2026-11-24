from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)
    role: str = "passenger"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    model_config = ConfigDict(from_attributes=True)

class LostItemCreate(BaseModel):
    item_type: str
    brand: Optional[str] = None
    color: Optional[str] = None
    bus_number: Optional[str] = None
    lost_date: Optional[date] = None
    description: str

class LostItemOut(LostItemCreate):
    id: int
    user_id: Optional[int]
    status: str
    model_config = ConfigDict(from_attributes=True)

class FoundItemCreate(BaseModel):
    item_type: str
    brand: Optional[str] = None
    color: Optional[str] = None
    bus_number: Optional[str] = None
    found_date: Optional[date] = None
    description: str

class FoundItemOut(FoundItemCreate):
    id: int
    user_id: Optional[int]
    status: str
    model_config = ConfigDict(from_attributes=True)

class MatchOut(BaseModel):
    id: int
    lost_item_id: int
    found_item_id: int
    score: float
    status: str
    model_config = ConfigDict(from_attributes=True)

class MatchStatusUpdate(BaseModel):
    status: str
