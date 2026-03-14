from google.adk.agents import Agent
from backend.agent.memory_agent import memory_tool
from backend.agent.reminder_agent import reminder_tool
from backend.agent.vision_agent import vision_tool

agent = Agent(
    name="neuroguardian_live_agent",
    model="gemini-2.5-flash",
    instruction="""
You are NeuroGuardian.

You help users with:
- memory support
- reminders
- understanding their environment
- interacting with device UI

You receive audio, video and screenshots in real time.
Respond with helpful instructions or actions.
""",
    tools=[
        memory_tool,
        reminder_tool,
        vision_tool
    ]
)