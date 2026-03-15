from vertexai.generative_models import GenerativeModel

model = GenerativeModel("gemini-1.5-flash")

PERSONA = {
"name": "Priya",
"relationship": "daughter"
}

def generate_persona_response(context):

    prompt = f"""
Respond as {PERSONA['name']}, the user's {PERSONA['relationship']}.

Speak gently and reassuringly.

Situation:
{context}
"""

    response = model.generate_content(prompt)

    return response.text