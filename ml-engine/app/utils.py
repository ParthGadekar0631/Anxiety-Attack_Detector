def risk_category(score: float) -> str:
    if score <= 30:
        return "Low"
    if score <= 60:
        return "Moderate"
    if score <= 80:
        return "Elevated"
    return "High"


def recommended_intervention(category: str) -> str:
    if category == "High":
        return "Start guided breathing and notify an emergency contact if symptoms continue."
    if category == "Elevated":
        return "Start guided breathing and complete a grounding exercise."
    if category == "Moderate":
        return "Use a short grounding exercise and reassess your stress level."
    return "Continue monitoring and use preventive calming steps if symptoms increase."
