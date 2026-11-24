# Lost & Found Management System - FastAPI

Run:
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload

Swagger: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc

MySQL:
DB_NAME=lost_and_found_db
DB_USER=root
DB_PASSWORD=empty

Authentication:
1. POST /api/auth/register
2. POST /api/auth/login
3. Copy access_token
4. Swagger /docs -> Authorize -> enter: Bearer <token>
5. Use protected endpoints.

Roles:
passenger -> create lost reports
driver -> create found reports
manager -> matches, dashboard, confirm/reject, return, delete

Important:
The app uses the existing MySQL database and automatically creates the required tables on startup.
