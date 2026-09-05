from enum import Enum
from typing import Any
from pydantic import BaseModel, Field
from .intent import FinancialBounds, InvariantPredicate, MerchantPolicy, IntentToken
from .payload import CheckoutPayload


class DecisionVerdict(str, Enum):
    ALLOW = "ALLOW"
    HOLD = "HOLD"
    BLOCK = "BLOCK"


class VerificationResult(BaseModel):
    decision: DecisionVerdict = Field(..., description="Final arbitration decision")
    latency_breakdown_ms: dict[str, float] = Field(
        ...,
        description="Execution time breakdown per subsystem in milliseconds"
    )
    total_latency_ms: float = Field(..., description="End-to-end evaluation latency in milliseconds")
    fidelity_score: float = Field(..., ge=0.0, le=1.0, description="Semantic similarity score (0.0 - 1.0)")
    injection_risk_score: float = Field(..., ge=0.0, le=1.0, description="Detected injection risk probability (0.0 - 1.0)")
    symbolic_violations: list[str] = Field(
        default_factory=list,
        description="Formal violations identified by Z3 SMT solver"
    )
    merkle_leaf_hash: str = Field(..., description="SHA-256 hash of the appended audit leaf")
    merkle_root_hash: str = Field(..., description="Updated SHA-256 root hash of RFC 6962 tree")
    audit_index: int = Field(..., description="Position index of the transaction in the Merkle log")
    razorpay_order_id: str | None = Field(None, description="Dispatched Razorpay payment rail order reference if ALLOW")
    status_reasons: list[str] = Field(default_factory=list, description="Explanatory human-readable reasons for verdict")


class VerifyRequest(BaseModel):
    intent_token: str = Field(..., description="Signed Ed25519 JWT IntentToken")
    payload: CheckoutPayload = Field(..., description="Agent checkout payload to verify")


class TokenizeRequest(BaseModel):
    sub: str = Field("user_fintech_master", description="Subject / User ID")
    semantic_goal: str = Field(..., description="Human intent description in natural language")
    hard_max_paise: int = Field(..., ge=1, description="Hard ceiling budget in Paise")
    currency: str = Field("INR", description="Currency ISO")
    max_items: int = Field(1, ge=1, description="Max allowed items")
    predicates: list[InvariantPredicate] = Field(default_factory=list, description="Deterministic SMT invariants")
    whitelist_merchant_ids: list[str] = Field(default_factory=list, description="Whitelisted merchant IDs")
    validity_minutes: int = Field(60, ge=1, description="Token validity window in minutes")


class TokenizeResponse(BaseModel):
    token: str = Field(..., description="Signed Ed25519 JWT IntentToken")
    claims: IntentToken = Field(..., description="Parsed claims payload")
    public_key_hex: str = Field(..., description="Ed25519 public key in hex encoding")


class AuditProofStep(BaseModel):
    sibling_hash: str
    direction: str  # "left" or "right"


class AuditRecord(BaseModel):
    index: int
    leaf_hash: str
    order_id: str
    jti: str
    decision: DecisionVerdict
    fidelity_score: float
    timestamp: int


class AuditProofResponse(BaseModel):
    order_id: str
    index: int
    tree_size: int
    leaf_hash: str
    root_hash: str
    audit_path: list[AuditProofStep]
    is_valid: bool
    record: AuditRecord
    rfc_6962_certificate: dict[str, Any]
