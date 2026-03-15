from fastapi import APIRouter
from pydantic import BaseModel

from backend.services.emotion_vision_service import detect_face_emotion
from backend.services.gemini_live_service import analyze_emotion_with_gemini

router = APIRouter()

class EmotionRequest(BaseModel):
    image: str


@router.post("/emotion")
async def detect_emotion(req: EmotionRequest):

    emotion = detect_face_emotion(req.image)

    ai_response = analyze_emotion_with_gemini(emotion)

    return {
        "emotion_data": emotion,
        "response": ai_response
    }