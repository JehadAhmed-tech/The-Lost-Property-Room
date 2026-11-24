from datetime import datetime
from app import db

class FoundItem(db.Model):
    __tablename__ = "found_items"

    id = db.Column(db.Integer, primary_key=True)
    item_name = db.Column(db.String(120), nullable=False)
    item_type = db.Column(db.String(80), nullable=False)
    brand = db.Column(db.String(100))
    color = db.Column(db.String(60))
    description = db.Column(db.Text)
    bus_number = db.Column(db.String(50))
    found_location = db.Column(db.String(150))
    found_date = db.Column(db.Date, nullable=False)
    found_time = db.Column(db.Time)
    found_by = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="FOUND")
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
            "found_location": self.found_location,
            "found_date": self.found_date.isoformat() if self.found_date else None,
            "found_time": self.found_time.isoformat() if self.found_time else None,
            "found_by": self.found_by,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
