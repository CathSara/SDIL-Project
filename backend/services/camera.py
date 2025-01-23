"""
This script does the object recognition an image taken by the camera. It includes:
 - taking an image
 - saving it
 - encoding the image in a base64 string
 - recognizing objects on the image (as a base64 string) with the OpenAI API
 - extracting all relevant information of the recognized object (object type, category, title, description, condition)
 - determining whether it is an allowed object or not (depends on object type and condition)
 - handling the object by adding it to the database if it is allowed or reject it otherwise
"""

from openai import OpenAI
import base64
import os
from ..models.database_service import create_item, update_item
from flask import jsonify
import requests
from PIL import Image
from datetime import datetime
from dotenv import load_dotenv

CAMERA_URL = "http://172.20.10.4/capture"
SAVE_DIRECTORY = os.path.join(os.getcwd(), "website-sharingbox", "public", "uploads")
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

def allowed_file(filename):
    """Prüfen, ob die Datei eine erlaubte Bilddatei ist."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def capture_image_for_item(item_id):
    """Bild von der Kamera abrufen und speichern."""
    try:
        response = requests.get(CAMERA_URL, timeout=10)
        response.raise_for_status()

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")  #Format: yyyymmdd_hhmmss
        #filename = "captured_image_" + timestamp + filename.rsplit('.', 1)[1].lower()
        filename = f"{item_id}.jpg"

        filepath = os.path.join(SAVE_DIRECTORY, filename)

        os.makedirs(SAVE_DIRECTORY, exist_ok=True)
        with open(filepath, "wb") as file:
            file.write(response.content)

        img = Image.open(filepath)
        img = img.resize((1600, 1200))
        img.save(filepath)

        if filepath:
          print("Bild erfolgreich aufgenommen unter Pfad: " + str(filepath))
          item = update_item(item_id, image_path="/uploads/"+filename)
          encode_image(item.id, item.image_path)
        else:
          return jsonify({"message": "Fehler beim Aufnehmen des Bildes"}), 500
    

    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Fehler beim Abrufen des Bildes: {e}"}), 500

def encode_image(item_id, item_image_path):
    """
    Encodes an image to a Base64 string (needed for local images).

    Args:
      image_path (str): Relative path to the image

    Returns:
      str: Base64 encoded string

    Attribution:
      Encoding adapted from OpenAI API Vision documentation: https://platform.openai.com/docs/guides/vision  
    """
    file_path = os.getcwd() + "/website-sharingbox/public/" + item_image_path
    file_path = file_path.replace("\\","/")

    # Encode image file to Base64 string
    with open(file_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode("utf-8")
    #return f"data:image/jpeg;base64,{base64_image}"
    analyze_image(item_id, base64_image)

def analyze_image(item_id, base64_image):
  """
  Analyzes the image by recognizing objects through OpenAI and extracting relevant information (object type, category, title, description, condition).

  Args:
    image_path (str): Relative path to the image

  Returns:
    dict: Dictionary with relevant information of the recognized object 

  Attribution:
    API request adapted from OpenAI API Vision documentation: https://platform.openai.com/docs/guides/vision
    Used help in ChatGPT for information extraction
  """

  load_dotenv()
  client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
  print(client.api_key)
  response = client.chat.completions.create(
    model="gpt-4o-mini", # Future outlook: Could use better performing, but more costly models
    messages=[
      {
        "role": "user",
        "content": [
          {"type": "text",
           "text": "Analyze the object lying in the white shelf on the foreground of this image and provide the following information: Object type (choose from: 'Material good' or 'No material good', exclude food items from being material goods), Category, Title (name of the object), Description (short explanation in one sentence without commas and dots), Condition (choose from: 'new', 'good', 'acceptable', 'poor'). Answer in one line and by using the following format: Object type: [result], Category: [result], Title: [result], Description: [result], Condition: [result]"},
          {
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
          },
        ],
      }
    ],
    max_tokens=300,
  )
  content = response.choices[0].message.content
  result = {
        "object_type": None,
        "category": None,
        "title": None,
        "description": None,
        "condition": None
    }
    
  for line in content.split(", "):
      if "Object type:" in line:
          result["object_type"] = line.split("Object type:")[1].strip()
      elif "Category:" in line:
           result["category"] = line.split("Category:")[1].strip()
      elif "Title:" in line:
           result["title"] = line.split("Title:")[1].strip()
      elif "Description:" in line:
          result["description"] = line.split("Description:")[1].strip()
      elif "Condition:" in line:
          result["condition"] = line.split("Condition:")[1].strip()

  print(result)
  # allow object
  if allow_object(result) == True:
    item = update_item(item_id, category=result["category"], condition=result["condition"], title=result["title"], description=result["description"])
    print(item)
  else:
    print("Not allowed")

def allow_object(result):
  """
  Determines whether the recognized object is allowed to be put in the smart giveaway box based on the object type and the condition.

  Args:
    result (dict): Dictionary with the relevant information of the recognized object

  Returns:
    bool: True if object is allowed, False otherwise
  """

  # Get the values for object type and condition
  object_type = result.get("object_type", "").lower()
  condition = result.get("condition", "").lower()

  # Allows object if it is not in poor condition and not recognized as "no material good" (which includes food items)
  if object_type not in ["no material good"] and condition not in ["poor"]:
    return True
  else:
    return False