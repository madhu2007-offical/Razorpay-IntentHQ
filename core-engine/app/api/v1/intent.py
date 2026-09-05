import time
import uuid
from fastapi import APIRouter, status
from app.schemas.intent import IntentToken, FinancialBounds, MerchantPolicy, InvariantPredicate
from app.schemas.decision import TokenizeRequest, TokenizeResponse
from app.services.crypto import get_crypto_service

router = APIRouter()


@router.post(
    "/tokenize",
    response_model=TokenizeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate Cryptographically Signed Ed25519 IntentToken"
)
async def create_intent_token(req: TokenizeRequest) -> TokenizeResponse:
    """
    Transforms human purchase intent and structured bounds into a tamper-proof
    Ed25519 signed JWT with RFC 8037 header.
    """
    crypto_svc = get_crypto_service()
    now = int(time.time())
    exp = now + (req.validity_minutes * 60)
    jti = f"int_{uuid.uuid4().hex}"

    claims = IntentToken(
        sub=req.sub,
        jti=jti,
        iat=now,
        exp=exp,
        semantic_goal=req.semantic_goal,
        financial_bounds=FinancialBounds(
            hard_max_paise=req.hard_max_paise,
            currency=req.currency,
            tax_inclusive=True,
            max_items=req.max_items
        ),
        predicates=req.predicates,
        merchant_policy=MerchantPolicy(
            whitelist_merchant_ids=req.whitelist_merchant_ids
        )
    )

    token = crypto_svc.sign_token(claims)

    return TokenizeResponse(
        token=token,
        claims=claims,
        public_key_hex=crypto_svc.public_key_hex
    )


@router.get(
    "/presets",
    summary="Fetch pre-configured Intent Presets for Demonstration"
)
async def get_intent_presets():
    """
    Returns standard pre-configured intent templates for testing and demonstration.
    """
    return [
        {
            "id": "laptop_purchase",
            "name": "High-Performance Developer Laptop",
            "semantic_goal": "Buy a 16GB RAM laptop under ₹70,000 from Croma or Reliance Digital",
            "hard_max_paise": 7000000,
            "currency": "INR",
            "max_items": 1,
            "whitelist_merchant_ids": ["croma_official", "reliance_digital"],
            "predicates": [
                {"field": "specs.ram_gb", "operator": ">=", "value": 16},
                {"field": "specs.storage_gb", "operator": ">=", "value": 512}
            ]
        },
        {
            "id": "office_monitor",
            "name": "4K Color-Accurate Office Monitor",
            "semantic_goal": "Purchase a 27-inch 4K UHD IPS monitor under ₹35,000",
            "hard_max_paise": 3500000,
            "currency": "INR",
            "max_items": 1,
            "whitelist_merchant_ids": ["croma_official", "amazon_business"],
            "predicates": [
                {"field": "specs.resolution", "operator": "==", "value": "4K"},
                {"field": "specs.panel_type", "operator": "==", "value": "IPS"}
            ]
        }
    ]
