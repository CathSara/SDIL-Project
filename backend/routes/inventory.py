from flask import Blueprint, jsonify, request
from ..models.database_service import get_items, get_item_by_id

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