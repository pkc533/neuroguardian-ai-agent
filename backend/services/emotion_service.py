import random

def detect_emotional_state(text):

    if not text:
        return "neutral"

    text = text.lower()

    stress_words = [
        "stressed",
        "anxious",
        "worried",
        "overwhelmed",
        "nervous",
        "panic"
    ]

    sadness_words = [
        "sad",
        "lonely",
        "depressed",
        "hopeless",
        "tired of life",
        "empty"
    ]

    confusion_words = [
        "confused",
        "lost",
        "where am i",
        "what should i do",
        "i don't understand"
    ]

    fear_words = [
        "scared",
        "afraid",
        "something is wrong",
        "help me",
        "i feel unsafe"
    ]

    # Stress detection
    for word in stress_words:
        if word in text:
            return "stress"

    # Sadness / depression detection
    for word in sadness_words:
        if word in text:
            return "sadness"

    # Confusion detection
    for word in confusion_words:
        if word in text:
            return "confusion"

    # Fear detection
    for word in fear_words:
        if word in text:
            return "fear"

    return "neutral"