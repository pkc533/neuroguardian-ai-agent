import json
from vertexai.generative_models import GenerativeModel, Part
import base64

model = GenerativeModel("gemini-1.5-flash")

VISION_PROMPT = """
You are NeuroGuardian, an AI caregiver assistant for elderly people.

Analyze the image and determine if the person might need help.

Possible situations:
- searching_for_object (keys, glasses, phone)
- confused_or_disoriented
- medication_needed
- emotional_distress
- fall_risk
- normal

Return ONLY JSON:

{
"situation": "",
"confidence": "",
"emotion": "",
"object": "",
"recommended_action": "",
"response": ""
}

Response must be calm and reassuring.
"""

def analyze_environment(base64_image):

    image_bytes = base64.b64decode(base64_image.split(",")[1])

    response = model.generate_content(
        [
            VISION_PROMPT,
            Part.from_data(image_bytes, mime_type="image/jpeg")
        ]
    )

    text = response.text.strip()

    try:
        return json.loads(text)
    except:
        return {
            "situation": "unknown",
            "confidence": 0,
            "emotion": "unknown",
            "recommended_action": "observe",
            "response": text
        }