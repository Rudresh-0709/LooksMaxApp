from backend.app.services.llm_pipeline.image_helper import get_recent_images
import os
from backend.app.services.llm_pipeline.prompts import (JAWLINE_PROMPT,SMILE_PROMPT,SKIN_PROMPT,CHEEKBONE_PROMPT,EYELINE_PROMPT)
from langchain_google_genai import ChatGoogleGenerativeAI

# Fix the path to point to the correct location
FACIAL_IMAGES_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 
                                 'src', 'uploads', 'facial_images')

def convert_recent_facial_images():
    # Get the 3 most recent images as base64
    converted_images = get_recent_images(FACIAL_IMAGES_PATH, count=3)
    
    # Print number of images found
    print(f"Found {len(converted_images)} recent images")
    
    return converted_images

if __name__ == "__main__":
    results = convert_recent_facial_images()
    for i, img in enumerate(results, 1):
        data = img["inlineData"]["data"]
        print(f"Image {i}: {img['inlineData']['mimeType']}")
        print(f"Base64 snippet: {data[:100]}...\n")

