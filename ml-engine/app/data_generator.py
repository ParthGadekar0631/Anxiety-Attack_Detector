from pathlib import Path
import csv


def generate_synthetic_datasets(base_dir: str = "dataset") -> list[str]:
    output = Path(base_dir)
    output.mkdir(parents=True, exist_ok=True)
    anxiety_path = output / "synthetic_anxiety_data.csv"
    wearable_path = output / "synthetic_wearable_data.csv"
    voice_path = output / "synthetic_voice_features.csv"

    with anxiety_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["stress_level", "heart_rate", "sleep_quality", "risk_label"])
        for stress in range(1, 11):
            writer.writerow([stress, 70 + stress * 6, max(1, 11 - stress), int(stress >= 7)])

    with wearable_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["source", "heart_rate", "oxygen_level", "hrv", "sleep_hours", "anomaly"])
        writer.writerows([
            ["apple", 112, 97, 32, 5.2, 1],
            ["fitbit", 92, 98, 48, 7.1, 0],
            ["samsung", 118, 95, 29, 4.7, 1],
        ])

    with voice_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["speech_rate", "pitch_variance", "pause_count", "volume_variance", "stress_score"])
        writer.writerows([[180, 0.8, 8, 0.75, 85], [140, 0.35, 3, 0.25, 34]])

    return [str(anxiety_path), str(wearable_path), str(voice_path)]
