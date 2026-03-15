from google.adk.tools import FunctionTool
from backend.services.firestore_service import save_memory


# --------------------------------------------------
# EXISTING LONG-TERM MEMORY STORAGE (Firestore)
# --------------------------------------------------

def store_memory(user_id: str, note: str):
    """Store user memory context"""
    save_memory(user_id, {"note": note})
    return "Memory stored."


memory_tool = FunctionTool(store_memory)


# --------------------------------------------------
# NEW OBJECT LOCATION MEMORY (Prototype RAM Storage)
# --------------------------------------------------

# Stores objects seen by AI Vision
# Example:
# {
#   "keys": "kitchen table",
#   "glasses": "bedside table"
# }

object_memory = {}


def store_object_location(object_name: str, location: str):
    """
    Store the last known location of an object detected by AI Vision
    """

    if not object_name or not location:
        return

    object_name = object_name.lower().strip()
    location = location.lower().strip()

    object_memory[object_name] = location


def get_object_location(object_name: str):
    """
    Retrieve last known location of an object
    """

    if not object_name:
        return None

    object_name = object_name.lower().strip()

    return object_memory.get(object_name)


def list_known_objects():
    """
    Return all stored objects (useful for debugging or dashboard display)
    """

    return object_memory