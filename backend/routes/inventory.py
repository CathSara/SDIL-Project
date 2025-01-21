from flask import Blueprint, jsonify, request

from backend.services import open_box
from ..models.database_service import add_favorite, get_all_boxes, get_box_by_id, get_items, get_item_by_id, get_reserved_items, get_user_favorites, is_item_favorited, is_item_reserved, remove_favorite, update_item_as_reserved, update_item_as_unreserved, update_item

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/items', methods=['GET'])
def search_items():
    """
    Use this endpoint to search for items.


    Returns:
        json: an overview of available items with the provided filters.
    """
    box_id = request.args.get("box_id", None)
    category = request.args.get("category", None)
    search_string = request.args.get("search_string", None)

    items = get_items(box_id, category, search_string)
    
    if items:
        items_data = [item.to_overview_dict() for item in items]
        return jsonify(items_data), 200
    else:
        return jsonify({'message': 'No items found matching the criteria'}), 404


@inventory_bp.route('/item', methods=['GET'])
def get_item():
    """
    Use this endpoint to retrieve particular item (so that the number of views is increased).

    Returns:
       json: a detailed description of the item.
    """
    item_id = request.args.get("item_id", None)

    item = get_item_by_id(item_id)
    
    if item:
        return jsonify(item.to_detail_dict()), 200
    else:
        return jsonify({'message': 'Item not found'}), 404
    

@inventory_bp.route('/update', methods=['POST'])
def update():
    data = request.get_json()
    item_id = data.get("item_id", None)
    title = data.get("title", None)
    description = data.get("description", None)
    category = data.get("category", None)
    condition = data.get("condition", None)

    print("update called with item id:", item_id)

    item = update_item(item_id, title, description, category, condition)

    if item == "item_error":
        return jsonify({'message': 'Item not found'}), 404
    else:
        return jsonify(item.to_detail_dict()), 200
    

@inventory_bp.route('/reserve', methods=['POST'])
def reserve_item():
    item_id = request.args.get("item_id", None)
    user_id = request.args.get("user_id", None)
    status = update_item_as_reserved(item_id, user_id)

    if status == "success":
        return jsonify({'message': 'Item is now reserved'}), 200
    if status == "conflict":
        return jsonify({'message': 'Item has already been reserved'}), 403
    if status == "item_error":
        return jsonify({'message': 'Item not found'}), 404
    else:
        return jsonify({'message': 'User not found'}), 404
    

@inventory_bp.route('/unreserve', methods=['POST'])
def unreserve_item():
    item_id = request.args.get("item_id", None)
    user_id = request.args.get("user_id", None)
    status = update_item_as_unreserved(item_id, user_id)

    if status == "success":
        return jsonify({'message': 'Item is now unreserved'}), 200
    if status == "item_error":
        return jsonify({'message': 'Item not found'}), 404
    else:
        return jsonify({'message': 'Item could not be unreserved'}), 403
    

@inventory_bp.route('/get_reserved', methods=['GET'])
def get_reserved():
    user_id = request.args.get("user_id", None)

    items = get_reserved_items(user_id)
    
    if items:
        items_data = [item.to_overview_dict() for item in items]
        return jsonify(items_data), 200
    else:
        return jsonify({'message': 'No items found matching the criteria'}), 404
    

@inventory_bp.route('/is_reserved', methods=['GET'])
def is_reserved():
    item_id = request.args.get("item_id", None)

    result = is_item_reserved(item_id)
    return jsonify({'reserved': result, 'item_id': item_id}), 200


@inventory_bp.route('/favorize', methods=['POST'])
def favorize_item():
    item_id = request.args.get("item_id", None)
    user_id = request.args.get("user_id", None)

    success = add_favorite(user_id, item_id)
    if success:
        return jsonify({'message': 'Item is now favorited'}), 200
    else:
        return jsonify({'message': 'Item could not be favorited'}), 403


@inventory_bp.route('/defavorize', methods=['POST'])
def defavorize_item():
    item_id = request.args.get("item_id", None)
    user_id = request.args.get("user_id", None)

    success = remove_favorite(user_id, item_id)
    if success:
        return jsonify({'message': 'Item is now dereserved'}), 200
    else:
        return jsonify({'message': 'Item could not be defavorized'}), 403


@inventory_bp.route('/is_favorized', methods=['GET'])
def is_favorized():
    item_id = request.args.get("item_id", None)
    user_id = request.args.get("user_id", None)

    item_favorited = is_item_favorited(user_id, item_id)
    return jsonify({'item_favorited': item_favorited}), 200


@inventory_bp.route('/get_favorites', methods=['GET'])
def get_favorites():
    user_id = request.args.get("user_id", None)

    favorites = get_user_favorites(user_id)

    if favorites:
        favorites_data = [favorite.to_overview_dict() for favorite in favorites]
        return jsonify(favorites_data), 200
    else:
        return jsonify({'message': 'No favorites found'}), 404
    

@inventory_bp.route('/boxes', methods=['GET'])
def get_boxes():
    boxes = get_all_boxes()

    if boxes:
        boxes_data = [box.to_dict() for box in boxes]
        return jsonify(boxes_data), 200
    else:
        return jsonify({'message': 'No boxes found'}), 404
    

@inventory_bp.route('/box', methods=['GET'])
def get_box():
    box_id = request.args.get("box_id", None)
    box = get_box_by_id(box_id=box_id)

    if box:
        return jsonify(box.to_dict()), 200
    else:
        return jsonify({'message': 'No box found'}), 404
    

@inventory_bp.route('/open', methods=['GET'])
def open_box_request():
    box_id = request.args.get("box_id", None)
    open_box(box_id)
    
    return jsonify({'message': 'Notified backend to open the box.'}), 200


@inventory_bp.route('/categories', methods=['GET'])
def get_categories():
    categories_data = [
        { "name": "Dishes"},
        { "name": "Household Appliance"},
        { "name": "Decorations"},
        { "name": "Electronics"},
        { "name": "Storage"},
        { "name": "Toys"}
    ]

    return jsonify(categories_data), 200