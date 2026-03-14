from fastapi import APIRouter

router = APIRouter()

@router.post("/caregiver-alert")
async def caregiver_alert():

    print("⚠ CAREGIVER ALERT TRIGGERED")

    return {
        "status": "alert_sent",
        "message": "Caregiver has been notified"
    }