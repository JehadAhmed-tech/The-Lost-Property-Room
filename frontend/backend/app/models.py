from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, Float
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False, default="passenger")
    created_at = Column(DateTime, default=datetime.utcnow)

class LostItem(Base):
    __tablename__ = "lost_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    item_type = Column(String(100), nullable=False)
    brand = Column(String(100))
    color = Column(String(50))
    bus_number = Column(String(50))
    lost_date = Column(Date)
    description = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="lost")
    created_at = Column(DateTime, default=datetime.utcnow)

class FoundItem(Base):
    __tablename__ = "found_items"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    item_type = Column(String(100), nullable=False)
    brand = Column(String(100))
    color = Column(String(50))
    bus_number = Column(String(50))
    found_date = Column(Date)
    description = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="found")
    created_at = Column(DateTime, default=datetime.utcnow)

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    lost_item_id = Column(Integer, ForeignKey("lost_items.id"), nullable=False)
    found_item_id = Column(Integer, ForeignKey("found_items.id"), nullable=False)
    score = Column(Float, nullable=False)
    status = Column(String(30), nullable=False, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
