from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes.auth import router as auth_router
from app.routes.lost import router as lost_router
from app.routes.found import router as found_router
from app.routes.matches import router as matches_router
from app.routes.dashboard import router as dashboard_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="Lost & Found Management System API", version="2.1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(lost_router, prefix="/api/lost", tags=["Lost Items"])
app.include_router(found_router, prefix="/api/found", tags=["Found Items"])
app.include_router(matches_router, prefix="/api/matches", tags=["Matches"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/", tags=["Health"])
def root(): return {"message": "Lost & Found Backend API is running"}
