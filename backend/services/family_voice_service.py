import json
import os
from vertexai.generative_models import GenerativeModel

MODEL = GenerativeModel("gemini-2.5-flash")

PROFILE_PATH = "backend/memory/family_profiles.json"


def load_profiles():
    with open(PROFILE_PATH) as f:
        return json.load(f)


def generate_family_message(user, situation):

    profiles = load_profiles()

    profile = profiles.get(user, list(profiles.values())[0])

    prompt = f"""
You are speaking as {profile['name']}, the {profile['relationship']}.

Tone:
{profile['voice_style']}

Start with greeting:
"{profile['greeting']}"

Situation:
{situation}

Give reassurance and guidance in a loving tone.
"""

    response = MODEL.generate_content(prompt)

    return response.text