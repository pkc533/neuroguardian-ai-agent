from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.family_voice_service import generate_family_message

router = APIRouter()


class FamilyVoiceRequest(BaseModel):
    user: str = "mary"
    situation: str


@router.post("/family-voice")
async def family_voice(req: FamilyVoiceRequest):

    message = generate_family_message(
        req.user,
        req.situation
    )

    return {"message": message}