import os
from flask import jsonify
import requests
from PIL import Image

# Konfiguration für die Kamera und den Speicherpfad
CAMERA_URL = "http://172.20.10.4/capture"
SAVE_DIRECTORY = os.path.join(os.getcwd(), "website-sharingbox", "public", "uploads")
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    """Prüfen, ob die Datei eine erlaubte Bilddatei ist."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def capture_image():
    """Bild von der Kamera abrufen und speichern."""
    try:
        # Bild von der Kamera abrufen
        response = requests.get(CAMERA_URL, timeout=10)
        response.raise_for_status()

        # Dateiname und Speicherpfad definieren
        filename = "captured_image.jpg"
        filepath = os.path.join(SAVE_DIRECTORY, filename)

        # Sicherstellen, dass der Speicherordner existiert
        os.makedirs(SAVE_DIRECTORY, exist_ok=True)

        # Bild speichern
        with open(filepath, "wb") as file:
            file.write(response.content)

        # Optional: Bild mit Pillow bearbeiten (z. B. Größe ändern)
        img = Image.open(filepath)
        img = img.resize((256, 256))  # Bildgröße anpassen
        img.save(filepath)

        return jsonify({"message": "Bild erfolgreich aufgenommen", "path": f"/uploads/{filename}"}), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Fehler beim Abrufen des Bildes: {e}"}), 500
