from google.adk.tools import FunctionTool
from backend.services.firestore_service import save_memory


def store_memory(user_id: str, note: str):
    """Store user memory context"""
    save_memory(user_id, {"note": note})
    return "Memory stored."


memory_tool = FunctionTool(store_memory)