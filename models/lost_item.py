from datetime import datetime
from app import db

class LostItem(db.Model):
    __tablename__ = "lost_items"

    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(120), nullable=False)
    item_type = db.Column(db.String(80), nullable=False)
    brand = db.Column(db.String(100))
    color = db.Column(db.String(60))
    description = db.Column(db.Text)
    bus_number = db.Column(db.String(50))
    lost_location = db.Column(db.String(150))
    lost_date = db.Column(db.Date, nullable=False)
    lost_time = db.Column(db.Time)
    owner_name = db.Column(db.String(120), nullable=False)
    owner_contact = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="LOST")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "item_name": self.item_name,
            "item_type": self.item_type,
            "brand": self.brand,
            "color": self.color,
            "description": self.description,
            "bus_number": self.bus_number,
            "lost_location": self.lost_location,
            "lost_date": self.lost_date.isoformat() if self.lost_date else None,
            "lost_time": self.lost_time.isoformat() if self.lost_time else None,
            "owner_name": self.owner_name,
            "owner_contact": self.owner_contact,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
