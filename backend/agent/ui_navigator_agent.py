from google.adk.tools import FunctionTool
from backend.services.gemini_live_service import analyze_multimodal

def navigate_ui(screen):

    prompt = """
Analyze the UI screenshot and return an action.

Return JSON:

{
  "action": "click | scroll | type",
  "target": "element description"
}
"""

    return analyze_multimodal(prompt, screen)

navigator_tool = FunctionTool(navigate_ui)