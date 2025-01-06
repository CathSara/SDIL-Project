from flask import Blueprint, request, jsonify
from ..models.database_service import create_user, authenticate_user, confirm_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    phone_number = data['phone_number']
    first_name = data['first_name']
    last_name = data['last_name']
    password_raw = data['password']

    user, is_created = create_user(phone_number, first_name, last_name, password_raw)

    if is_created:
        return jsonify({'message': 'User registered successfully, but not confirmed!',
                        'user_id': user.id}), 201
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

    if authenticate_user(phone_number=phone_number, password=password):
        return jsonify({'message': 'Login successful!', 'token': 'mock_token'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
