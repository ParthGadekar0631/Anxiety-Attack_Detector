from fastapi import FastAPI

from app.model_registry import ACTIVE_MODELS
from app.predict import predict
from app.relapse_model import predict_relapse
from app.risk_model import wearable_risk
from app.schemas import PredictionInput, RelapseInput, VoiceStressInput, WearableRiskInput
from app.train import train_models
from app.voice_feature_model import score_voice_stress

app = FastAPI(title="Anxiety Attack Detector ML Engine", version="1.0.0")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ml-engine", "models": ACTIVE_MODELS}


@app.post("/predict")
def predict_endpoint(payload: PredictionInput):
    return predict(payload)


@app.post("/train")
def train_endpoint() -> dict:
    return train_models()


@app.post("/predict-relapse")
def predict_relapse_endpoint(payload: RelapseInput) -> dict:
    return predict_relapse(payload)


@app.post("/voice-stress")
def voice_stress_endpoint(payload: VoiceStressInput) -> dict:
    return score_voice_stress(payload)


@app.post("/wearable-risk")
def wearable_risk_endpoint(payload: WearableRiskInput) -> dict:
    return wearable_risk(payload)
