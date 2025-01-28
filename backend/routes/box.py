from flask import Blueprint, jsonify, request

from backend.services import close_box, confirm_box_open, register_storage_weight_change, register_scanning_weight_change

from backend.services.camera import capture_image_for_item

import time



box_pb = Blueprint('box', __name__)

@box_pb.route('/storage_weight_change', methods=['POST'])
def storage_weight_change():
    box_id = request.args.get("box_id", None)
    weight_change = request.args.get("weight_change", None)
    
    items = register_storage_weight_change(box_id, weight_change)
    
    if items:
        items_data = [item.to_detail_dict() for item in items]
        return jsonify(items_data)
    else:
        return jsonify({"message": "No item in this weight range"})

@box_pb.route('/notify_closed', methods=['POST'])
def notify_box_closed():
    box_id = request.args.get("box_id", None)
    close_box(box_id)
    
    return jsonify({'message': 'Notified backend that box has been closed.'}), 200


@box_pb.route('/notify_open', methods=['POST'])
def notify_box_open():
    print("box should be notified to open here")
    box_id = request.args.get("box_id", None)
    confirm_box_open(box_id)
    
    return jsonify({'message': 'Notified backend that box has been opened.'}), 200


@box_pb.route("/capture", methods=["GET"]) 
# Used for testing the capture functionality
#Can be removed when capture_image_for_item is called in register_scanning_weight_change crrectly
def capture_image():
    print("Putting item in scanning...")
    register_scanning_weight_change(1, 666)
    print("Success!")
    #import time
    #time.sleep(2)
    #print("Taking item out of scanning...")
    #time.sleep(2)
    #register_scanning_weight_change(1, -666)
    #time.sleep(2)
    #print("Putting in storage...")
    #register_storage_weight_change(1,666)
    return jsonify({'message': 'Image and info have been added.'}), 200

  


# Todo: Scanning weight change
