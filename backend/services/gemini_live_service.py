import base64
import json
import re
import os
import vertexai

from vertexai.generative_models import GenerativeModel, Part

PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "armour-assistant")
REGION = "us-central1"

vertexai.init(
    project=PROJECT_ID,
    location=REGION
)

model = GenerativeModel("gemini-2.5-flash")


# --------------------------------------------------
# Safe JSON Cleaner
# --------------------------------------------------

def clean_json_response(text):

    if not text:
        return {
            "analysis": "No response from AI.",
            "actions": {"action": "observe", "target": "environment"},
            "response": None
        }

    # remove markdown
    text = re.sub(r"```json", "", text)
    text = re.sub(r"```", "", text)

    text = text.strip()

    try:
        parsed = json.loads(text)
        return parsed

    except Exception:

        return {
            "analysis": text,
            "actions": {"action": "observe", "target": "environment"},
            "response": None
        }


# --------------------------------------------------
# Emotion Analysis
# --------------------------------------------------

def analyze_emotion_with_gemini(emotion_data):

    prompt = f"""
You are NeuroGuardian emotional assistant.

Detected facial emotion signals:

{emotion_data}

Determine emotional state:
- stress
- sadness
- depression
- calm

If stress or sadness is detected, generate a calming message.

Return JSON:
{{
 "analysis": "",
 "actions": {{
   "action": "calm",
   "target": "emotional support"
 }},
 "response": ""
}}
"""

    try:

        response = model.generate_content(prompt)

        return clean_json_response(response.text)

    except Exception as e:

        print("Gemini emotion error:", str(e))

        return {
            "analysis": "Emotion analysis unavailable.",
            "actions": {"action": "observe", "target": "emotion"},
            "response": None
        }


# --------------------------------------------------
# Multimodal Analysis
# --------------------------------------------------

def analyze_multimodal(prompt, image=None):

    try:

        if image:

            image_bytes = base64.b64decode(image.split(",")[1])

            image_part = Part.from_data(
                image_bytes,
                mime_type="image/jpeg"
            )

            response = model.generate_content(
                [prompt, image_part]
            )

        else:

            response = model.generate_content(prompt)

        return clean_json_response(response.text)

    except Exception as e:

        print("Gemini multimodal error:", str(e))

        return {
            "analysis": "AI analysis temporarily unavailable.",
            "actions": {"action": "observe", "target": "environment"},
            "response": None
        }