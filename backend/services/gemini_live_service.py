import base64
import json
import vertexai
from vertexai.generative_models import GenerativeModel, Part

vertexai.init()

model = GenerativeModel("gemini-2.5-flash")


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

    text = response.text

    try:
        parsed = json.loads(text)
        return parsed
    except:
        return {
            "analysis": text,
            "actions": None
        }