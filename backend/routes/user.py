from flask import Blueprint, jsonify, request

from backend.models.database_service import get_user_by_id

user_pb = Blueprint('user', __name__)

@user_pb.route('/get', methods=['GET'])
def get_user():
    user_id = request.args.get("user_id", None)

    user = get_user_by_id(user_id)
    
    if user:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({'message': 'No user found.'}), 404
