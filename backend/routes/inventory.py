from flask import Blueprint, jsonify, request
from ..models.database_service import get_all_items

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/items', methods=['GET'])
def get_example():
    box_id = request.args.get('box_id')
    items = get_all_items(box_id)
    items_data = [item.to_dict() for item in items]
    return jsonify(items_data)

