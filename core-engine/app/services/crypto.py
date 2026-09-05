import base64
import json
import time
from typing import Any
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.exceptions import InvalidSignature
from app.schemas.intent import IntentToken
from app.config import get_settings


def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _base64url_decode(data: str) -> bytes:
    padding = 4 - (len(data) % 4)
    if padding != 4:
        data += "=" * padding
    return base64.urlsafe_b64decode(data.encode("utf-8"))


class CryptoService:
    def __init__(self, private_key_hex: str | None = None):
        if private_key_hex and len(private_key_hex) == 64:
            self._private_key = ed25519.Ed25519PrivateKey.from_private_bytes(
                bytes.fromhex(private_key_hex)
            )
        else:
            self._private_key = ed25519.Ed25519PrivateKey.generate()

        self._public_key = self._private_key.public_key()

    @property
    def public_key_hex(self) -> str:
        from cryptography.hazmat.primitives import serialization
        raw_bytes = self._public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw
        )
        return raw_bytes.hex()

    @property
    def private_key_hex(self) -> str:
        from cryptography.hazmat.primitives import serialization
        raw_bytes = self._private_key.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption()
        )
        return raw_bytes.hex()

    def sign_token(self, claims: IntentToken) -> str:
        """
        Signs an IntentToken following RFC 8037 (JWT with EdDSA / Ed25519).
        """
        header = {
            "alg": "EdDSA",
            "typ": "JWT",
            "crv": "Ed25519"
        }
        header_bytes = json.dumps(header, separators=(",", ":")).encode("utf-8")
        payload_bytes = json.dumps(claims.model_dump(), separators=(",", ":")).encode("utf-8")

        encoded_header = _base64url_encode(header_bytes)
        encoded_payload = _base64url_encode(payload_bytes)

        signing_input = f"{encoded_header}.{encoded_payload}".encode("utf-8")
        signature = self._private_key.sign(signing_input)
        encoded_signature = _base64url_encode(signature)

        return f"{encoded_header}.{encoded_payload}.{encoded_signature}"

    def verify_token(self, token: str) -> tuple[bool, IntentToken | None, str | None]:
        """
        Verifies an incoming Ed25519 JWT IntentToken.
        Returns (is_valid, parsed_claims, error_message).
        """
        parts = token.split(".")
        if len(parts) != 3:
            return False, None, "Invalid JWT token structure (must have 3 parts)"

        encoded_header, encoded_payload, encoded_signature = parts

        try:
            header_bytes = _base64url_decode(encoded_header)
            header = json.loads(header_bytes.decode("utf-8"))
            if header.get("alg") != "EdDSA":
                return False, None, f"Unsupported algorithm {header.get('alg')}, expected EdDSA"

            signing_input = f"{encoded_header}.{encoded_payload}".encode("utf-8")
            signature = _base64url_decode(encoded_signature)

            # Cryptographic signature check
            self._public_key.verify(signature, signing_input)

            payload_bytes = _base64url_decode(encoded_payload)
            payload_dict = json.loads(payload_bytes.decode("utf-8"))
            claims = IntentToken(**payload_dict)

            # Validate expiration
            now = int(time.time())
            if claims.exp < now:
                return False, claims, f"IntentToken expired at {claims.exp} (current time: {now})"

            return True, claims, None

        except InvalidSignature:
            return False, None, "Ed25519 cryptographic signature verification failed"
        except Exception as e:
            return False, None, f"Token decode or verification error: {str(e)}"


_crypto_instance: CryptoService | None = None


def get_crypto_service() -> CryptoService:
    global _crypto_instance
    if _crypto_instance is None:
        settings = get_settings()
        _crypto_instance = CryptoService(
            private_key_hex=settings.ED25519_PRIVATE_KEY_HEX or None
        )
    return _crypto_instance
