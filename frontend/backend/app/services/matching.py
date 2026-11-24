from difflib import SequenceMatcher

def text_score(a, b):
    if not a or not b:
        return 0
    return SequenceMatcher(None, str(a).lower().strip(), str(b).lower().strip()).ratio()

def calculate_match_score(lost, found):
    score = (
        text_score(lost.item_type, found.item_type) * 20 +
        text_score(lost.brand, found.brand) * 20 +
        text_score(lost.color, found.color) * 15 +
        text_score(lost.bus_number, found.bus_number) * 15 +
        text_score(lost.description, found.description) * 20
    )
    if lost.lost_date and found.found_date:
        if abs((lost.lost_date - found.found_date).days) <= 3:
            score += 10
    return round(score, 2)
