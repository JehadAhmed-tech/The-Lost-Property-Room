from app.database import Base, engine
from app.models import User, LostItem, FoundItem, Match

print("WARNING: This will delete the existing Lost & Found tables and their data.")
answer = input("Type RESET to continue: ").strip()
if answer != "RESET":
    print("Cancelled.")
    raise SystemExit(0)
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Database tables recreated successfully.")
