"""
This script does the object recognition for images sent by the camera. It includes:
 - encoding the image in a base64 string
 - recognizing objects on the image (as a base64 string) with the OpenAI API
 - extracting all relevant information of the recognized object (object type, category, title, description, condition)
 - determining whether it is an allowed object or not (depends on object type and condition)
 - handling the object by adding it to the database if it is allowed or reject it otherwise
"""

import openai # type: ignore
import base64
import os
from ..models.database_service import create_item
from dotenv import load_dotenv # type: ignore

# Get the OpenAI API key from the .env file
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

def encode_image(image_name):
    """
    Encodes an image to a Base64 string (needed for local images).

    Args:
      image_path (str): Relative path to the image

    Returns:
      str: Base64 encoded string

    Attribution:
      Encoding adapted from OpenAI API Vision documentation: https://platform.openai.com/docs/guides/vision  
    """

    # Construct absolute path to make it work
    file_path = os.getcwd() + "/website-sharingbox/public/uploads/" + image_name
    file_path = file_path.replace("\\","/")

    # Encode image file to Base64 string
    with open(file_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode("utf-8")
    return f"data:image/jpeg;base64,{base64_image}"

def analyze_image(image_path):
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

  # Encode image to a Base64 string
  base64_image = encode_image(image_path) # Comment this line out if URL option is used instead

  # Create an API request, including the prompt message and image
  response = openai.ChatCompletion.create(
    model="gpt-4o-mini", # Future outlook: Could use better performing, but more costly models
    messages=[
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "Analyze the object in this image and provide the following information: Object type (choose from: 'Material good' or 'No material good', exclude food items from being material goods), Category, Title (name of the object), Description (short explanation in one sentence without commas and dots), Condition (choose from: 'new', 'good', 'acceptable', 'poor'). Answer in one line and by using the following format: Object type: [result], Category: [result], Title: [result], Description: [result], Condition: [result]"},
          {
            "type": "image_url",
            "image_url": {
              "url": base64_image, # If URL option is used: Replace base64_image with image_path (which should then be image_url with the link to the image)
            },
          },
        ],
      }
    ],
    max_tokens=300,
  )
  content = response.choices[0].message['content']

  # Initialize the dictionary and extract the relevant information from the response of OpenAI (which should have the given format from the prompt message)
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

  return result

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

def handle_item(image_path, weight, box, created_by):
  """
  Handles the item (object) by adding it to the database if it is allowed or reject it otherwise.

  Args:
    image path (str): Relative path to the image
    weight (float): Weight of the object (given by weight sensors)
    box (str): Box ID where the item is put in
    created_by (str): User who puts the item in 
  """

  analysis_result = analyze_image(image_path)
  is_allowed = allow_object(analysis_result)

  if is_allowed:
        create_item(image_path, analysis_result["category"], analysis_result["title"], analysis_result["description"], analysis_result["condition"], weight, box, created_by)
        print(f"Item '{analysis_result['title']}' added to the database.")
  else:
        print(f"Item '{analysis_result['title']}' is not allowed.")