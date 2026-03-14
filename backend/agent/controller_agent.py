from google.adk.agents import Agent
from backend.agent.memory_agent import memory_tool
from backend.agent.reminder_agent import reminder_tool
from backend.agent.vision_agent import vision_tool

root_agent = Agent(
    name="neuroguardian_agent",
    model="gemini-2.5-flash",
    instruction="""
    You are NeuroGuardian, an assistive AI helping users
    with memory support, reminders, and environmental awareness.
    """,
    tools=[
        memory_tool,
        reminder_tool,
        vision_tool
    ],
)