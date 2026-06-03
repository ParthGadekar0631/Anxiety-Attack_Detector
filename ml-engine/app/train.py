from app.data_generator import generate_synthetic_datasets


def train_models() -> dict:
    datasets = generate_synthetic_datasets()
    return {
        "status": "trained",
        "model_version": "deterministic-rf-style-v1",
        "datasets": datasets,
        "note": "Synthetic datasets generated; deterministic scoring model is active for local development.",
    }
