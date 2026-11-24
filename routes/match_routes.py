from datetime import datetime
from flask import Blueprint, request
from app import db
from models.match import Match

match_bp = Blueprint("match", __name__)

@match_bp.get("")
def list_matches():
    status = (request.args.get("status") or "").strip().upper()

    query = Match.query
    if status:
        query = query.filter_by(status=status)

    matches = query.order_by(Match.match_score.desc(), Match.id.desc()).all()
    return {"success": True, "data": [match.to_dict() for match in matches]}

@match_bp.get("/<int:match_id>")
def get_match(match_id):
    match = db.session.get(Match, match_id)
    if not match:
        return {"success": False, "message": "Match not found"}, 404
    return {"success": True, "data": match.to_dict()}

@match_bp.patch("/<int:match_id>/confirm")
def confirm_match(match_id):
    data = request.get_json(silent=True) or {}
    match = db.session.get(Match, match_id)

    if not match:
        return {"success": False, "message": "Match not found"}, 404

    if match.status == "REJECTED":
        return {"success": False, "message": "Rejected match cannot be confirmed"}, 409

    reviewer_id = data.get("reviewed_by")

    match.status = "CONFIRMED"
    match.reviewed_by = reviewer_id if reviewer_id else None
    match.reviewed_at = datetime.utcnow()

    match.lost_item.status = "MATCHED"
    match.found_item.status = "MATCHED"

    db.session.commit()

    return {"success": True, "message": "Match confirmed", "data": match.to_dict()}

@match_bp.patch("/<int:match_id>/reject")
def reject_match(match_id):
    data = request.get_json(silent=True) or {}
    match = db.session.get(Match, match_id)

    if not match:
        return {"success": False, "message": "Match not found"}, 404

    match.status = "REJECTED"
    match.reviewed_by = data.get("reviewed_by") or None
    match.reviewed_at = datetime.utcnow()

    db.session.commit()

    return {"success": True, "message": "Match rejected", "data": match.to_dict()}
