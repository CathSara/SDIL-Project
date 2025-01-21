from flask import Blueprint, jsonify, request

from backend.services import close_box

box_pb = Blueprint('box', __name__)

@box_pb.route('/notify_closed', methods=['GET'])
def notify_box_closed():
    box_id = request.args.get("box_id", None)
    close_box(box_id)
    
    return jsonify({'message': 'Notified backend that box has been closed.'}), 200


# storage weight change

# scanning weight change