from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import require_roles
from app.models import Match, FoundItem, LostItem
from app.schemas import MatchOut, MatchStatusUpdate

router=APIRouter()

@router.get("", response_model=list[MatchOut])
def list_matches(current_user=Depends(require_roles("manager")),db:Session=Depends(get_db)):
    return db.query(Match).order_by(Match.score.desc()).all()

@router.patch("/{match_id}/status",response_model=MatchOut)
def update_status(match_id:int,data:MatchStatusUpdate,current_user=Depends(require_roles("manager")),db:Session=Depends(get_db)):
    if data.status not in {"pending","confirmed","rejected"}:
        raise HTTPException(400,"Invalid status")
    match=db.get(Match,match_id)
    if not match: raise HTTPException(404,"Match not found")
    match.status=data.status; db.commit(); db.refresh(match)
    return match

@router.post("/{match_id}/return")
def return_item(match_id:int,current_user=Depends(require_roles("manager")),db:Session=Depends(get_db)):
    match=db.get(Match,match_id)
    if not match: raise HTTPException(404,"Match not found")
    match.status="returned"
    found=db.get(FoundItem,match.found_item_id)
    lost=db.get(LostItem,match.lost_item_id)
    if found: found.status="returned"
    if lost: lost.status="returned"
    db.commit()
    return {"message":"Item marked as returned"}
