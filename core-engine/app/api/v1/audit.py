from fastapi import APIRouter, HTTPException, status
from app.schemas.decision import AuditProofResponse
from app.services.merkle import get_merkle_service

router = APIRouter()


@router.get(
    "/proof/{order_id}",
    response_model=AuditProofResponse,
    status_code=status.HTTP_200_OK,
    summary="Fetch RFC 6962 Merkle Inclusion Proof for an Order"
)
async def get_inclusion_proof(order_id: str) -> AuditProofResponse:
    """
    Generates an auditable cryptographic inclusion proof showing that the
    specified transaction decision was permanently recorded in the RFC 6962 Merkle tree.
    """
    merkle_svc = get_merkle_service()
    record = merkle_svc.get_record(order_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No audit record found for order_id '{order_id}'"
        )

    leaf_hash, audit_path, root_hash = merkle_svc.generate_inclusion_proof(record.index)
    is_valid = merkle_svc.verify_inclusion_proof(
        leaf_hash=leaf_hash,
        audit_path=audit_path,
        expected_root=root_hash
    )

    certificate = {
        "standard": "RFC 6962 (Certificate Transparency)",
        "hash_algorithm": "SHA-256",
        "leaf_format": "0x00 || order_id || jti || decision || fidelity || timestamp",
        "internal_format": "0x01 || left_child || right_child",
        "order_id": order_id,
        "leaf_index": record.index,
        "leaf_hash": leaf_hash,
        "root_hash": root_hash,
        "tree_size": merkle_svc.get_tree_size(),
        "cryptographic_integrity_verified": is_valid,
        "verdict": record.decision.value,
        "timestamp": record.timestamp
    }

    return AuditProofResponse(
        order_id=order_id,
        index=record.index,
        tree_size=merkle_svc.get_tree_size(),
        leaf_hash=leaf_hash,
        root_hash=root_hash,
        audit_path=audit_path,
        is_valid=is_valid,
        record=record,
        rfc_6962_certificate=certificate
    )


@router.get(
    "/tree",
    summary="Get Current Merkle Tree State and Log Count"
)
async def get_merkle_tree_state():
    """
    Returns current Merkle tree root hash and total committed records.
    """
    merkle_svc = get_merkle_service()
    return {
        "tree_size": merkle_svc.get_tree_size(),
        "root_hash": merkle_svc.get_root_hash(),
        "standard": "RFC 6962"
    }
