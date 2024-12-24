import openai
from ..models.database_service import create_item

#client = OpenAI()

openai.api_key = ''

def analyze_image(image_url):
  response = openai.ChatCompletion.create(
    model="gpt-4o-mini",
    messages=[
      {
        "role": "user",
        "content": [
          {"type": "text", "text": "Analyze the object in this image and provide the following information: Object type (choose from: 'Material good' or 'No material good', exclude food items from being material goods), Category, Title (name of the object), Description (short explanation in one sentence without commas and dots), Condition (choose from: 'new', 'good', 'acceptable', 'poor'). Answer in one line and by using the following format: Object type: [result], Category: [result], Title: [result], Description: [result], Condition: [result]"},
          {
            "type": "image_url",
            "image_url": {
              "url": image_url,
            },
          },
        ],
      }
    ],
    max_tokens=300,
  )
  content = response.choices[0].message['content']
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
  object_type = result.get("object_type", "").lower()
  condition = result.get("condition", "").lower()

  if object_type not in ["no material good"] and condition not in ["poor"]:
        return True
  else:
    return False

def handle_item(image_url, weight, box, created_by):
  analysis_result = analyze_image(image_url)
  is_allowed = allow_object(analysis_result)

  if is_allowed:
        create_item(image_url, analysis_result["category"], analysis_result["title"], analysis_result["description"], analysis_result["condition"], weight, box, created_by)
        print(f"Item '{analysis_result['title']}' added to the database.")
  else:
        print(f"Item '{analysis_result['title']}' is not allowed.")