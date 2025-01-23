from flask import Blueprint, jsonify, request

from backend.services import close_box, confirm_box_open

from backend.services.capture import capture_and_save_image

from backend.services.vision import encode_image


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
def capture_image():
    image_path = capture_and_save_image()
    if image_path:
        print(jsonify({"message": "Bild erfolgreich aufgenommen", "path": image_path}), 200)
    else:
        return jsonify({"message": "Fehler beim Aufnehmen des Bildes"}), 500
    base_64_image = encode_image(image_path)
    if base_64_image:
        return jsonify({"message": "Bild erfolgreich aufgenommen", "path": base_64_image}), 200
    else:
        return jsonify({"message": "Fehler beim Enkodieren des Bildes"}), 500

# storage weight change

# scanning weight change