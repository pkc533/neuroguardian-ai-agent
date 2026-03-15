def decide_action(analysis):

    situation = analysis.get("situation")

    if situation == "searching_for_object":
        return "assist_search"

    if situation == "confused_or_disoriented":
        return "calm_and_orient"

    if situation == "medication_needed":
        return "remind_medication"

    if situation == "emotional_distress":
        return "comfort_user"

    if situation == "fall_risk":
        return "alert_caregiver"

    return "observe"