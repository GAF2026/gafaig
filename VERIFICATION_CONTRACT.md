# VERIFICATION_CONTRACT.md
Last Updated: 2026-04-29

## PURPOSE

This document defines the GAFAIG public verification contract.

GAFAIG verification is the public proof layer for certified AI governance records. It allows external systems to validate certification status, payload integrity, and authenticity without accessing private governance evidence, findings, scoring internals, or review workflows.

GAFAIG verification is not a UI claim. It is a cryptographically verifiable public trust mechanism based on a Snowflake-originated record, a canonical signed payload, an Ed25519 signature, and a public verification key.

---

## CORE RULE

A GAFAIG public record may be treated as trusted only when all of the following are true:

1. The record exists in the GAFAIG public verification endpoint.
2. The response returns `ok: true`.
3. The response returns `verified: true`.
4. The record returns `certificationStatus: "CERTIFIED"`.
5. The record returns `lifecycleStatus: "active"`.
6. The record returns `visibilityStatus: "public"`.
7. The record returns `verificationEligible: true`.
8. The record returns `badgeEligible: true`.
9. The response includes `proof.messageString`.
10. The response includes `proof.signature`.
11. The signature validates against the exact `proof.messageString` using the GAFAIG public key.

If any condition fails, the record must not be displayed as trusted.

---

## CANONICAL VERIFICATION INPUT

The canonical signed payload is:

```text
proof.messageString