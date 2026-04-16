# VERIFICATION_SIGNATURE_CONTRACT.md
Last Updated: 2026-04-16

---

## PURPOSE

This document defines the canonical signature and verification contract for GAFAIG.

It ensures:
- Deterministic verification of registry records
- Cryptographic integrity of public trust artifacts
- Consistent signature structure across all outputs
- Compatibility with external verification systems

This contract is mandatory for all verification endpoints and trust surfaces.

---

## CORE PRINCIPLE

All verification responses must be:

- Deterministic
- Signed
- Verifiable externally
- Independent of UI rendering

Snowflake provides the data.
The API signs the response.
External systems verify the signature.

---

## VERIFICATION ENDPOINT

Primary endpoint:

/api/verify/[registryId]

This endpoint returns:
- Canonical registry record
- Verification metadata
- Cryptographic proof

---

## RESPONSE STRUCTURE

```json
{
  "ok": true,
  "registryId": "GAFAIG-XXXXXXXX",
  "record": { ... },
  "proof": { ... }
}