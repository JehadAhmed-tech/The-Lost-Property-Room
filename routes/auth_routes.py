from flask import Blueprint, request
from app import db
from models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = (data.get("role") or "USER").upper()

    if not name or not email or not password:
        return {"success": False, "message": "name, email and password are required"}, 400

    if role not in {"USER", "DRIVER", "ADMIN"}:
        return {"success": False, "message": "Invalid role"}, 400

    if User.query.filter_by(email=email).first():
        return {"success": False, "message": "Email already registered"}, 409

    user = User(name=name, email=email, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return {"success": True, "message": "Registration successful", "data": user.to_dict()}, 201

@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return {"success": False, "message": "Invalid email or password"}, 401

    # Simple development login response.
    # JWT can be added later if your teacher requires token-based authentication.
    return {
        "success": True,
        "message": "Login successful",
        "data": user.to_dict()
    }, 200
