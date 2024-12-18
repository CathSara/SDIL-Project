from flask import Flask
from flask_cors import CORS # type: ignore
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object("backend.config.Config")
    
    db.init_app(app)
    migrate.init_app(app, db)

    CORS(app, resources={r"/*": {"origins": "*"}})
    app.config['CORS_HEADERS'] = 'Content-Type'

    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    with app.app_context():
        from .models.models import User, Box, Item

    @app.cli.command('seed-db')
    def seed_db():
        """Seed the database with the seeding script in backend/seed.py."""
        from .seed import seed_database
        seed_database()
        print('Database seeded!')

    return app

