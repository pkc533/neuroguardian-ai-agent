from google.adk.tools import FunctionTool

reminders = []


def add_reminder(task: str):
    """Add reminder for the user"""
    reminders.append(task)
    return f"Reminder added: {task}"


reminder_tool = FunctionTool(add_reminder)