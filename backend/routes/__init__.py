from flask import Blueprint, jsonify, request
from ..models.database_service import get_all_boxes, get_all_users, get_items

main = Blueprint('main', __name__)

from . import auth, inventory, user

main.register_blueprint(auth.auth_bp, url_prefix='/auth')
main.register_blueprint(inventory.inventory_bp, url_prefix='/inventory')
main.register_blueprint(user.user_pb, url_prefix='/user')


@main.route('/test/items', methods=['GET'])
def get_items_list():
    box_id = request.args.get("box_id", None)
    category = request.args.get("category", None)
    search_string = request.args.get("search_string", None)
    
    items = get_items(box_id=box_id, category=category, search_string=search_string)
    items_data = [item.to_detail_dict() for item in items]
    return jsonify(items_data)


@main.route('/test/users', methods=['GET'])
def get_users_list():
    users = get_all_users()
    users_data = [user.to_dict() for user in users]
    return jsonify(users_data)


@main.route('/test/boxes', methods=['GET'])
def get_boxes_list():
    boxes = get_all_boxes()
    boxes_data = [box.to_dict() for box in boxes]
    return jsonify(boxes_data)


@main.route('/test/hi', methods=['GET'])
def say_hi():
    return jsonify({'message': 'It works'}), 200