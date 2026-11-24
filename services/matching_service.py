from datetime import date
from difflib import SequenceMatcher
from app import db
from models.lost_item import LostItem
from models.found_item import FoundItem
from models.match import Match

def text_similarity(a, b):
    a = (a or "").strip().lower()
    b = (b or "").strip().lower()
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a, b).ratio()

def exact_or_similarity(a, b):
    a = (a or "").strip().lower()
    b = (b or "").strip().lower()
    if not a or not b:
        return 0.0
    if a == b:
        return 1.0
    return text_similarity(a, b)

def calculate_score(lost, found):
    # Weights total 100:
    # item type 20, brand 20, color 15, bus 15, date 10, description 20
    score = 0.0
    score += exact_or_similarity(lost.item_type, found.item_type) * 20
    score += exact_or_similarity(lost.brand, found.brand) * 20
    score += exact_or_similarity(lost.color, found.color) * 15
    score += exact_or_similarity(lost.bus_number, found.bus_number) * 15

    if lost.lost_date and found.found_date:
        day_gap = abs((lost.lost_date - found.found_date).days)
        if day_gap == 0:
            date_score = 1.0
        elif day_gap == 1:
            date_score = 0.8
        elif day_gap <= 3:
            date_score = 0.5
        elif day_gap <= 7:
            date_score = 0.25
        else:
            date_score = 0.0
        score += date_score * 10

    score += text_similarity(lost.description, found.description) * 20
    return round(score, 2)

def find_matches_for_found_item(found_item, threshold=60):
    candidates = LostItem.query.filter(
        LostItem.status.in_(["LOST", "MATCHED"])
    ).all()

    created = []
    for lost_item in candidates:
        score = calculate_score(lost_item, found_item)

        existing = Match.query.filter_by(
            lost_item_id=lost_item.id,
            found_item_id=found_item.id
        ).first()

        if score >= threshold and not existing:
            match = Match(
                lost_item_id=lost_item.id,
                found_item_id=found_item.id,
                match_score=score,
                status="PENDING"
            )
            db.session.add(match)
            created.append(match)

    db.session.commit()
    return created
