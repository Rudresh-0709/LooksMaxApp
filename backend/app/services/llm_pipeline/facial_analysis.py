from backend.app.services.llm_pipeline.image_helper import get_recent_images,get_only_recent_images
import os
from backend.app.services.llm_pipeline.prompts import (JAWLINE_PROMPT,SMILE_PROMPT,SKIN_PROMPT,CHEEKBONE_PROMPT,EYELINE_PROMPT)
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from transformers import AutoProcessor, AutoModelForVision2Seq, AutoModelForCausalLM
import torch
from qwen_vl_utils import process_vision_info  # Assuming this file is available
from PIL import Image

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

model_path="lmms-lab/LLaVA-OneVision-1.5"
# processor = AutoProcessor.from_pretrained(model_id)
# model = AutoModelForVision2Seq.from_pretrained(
#     model_id,
#     torch_dtype=torch.float16,
#     device_map="auto"
# )

get_only_recent_images(FACIAL_IMAGES_PATH)
model = AutoModelForCausalLM.from_pretrained(
    model_path, torch_dtype="auto", device_map="auto", trust_remote_code=True
)
processor = AutoProcessor.from_pretrained(model_path, trust_remote_code=True)