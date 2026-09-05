from fastapi import APIRouter
from .verify import router as verify_router
from .intent import router as intent_router
from .audit import router as audit_router

api_v1_router = APIRouter()
api_v1_router.include_router(verify_router, prefix="", tags=["Verification"])
api_v1_router.include_router(intent_router, prefix="/intent", tags=["Intent Tokenization"])
api_v1_router.include_router(audit_router, prefix="/audit", tags=["Cryptographic Audit"])
