import os
from flask import jsonify
import requests
from PIL import Image
from datetime import datetime

CAMERA_URL = "http://172.20.10.4/capture"
SAVE_DIRECTORY = os.path.join(os.getcwd(), "website-sharingbox", "public", "uploads")
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    """Prüfen, ob die Datei eine erlaubte Bilddatei ist."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def capture_and_save_image():
    """Bild von der Kamera abrufen und speichern."""
    try:
        response = requests.get(CAMERA_URL, timeout=10)
        response.raise_for_status()

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")  #Format: yyyymmdd_hhmmss
        #filename = "captured_image_" + timestamp + filename.rsplit('.', 1)[1].lower()
        #filename = f"captured_image_{timestamp}.jpg" #HIER AUSKOMMENTIEREN NACH OPENAI TESTING
        filename = "testbild.jpg" #HIER WEG NACH OPENAI TESTING

        filepath = os.path.join(SAVE_DIRECTORY, filename)

        os.makedirs(SAVE_DIRECTORY, exist_ok=True)
        with open(filepath, "wb") as file:
            file.write(response.content)

        img = Image.open(filepath)
        img = img.resize((800, 600))
        img.save(filepath)

        return jsonify({"message": "Bild erfolgreich aufgenommen", "path": f"/uploads/{filename}"}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Fehler beim Abrufen des Bildes: {e}"}), 500
