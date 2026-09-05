from typing import Any, Literal
from pydantic import BaseModel, Field


class InvariantPredicate(BaseModel):
    field: str = Field(..., description="Target dot-notation attribute path, e.g. 'specs.ram_gb' or 'quantity'")
    operator: Literal[">=", "<=", "==", "!=", "in"] = Field(..., description="Comparison operator")
    value: Any = Field(..., description="Reference comparison value")


class FinancialBounds(BaseModel):
    hard_max_paise: int = Field(..., description="Maximum allowed total transaction amount in Paise (1 INR = 100 Paise)")
    currency: str = Field("INR", description="Currency ISO code")
    tax_inclusive: bool = Field(True, description="Whether the max ceiling includes tax")
    max_items: int = Field(1, description="Maximum total items allowed in order")


class MerchantPolicy(BaseModel):
    whitelist_merchant_ids: list[str] = Field(default_factory=list, description="Whitelisted Razorpay merchant account IDs")
    disallowed_mcc: list[str] = Field(default_factory=list, description="Disallowed Merchant Category Codes")


class IntentToken(BaseModel):
    # JWT standard claims
    sub: str = Field(..., description="Subject: User / Master Principal ID")
    jti: str = Field(..., description="JWT ID: Unique cryptographic intent identifier")
    iat: int = Field(..., description="Issued at epoch seconds")
    exp: int = Field(..., description="Expiration epoch seconds")
    
    # IntentHQ specific domain claims
    semantic_goal: str = Field(..., description="Natural language human intent description")
    financial_bounds: FinancialBounds = Field(..., description="Hard mathematical budget thresholds")
    predicates: list[InvariantPredicate] = Field(default_factory=list, description="Deterministic SMT invariant predicates")
    merchant_policy: MerchantPolicy = Field(default_factory=MerchantPolicy, description="Merchant restrictions")
