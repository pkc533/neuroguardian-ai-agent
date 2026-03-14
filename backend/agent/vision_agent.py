from google.adk.tools import FunctionTool
from backend.services.gemini_live_service import analyze_multimodal

def analyze_scene(image):

    result = analyze_multimodal(
        "Describe the objects and actions in this scene",
        image
    )

    return result

vision_tool = FunctionTool(analyze_scene)