from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import DATABASE_URL, SECRET_KEY

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = SECRET_KEY
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app)
    db.init_app(app)

    from models.user import User
    from models.lost_item import LostItem
    from models.found_item import FoundItem
    from models.match import Match

    from routes.auth_routes import auth_bp
    from routes.lost_routes import lost_bp
    from routes.found_routes import found_bp
    from routes.match_routes import match_bp
    from routes.dashboard_routes import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(lost_bp, url_prefix="/api/lost-items")
    app.register_blueprint(found_bp, url_prefix="/api/found-items")
    app.register_blueprint(match_bp, url_prefix="/api/matches")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    @app.get("/")
    def home():
        return {"success": True, "message": "Lost & Found Backend API is running."}

    @app.get("/api/health")
    def health():
        return {"success": True, "message": "API is healthy."}

    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
