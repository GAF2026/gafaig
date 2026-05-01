import base64
import json
import sys
import urllib.request
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

REGISTRY_ID = sys.argv[1] if len(sys.argv) > 1 else "GAFAIG-00000001"
BASE_URL = sys.argv[2] if len(sys.argv) > 2 else "https://www.gafaig.com"

def fetch_json(url):
    with urllib.request.urlopen(url) as response:
        return json.loads(response.read().decode("utf-8"))

payload = fetch_json(f"{BASE_URL}/api/verify/{REGISTRY_ID}")

proof = payload.get("proof", {})
message_string = proof.get("messageString")
signature_b64 = proof.get("signature")
key_url = proof.get("verificationKeyUrl")

if not message_string or not signature_b64 or not key_url:
    raise Exception("Missing messageString, signature, or verificationKeyUrl")

key_payload = fetch_json(key_url)
public_key_pem = (
    key_payload.get("publicKeyPem")
    or key_payload.get("public_key_pem")
    or key_payload.get("pem")
    or key_payload.get("publicKey")
    or key_payload.get("public_key")
    or key_payload.get("key")
)

if not public_key_pem:
    raise Exception("Public key PEM not found")

public_key = serialization.load_pem_public_key(public_key_pem.encode("utf-8"))

if not isinstance(public_key, Ed25519PublicKey):
    raise Exception("Public key is not Ed25519")

signature = base64.b64decode(signature_b64)

public_key.verify(signature, message_string.encode("utf-8"))

print({
    "registryId": payload.get("registryId"),
    "verifiedByApi": payload.get("verified"),
    "signatureValidExternally": True,
    "keyId": proof.get("kid"),
    "signedAt": proof.get("signedAt"),
})