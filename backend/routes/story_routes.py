from fastapi import APIRouter
from pydantic import BaseModel
import vertexai
from vertexai.generative_models import GenerativeModel

router = APIRouter()

# Ensure Vertex AI initialized


model = GenerativeModel("gemini-2.5-flash")


class StoryRequest(BaseModel):
    theme: str = "calm"


@router.post("/story")
async def generate_story(req: StoryRequest = StoryRequest()):

    prompt = f"""
You are NeuroGuardian, a calm and supportive AI companion.

Tell a short comforting story for an elderly person.

Theme: {req.theme}

The story should be:
- calming
- simple
- 3 to 5 sentences
- easy to understand
"""

    try:

        response = model.generate_content(prompt)

        return {
            "story": response.text
        }

    except Exception as e:

        return {
            "error": str(e)
        }