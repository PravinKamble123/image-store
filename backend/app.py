import logging
from flask import Flask
from flask_cors import CORS
from models import db
from routes import auth_bp, image_bp
from utils import wait_for_db
from config import Config
from flask_migrate import Migrate



app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)
migrate = Migrate(app, db)



db.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(image_bp, url_prefix='/images')


def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG if app.debug else logging.INFO)

    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG if app.debug else logging.INFO)

    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(formatter)

    logger.addHandler(console_handler)

setup_logging()

with app.app_context():
    wait_for_db()
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
