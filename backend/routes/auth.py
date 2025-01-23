import os
from PIL import Image
from flask import Blueprint, Flask, request, jsonify, current_app
from ..models.database_service import create_user, authenticate_user, confirm_user

auth_bp = Blueprint('auth', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.form
    phone_number = data['phone_number']
    first_name = data['first_name']
    last_name = data['last_name']
    password_raw = data['password']

    profile_picture = request.files.get('profile_picture')
    profile_picture_path = None

    if profile_picture and allowed_file(profile_picture.filename):
        filename = f"{phone_number}.{profile_picture.filename.rsplit('.', 1)[1].lower()}"
        filepath = os.path.join(os.getcwd(), 'website-sharingbox', 'public', 'profiles', filename)

        img = Image.open(profile_picture)
        img = img.resize((256, 256))

        img.save(filepath)
        profile_picture_path = f"/profiles/{filename}"

    user, is_created = create_user(phone_number, first_name, last_name, password_raw, profile_picture_path)

    if is_created:
        return jsonify({'message': 'User registered successfully, but not confirmed!', 'user_id': user.id}), 201
    else:
        return jsonify({'message': 'User already exists'}), 409


@auth_bp.route('/confirm', methods=['POST'])
def confirm():
    data = request.get_json()
    user_id = data["user_id"]
    token = data["token"]

    user, is_confirmed = confirm_user(user_id,token)

    if is_confirmed:
        return jsonify({'message': 'User has been confirmed!',
                        'user_id': user.id}), 201
    else:
        return jsonify({'message': 'User could not be confirmed.'}), 409


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    phone_number = data['phone_number']
    password = data['password']

    user, authenticated = authenticate_user(phone_number=phone_number, password=password)

    if authenticated:
        return jsonify({'message': 'Login successful!', 'token': 'mock_token', 'user_id': user.id}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
