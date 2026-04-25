# VERSIONING.md
Last Updated: 2026-04-25

## PURPOSE
This document defines the canonical versioning strategy for GAFAIG (Global Authority for AI Governance).

It governs how changes are introduced, tracked, and communicated across Snowflake, API, SDK, public contracts, cryptographic signatures, and UI surfaces.

GAFAIG is a deterministic, Snowflake-executed governance verification system.

Versioning must preserve:
- determinism
- backward compatibility (where possible)
- verifiability
- public trust stability

Versioning is not cosmetic. It is part of the trust infrastructure.

---

## CORE PRINCIPLES

1. Snowflake is the source of truth  
2. Public contracts must remain stable or explicitly versioned  
3. Breaking changes must be versioned, not silently introduced  
4. Cryptographic verification must remain backward verifiable  
5. UI/SDK must never redefine contract behavior  
6. Versioning must be explicit, traceable, and auditable  

---

## VERSIONING DOMAINS

GAFAIG versioning spans multiple domains:

1. Snowflake Data Contracts  
2. Public API Contracts  
3. Verification Signature Contract  
4. SDK / Widget  
5. Public Record Model  
6. Documentation  

Each domain has its own versioning rules but must remain aligned.

---

## SNOWFLAKE VERSIONING

### RULES
- Snowflake is authoritative  
- Schema/view changes define system behavior  
- No version numbers are embedded directly in tables/views  
- Changes must be additive or explicitly coordinated  

### TYPES OF CHANGES

**Non-breaking:**
- Adding new columns to views  
- Adding new record types  
- Adding new eligibility fields  

**Breaking:**
- Removing columns from public views  
- Renaming existing columns  
- Changing semantic meaning of fields  

### REQUIREMENT

Breaking changes must:
- be coordinated with API layer  
- be reflected in documentation  
- not silently alter public behavior  

---

## PUBLIC VIEW CONTRACT VERSIONING

Primary public contract:
CORE.V_REGISTRY_PUBLIC  

Rules:
- This is the canonical public data contract  
- Fields must not be removed without version transition  
- New fields may be added (forward-compatible)  

Phase 6 introduced:
- RECORD_TYPE  
- RECORD_NAME  
- VISIBILITY_STATUS  
- VERIFICATION_ELIGIBLE  
- BADGE_ELIGIBLE  
- LIFECYCLE_STATUS  

These are additive and non-breaking.

---

## API VERSIONING

### CURRENT STATE

GAFAIG APIs are currently unversioned (v1 implicit).

Primary endpoints:
- /api/verify/[registryId]  
- /api/registry  
- /api/badge/[registryId]  
- /api/.well-known/gafaig-public-key  

### RULES

- API responses must remain backward compatible  
- Fields may be added but not removed  
- Response shape must not break consumers  

### WHEN TO VERSION API

Introduce explicit versioning (/api/v2/...) when:
- response shape changes  
- required fields are removed or renamed  
- verification contract changes  

---

## VERIFICATION SIGNATURE VERSIONING

### CONTROL MECHANISM

Verification contract is versioned through:
- alg (algorithm)  
- kid (key ID)  

### CURRENT VALUES

- alg: Ed25519  
- kid: gafaig-ed25519-2026-01  

### RULES

- Changing algorithm requires new alg value  
- Rotating keys requires new kid  
- Old signatures must remain verifiable  

### MESSAGE VERSIONING

The signed message must:
- remain stable  
- not be expanded casually  

If message structure changes:
- introduce new kid  
- optionally include explicit version field  

---

## PUBLIC KEY VERSIONING

Endpoint:
`/api/.well-known/gafaig-public-key`

Rules:
- Must return current active key  
- Must include kid  
- Must remain stable  

Key rotation:
- New key → new kid  
- Old keys must remain verifiable for historical records  

---

## SDK VERSIONING

### FILE
public/sdk/gafaig.js  

### CURRENT VERSION
1.2.0  

### RULES

- SDK version must be explicitly defined  
- Breaking changes require major version increment  
- Backward-compatible changes increment minor/patch  

### VERSIONING STRATEGY

- MAJOR → breaking changes  
- MINOR → backward-compatible features  
- PATCH → bug fixes  

### DISTRIBUTION

SDK must support:

Stable (versioned):
- /sdk/gafaig.v1.js  

Latest (non-deterministic):
- /sdk/gafaig.js  

Optional:
- /sdk/gafaig.js?v=1  

### HARD RULES

- Versioned SDK files must NEVER change once published  
- Breaking changes require new file (v2)  
- SDK must NOT compute trust logic  
- SDK must only fetch + render  

---

## WIDGET VERSIONING

Files:
- public/widget/gafaig-widget.js  
- public/widget/gafaig-verify.js  

### CURRENT STATE
Implicit v1 (unversioned)

### REQUIRED STRUCTURE

Stable:
- /widget/gafaig-widget.v1.js  
- /widget/gafaig-verify.v1.js  

Latest:
- /widget/gafaig-widget.js  
- /widget/gafaig-verify.js  

### RULES

- Versioned widget files must NEVER change  
- Latest files must remain backward compatible  
- Breaking changes require new version files  
- Widget must not compute trust  
- Widget must be driven entirely by API responses  

### FAILURE MODES

- Modifying v1 file = system-wide break  
- Unversioned changes = silent embed failure  
- API mismatch = trust inconsistency  

---

## BADGE VERSIONING

Badge assets:
`/public/badges/`

Rules:
- Visual changes must not imply different certification meaning  
- Badge semantics must align with Snowflake contract  
- Badge logic must respect:
  - lifecycleStatus  
  - badgeEligible  

Badges are NOT trust sources.  
They are representations only.

---

## RECORD MODEL VERSIONING

Phase 6 introduced record-level certification model.

Key additions:
- RECORD_TYPE  
- RECORD_NAME  
- lifecycle-aware verification  
- eligibility controls  

Rules:
- Record model changes must be additive  
- Must not invalidate existing records  
- Must not change meaning of certification  

---

## DOCUMENTATION VERSIONING

Key docs:
- MASTER_STATE.md  
- CURRENT_FOCUS.md  
- ENGINEERING_RULES.md  
- VERIFICATION_SIGNATURE_CONTRACT.md  
- VERIFIED_DEFINITION.md  
- VERSIONING.md  

Rules:
- Must be updated with every major change  
- Must reflect actual system state  
- Must not drift from implementation  

---

## BACKWARD COMPATIBILITY

### REQUIRED

- Existing registry records must remain verifiable  
- Existing signatures must validate  
- Existing SDK integrations must not break  

### STRATEGY

- Add fields, do not remove  
- Introduce new keys for cryptographic changes  
- Introduce new endpoints for breaking API changes  
- Introduce new SDK versions for breaking behavior  

---

## BREAKING CHANGE POLICY

A change is breaking if it:

- invalidates existing signatures  
- removes required API fields  
- changes verification meaning  
- alters public contract semantics  
- breaks SDK integrations  

When breaking:

1. Introduce new version  
2. Preserve old version  
3. Update documentation  
4. Communicate change  

---

## DEPLOYMENT VERSION CONTROL

Deployment via:
Vercel (gafaig-vercel)

Rules:
- Production reflects main branch  
- No silent breaking changes  
- All changes tested locally first  

---

## TESTING VERSION CONSISTENCY

Example:

```js
gafaig.version
gafaig.verify("GAFAIG-00363095").then(console.log)