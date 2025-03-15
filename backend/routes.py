import os
import logging
from flask import Blueprint, request, jsonify, g
from models import db, User, Image
from utils import hash_password, check_password, create_jwt_token, jwt_required
from werkzeug.utils import secure_filename


UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)
image_bp = Blueprint('images', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user with a username and password"""
    
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if User.query.filter_by(username=username).first():
        logger.warning(f"Username '{username}' already exists")
        return jsonify({"message": "Username already exists"}), 400

    # Hash the password and create a new user
    hashed_password = hash_password(password)
    user = User(username=username, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    logger.info(f"User '{username}' registered successfully")
    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """ Login a user by validating their credentials and returning a JWT token """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    
    user = User.query.filter_by(username=username).first()
    if not user:
        logger.warning(f"Login failed: User '{username}' not found")
        return jsonify({'message': "User not found"}), 400
    if user and check_password(user.password, password):
        access_token = create_jwt_token(user.id)
        logger.info(f"User '{username}' logged in successfully")
        return jsonify(access_token=access_token, username=username), 200

    logger.warning(f"Invalid credentials for user '{username}'")
    return jsonify({"message": "Invalid credentials"}), 401

@image_bp.route('/add', methods=['POST'])
@jwt_required
def upload():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    user_id = g.user_id

    new_image = Image(url=file_path, user_id=user_id)
    db.session.add(new_image)
    db.session.commit()

    return jsonify({'message': 'File uploaded successfully', 'file_url': file_path}), 201

@image_bp.route('/images', methods=['POST'])
@jwt_required
def get_images():
    images = Image.query.filter_by(user_id=g.user_id).all()
    return jsonify({'images': [img.url for img in images]})

