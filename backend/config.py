import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///tasks.db'
    # SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.getenv(
    "DATABASE_URL", "postgresql://flaskuser:flaskpassword@db:5432/flaskdb")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'my_secret')
    JWT_ACCESS_TOKEN_EXPIRES = 3600 
