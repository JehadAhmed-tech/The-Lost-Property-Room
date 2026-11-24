from datetime import date, datetime
from flask import Blueprint, request
from app import db
from models.lost_item import LostItem

lost_bp = Blueprint("lost", __name__)

def parse_date(value):
    return datetime.strptime(value, "%Y-%m-%d").date() if value else None

def parse_time(value):
    return datetime.strptime(value, "%H:%M").time() if value else None

@lost_bp.post("")
def create_lost_item():
    data = request.get_json(silent=True) or {}

    required = ["item_name", "item_type", "lost_date", "owner_name", "owner_contact"]
    missing = [key for key in required if not data.get(key)]
    if missing:
        return {"success": False, "message": f"Missing fields: {', '.join(missing)}"}, 400

    try:
        item = LostItem(
            item_name=data["item_name"].strip(),
            item_type=data["item_type"].strip(),
            brand=(data.get("brand") or "").strip() or None,
            color=(data.get("color") or "").strip() or None,
            description=(data.get("description") or "").strip() or None,
            bus_number=(data.get("bus_number") or "").strip() or None,
            lost_location=(data.get("lost_location") or "").strip() or None,
            lost_date=parse_date(data["lost_date"]),
            lost_time=parse_time(data.get("lost_time")),
            owner_name=data["owner_name"].strip(),
            owner_contact=data["owner_contact"].strip()
        )
    except ValueError:
        return {"success": False, "message": "Date must be YYYY-MM-DD and time must be HH:MM"}, 400

    db.session.add(item)
    db.session.commit()

    return {"success": True, "message": "Lost item created", "data": item.to_dict()}, 201

@lost_bp.get("")
def list_lost_items():
    search = (request.args.get("search") or "").strip().lower()
    status = (request.args.get("status") or "").strip().upper()

    query = LostItem.query

    if status:
        query = query.filter_by(status=status)

    items = query.order_by(LostItem.id.desc()).all()

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
                item.owner_name or ""
            ]).lower()
        ]

    return {"success": True, "data": [item.to_dict() for item in items]}

@lost_bp.get("/<int:item_id>")
def get_lost_item(item_id):
    item = db.session.get(LostItem, item_id)
    if not item:
        return {"success": False, "message": "Lost item not found"}, 404
    return {"success": True, "data": item.to_dict()}

@lost_bp.put("/<int:item_id>")
def update_lost_item(item_id):
    item = db.session.get(LostItem, item_id)
    if not item:
        return {"success": False, "message": "Lost item not found"}, 404

    data = request.get_json(silent=True) or {}

    fields = [
        "item_name", "item_type", "brand", "color", "description",
        "bus_number", "lost_location", "owner_name", "owner_contact", "status"
    ]

    for field in fields:
        if field in data:
            value = data[field]
            if isinstance(value, str):
                value = value.strip()
            setattr(item, field, value)

    try:
        if "lost_date" in data:
            item.lost_date = parse_date(data["lost_date"])
        if "lost_time" in data:
            item.lost_time = parse_time(data["lost_time"])
    except ValueError:
        return {"success": False, "message": "Date must be YYYY-MM-DD and time must be HH:MM"}, 400

    db.session.commit()
    return {"success": True, "message": "Lost item updated", "data": item.to_dict()}

@lost_bp.delete("/<int:item_id>")
def delete_lost_item(item_id):
    item = db.session.get(LostItem, item_id)
    if not item:
        return {"success": False, "message": "Lost item not found"}, 404

    db.session.delete(item)
    db.session.commit()
    return {"success": True, "message": "Lost item deleted"}
