from flask import Blueprint, jsonify, request

from backend.services import register_storage_weight_change
from ..models.database_service import get_all_boxes, get_all_users, get_items, update_item_state

main = Blueprint('main', __name__)

from . import auth, inventory, user, box

main.register_blueprint(auth.auth_bp, url_prefix='/auth')
main.register_blueprint(inventory.inventory_bp, url_prefix='/inventory')
main.register_blueprint(user.user_pb, url_prefix='/user')
main.register_blueprint(box.box_pb, url_prefix='/box')


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


@main.route('/test/item_status', methods=['GET'])
def item_status():
    item_id = request.args.get("item_id", None)
    state = request.args.get("state", None)
    
    item = update_item_state(item_id, state)
    return jsonify(item.to_detail_dict())


@main.route('/test/weight_change', methods=['GET'])
def test_weight_change():
    box_id = request.args.get("box_id", None)
    weight_change = request.args.get("weight_change", None)
    
    items = register_storage_weight_change(box_id, weight_change)
    
    if items:
        items_data = [item.to_detail_dict() for item in items]
        return jsonify(items_data)
    else:
        return jsonify({"message": "No item in this weight range"})