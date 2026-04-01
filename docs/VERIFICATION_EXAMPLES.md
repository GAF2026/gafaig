# GAFAIG Verification Examples

GAFAIG certifications can be independently verified using two public endpoints:

- Verification proof endpoint: `/api/verify/{registryId}`
- Public key endpoint: `/api/.well-known/gafaig-public-key`

The verification endpoint returns:
- the public certification record
- a signed proof object
- the verification key URL

The public key endpoint returns:
- the Ed25519 public key
- the key identifier (`kid`)
- PEM and base64 key formats

## Verification flow

1. Fetch the proof from `/api/verify/{registryId}`
2. Read `proof.verificationKeyUrl`
3. Fetch the public key from that URL
4. Serialize the signed message deterministically
5. Verify the Ed25519 signature against the signed message
6. Confirm the record fields match the signed proof payload

## Node.js example

Run:

```bash
node examples/verify-gafaig-node.mjs GAFAIG-28dedd000ca5410c86e3a6633cd6639a