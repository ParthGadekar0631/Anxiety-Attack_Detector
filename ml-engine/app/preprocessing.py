from app.schemas import PredictionInput


def rule_score(payload: PredictionInput) -> tuple[int, list[str]]:
    score = 0
    reasons: list[str] = []

    def add(condition: bool, points: int, reason: str) -> None:
        nonlocal score
        if condition:
            score += points
            reasons.append(reason)

    add(payload.stress_level >= 8, 20, "High stress level")
    add(payload.heart_rate >= 110, 20, "Elevated heart rate")
    add(payload.sleep_quality <= 4, 15, "Poor sleep quality")
    add(payload.breathing_irregularity, 20, "Breathing irregularity detected")
    add(payload.trigger_event, 10, "Trigger event reported")
    add(payload.chest_tightness >= 7, 15, "Chest tightness is elevated")
    add(payload.dizziness >= 7, 10, "Dizziness is elevated")
    add(payload.recent_episode_count >= 3, 10, "Recent episode count is elevated")
    add(payload.wearable_heart_rate is not None and payload.wearable_heart_rate >= 110, 15, "Wearable heart rate anomaly")
    add(payload.voice_stress_score >= 70, 15, "Voice stress score is high")

    if not reasons:
        reasons.append("Inputs do not currently indicate strong escalation signals")
    return min(100, score), reasons


def normalized_ml_probability(payload: PredictionInput) -> float:
    stress = payload.stress_level / 10
    heart_rate = min(1, max(0, (payload.heart_rate - 65) / 70))
    sleep_risk = 1 - payload.sleep_quality / 10
    symptoms = (payload.chest_tightness + payload.dizziness) / 20
    context = payload.caffeine_intake / 12 * 0.08 + payload.recent_episode_count / 10 * 0.12
    binary = (0.18 if payload.breathing_irregularity else 0) + (0.08 if payload.trigger_event else 0)
    voice = payload.voice_stress_score / 100 * 0.12
    wearable = 0
    if payload.wearable_heart_rate and payload.wearable_heart_rate >= 110:
        wearable += 0.1
    if payload.wearable_oxygen_level and payload.wearable_oxygen_level < 94:
        wearable += 0.08
    return min(0.99, max(0.03, stress * 0.28 + heart_rate * 0.2 + sleep_risk * 0.14 + symptoms * 0.16 + context + binary + voice + wearable))
