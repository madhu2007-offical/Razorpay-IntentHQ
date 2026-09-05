import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Razorpay IntentHQ Core Engine"
    ENV: str = "development"
    DEBUG: bool = False
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # Strict SLA invariants
    MAX_VERIFY_LATENCY_MS: float = 45.0

    # Cryptography
    ED25519_PRIVATE_KEY_HEX: str = ""
    ED25519_PUBLIC_KEY_HEX: str = ""

    # Razorpay Sandbox Rail
    RAZORPAY_KEY_ID: str = "rzp_test_intenthq_mock_key"
    RAZORPAY_KEY_SECRET: str = "rzp_test_intenthq_mock_secret"
    RAZORPAY_MOCK_MODE: bool = True

    # Embeddings / Neural Model
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # Arbitration thresholds
    SIMILARITY_ALLOW_THRESHOLD: float = 0.85
    SIMILARITY_HOLD_THRESHOLD: float = 0.60
    INJECTION_RISK_BLOCK_THRESHOLD: float = 0.65
    INJECTION_RISK_ALLOW_THRESHOLD: float = 0.15

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
