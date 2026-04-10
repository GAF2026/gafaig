# GAFAIG — VERIFICATION SIGNATURE CONTRACT — 2026-04-10

## PURPOSE
Defines the cryptographic verification standard.

---

## ALGORITHM

Ed25519

Library:
tweetnacl

---

## PAYLOAD STRUCTURE

{
  registryId,
  message,
  signature,
  alg: "Ed25519",
  kid,
  signedAt,
  verificationKeyUrl
}

---

## MESSAGE RULE

messageString MUST be:
- Deterministic
- Identical across:
  - Snowflake
  - API
  - Client verification

---

## SIGNING FLOW

1. Construct message
2. Sign using private key
3. Return signature + metadata

---

## VERIFICATION FLOW

1. Fetch payload
2. Fetch public key
3. Verify signature
4. Return TRUE/FALSE

---

## FAILURE CONDITIONS

- Message mismatch
- Key mismatch
- Encoding mismatch

---

## FINAL RULE

If signature fails → certification is invalid.