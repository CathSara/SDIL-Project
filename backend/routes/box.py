from flask import Blueprint, jsonify, request

from backend.services import close_box

from backend.services.capture import capture_and_save_image

box_pb = Blueprint('box', __name__)

@box_pb.route('/notify_closed', methods=['GET'])
def notify_box_closed():
    box_id = request.args.get("box_id", None)
    close_box(box_id)
    
    return jsonify({'message': 'Notified backend that box has been closed.'}), 200

@box_pb.route("/capture", methods=["GET"])
def capture_image():
    image_path = capture_and_save_image()
    if image_path:
        return jsonify({"message": "Bild erfolgreich aufgenommen", "path": image_path}), 200
    else:
        return jsonify({"message": "Fehler beim Aufnehmen des Bildes"}), 500


# storage weight change

# scanning weight change