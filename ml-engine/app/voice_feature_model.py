from app.schemas import VoiceStressInput


def score_voice_stress(payload: VoiceStressInput) -> dict:
    score = min(
        100,
        max(
            0,
            (payload.speech_rate - 120) * 0.35
            + payload.pitch_variance * 24
            + payload.pause_count * 4
            + payload.volume_variance * 28,
        ),
    )
    return {
        "voice_stress_score": round(score),
        "analysis_summary": "Simulated acoustic features indicate elevated stress."
        if score >= 70
        else "Simulated acoustic features indicate low-to-moderate stress.",
        "features": payload.model_dump(),
    }
