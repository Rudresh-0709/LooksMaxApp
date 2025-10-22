from backend.app.services.llm_pipeline.image_helper import get_recent_images,get_only_recent_images
import os
from backend.app.services.llm_pipeline.prompts import (JAWLINE_PROMPT,SMILE_PROMPT,SKIN_PROMPT,CHEEKBONE_PROMPT,EYELINE_PROMPT)
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from PIL import Image
import base64
from openai import OpenAI
import sys

load_dotenv()

# Fix the path to point to the correct location
FACIAL_IMAGES_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 
                                 'src', 'uploads', 'facial_images')

def load_gemini_image():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.3
    )

gemini_llm=load_gemini_image()

images=get_recent_images(FACIAL_IMAGES_PATH)

gemini_jawline = gemini_llm.invoke([
    {"role": "user", "content": [
        {"type": "text", "text": JAWLINE_PROMPT},
        *[{"type": "image_url", "image_url": f"data:image/jpeg;base64,{img['inlineData']['data']}"} for img in images]

    ]}
])
jawline_gemini_output=gemini_jawline.content

gemini_smile = gemini_llm.invoke([
    {"role": "user", "content": [
        {"type": "text", "text": SMILE_PROMPT},
        *[{"type": "image_url", "image_url": f"data:image/jpeg;base64,{img['inlineData']['data']}"} for img in images]

    ]}
])
smile_gemini_output=gemini_smile.content

gemini_skin = gemini_llm.invoke([
    {"role": "user", "content": [
        {"type": "text", "text": SKIN_PROMPT},
        *[{"type": "image_url", "image_url": f"data:image/jpeg;base64,{img['inlineData']['data']}"} for img in images]

    ]}
])
skin_gemini_output=gemini_skin.content

gemini_cheekbone = gemini_llm.invoke([
    {"role": "user", "content": [
        {"type": "text", "text": CHEEKBONE_PROMPT},
        *[{"type": "image_url", "image_url": f"data:image/jpeg;base64,{img['inlineData']['data']}"} for img in images]

    ]}
])
cheekbone_gemini_output=gemini_cheekbone.content

gemini_eyeline = gemini_llm.invoke([
    {"role": "user", "content": [
        {"type": "text", "text": EYELINE_PROMPT},
        *[{"type": "image_url", "image_url": f"data:image/jpeg;base64,{img['inlineData']['data']}"} for img in images]

    ]}
])
eyeline_gemini_output=gemini_eyeline.content

def encode_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def process_with_llama(image_paths, gemini_outputs):
    print("Processing with Llama model...")
    try:
        client = OpenAI(
            base_url="https://router.huggingface.co/v1",
            api_key=os.getenv("HF_TOKEN"),
        )

        # Prepare base64 images
        image_contents = []
        for i, path in enumerate(image_paths[:3], 1):
            base64_image = encode_image_to_base64(path)
            view_type = "45-degree view" if i == 1 else "profile view" if i == 2 else "frontal view"
            image_contents.extend([
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                },
                {
                    "type": "text",
                    "text": f"Image {i}: {view_type}"
                }
            ])

        analysis_prompt = f"""
        Based on the Gemini analysis:

        JAWLINE: {gemini_outputs['jawline']}
        SMILE: {gemini_outputs['smile']}
        SKIN: {gemini_outputs['skin']}
        CHEEKBONES: {gemini_outputs['cheekbone']}
        EYELINE: {gemini_outputs['eyeline']}

        Analyze each feature compared to professional model standards and provide a rating out of 10. 
        Return the response in this exact JSON format:

        {{
            "jawline": {{
                "rating": <number>,
                "description": "<detailed explanation>"
            }},
            "smile": {{
                "rating": <number>,
                "description": "<detailed explanation>"
            }},
            "skin": {{
                "rating": <number>,
                "description": "<detailed explanation>"
            }},
            "cheekbones": {{
                "rating": <number>,
                "description": "<detailed explanation>"
            }},
            "eyeline": {{
                "rating": <number>,
                "description": "<detailed explanation>"
            }}
        }}

        Be brutally honest in your ratings and descriptions. Only return the JSON, no other text.
        """

        # Add the prompt to image contents
        image_contents.append({
            "type": "text",
            "text": analysis_prompt
        })

        print("Generating response...")
        completion = client.chat.completions.create(
            model="meta-llama/Llama-4-Scout-17B-16E-Instruct:groq",
            messages=[{
                "role": "user",
                "content": image_contents
            }]
        )

        return completion.choices[0].message.content

    except Exception as e:
        print(f"Error processing with Llama: {e}")
        raise

if __name__ == "__main__":
    try:
        # Collect Gemini outputs
        gemini_outputs = {
            'jawline': jawline_gemini_output,
            'smile': smile_gemini_output,
            'skin': skin_gemini_output,
            'cheekbone': cheekbone_gemini_output,
            'eyeline': eyeline_gemini_output
        }

        # Get image paths
        image_paths = get_only_recent_images(FACIAL_IMAGES_PATH)
        if len(image_paths) < 3:
            raise ValueError(f"Found only {len(image_paths)} images. Need 3 for assessment.")

        # Process with Llama
        llama_output = process_with_llama(image_paths, gemini_outputs)
        print("\nLlama Model Output:")
        print(llama_output)

    except Exception as e:
        print(f"Failed to process with Llama: {e}")
        sys.exit(1)