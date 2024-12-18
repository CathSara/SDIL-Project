from flask import Blueprint, request, jsonify
from ..models.database_service import create_user, authenticate_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    phone_number = data['phone_number']
    first_name = data['first_name']
    last_name = data['last_name']
    password_raw = data['password']

    if create_user(phone_number, first_name, last_name, password_raw):
        return jsonify({'message': 'User registered successfully!'}), 201
    else:
        return jsonify({'message': 'User already exists'}), 409


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    phone_number = data['phone_number']
    password = data['password']

    if authenticate_user(phone_number=phone_number, password=password):
        return jsonify({'message': 'Login successful!', 'token': 'mock_token'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
