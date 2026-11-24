from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user, require_roles
from app.models import FoundItem, LostItem, Match
from app.schemas import FoundItemCreate, FoundItemOut
from app.services.matching import calculate_match_score

router = APIRouter()

@router.post("", response_model=FoundItemOut, status_code=201)
def create_found(data: FoundItemCreate, current_user=Depends(require_roles("driver", "manager")), db: Session = Depends(get_db)):
    item = FoundItem(**data.model_dump(), user_id=current_user.id)
    db.add(item); db.flush()
    for lost in db.query(LostItem).filter(LostItem.status == "searching").all():
        score = calculate_match_score(lost, item)
        if score >= 60 and not db.query(Match).filter(Match.lost_item_id == lost.id, Match.found_item_id == item.id).first():
            db.add(Match(lost_item_id=lost.id, found_item_id=item.id, score=score))
    db.commit(); db.refresh(item)
    return item

@router.get("", response_model=list[FoundItemOut])
def list_found(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(FoundItem).order_by(FoundItem.id.desc()).all()

@router.get("/{item_id}", response_model=FoundItemOut)
def get_found(item_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.get(FoundItem, item_id)
    if not item: raise HTTPException(404, "Found item not found")
    return item

@router.delete("/{item_id}")
def delete_found(item_id: int, current_user=Depends(require_roles("manager")), db: Session = Depends(get_db)):
    item = db.get(FoundItem, item_id)
    if not item: raise HTTPException(404, "Found item not found")
    db.delete(item); db.commit()
    return {"message": "Found item deleted"}
