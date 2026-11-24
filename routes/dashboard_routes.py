from flask import Blueprint
from app import db
from models.lost_item import LostItem
from models.found_item import FoundItem
from models.match import Match

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.get("")
def dashboard():
    return {
        "success": True,
        "data": {
            "totalLost": LostItem.query.count(),
            "totalFound": FoundItem.query.count(),
            "pendingMatches": Match.query.filter_by(status="PENDING").count(),
            "confirmedMatches": Match.query.filter_by(status="CONFIRMED").count(),
            "rejectedMatches": Match.query.filter_by(status="REJECTED").count(),
            "returnedItems": FoundItem.query.filter_by(status="RETURNED").count()
        }
    }
