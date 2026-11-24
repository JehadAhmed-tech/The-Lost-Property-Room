from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import require_roles
from app.models import LostItem, FoundItem, Match

router=APIRouter()

@router.get("")
def dashboard(current_user=Depends(require_roles("manager")),db:Session=Depends(get_db)):
    return {
        "lost_items":db.query(LostItem).count(),
        "found_items":db.query(FoundItem).count(),
        "matches":db.query(Match).count(),
        "pending_matches":db.query(Match).filter(Match.status=="pending").count()
    }
