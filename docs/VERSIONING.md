# VERSIONING.md
Last Updated: 2026-04-16

---

## PURPOSE

This document defines the canonical versioning strategy for GAFAIG.

It governs:
- System versioning
- Data versioning
- Scoring versioning
- Registry versioning
- API and contract stability

The goal is to ensure:
- Deterministic reproducibility
- Backward compatibility
- Transparent evolution of the system

---

## CORE PRINCIPLE

GAFAIG is a deterministic system.

Versioning must ensure that:
- The same inputs always produce the same outputs
- Historical records remain immutable
- Changes do not retroactively alter past results

---

## VERSIONING DOMAINS

GAFAIG uses versioning across five domains:

1. SCORING MODEL
2. DATA STRUCTURE
3. REGISTRY SNAPSHOTS
4. API CONTRACTS
5. CRYPTOGRAPHIC KEYS

Each domain must be versioned independently.

---

## 1. SCORING VERSIONING

### Canonical File

- GAFAIG - Governance Scoring (Enterprise v1.2).sql

---

### Rules

- Scoring logic must be versioned explicitly
- Each version must be immutable once deployed
- New versions must not overwrite old scoring results

---

### Storage

Stored in:

- CORE.CASE_SCORE_SNAPSHOTS

Each snapshot must include:
- scoringVersion
- computed metrics
- timestamp

---

### Behavior

- Old cases retain original scoring version
- New cases use latest scoring version
- No retroactive recalculation

---

## 2. DATA STRUCTURE VERSIONING

### Tables

- Schema changes must be additive
- Columns must not be removed or renamed without migration

---

### Views

- Views must maintain backward compatibility
- Breaking changes require:
  - new view version OR
  - controlled migration

---

### Rules

- Never silently change column meaning
- Never reuse a column for a different purpose

---

## 3. REGISTRY VERSIONING

### Core Table

- CORE.REGISTRY_SNAPSHOTS

---

### Rules

- Append-only
- Each publish creates a new snapshot
- No updates to existing records

---

### Fields

Each snapshot must include:
- registryId
- caseId
- version timestamp
- certification data
- validity window

---

### Behavior

- Historical registry records must remain immutable
- New versions do not overwrite prior versions
- Public views select latest valid snapshot

---

## 4. PUBLIC VIEW VERSIONING

### Core Views

- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

---

### Rules

- Views must remain stable for API consumers
- Changes must not break existing contracts

---

### Strategy

If breaking change is required:
- Create new view (e.g., V_REGISTRY_PUBLIC_V2)
- Deprecate old view gradually

---

## 5. API VERSIONING

### Current State

- Implicit versioning (v1)

Endpoints:
- /api/registry
- /api/verify/[registryId]
- /api/explorer

---

### Rules

- API responses must remain stable
- Field names must not change without version bump
- New fields may be added (non-breaking)

---

### Future

If needed:

/api/v2/registry
/api/v2/verify

---

## 6. SIGNATURE VERSIONING

### Key Identifier (kid)

Format:

gafaig-ed25519-YYYY-MM

Example:

gafaig-ed25519-2026-01

---

### Rules

- Each key rotation creates a new kid
- Old keys must remain verifiable
- Public key endpoint must support validation

---

## 7. SEED VERSIONING

### Canonical Seed

- GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

---

### Rules

- Only one active seed file
- Changes must be deterministic
- Seed updates must not break prior assumptions

---

### Behavior

- Seed defines test dataset
- Must align with full pipeline
- Must produce stable counts

---

## 8. DOCUMENT VERSIONING

### Core Docs

- MASTER_STATE.md
- CURRENT_FOCUS.md
- ENGINEERING_RULES.md
- VERSIONING.md

---

### Rules

- All documents must include Last Updated date
- Changes must reflect actual system state
- No drift between docs and implementation

---

## VERSION IDENTIFIERS

### Format

- Semantic-like but simplified:

v1.0
v1.1
v1.2

---

### Usage

- Scoring models
- Contracts
- Major system updates

---

## BACKWARD COMPATIBILITY

System must guarantee:

- Old registry records remain valid
- Old signatures remain verifiable
- Old API responses remain interpretable

---

## CHANGE MANAGEMENT

When introducing changes:

1. Identify impacted domain
2. Assign version increment
3. Preserve existing data
4. Validate against seed + pipeline
5. Update documentation

---

## CURRENT VERSION STATE

- Scoring Model: v1.2
- Registry Contract: v1 (pending fix)
- API: v1
- Seed: canonical multi-seed
- Signature: Ed25519 (current key active)

---

## KNOWN RISKS

- Changing registry view semantics without versioning
- Mixing approved and certified states
- Recomputing historical scores
- Breaking API contracts silently

---

## DO NOT BREAK

- Append-only registry
- Deterministic scoring
- Stable public views
- Signature verification
- Canonical data flow

---

## FINAL RULE

Versioning must preserve truth over time.

If a change alters historical interpretation without versioning,
the system is no longer deterministic.

---

END OF FILE