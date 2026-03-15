import base64
import json
import re
import vertexai
from vertexai.generative_models import GenerativeModel, Part

vertexai.init()

model = GenerativeModel("gemini-2.5-flash")


def clean_json_response(text):
    """
    Remove markdown formatting and safely parse JSON.
    """

    # Remove ```json ``` blocks
    text = re.sub(r"```json", "", text)
    text = re.sub(r"```", "", text)

    text = text.strip()

    try:
        parsed = json.loads(text)
        return parsed
    except:
        return {
            "analysis": text,
            "actions": None
        }


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
 "analysis": "emotion explanation",
 "actions": {{
   "action": "calm",
   "target": "emotional support"
 }},
 "response": "calming therapy message"
}}
"""

    response = model.generate_content(prompt)

    return clean_json_response(response.text)


def analyze_multimodal(prompt, image=None):

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