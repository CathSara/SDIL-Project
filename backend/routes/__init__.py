from flask import Blueprint, jsonify
from ..models.database_service import get_all_boxes, get_all_users, get_all_items

main = Blueprint('main', __name__)

from . import auth, inventory

main.register_blueprint(auth.auth_bp, url_prefix='/auth')
main.register_blueprint(inventory.inventory_bp, url_prefix='/inventory')

@main.route('/test/items', methods=['GET'])
def get_items():
    items = get_all_items()
    items_data = [item.to_dict() for item in items]
    return jsonify(items_data)


@main.route('/test/users', methods=['GET'])
def get_users():
    users = get_all_users()
    users_data = [user.to_dict() for user in users]
    return jsonify(users_data)


@main.route('/test/boxes', methods=['GET'])
def get_boxes():
    boxes = get_all_boxes()
    boxes_data = [box.to_dict() for box in boxes]
    return jsonify(boxes_data)