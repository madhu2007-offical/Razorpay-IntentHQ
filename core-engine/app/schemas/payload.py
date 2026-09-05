from typing import Any
from pydantic import BaseModel, Field


class LineItem(BaseModel):
    item_id: str = Field(..., description="Unique product SKU or identifier")
    title: str = Field(..., description="Product title / name")
    quantity: int = Field(..., ge=1, description="Quantity ordered")
    unit_price_paise: int = Field(..., ge=0, description="Unit price in Paise")
    attributes: dict[str, Any] = Field(
        default_factory=dict,
        description="Structured product specifications, e.g. {'specs': {'ram_gb': 16, 'storage_gb': 512}}"
    )


class CheckoutPayload(BaseModel):
    order_id: str = Field(..., description="Razorpay order or cart reference ID")
    merchant_id: str = Field(..., description="Merchant identifier (e.g. 'croma_official')")
    amount_paise: int = Field(..., ge=0, description="Total order amount requested in Paise")
    line_items: list[LineItem] = Field(..., min_length=1, description="Cart line items")
    dom_context: str | None = Field(
        None,
        description="Raw DOM text/HTML context captured by agent during checkout"
    )
    timestamp: int = Field(..., description="Client execution timestamp (epoch seconds)")
    nonce: str = Field(..., description="Anti-replay cryptographic nonce")
