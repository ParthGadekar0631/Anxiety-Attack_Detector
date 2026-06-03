def summarize_time_series(readings: list[dict]) -> dict:
    if not readings:
        return {"trend": "insufficient-data", "points": 0}
    heart_rates = [float(item.get("heart_rate", 0)) for item in readings if item.get("heart_rate")]
    if len(heart_rates) < 2:
        return {"trend": "insufficient-data", "points": len(heart_rates)}
    trend = "rising" if heart_rates[-1] > heart_rates[0] else "stable-or-falling"
    return {"trend": trend, "points": len(heart_rates), "first": heart_rates[0], "last": heart_rates[-1]}
