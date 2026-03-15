from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import time

from backend.services.gemini_live_service import analyze_multimodal
from backend.services.emotion_service import detect_emotional_state
from backend.services.persona_service import calming_response
from backend.services import memory_agent

router = APIRouter()

LAST_VISION_ANALYSIS = 0
VISION_WINDOW_SECONDS = 10


def safe_response(data):
    """Always return JSON with CORS header"""
    return JSONResponse(
        content=data,
        headers={"Access-Control-Allow-Origin": "*"}
    )


def normalize_result(result):
    """Ensure Gemini response is always valid JSON"""

    if result is None:
        return {
            "analysis": "No AI response available.",
            "actions": {"action": "observe", "target": "environment"},
            "response": None
        }

    if not isinstance(result, dict):
        return {
            "analysis": str(result),
            "actions": {"action": "observe", "target": "environment"},
            "response": None
        }

    result.setdefault("analysis", "Environment observed.")
    result.setdefault("actions", {"action": "observe", "target": "environment"})
    result.setdefault("response", None)

    return result


@router.post("/chat")
async def chat(request: Request):

    global LAST_VISION_ANALYSIS

    try:
        body = await request.json()
    except Exception as e:

        print("JSON parse error:", str(e))

        return safe_response({
            "analysis": "Invalid request format.",
            "actions": {"action": "observe", "target": "environment"},
            "response": None
        })

    print("\n===== REQUEST =====")
    print(body)
    print("===================\n")

    prompt = body.get("prompt")
    frames = body.get("frames")

    # --------------------------------------------------
    # VISION ANALYSIS
    # --------------------------------------------------

    if frames and isinstance(frames, list):

        now = time.time()

        if now - LAST_VISION_ANALYSIS < VISION_WINDOW_SECONDS:

            return safe_response({
                "analysis": "Observation window active",
                "actions": {"action": "observe", "target": "environment"},
                "response": None
            })

        LAST_VISION_ANALYSIS = now

        frame = frames[0]

        vision_prompt = """
You are NeuroGuardian, an AI assistant supporting elderly users.

Analyze the image and determine:

• confusion
• searching behaviour
• emotional distress
• visible objects (glasses, keys, phone, medication)

Return JSON with:

analysis
situation
object
location
actions
response
"""

        try:

            raw_result = analyze_multimodal(vision_prompt, frame)

            print("Gemini result:", raw_result)

            result = normalize_result(raw_result)

        except Exception as e:

            print("Vision analysis error:", str(e))

            return safe_response({
                "analysis": "Vision analysis failed.",
                "actions": {"action": "observe", "target": "environment"},
                "response": None
            })

        # --------------------------------------------------
        # SAFE MEMORY STORAGE
        # --------------------------------------------------

        obj = result.get("object")
        location = result.get("location")

        if obj and location:

            print("Saving memory:", obj, location)

            if hasattr(memory_agent, "store_object_location"):
                memory_agent.store_object_location(obj, location)
            else:
                print("store_object_location not available")

        return safe_response(result)

    # --------------------------------------------------
    # VOICE ANALYSIS
    # --------------------------------------------------

    if prompt:

        lower_prompt = prompt.lower()

        for obj in ["keys", "glasses", "phone", "medication"]:

            if obj in lower_prompt and any(
                w in lower_prompt for w in ["where", "find", "lost", "looking"]
            ):

                location = None

                if hasattr(memory_agent, "get_object_location"):
                    location = memory_agent.get_object_location(obj)

                if location:

                    return safe_response({
                        "analysis": f"User searching for {obj}.",
                        "actions": {
                            "action": "assist_search",
                            "target": obj
                        },
                        "response": f"Your {obj} were last seen near the {location}."
                    })

        emotion = detect_emotional_state(prompt)

        if emotion in ["stress", "sadness"]:

            calming_text = calming_response(prompt)

            return safe_response({
                "analysis": "User appears stressed or overwhelmed.",
                "actions": {
                    "action": "calm",
                    "target": "emotional support"
                },
                "response": calming_text
            })

        voice_prompt = f"""
User said: "{prompt}"

Return JSON with analysis, actions and response.
"""

        try:

            raw_result = analyze_multimodal(voice_prompt, None)

            result = normalize_result(raw_result)

        except Exception as e:

            print("Voice analysis error:", str(e))

            return safe_response({
                "analysis": "Voice analysis failed.",
                "actions": {"action": "observe", "target": "conversation"},
                "response": None
            })

        return safe_response(result)

    return safe_response({
        "analysis": "No input received.",
        "actions": {"action": "observe", "target": "environment"},
        "response": None
    })