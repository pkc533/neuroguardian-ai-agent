import base64
from google.cloud import vision

client = vision.ImageAnnotatorClient()

def detect_face_emotion(base64_image):

    image_bytes = base64.b64decode(base64_image.split(",")[1])

    image = vision.Image(content=image_bytes)

    response = client.face_detection(image=image)

    faces = response.face_annotations

    if not faces:
        return {"emotion": "unknown"}

    face = faces[0]

    return {
        "joy": face.joy_likelihood.name,
        "sorrow": face.sorrow_likelihood.name,
        "anger": face.anger_likelihood.name,
        "surprise": face.surprise_likelihood.name
    }