# FastAPI API Contract

Base URL: `http://localhost:8000/api`

Authentication:
- `POST /auth/register`
- `POST /auth/login`
- Protected endpoints use `Authorization: Bearer <JWT>`.

Lost:
- `GET /lost`
- `POST /lost`
- `GET /lost/{id}`
- `DELETE /lost/{id}` (manager)

Found:
- `GET /found`
- `POST /found` (driver/manager)
- `GET /found/{id}`
- `DELETE /found/{id}` (manager)

Matches:
- `GET /matches` (manager)
- `PATCH /matches/{id}/status` with `{ "status": "confirmed" | "rejected" | "pending" }`
- `POST /matches/{id}/return` (manager; confirmed match only)

Dashboard:
- `GET /dashboard` (manager)

The frontend maps its UI fields to the backend request fields and stores the JWT in localStorage.
