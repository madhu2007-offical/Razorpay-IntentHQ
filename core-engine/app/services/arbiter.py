from app.schemas.decision import DecisionVerdict
from app.config import get_settings


class DecisionArbiter:
    """
    Arbitration Decision Engine:
    Combines formal deterministic symbolic constraints and probabilistic neural signals
    into an unambiguous operational verdict (ALLOW, HOLD, BLOCK).
    """

    def arbitrate(
        self,
        symbolic_violations: list[str],
        fidelity_score: float,
        injection_risk: float,
        injection_reasons: list[str] | None = None
    ) -> tuple[DecisionVerdict, list[str]]:
        """
        Evaluates the Arbitration Matrix.
        Returns (DecisionVerdict, list_of_human_readable_reasons).
        """
        settings = get_settings()
        reasons: list[str] = []

        # 1. Hard Invariant Violations (SMT formal failure) -> BLOCK
        if symbolic_violations:
            for v in symbolic_violations:
                reasons.append(f"SMT Constraint Failure: {v}")
            return DecisionVerdict.BLOCK, reasons

        # 2. Critical Prompt Injection Attack (> 0.65) -> BLOCK
        if injection_risk > settings.INJECTION_RISK_BLOCK_THRESHOLD:
            reasons.append(
                f"Critical Prompt Injection Threat (Risk: {injection_risk:.2f} > "
                f"{settings.INJECTION_RISK_BLOCK_THRESHOLD:.2f})"
            )
            if injection_reasons:
                reasons.extend([f"Detected vector: {r}" for r in injection_reasons])
            return DecisionVerdict.BLOCK, reasons

        # 3. Severe Goal Semantic Drift (< 0.60) -> BLOCK
        if fidelity_score < settings.SIMILARITY_HOLD_THRESHOLD:
            reasons.append(
                f"Severe Semantic Goal Drift (Fidelity: {fidelity_score:.2f} < "
                f"{settings.SIMILARITY_HOLD_THRESHOLD:.2f}). Transaction is materially incongruent with human intent."
            )
            return DecisionVerdict.BLOCK, reasons

        # 4. Elevated Injection Suspicion (0.15 < risk <= 0.65) -> HOLD
        if injection_risk > settings.INJECTION_RISK_ALLOW_THRESHOLD:
            reasons.append(
                f"Elevated Injection Anomaly (Risk: {injection_risk:.2f}). Step-up biometric authorization required."
            )
            if injection_reasons:
                reasons.extend([f"Suspect vector: {r}" for r in injection_reasons])
            return DecisionVerdict.HOLD, reasons

        # 5. Ambiguous Semantic Drift (0.60 <= fidelity < 0.85) -> HOLD
        if fidelity_score < settings.SIMILARITY_ALLOW_THRESHOLD:
            reasons.append(
                f"Ambiguous Semantic Drift (Fidelity: {fidelity_score:.2f} in range [0.60, 0.85)). "
                f"Potential unsolicited accessory bundling or variant shift. Human step-up confirmation required."
            )
            return DecisionVerdict.HOLD, reasons

        # 6. Full Compliance -> ALLOW
        reasons.append(
            f"Zero symbolic violations, high semantic fidelity ({fidelity_score:.2f} >= 0.85), "
            f"and clean DOM context (risk: {injection_risk:.2f}). Dispatched to Razorpay payment rail."
        )
        return DecisionVerdict.ALLOW, reasons


_arbiter_instance: DecisionArbiter | None = None


def get_arbiter() -> DecisionArbiter:
    global _arbiter_instance
    if _arbiter_instance is None:
        _arbiter_instance = DecisionArbiter()
    return _arbiter_instance
