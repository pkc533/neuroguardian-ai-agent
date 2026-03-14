from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.gemini_live_service import analyze_multimodal

router = APIRouter()

class AgentRequest(BaseModel):
    prompt: str | None = None
    image: str | None = None


@router.post("/chat")
async def chat(req: AgentRequest):

    prompt = req.prompt or ""

    # Base NeuroGuardian system instruction
    system_prompt = """
You are NeuroGuardian, an AI companion assisting people with
Alzheimer's, dementia, and Parkinson's disease.

You help with:
- medication reminders
- environment awareness
- detecting unusual movement (tremor)
- guiding the user with simple instructions
- suggesting contacting caregivers if needed

Always respond clearly and supportively.
"""

    # If image exists → environment analysis
    if req.image:

        prompt = system_prompt + """

Analyze the image from the user's environment.

Return JSON:

{
 "analysis": "what you observe",
 "actions": {
   "action": "remind | notify | guide",
   "target": "user action"
 }
}
"""

    # Voice-only interaction
    else:

        prompt = system_prompt + f"""

User said: "{req.prompt}"

Provide helpful guidance.
"""

    result = analyze_multimodal(prompt, req.image)

    return result