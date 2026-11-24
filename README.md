# The Lost Property Room

## Backend
1. Create `backend/.env` from `.env.example` and set MySQL values.
2. From `backend`, install requirements: `venv\Scripts\python.exe -m pip install -r requirements.txt`
3. If the database still has the old schema, run `venv\Scripts\python.exe reset_db.py` and type `RESET`.
4. Start API: `venv\Scripts\python.exe -m uvicorn app.main:app --reload`
5. Swagger: http://127.0.0.1:8000/docs

## Frontend
1. Create `frontend/.env` from `.env.example`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open http://localhost:5173

Frontend API calls use the FastAPI backend at `http://localhost:8000/api` and JWT bearer authentication.
