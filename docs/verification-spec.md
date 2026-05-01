# GAFAIG Public Verification Specification
Last Updated: 2026-05-01

## Purpose

GAFAIG public verification allows any external system to independently verify that a public certification record was signed by GAFAIG and has not been altered.

Verification does not require trusting the GAFAIG website, widget UI, or frontend code. External systems verify the signed payload using the public verification key.

## Verification Endpoint

GET /api/verify/{registryId}

Example:

https://www.gafaig.com/api/verify/GAFAIG-00000001

## Required Response Fields

The verification response must include:

- ok
- verified
- registryId
- record
- proof

The `proof` object must include:

- alg
- kid
- signature
- signedAt
- verificationKeyUrl
- message
- messageString

## Signature Algorithm

GAFAIG uses:

Ed25519

The signature is generated over the exact UTF-8 bytes of:

proof.messageString

## Signature Encoding

The signature is returned as base64.

External verifiers must decode the base64 signature before verification.

## Public Key

The public key is available from:

proof.verificationKeyUrl

External systems must use the public key returned by this endpoint to verify the signature.

## Verification Rule

A GAFAIG record is externally signature-valid only if:

1. `proof.messageString` is present.
2. `proof.signature` is present.
3. `proof.verificationKeyUrl` is present.
4. The public verification key can be fetched.
5. The Ed25519 signature verifies against the exact UTF-8 bytes of `proof.messageString`.

## Important Rule

External systems must not reconstruct the payload from UI fields.

They must verify the exact `proof.messageString` returned by the verification endpoint.

Any change to spacing, key order, timestamp format, escaping, or field values will invalidate the signature.

## Trust Boundary

The GAFAIG UI displays the verification result.

The GAFAIG API returns the signed verification payload.

The GAFAIG public key allows independent verification.

External trust must be established by validating:

messageString + signature + public key

## Successful Verification Means

A successful external verification means:

- The signed payload was produced by the holder of the GAFAIG private signing key.
- The payload has not been modified since signing.
- The public certification record can be independently verified outside the GAFAIG frontend.

## Failed Verification Means

If signature verification fails, the record must not be trusted as a valid signed GAFAIG proof.