from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.gemini_live_service import analyze_multimodal
from backend.services.emotion_service import detect_emotional_state
from backend.services.persona_service import calming_response

router = APIRouter()


class AgentRequest(BaseModel):
    prompt: str | None = None
    image: str | None = None


@router.post("/chat")
async def chat(req: AgentRequest):

    prompt = req.prompt or ""

    # Base NeuroGuardian instruction
    system_prompt = """
You are NeuroGuardian, an AI companion assisting people with
Alzheimer's, dementia, Parkinson's disease and emotional stress.

You help with:
- medication reminders
- environment awareness
- detecting unusual movement (tremor)
- guiding the user with simple instructions
- calming users experiencing stress or anxiety
- suggesting contacting caregivers if needed

Always respond clearly, simply and supportively.
"""

    # ------------------------------------------------
    # IMAGE INPUT → ENVIRONMENT ANALYSIS
    # ------------------------------------------------

    if req.image:

        vision_prompt = system_prompt + """
Analyze the user's environment from the camera image.

Look for:
- medication
- hazards
- signs of distress
- unusual activity

Return ONLY valid JSON:

{
 "analysis": "short explanation of what you observe",
 "actions": {
   "action": "remind | notify | guide | calm",
   "target": "recommended assistance"
 }
}

Do not include markdown formatting.
"""

        result = analyze_multimodal(vision_prompt, req.image)

        return result

    # ------------------------------------------------
    # VOICE INPUT → EMOTION ANALYSIS
    # ------------------------------------------------

    if prompt:

        emotion = detect_emotional_state(prompt)

        # Stress or sadness detected → calming persona
        if emotion in ["stress", "sadness"]:

            calming_text = calming_response(prompt)

            return {
                "analysis": "User appears stressed or emotionally overwhelmed.",
                "actions": {
                    "action": "calm",
                    "target": "emotional support"
                },
                "response": calming_text
            }

        # Fear detected → caregiver escalation
        if emotion == "fear":

            return {
                "analysis": "User appears frightened or unsafe.",
                "actions": {
                    "action": "notify",
                    "target": "caregiver"
                }
            }

        # Normal conversation → Gemini reasoning
        voice_prompt = system_prompt + f"""

User said: "{prompt}"

Return JSON:

{
 "analysis": "short helpful response",
 "actions": {
   "action": "guide | calm | remind",
   "target": "recommended assistance"
 }
}

Do not include markdown formatting.
"""

        result = analyze_multimodal(voice_prompt, None)

        return result

    # ------------------------------------------------
    # FALLBACK
    # ------------------------------------------------

    return {
        "analysis": "No input received.",
        "actions": None
    }