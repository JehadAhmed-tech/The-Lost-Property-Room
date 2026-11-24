from datetime import datetime
from app import db

class Match(db.Model):
    __tablename__ = "matches"

    id = db.Column(db.Integer, primary_key=True)
    lost_item_id = db.Column(db.Integer, db.ForeignKey("lost_items.id"), nullable=False)
    found_item_id = db.Column(db.Integer, db.ForeignKey("found_items.id"), nullable=False)
    match_score = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="PENDING")
    reviewed_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    reviewed_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    lost_item = db.relationship("LostItem", backref="matches")
    found_item = db.relationship("FoundItem", backref="matches")
    reviewer = db.relationship("User", foreign_keys=[reviewed_by])

    def to_dict(self):
        return {
            "id": self.id,
            "lost_item_id": self.lost_item_id,
            "found_item_id": self.found_item_id,
            "match_score": round(self.match_score, 2),
            "status": self.status,
            "reviewed_by": self.reviewed_by,
            "reviewed_at": self.reviewed_at.isoformat() if self.reviewed_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "lost_item": self.lost_item.to_dict() if self.lost_item else None,
            "found_item": self.found_item.to_dict() if self.found_item else None,
        }
