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


@box_pb.route("/capture", methods=["GET"]) #Aktuell unused, wird ausgelagert
def capture_image():
    #image_path = capture_image_for_item()
    #if image_path:
    #    print("Bild erfolgreich aufgenommen unter Pfad: " + str(image_path))
    #else:
    #    return jsonify({"message": "Fehler beim Aufnehmen des Bildes"}), 500
    #print("test base64")
    #base_64_image = encode_image(image_path)
    #if base_64_image:
    #    print("Bild erfolgreich enkodiert")
    #    #print("Bild erfolgreich enkodiert, Bild:" + str(base_64_image))
    #else:
    #    return jsonify({"message": "Fehler beim Enkodieren des Bildes"}), 500
    #item = create_item(image_path=None, category=None, title=None, description=None, condition=None, weight=None, box=1, created_by=None, item_state="created")
    capture_image_for_item(1) #Snoopy Tasse

# storage weight change

# scanning weight change