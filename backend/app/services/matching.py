from difflib import SequenceMatcher

def text_score(a, b):
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, str(a).lower().strip(), str(b).lower().strip()).ratio()

def calculate_match_score(lost, found):
    score = (
        text_score(lost.item_name, found.item_name) * 20 +
        text_score(lost.category, found.category) * 15 +
        text_score(lost.color, found.color) * 15 +
        text_score(lost.route, found.route) * 15 +
        text_score(lost.description, found.description) * 25
    )
    if lost.lost_date and found.found_date:
        diff = abs((lost.lost_date - found.found_date).days)
        if diff == 0: score += 10
        elif diff <= 2: score += 7
        elif diff <= 3: score += 4
    return round(score, 2)
