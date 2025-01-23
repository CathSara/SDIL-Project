from flask import Blueprint, jsonify, request

from backend.services import close_box

from backend.services.capture import capture_and_save_image

from backend.services.vision import encode_image


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
        print("Bild erfolgreich aufgenommen unter Pfad: " + str(image_path))
    else:
        return jsonify({"message": "Fehler beim Aufnehmen des Bildes"}), 500
    print("test base64")
    base_64_image = encode_image(image_path)
    if base_64_image:
        print("Bild erfolgreich enkodiert")
        #print("Bild erfolgreich enkodiert, Bild:" + str(base_64_image))
    else:
        return jsonify({"message": "Fehler beim Enkodieren des Bildes"}), 500

# storage weight change

# scanning weight change