from flask import Blueprint, jsonify, request

from backend.services import close_box, confirm_box_open

from backend.services.camera import capture_image_for_item

from backend.models.database_service import create_item




box_pb = Blueprint('box', __name__)

@box_pb.route('/notify_closed', methods=['POST'])
def notify_box_closed():
    box_id = request.args.get("box_id", None)
    close_box(box_id)
    
    return jsonify({'message': 'Notified backend that box has been closed.'}), 200


@box_pb.route('/notify_open', methods=['POST'])
def notify_box_open():
    box_id = request.args.get("box_id", None)
    confirm_box_open(box_id)
    
    return jsonify({'message': 'Notified backend that box has been opened.'}), 200


@box_pb.route("/capture", methods=["GET"]) 
# Used for testing the capture functionality
#Can be removed when capture_image_for_item is called in register_scanning_weight_change crrectly
def capture_image():
    capture_image_for_item(1) #Snoopy Tasse
    return jsonify({'message': 'Image and info have been added.'}), 200

# storage weight change

# scanning weight change