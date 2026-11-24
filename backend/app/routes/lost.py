from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user, require_roles
from app.models import LostItem, FoundItem, Match
from app.schemas import LostItemCreate, LostItemOut
from app.services.matching import calculate_match_score

router = APIRouter()

@router.post("", response_model=LostItemOut, status_code=201)
def create_lost(data: LostItemCreate, current_user=Depends(require_roles("passenger", "manager")), db: Session = Depends(get_db)):
    item = LostItem(**data.model_dump(), user_id=current_user.id)
    db.add(item); db.flush()
    for found in db.query(FoundItem).filter(FoundItem.status.in_(["stored", "found"])).all():
        score = calculate_match_score(item, found)
        if score >= 60 and not db.query(Match).filter(Match.lost_item_id == item.id, Match.found_item_id == found.id).first():
            db.add(Match(lost_item_id=item.id, found_item_id=found.id, score=score))
    db.commit(); db.refresh(item)
    return item

@router.get("", response_model=list[LostItemOut])
def list_lost(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(LostItem).order_by(LostItem.id.desc()).all()

@router.get("/{item_id}", response_model=LostItemOut)
def get_lost(item_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.get(LostItem, item_id)
    if not item: raise HTTPException(404, "Lost item not found")
    return item

@router.delete("/{item_id}")
def delete_lost(item_id: int, current_user=Depends(require_roles("manager")), db: Session = Depends(get_db)):
    item = db.get(LostItem, item_id)
    if not item: raise HTTPException(404, "Lost item not found")
    db.delete(item); db.commit()
    return {"message": "Lost item deleted"}
