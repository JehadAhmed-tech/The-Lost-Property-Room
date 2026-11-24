from datetime import datetime
from flask import Blueprint, request
from app import db
from models.found_item import FoundItem
from services.matching_service import find_matches_for_found_item

found_bp = Blueprint("found", __name__)

def parse_date(value):
    return datetime.strptime(value, "%Y-%m-%d").date() if value else None

def parse_time(value):
    return datetime.strptime(value, "%H:%M").time() if value else None

@found_bp.post("")
def create_found_item():
    data = request.get_json(silent=True) or {}

    required = ["item_name", "item_type", "found_date", "found_by"]
    missing = [key for key in required if not data.get(key)]
    if missing:
        return {"success": False, "message": f"Missing fields: {', '.join(missing)}"}, 400

    try:
        item = FoundItem(
            item_name=data["item_name"].strip(),
            item_type=data["item_type"].strip(),
            brand=(data.get("brand") or "").strip() or None,
            color=(data.get("color") or "").strip() or None,
            description=(data.get("description") or "").strip() or None,
            bus_number=(data.get("bus_number") or "").strip() or None,
            found_location=(data.get("found_location") or "").strip() or None,
            found_date=parse_date(data["found_date"]),
            found_time=parse_time(data.get("found_time")),
            found_by=data["found_by"].strip()
        )
    except ValueError:
        return {"success": False, "message": "Date must be YYYY-MM-DD and time must be HH:MM"}, 400

    db.session.add(item)
    db.session.commit()

    matches = find_matches_for_found_item(item)

    return {
        "success": True,
        "message": "Found item created and matching process completed",
        "data": item.to_dict(),
        "possible_matches": [match.to_dict() for match in matches]
    }, 201

@found_bp.get("")
def list_found_items():
    search = (request.args.get("search") or "").strip().lower()
    status = (request.args.get("status") or "").strip().upper()

    query = FoundItem.query
    if status:
        query = query.filter_by(status=status)

    items = query.order_by(FoundItem.id.desc()).all()

    if search:
        items = [
            item for item in items
            if search in " ".join([
                item.item_name or "",
                item.item_type or "",
                item.brand or "",
                item.color or "",
                item.description or "",
                item.bus_number or "",
                item.found_by or ""
            ]).lower()
        ]

    return {"success": True, "data": [item.to_dict() for item in items]}

@found_bp.get("/<int:item_id>")
def get_found_item(item_id):
    item = db.session.get(FoundItem, item_id)
    if not item:
        return {"success": False, "message": "Found item not found"}, 404
    return {"success": True, "data": item.to_dict()}

@found_bp.put("/<int:item_id>")
def update_found_item(item_id):
    item = db.session.get(FoundItem, item_id)
    if not item:
        return {"success": False, "message": "Found item not found"}, 404

    data = request.get_json(silent=True) or {}

    fields = [
        "item_name", "item_type", "brand", "color", "description",
        "bus_number", "found_location", "found_by", "status"
    ]

    for field in fields:
        if field in data:
            value = data[field]
            if isinstance(value, str):
                value = value.strip()
            setattr(item, field, value)

    try:
        if "found_date" in data:
            item.found_date = parse_date(data["found_date"])
        if "found_time" in data:
            item.found_time = parse_time(data["found_time"])
    except ValueError:
        return {"success": False, "message": "Date must be YYYY-MM-DD and time must be HH:MM"}, 400

    db.session.commit()
    return {"success": True, "message": "Found item updated", "data": item.to_dict()}

@found_bp.delete("/<int:item_id>")
def delete_found_item(item_id):
    item = db.session.get(FoundItem, item_id)
    if not item:
        return {"success": False, "message": "Found item not found"}, 404

    db.session.delete(item)
    db.session.commit()
    return {"success": True, "message": "Found item deleted"}

@found_bp.patch("/<int:item_id>/return")
def return_found_item(item_id):
    item = db.session.get(FoundItem, item_id)
    if not item:
        return {"success": False, "message": "Found item not found"}, 404

    item.status = "RETURNED"

    for match in item.matches:
        if match.status == "CONFIRMED":
            match.lost_item.status = "RETURNED"

    db.session.commit()
    return {"success": True, "message": "Found item marked as returned", "data": item.to_dict()}
