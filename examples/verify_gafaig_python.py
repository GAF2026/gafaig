import base64
import json
import sys
import urllib.parse
import urllib.request
from typing import Any

from cryptography.hazmat.primitives.serialization import load_pem_public_key
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey


REGISTRY_ID = sys.argv[1] if len(sys.argv) > 1 else "GAFAIG-28dedd000ca5410c86e3a6633cd6639a"
BASE_URL = "https://www.gafaig.com"


def fetch_json(url: str) -> dict[str, Any]:
    request = urllib.request.Request(
        url,
        headers={"Accept": "application/json"},
        method="GET",
    )
    with urllib.request.urlopen(request) as response:
        body = response.read().decode("utf-8")
        return json.loads(body)


def normalize_pem(value: str) -> str:
    return value.replace("\\n", "\n").strip()


def main() -> None:
    verify_url = f"{BASE_URL}/api/verify/{urllib.parse.quote(REGISTRY_ID)}"
    verify_payload = fetch_json(verify_url)

    if not verify_payload.get("ok") or not verify_payload.get("verified"):
        raise RuntimeError(
            "GAFAIG verification endpoint did not return a verified record:\n"
            + json.dumps(verify_payload, indent=2)
        )

    proof = verify_payload.get("proof") or {}
    verification_key_url = proof.get("verificationKeyUrl")
    if not verification_key_url:
        raise RuntimeError("Verification payload did not include proof.verificationKeyUrl")

    public_key_payload = fetch_json(verification_key_url)
    public_key_pem = public_key_payload.get("publicKeyPem")
    if not public_key_payload.get("ok") or not public_key_pem:
        raise RuntimeError(
            "Public key endpoint did not return a usable key:\n"
            + json.dumps(public_key_payload, indent=2)
        )

    normalized_pem = normalize_pem(public_key_pem)
    public_key = load_pem_public_key(normalized_pem.encode("utf-8"))
    if not isinstance(public_key, Ed25519PublicKey):
        raise RuntimeError("Public key is not an Ed25519 public key")

    message_string = proof.get("messageString")
    if not message_string:
        raise RuntimeError("Verification payload did not include proof.messageString")

    signature_b64 = proof.get("signature")
    if not signature_b64:
        raise RuntimeError("Verification payload did not include proof.signature")

    signature = base64.b64decode(signature_b64)

    local_signature_valid = True
    try:
        public_key.verify(signature, message_string.encode("utf-8"))
    except Exception:
        local_signature_valid = False

    result = {
        "ok": True,
        "registryId": verify_payload.get("registryId"),
        "verifiedByEndpoint": verify_payload.get("verified"),
        "localSignatureValid": local_signature_valid,
        "algorithm": proof.get("alg"),
        "keyIdFromProof": proof.get("kid"),
        "keyIdFromPublicKey": public_key_payload.get("kid"),
        "verificationKeyUrl": verification_key_url,
        "entityName": (verify_payload.get("record") or {}).get("entityName"),
        "decisionStatus": (verify_payload.get("record") or {}).get("decisionStatus"),
        "certifiedTier": (verify_payload.get("record") or {}).get("certifiedTier"),
        "certifiedBand": (verify_payload.get("record") or {}).get("certifiedBand"),
        "validTo": (verify_payload.get("record") or {}).get("validTo"),
    }

    print(json.dumps(result, indent=2))

    if not local_signature_valid:
        raise SystemExit(1)


if __name__ == "__main__":
    main()