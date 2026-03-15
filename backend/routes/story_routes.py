from fastapi import APIRouter
from pydantic import BaseModel
from vertexai.generative_models import GenerativeModel

router = APIRouter()

model = GenerativeModel("gemini-2.5-flash")

class StoryRequest(BaseModel):
    theme: str = "calm"

@router.post("/story")
async def generate_story(req: StoryRequest = StoryRequest()):

    prompt = f"""
You are NeuroGuardian.

Tell a short calming story for an elderly person.

Theme: {req.theme}

The story should be comforting and easy to understand.
"""

    response = model.generate_content(prompt)

    return {
        "story": response.text
    }