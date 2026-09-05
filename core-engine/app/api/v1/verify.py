import time
from fastapi import APIRouter, HTTPException, status
from app.schemas.decision import VerifyRequest, VerificationResult, DecisionVerdict
from app.services.crypto import get_crypto_service
from app.services.smt_solver import get_smt_service
from app.services.neural_drift import get_neural_service
from app.services.arbiter import get_arbiter
from app.services.merkle import get_merkle_service
from app.services.razorpay_rail import get_razorpay_service

router = APIRouter()


@router.post(
    "/verify",
    response_model=VerificationResult,
    status_code=status.HTTP_200_OK,
    summary="Inline Zero-Trust Verification Path (< 45ms P99)"
)
async def verify_transaction(req: VerifyRequest) -> VerificationResult:
    """
    Sub-45ms fast path:
    1. Asymmetric Ed25519 Token signature & expiration verification
    2. Deterministic Z3 SMT Formal Invariant Verification
    3. Quantized ONNX Neural Semantic Drift & DOM Injection Scan
    4. Arbitration Matrix Decision
    5. Dispatches to Razorpay if ALLOW
    6. Appends audit record to RFC 6962 Merkle Tree
    """
    t_start = time.perf_counter()
    latency_breakdown: dict[str, float] = {}

    crypto_svc = get_crypto_service()
    smt_svc = get_smt_service()
    neural_svc = get_neural_service()
    arbiter_svc = get_arbiter()
    merkle_svc = get_merkle_service()
    razorpay_svc = get_razorpay_service()

    # Step 1: Cryptographic verification of IntentToken
    t0 = time.perf_counter()
    is_valid_token, claims, token_err = crypto_svc.verify_token(req.intent_token)
    t1 = time.perf_counter()
    latency_breakdown["crypto_ms"] = round((t1 - t0) * 1000, 3)

    if not is_valid_token or claims is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"IntentToken cryptographic verification failed: {token_err}"
        )

    # Step 2: SMT Invariant Verification (Z3)
    t0 = time.perf_counter()
    smt_satisfied, symbolic_violations, smt_time_ms = smt_svc.verify_invariants(
        token=claims,
        payload=req.payload
    )
    t1 = time.perf_counter()
    latency_breakdown["smt_ms"] = round((t1 - t0) * 1000, 3)

    # Step 3: Neural Semantic Drift & DOM Prompt Injection Scanning
    t0 = time.perf_counter()
    # Summarize line items into text for semantic comparison
    items_summary = " ; ".join([
        f"{item.title} (qty: {item.quantity}, price: ₹{item.unit_price_paise/100:.2f})"
        for item in req.payload.line_items
    ])
    fidelity_score, injection_risk, injection_reasons, neural_time_ms = neural_svc.evaluate(
        semantic_goal=claims.semantic_goal,
        items_summary=items_summary,
        dom_context=req.payload.dom_context
    )
    t1 = time.perf_counter()
    latency_breakdown["neural_ms"] = round((t1 - t0) * 1000, 3)

    # Step 4: Decision Arbitration
    t0 = time.perf_counter()
    verdict, reasons = arbiter_svc.arbitrate(
        symbolic_violations=symbolic_violations,
        fidelity_score=fidelity_score,
        injection_risk=injection_risk,
        injection_reasons=injection_reasons
    )
    t1 = time.perf_counter()
    latency_breakdown["arbiter_ms"] = round((t1 - t0) * 1000, 3)

    # Step 5: Payment Rail Dispatch (if ALLOW)
    razorpay_order_id = None
    if verdict == DecisionVerdict.ALLOW:
        t0 = time.perf_counter()
        rzp_res = await razorpay_svc.create_authorized_order(
            jti=claims.jti,
            order_id=req.payload.order_id,
            amount_paise=req.payload.amount_paise,
            currency=claims.financial_bounds.currency,
            notes={"merchant_id": req.payload.merchant_id}
        )
        razorpay_order_id = rzp_res.get("id")
        t1 = time.perf_counter()
        latency_breakdown["payment_rail_ms"] = round((t1 - t0) * 1000, 3)

    # Step 6: RFC 6962 Merkle Tree Audit Append
    t0 = time.perf_counter()
    audit_index, leaf_hash, root_hash = merkle_svc.append_leaf(
        order_id=req.payload.order_id,
        jti=claims.jti,
        decision=verdict,
        fidelity_score=fidelity_score,
        timestamp=req.payload.timestamp
    )
    t1 = time.perf_counter()
    latency_breakdown["merkle_ms"] = round((t1 - t0) * 1000, 3)

    t_end = time.perf_counter()
    total_latency_ms = round((t_end - t_start) * 1000, 3)

    return VerificationResult(
        decision=verdict,
        latency_breakdown_ms=latency_breakdown,
        total_latency_ms=total_latency_ms,
        fidelity_score=fidelity_score,
        injection_risk_score=injection_risk,
        symbolic_violations=symbolic_violations,
        merkle_leaf_hash=leaf_hash,
        merkle_root_hash=root_hash,
        audit_index=audit_index,
        razorpay_order_id=razorpay_order_id,
        status_reasons=reasons
    )
