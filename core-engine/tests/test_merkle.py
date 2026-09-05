import hashlib
import pytest
from app.schemas.decision import DecisionVerdict, AuditProofStep
from app.services.merkle import MerkleTreeService


@pytest.fixture
def merkle_service():
    return MerkleTreeService()


def test_rfc6962_leaf_hash_prefix(merkle_service):
    order_id = "order_123"
    jti = "jti_456"
    decision = DecisionVerdict.ALLOW
    fidelity = 0.92
    timestamp = 1700000000

    leaf_hash = merkle_service.compute_leaf_hash(
        order_id=order_id,
        jti=jti,
        decision=decision,
        fidelity_score=fidelity,
        timestamp=timestamp
    )

    # Manually compute with 0x00 prefix to verify RFC 6962 compliance
    raw = f"{order_id}:{jti}:{decision.value}:{fidelity:.4f}:{timestamp}".encode("utf-8")
    h = hashlib.sha256()
    h.update(b"\x00")
    h.update(raw)
    assert leaf_hash == h.hexdigest()


def test_merkle_single_leaf(merkle_service):
    idx, leaf_hash, root_hash = merkle_service.append_leaf(
        order_id="order_1",
        jti="jti_1",
        decision=DecisionVerdict.ALLOW,
        fidelity_score=0.95,
        timestamp=1700000001
    )

    assert idx == 0
    assert root_hash == leaf_hash  # In RFC 6962, tree of size 1 has root == leaf_hash

    # Inclusion proof for size 1 should be empty path
    l_hash, audit_path, r_hash = merkle_service.generate_inclusion_proof(0)
    assert l_hash == leaf_hash
    assert len(audit_path) == 0
    assert r_hash == root_hash

    is_valid = merkle_service.verify_inclusion_proof(leaf_hash, audit_path, root_hash)
    assert is_valid is True


def test_merkle_multi_leaf_inclusion_proofs(merkle_service):
    # Test for arbitrary power-of-2 and non-power-of-2 tree sizes (e.g. 5 leaves)
    num_leaves = 5
    leaf_hashes = []
    
    for i in range(num_leaves):
        idx, l_hash, _ = merkle_service.append_leaf(
            order_id=f"order_{i}",
            jti=f"jti_{i}",
            decision=DecisionVerdict.ALLOW if i % 2 == 0 else DecisionVerdict.BLOCK,
            fidelity_score=0.85 + (i * 0.02),
            timestamp=1700000000 + i
        )
        assert idx == i
        leaf_hashes.append(l_hash)

    tree_size = merkle_service.get_tree_size()
    assert tree_size == num_leaves
    root_hash = merkle_service.get_root_hash()

    # Generate and verify inclusion proofs for EVERY single leaf in the tree
    for i in range(num_leaves):
        l_hash, audit_path, r_hash = merkle_service.generate_inclusion_proof(i)
        assert l_hash == leaf_hashes[i]
        assert r_hash == root_hash
        assert len(audit_path) > 0

        # Cryptographic verification
        is_valid = merkle_service.verify_inclusion_proof(l_hash, audit_path, root_hash)
        assert is_valid is True, f"Inclusion proof failed for leaf index {i}"


def test_merkle_tampered_proof_rejection(merkle_service):
    for i in range(4):
        merkle_service.append_leaf(
            order_id=f"order_tamper_{i}",
            jti=f"jti_{i}",
            decision=DecisionVerdict.ALLOW,
            fidelity_score=0.90,
            timestamp=1700000000 + i
        )

    leaf_hash, audit_path, root_hash = merkle_service.generate_inclusion_proof(2)

    # Tampered leaf hash must fail verification
    fake_leaf = hashlib.sha256(b"fake_unauthorized_leaf").hexdigest()
    assert merkle_service.verify_inclusion_proof(fake_leaf, audit_path, root_hash) is False

    # Tampered sibling hash must fail verification
    tampered_path = [
        AuditProofStep(
            sibling_hash=hashlib.sha256(b"corrupted_sibling").hexdigest(),
            direction=step.direction
        )
        for step in audit_path
    ]
    assert merkle_service.verify_inclusion_proof(leaf_hash, tampered_path, root_hash) is False
