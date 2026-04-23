# MASTER_STATE.md
Date: 2026-04-23

---

## SYSTEM IDENTITY

GAFAIG (Global Authority for AI Governance) is the world’s first deterministic AI governance registry.

It is a system designed to:
- evaluate AI systems
- assign governance scores (private)
- issue lifecycle-controlled decisions (private)
- publish immutable registry records (public)
- enable external trust via cryptographic verification (public)

GAFAIG is not a database or dashboard.

GAFAIG is a deterministic trust infrastructure.

---

## CORE ARCHITECTURE (LOCKED)

GAFAIG is built on a strict two-layer model:

1. PRIVATE VERIFICATION ENGINE (Snowflake)  
2. PUBLIC TRUST LAYER (Views → API → UI → Widget)  

This separation is absolute and non-negotiable.

---

## CANONICAL DATA FLOW (LOCKED)

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ DECISION  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEWS  
→ API  
→ UI  
→ VERIFY  
→ WIDGET  

Rules:

- append-only flow  
- no back-editing  
- no re-architecture  
- every downstream layer reflects upstream truth  

---

## SOURCE OF TRUTH

Snowflake is the single source of truth.

ALL of the following originate ONLY in Snowflake:

- scoring  
- certification  
- lifecycle state  
- registry publication  
- trust classification  

No logic allowed in:
- API  
- UI  
- Widgets  

---

## SYSTEM LAYERS

### 1. PRIVATE VERIFICATION ENGINE

Purpose:
- intake  
- verification workflow  
- scoring  
- decision lifecycle  

Core Tables:
- CORE.APPLICATIONS  
- CORE.VERIFICATION_CASES  
- CORE.VERIFICATION_FINDINGS  
- CORE.VERIFICATION_EVIDENCE  
- CORE.VERIFICATION_FINDING_EVIDENCE  
- CORE.VERIFICATION_EVENTS  
- CORE.CASE_SCORE_SNAPSHOTS  
- CORE.DECISIONS  

Characteristics:
- deterministic  
- lifecycle-controlled  
- append-only  
- NEVER publicly exposed  

---

### 2. REGISTRY LAYER

Purpose:
- store certified outcomes as immutable public records  

Core Tables:
- CORE.REGISTRY_SNAPSHOTS  
- CORE.REGISTRY_AI_SYSTEMS  

Characteristics:
- append-only  
- immutable  
- historical trace preserved  
- REGISTRY_ID persistent  

---

### 3. PUBLIC TRUST LAYER (PHASE 4 LOCK)

Purpose:
- expose certified truth externally  
- provide cryptographic trust  

Core Views:
- CORE.V_REGISTRY_PUBLIC  
- CORE.V_REGISTRY_LATEST_APPROVED  
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  
- CORE.V_EXPLORER_STATS  

Characteristics:
- projection-only  
- no computation  
- lifecycle-filtered  
- certification-enforced  
- PUBLIC DATA ONLY  

---

## 🔒 PUBLIC VS PRIVATE BOUNDARY (LOCKED)

### PUBLIC (ALLOWED)

- registryId  
- entityName  
- entityType  
- country  
- certificationStatus  
- certifiedAt  
- validFrom  
- validTo  
- lifecycleStatus  
- renewalStatus  

---

### PRIVATE (FORBIDDEN)

- decision_status  
- score  
- tier  
- band  
- scoring breakdown  
- workflow states  

These MUST NEVER appear in:

- V_REGISTRY_PUBLIC  
- API  
- UI  
- Widgets  
- Verify  

---

## TRUST MODEL (LOCKED)

GAFAIG defines three strict states:

### VERIFIED (Internal)
- workflow complete  
- structural integrity  

### APPROVED (Internal)
- scoring complete  
- governance decision issued  

### CERTIFIED (Public)
- published to registry  
- lifecycle-valid  
- cryptographically verifiable  

---

## TRUST AUTHORITY (PHASE 4)

The ONLY trust authority is:

/api/verify/[registryId]

Rules:

- UI must not infer trust  
- Widgets must not compute trust  
- Badges must not infer trust  
- External systems must verify signatures  

---

## SIGNATURE SYSTEM

Algorithm:
- Ed25519  

Verify endpoint:
- /api/verify/[registryId]  

Public key endpoint:
- /api/.well-known/gafaig-public-key  

Proof includes:
- alg  
- kid  
- signature  
- signedAt  
- message  
- messageString  

Rules:
- deterministic message  
- minimal payload  
- no private fields  
- independently verifiable  

---

## VERIFY CONTRACT (LOCKED)

Signed message contains ONLY:

{
  registryId,
  entityName,
  certificationStatus,
  certifiedAt
}

This is the ONLY cryptographic trust payload.

---

## REGISTRY MODEL

Registry is:

- append-only  
- snapshot-based  
- immutable  

Rules:

- no updates to snapshots  
- new state = new snapshot  
- REGISTRY_ID persists  

---

## LIFECYCLE MODEL

Controlled by:

- CORE.DECISIONS  
- VALID_FROM / VALID_TO  
- CORE.V_CASE_RENEWAL_STATUS  

Public exposure MUST respect lifecycle validity.

---

## API LAYER

Endpoints:

/api/registry  
/api/registry/search  
/api/registry/[registryId]  
/api/explorer  
/api/verify/[registryId]  
/api/badge/[registryId]  
/api/.well-known/gafaig-public-key  

Rules:

- no computation  
- no trust logic  
- direct mapping to Snowflake  
- deterministic outputs  

---

## UI SYSTEM

Framework:
- Next.js App Router  
- TypeScript  

Rules:

- render-only  
- no trust computation  
- no derived state  

---

## WIDGET SYSTEM (LOCKED)

Files:

- public/widget/gafaig-widget.js  
- public/widget/gafaig-verify.js  

Rules:

- must call /api/verify  
- must not call /api/registry  
- must not compute trust  
- must display signed results only  

Widgets are portable trust surfaces.

---

## CURRENT STATE (PHASE 4)

System is in:

PRODUCTION + TRUST LOCK

Status:

- public contract enforced  
- private boundary locked  
- verify endpoint authoritative  
- registry aligned  
- explorer aligned  
- badge aligned  
- widget aligned  
- modal aligned  
- signature system stable  
- deterministic pipeline verified  

---

## CURRENT PRIORITY

1. lock documentation  
2. enforce zero drift  
3. validate full pipeline determinism  
4. maintain Snowflake → API → UI → Verify parity  
5. prevent any reintroduction of private data into public layers  

---

## SYSTEM GUARANTEES

GAFAIG guarantees:

- deterministic outputs  
- immutable registry  
- strict lifecycle enforcement  
- public/private separation  
- cryptographic trust verification  
- portable trust surfaces  

---

## DO NOT BREAK

- canonical data flow  
- Snowflake authority  
- append-only registry  
- trust model separation  
- verify-only trust surface  
- signature contract  
- public/private boundary  

---

## FINAL RULE

If any layer:

- computes its own trust  
- overrides Snowflake  
- exposes private data  
- introduces non-determinism  

👉 the system is invalid  

---

## FINAL STATEMENT

GAFAIG is a deterministic trust infrastructure where:

Snowflake defines truth  
API transmits truth  
UI renders truth  
Verify proves truth  
Widget distributes truth  

Trust is not asserted.  

Trust is mathematically and cryptographically proven.

---

END OF FILE