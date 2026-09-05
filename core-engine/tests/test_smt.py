import time
import pytest
from app.schemas.intent import IntentToken, FinancialBounds, MerchantPolicy, InvariantPredicate
from app.schemas.payload import CheckoutPayload, LineItem
from app.services.smt_solver import SMTSolverService


@pytest.fixture
def smt_service(base_intent_token):
    svc = SMTSolverService()
    # Warmup libz3 runtime
    dummy_payload = CheckoutPayload(
        order_id="warmup",
        merchant_id="croma_official",
        amount_paise=1000,
        line_items=[
            LineItem(item_id="w1", title="w", quantity=1, unit_price_paise=1000, attributes={})
        ],
        timestamp=1700000000,
        nonce="w"
    )
    svc.verify_invariants(base_intent_token, dummy_payload)
    return svc


@pytest.fixture
def base_intent_token():
    return IntentToken(
        sub="user_tester_1",
        jti="int_test_123",
        iat=1700000000,
        exp=1700003600,
        semantic_goal="Purchase a 16GB RAM laptop under ₹70,000 from Croma",
        financial_bounds=FinancialBounds(
            hard_max_paise=7000000,  # ₹70,000
            currency="INR",
            tax_inclusive=True,
            max_items=1
        ),
        predicates=[
            InvariantPredicate(field="specs.ram_gb", operator=">=", value=16),
            InvariantPredicate(field="specs.storage_gb", operator=">=", value=512),
        ],
        merchant_policy=MerchantPolicy(
            whitelist_merchant_ids=["croma_official"]
        )
    )


def test_smt_clean_compliant_payload(smt_service, base_intent_token):
    payload = CheckoutPayload(
        order_id="order_clean_1",
        merchant_id="croma_official",
        amount_paise=6499900,  # ₹64,999 <= ₹70,000
        line_items=[
            LineItem(
                item_id="laptop_dell_16",
                title="Dell Inspiron 15 (16GB RAM, 512GB SSD)",
                quantity=1,
                unit_price_paise=6499900,
                attributes={"specs": {"ram_gb": 16, "storage_gb": 512}}
            )
        ],
        dom_context="<div>Checkout button clicked</div>",
        timestamp=1700000100,
        nonce="nonce_abc1"
    )

    is_sat, violations, elapsed_ms = smt_service.verify_invariants(base_intent_token, payload)
    assert is_sat is True
    assert len(violations) == 0
    assert elapsed_ms < 25.0  # Must be fast (< 25ms in test env, target < 4ms)


def test_smt_budget_overrun_violation(smt_service, base_intent_token):
    payload = CheckoutPayload(
        order_id="order_overrun_1",
        merchant_id="croma_official",
        amount_paise=7500000,  # ₹75,000 > ₹70,000 budget
        line_items=[
            LineItem(
                item_id="laptop_dell_16",
                title="Dell Inspiron 15 (16GB RAM, 512GB SSD)",
                quantity=1,
                unit_price_paise=7500000,
                attributes={"specs": {"ram_gb": 16, "storage_gb": 512}}
            )
        ],
        timestamp=1700000100,
        nonce="nonce_abc2"
    )

    is_sat, violations, _ = smt_service.verify_invariants(base_intent_token, payload)
    assert is_sat is False
    assert any("Financial Bound Violation" in v for v in violations)


def test_smt_specification_downgrade_violation(smt_service, base_intent_token):
    # Downgrade attack: RAM is only 8GB instead of >= 16GB
    payload = CheckoutPayload(
        order_id="order_downgrade_1",
        merchant_id="croma_official",
        amount_paise=6950000,
        line_items=[
            LineItem(
                item_id="laptop_dell_8gb",
                title="Dell Inspiron 15 (8GB RAM, 512GB SSD)",
                quantity=1,
                unit_price_paise=6950000,
                attributes={"specs": {"ram_gb": 8, "storage_gb": 512}}
            )
        ],
        timestamp=1700000100,
        nonce="nonce_abc3"
    )

    is_sat, violations, _ = smt_service.verify_invariants(base_intent_token, payload)
    assert is_sat is False
    assert any("specs.ram_gb" in v and "violates condition '>= 16'" in v for v in violations)


def test_smt_cart_tampering_sum_mismatch(smt_service, base_intent_token):
    # Total claims 6499900 paise, but line item is 5000000 paise (stealth fee added)
    payload = CheckoutPayload(
        order_id="order_tamper_1",
        merchant_id="croma_official",
        amount_paise=6499900,
        line_items=[
            LineItem(
                item_id="laptop_dell_16",
                title="Dell Inspiron 15 (16GB RAM, 512GB SSD)",
                quantity=1,
                unit_price_paise=5000000,
                attributes={"specs": {"ram_gb": 16, "storage_gb": 512}}
            )
        ],
        timestamp=1700000100,
        nonce="nonce_abc4"
    )

    is_sat, violations, _ = smt_service.verify_invariants(base_intent_token, payload)
    assert is_sat is False
    assert any("Cart Accounting Invariant Violation" in v for v in violations)


def test_smt_item_count_overrun(smt_service, base_intent_token):
    # 2 items when max_items = 1
    payload = CheckoutPayload(
        order_id="order_count_overrun",
        merchant_id="croma_official",
        amount_paise=6499900,
        line_items=[
            LineItem(
                item_id="laptop_dell_16",
                title="Dell Inspiron 15",
                quantity=1,
                unit_price_paise=6000000,
                attributes={"specs": {"ram_gb": 16, "storage_gb": 512}}
            ),
            LineItem(
                item_id="mouse_extra",
                title="Wireless Mouse",
                quantity=1,
                unit_price_paise=499900,
                attributes={}
            )
        ],
        timestamp=1700000100,
        nonce="nonce_abc5"
    )

    is_sat, violations, _ = smt_service.verify_invariants(base_intent_token, payload)
    assert is_sat is False
    assert any("Item Count Violation" in v for v in violations)


def test_smt_merchant_whitelist_violation(smt_service, base_intent_token):
    payload = CheckoutPayload(
        order_id="order_rogue_merchant",
        merchant_id="rogue_merchant_99",
        amount_paise=6499900,
        line_items=[
            LineItem(
                item_id="laptop_dell_16",
                title="Dell Inspiron 15",
                quantity=1,
                unit_price_paise=6499900,
                attributes={"specs": {"ram_gb": 16, "storage_gb": 512}}
            )
        ],
        timestamp=1700000100,
        nonce="nonce_abc6"
    )

    is_sat, violations, _ = smt_service.verify_invariants(base_intent_token, payload)
    assert is_sat is False
    assert any("Merchant Policy Violation" in v for v in violations)
