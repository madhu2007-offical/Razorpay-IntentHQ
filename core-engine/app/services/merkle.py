import hashlib
import threading
from typing import Any
from app.schemas.decision import DecisionVerdict, AuditRecord, AuditProofStep


def _largest_power_of_two_less_than(n: int) -> int:
    """Returns the largest power of 2 smaller than n (for n > 1)."""
    k = 1
    while k * 2 < n:
        k *= 2
    return k


class MerkleTreeService:
    """
    Thread-safe RFC 6962-compliant Append-Only Merkle Tree.
    Implements:
      - Leaf hashing: SHA256(0x00 || data)
      - Internal node hashing: SHA256(0x01 || left || right)
      - RFC 6962 Merkle Tree Hash (MTH) and Audit Path (PATH) generation
    """

    def __init__(self):
        self._lock = threading.Lock()
        self._leaves: list[bytes] = []  # Raw leaf hashes
        self._records: list[AuditRecord] = []
        self._order_to_index: dict[str, int] = {}

    def compute_leaf_hash(
        self,
        order_id: str,
        jti: str,
        decision: DecisionVerdict,
        fidelity_score: float,
        timestamp: int
    ) -> str:
        """
        Calculates RFC 6962 leaf hash:
        SHA256(0x00 || order_id || jti || decision || str(fidelity_score) || str(timestamp))
        """
        raw_data = (
            f"{order_id}:{jti}:{decision.value}:{fidelity_score:.4f}:{timestamp}".encode("utf-8")
        )
        hasher = hashlib.sha256()
        hasher.update(b"\x00")
        hasher.update(raw_data)
        return hasher.hexdigest()

    def append_leaf(
        self,
        order_id: str,
        jti: str,
        decision: DecisionVerdict,
        fidelity_score: float,
        timestamp: int
    ) -> tuple[int, str, str]:
        """
        Appends a verified transaction to the Merkle log.
        Returns:
            - index: int (0-indexed position)
            - leaf_hash: str (hex)
            - root_hash: str (hex)
        """
        with self._lock:
            leaf_hash_hex = self.compute_leaf_hash(
                order_id=order_id,
                jti=jti,
                decision=decision,
                fidelity_score=fidelity_score,
                timestamp=timestamp
            )
            leaf_bytes = bytes.fromhex(leaf_hash_hex)
            index = len(self._leaves)

            record = AuditRecord(
                index=index,
                leaf_hash=leaf_hash_hex,
                order_id=order_id,
                jti=jti,
                decision=decision,
                fidelity_score=fidelity_score,
                timestamp=timestamp
            )

            self._leaves.append(leaf_bytes)
            self._records.append(record)
            self._order_to_index[order_id] = index

            root_hash_hex = self._compute_mth(self._leaves).hex()
            return index, leaf_hash_hex, root_hash_hex

    def get_root_hash(self) -> str:
        """Returns the current Merkle Tree Hash (Root)."""
        with self._lock:
            if not self._leaves:
                return hashlib.sha256().hexdigest()
            return self._compute_mth(self._leaves).hex()

    def get_tree_size(self) -> int:
        with self._lock:
            return len(self._leaves)

    def get_record(self, order_id: str) -> AuditRecord | None:
        with self._lock:
            idx = self._order_to_index.get(order_id)
            if idx is not None and idx < len(self._records):
                return self._records[idx]
            return None

    def generate_inclusion_proof(self, leaf_index: int) -> tuple[str, list[AuditProofStep], str]:
        """
        Generates RFC 6962 inclusion proof for leaf at leaf_index.
        Returns:
            - leaf_hash: str
            - audit_path: list[AuditProofStep]
            - root_hash: str
        """
        with self._lock:
            n = len(self._leaves)
            if leaf_index < 0 or leaf_index >= n:
                raise IndexError(f"Leaf index {leaf_index} out of bounds for tree size {n}")

            leaf_hash = self._leaves[leaf_index].hex()
            root_hash = self._compute_mth(self._leaves).hex()
            audit_steps: list[AuditProofStep] = []

            self._build_audit_path(leaf_index, self._leaves, audit_steps)
            return leaf_hash, audit_steps, root_hash

    def _compute_mth(self, leaves: list[bytes]) -> bytes:
        """
        RFC 6962 Section 2.1: Merkle Tree Hash (MTH)
        """
        n = len(leaves)
        if n == 0:
            return hashlib.sha256().digest()
        if n == 1:
            # When leaves are already leaf hashes (SHA256(0x00 || data)), return leaf
            return leaves[0]

        k = _largest_power_of_two_less_than(n)
        left_mth = self._compute_mth(leaves[:k])
        right_mth = self._compute_mth(leaves[k:])

        hasher = hashlib.sha256()
        hasher.update(b"\x01")
        hasher.update(left_mth)
        hasher.update(right_mth)
        return hasher.digest()

    def _build_audit_path(
        self,
        m: int,
        leaves: list[bytes],
        steps: list[AuditProofStep]
    ):
        """
        RFC 6962 Section 2.1.1: Merkle Audit Path
        """
        n = len(leaves)
        if n <= 1:
            return

        k = _largest_power_of_two_less_than(n)
        if m < k:
            # Target is in left subtree, sibling is right subtree hash
            right_hash = self._compute_mth(leaves[k:]).hex()
            steps.append(AuditProofStep(sibling_hash=right_hash, direction="right"))
            self._build_audit_path(m, leaves[:k], steps)
        else:
            # Target is in right subtree, sibling is left subtree hash
            left_hash = self._compute_mth(leaves[:k]).hex()
            steps.append(AuditProofStep(sibling_hash=left_hash, direction="left"))
            self._build_audit_path(m - k, leaves[k:], steps)

    @staticmethod
    def verify_inclusion_proof(
        leaf_hash: str,
        audit_path: list[AuditProofStep],
        expected_root: str
    ) -> bool:
        """
        Verifies RFC 6962 inclusion proof.
        Iteratively recombines leaf hash with sibling hashes according to direction.
        """
        curr = bytes.fromhex(leaf_hash)

        # Proof steps are returned in top-to-bottom or bottom-to-top order;
        # Since _build_audit_path traverses top-to-bottom, we reverse steps for bottom-up verification
        for step in reversed(audit_path):
            sibling = bytes.fromhex(step.sibling_hash)
            hasher = hashlib.sha256()
            hasher.update(b"\x01")
            if step.direction == "right":
                hasher.update(curr)
                hasher.update(sibling)
            else:
                hasher.update(sibling)
                hasher.update(curr)
            curr = hasher.digest()

        return curr.hex() == expected_root


_merkle_instance: MerkleTreeService | None = None


def get_merkle_service() -> MerkleTreeService:
    global _merkle_instance
    if _merkle_instance is None:
        _merkle_instance = MerkleTreeService()
    return _merkle_instance
