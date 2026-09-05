import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.api.v1 import api_v1_router
from app.services.crypto import get_crypto_service
from app.services.neural_drift import get_neural_service
from app.services.smt_solver import get_smt_service
from app.services.merkle import get_merkle_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup pre-warming to guarantee sub-45ms P99 from first request.
    """
    settings = get_settings()
    # Initialize crypto keypair
    crypto_svc = get_crypto_service()
    
    # Pre-warm local ONNX model
    neural_svc = get_neural_service()
    neural_svc.warmup()
    
    # Pre-warm Z3 SMT solver
    smt_svc = get_smt_service()
    
    # Merkle tree singleton check
    merkle_svc = get_merkle_service()

    yield
    # Shutdown logic (if any)


settings = get_settings()

app = FastAPI(
    title="Razorpay IntentHQ Core Engine",
    description="Production-grade Zero-Trust Intent-to-Transaction Control Plane",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """High-resolution latency timing middleware with Server-Timing support."""
    start_time = time.perf_counter()
    response: Response = await call_next(request)
    process_time_ms = (time.perf_counter() - start_time) * 1000
    response.headers["X-Response-Time-Ms"] = f"{process_time_ms:.3f}"
    response.headers["Server-Timing"] = f"total;dur={process_time_ms:.2f}"
    return response


# Include API v1 routes
app.include_router(api_v1_router, prefix="/v1")


@app.get("/healthz", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "intenthq-core",
        "sla_target_ms": settings.MAX_VERIFY_LATENCY_MS,
        "mode": "zero_trust_inline"
    }


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "Razorpay IntentHQ",
        "version": "1.0.0",
        "documentation": "/docs",
        "health": "/healthz"
    }
