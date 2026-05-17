# CANONICAL_OPERATIONAL_MAP.md

Last Updated: 2026-05-15

---

# PURPOSE

This document defines the canonical operational architecture of GAFAIG.

The purpose of this document is to establish:

* deterministic operational layering
* canonical execution boundaries
* validation authority boundaries
* publication enforcement boundaries
* verification enforcement boundaries
* governance workflow separation
* operational dependency discipline
* institutional governance integrity

This document exists to prevent:

* architectural drift
* operational ambiguity
* validation inconsistency
* topology overengineering
* governance propagation instability
* public/private governance boundary violations
* non-deterministic operational execution

This document is canonical.

All operational infrastructure must align with this document.

---

# NON-NEGOTIABLE DOCTRINE

The following doctrines are immutable canonical operational rules.

## Source Of Truth Doctrine

Snowflake is the source of truth.

The API is pass-through only.

The UI is display only.

No trust logic may exist outside deterministic Snowflake governance infrastructure.

---

## Registry Doctrine

The registry is append-only.

Published governance trust surfaces are immutable historical publication artifacts.

Existing registry snapshots must never be mutated retroactively.

---

## Certification Doctrine

Certification is private.

Publication is explicit.

Verification is publication-bound.

Unpublished governance records must never appear in:

* Explorer
* Registry
* public APIs
* widgets
* badges
* SDK responses
* public observability surfaces

---

## Verification Doctrine

Verification MUST use proof.messageString only.

Verification MUST NOT reconstruct payloads from JSON fields.

Verification MUST fail closed.

Verification MUST remain deterministic.

The verification layer must never weaken cryptographic integrity for convenience.

---

## AI Boundary Doctrine

AI is advisory only.

Governance intelligence must NEVER override deterministic governance authority.

Human approval authority remains mandatory.

Canonical governance decisions remain deterministic and operationally controlled.

---

## Public Governance Trust Doctrine

Public governance trust surfaces must remain:

* publication-controlled
* projection-only
* deterministic
* append-only
* verification-safe
* institutionally auditable

---

# CANONICAL OPERATIONAL LAYERS

GAFAIG is divided into canonical operational layers.

Each layer has:

* explicit operational responsibilities
* explicit dependency boundaries
* explicit execution boundaries
* explicit validation responsibilities
* explicit publication boundaries

Operational layering exists to preserve:

* deterministic trust
* operational clarity
* institutional scalability
* governance integrity
* rebuild stability
* dependency discipline

---

# LAYER 1 — DETERMINISTIC SCHEMA BUILD

## Purpose

Layer 1 establishes deterministic canonical infrastructure.

This layer defines:

* tables
* views
* procedures
* deterministic identifiers
* lifecycle structures
* canonical public views
* governance workflow structures

This layer is foundational.

All higher operational layers depend on Layer 1.

---

## Responsibilities

Layer 1 is responsible for:

* deterministic schema creation
* canonical object creation
* public/private governance separation
* append-only registry structures
* deterministic lifecycle structures
* canonical governance identifiers
* AI advisory infrastructure structures
* publication-safe public projections

---

## Examples

Examples include:

* VERIFICATION_CASES
* VERIFICATION_FINDINGS
* VERIFICATION_EVIDENCE
* VERIFICATION_EVENTS
* DECISIONS
* REGISTRY_SNAPSHOTS
* REGISTRY_AI_SYSTEMS
* V_REGISTRY_PUBLIC
* V_REGISTRY_AI_SYSTEMS_PUBLIC
* SP_CREATE_CASE_FROM_APPLICATION
* SP_SCORE_CASE_ENTERPRISE
* SP_PUBLISH_CASE_TO_REGISTRY_V4

---

## Layer 1 Rules

Layer 1 MUST remain:

* deterministic
* canonical
* rebuild-safe
* append-only where required
* publication-safe
* operationally authoritative

Layer 1 MUST NOT:

* perform public trust interpretation
* contain UI logic
* contain API logic
* contain non-deterministic trust logic
* contain uncontrolled automation

---

# LAYER 2 — GOVERNANCE WORKFLOW INFRASTRUCTURE

## Purpose

Layer 2 operationalizes governance workflows.

This layer governs:

* AI governance workflows
* remediation workflows
* orchestration workflows
* review workflows
* approval workflows
* lifecycle workflows
* governance monitoring workflows
* governance continuity workflows

---

## Responsibilities

Layer 2 is responsible for:

* operational governance execution
* governance state transitions
* governance remediation
* reviewer orchestration
* SLA tracking
* governance workflow continuity
* governance monitoring
* governance simulations
* governance recovery readiness

---

## Examples

Examples include:

* AI_OBSERVATIONS
* AI_RECOMMENDATIONS
* AI_CONSENSUS_DECISIONS
* AI_GOVERNANCE_REMEDIATION_TASKS
* AI_GOVERNANCE_EXECUTIONS
* AI_GOVERNANCE_APPROVALS
* AI_CONTINUOUS_MONITORING
* AI_RECERTIFICATION_QUEUE
* V_AI_GOVERNANCE_RECOVERY
* V_AI_CONSENSUS_READINESS
* V_AI_WORKFLOW_METRICS
* V_AI_ORCHESTRATION_METRICS

---

## Layer 2 Rules

Layer 2 MUST remain:

* advisory-aware
* operationally deterministic
* lifecycle-safe
* review-auditable
* institutionally traceable

Layer 2 MUST NOT:

* override deterministic trust
* bypass human approval
* mutate published registry history
* bypass publication controls
* expose unpublished governance data publicly

---

# LAYER 3 — PUBLICATION + VERIFICATION INFRASTRUCTURE

## Purpose

Layer 3 governs public governance trust distribution.

This layer governs:

* publication
* verification
* trust distribution
* public observability
* registry publication
* badges
* widgets
* SDK infrastructure
* verification endpoints

---

## Responsibilities

Layer 3 is responsible for:

* publication-safe projections
* verification-safe payload distribution
* append-only registry publication
* public trust distribution
* cryptographic verification integrity
* fail-closed verification behavior
* public observability distribution

---

## Examples

Examples include:

* V_REGISTRY_PUBLIC
* V_REGISTRY_AI_SYSTEMS_PUBLIC
* /api/verify/[registryId]
* /api/badge/[registryId]
* public widgets
* SDK distribution infrastructure
* public verification proof infrastructure

---

## Layer 3 Rules

Layer 3 MUST remain:

* publication-controlled
* projection-only
* append-only
* cryptographically deterministic
* fail-closed
* institutionally auditable

Layer 3 MUST enforce:

* PUBLISHED = TRUE
* publication-safe projections
* proof.messageString verification doctrine
* explicit publication boundaries
* verification-safe public payloads

Layer 3 MUST NOT:

* expose private governance workflows
* expose unpublished governance records
* reconstruct verification payloads
* weaken verification integrity
* expose private scoring internals publicly

---

# LAYER 4 — OPERATIONAL VALIDATION INFRASTRUCTURE

## Purpose

Layer 4 validates institutional governance integrity.

This layer exists to:

* validate deterministic operational integrity
* validate publication enforcement
* validate verification integrity
* validate lifecycle integrity
* validate operational dependencies
* validate governance workflow consistency
* validate observability integrity

---

## Responsibilities

Layer 4 is responsible for:

* smoke testing
* dependency validation
* lifecycle validation
* publication validation
* verification validation
* observability validation
* governance integrity validation
* operational rebuild validation

---

## Examples

Examples include:

* 99_RUN_CANONICAL_PIPELINE.sql
* smoke tests
* lifecycle validation queries
* publication enforcement checks
* verification enforcement checks
* governance observability validation checks

---

## Layer 4 Rules

Layer 4 MUST remain:

* non-destructive
* validation-only
* deterministic
* operationally auditable
* institutionally traceable

Layer 4 MUST NOT:

* mutate governance state
* mutate registry history
* alter publication state
* bypass operational workflows
* weaken deterministic validation integrity

---

# DEPENDENCY RULES

Operational dependencies must remain explicit.

Lower layers may not depend on higher layers.

Allowed dependency direction:

Layer 1 → Layer 2 → Layer 3 → Layer 4

Forbidden dependency direction:

Layer 4 → Layer 1 mutation
Layer 3 → Layer 1 mutation bypass
Layer 2 → Layer 3 publication bypass

Operational dependency discipline exists to preserve:

* deterministic execution
* rebuild safety
* lifecycle integrity
* publication integrity
* institutional auditability

---

# EXECUTION RULES

Canonical execution must remain deterministic.

Execution order must remain canonical.

Canonical run-order infrastructure must remain authoritative.

Execution infrastructure must preserve:

* deterministic rebuild behavior
* append-only registry integrity
* publication sequencing
* verification sequencing
* lifecycle sequencing
* observability sequencing

Operational execution must never rely on:

* implicit ordering
* UI assumptions
* API assumptions
* manual trust interpretation

---

# VALIDATION RULES

Canonical validation infrastructure must validate:

* object existence
* lifecycle integrity
* publication integrity
* verification integrity
* observability integrity
* governance workflow integrity
* remediation integrity
* consensus integrity
* operational dependency integrity

Validation infrastructure must remain:

* deterministic
* non-destructive
* auditable
* reproducible

---

# PUBLICATION ENFORCEMENT RULES

Publication remains explicit.

Public trust distribution must remain publication-controlled.

Public governance trust surfaces must enforce:

* PUBLISHED = TRUE
* publication-safe projections
* append-only registry behavior
* deterministic verification payloads
* publication-safe observability

Unpublished governance records must never appear publicly.

---

# VERIFICATION ENFORCEMENT RULES

Verification MUST use proof.messageString only.

Verification MUST fail closed.

Verification MUST remain deterministic.

Verification MUST NOT:

* reconstruct payloads
* verify JSON fields directly
* weaken cryptographic enforcement
* bypass publication boundaries
* expose unpublished verification payloads

Verification infrastructure must remain institutionally auditable.

---

# AI ADVISORY BOUNDARY

AI governance infrastructure exists to support governance workflows.

AI governance infrastructure does NOT replace:

* deterministic governance authority
* human approvals
* publication controls
* certification authority
* operational governance responsibility

AI governance remains advisory-only.

Human governance authority remains mandatory.

---

# ENTERPRISE EXPANSION BOUNDARY

GAFAIG must remain:

Simple by default.
Expandable when needed.

Operational scalability must evolve progressively.

GAFAIG MUST NOT prematurely implement:

* topology inheritance engines
* governance propagation engines
* recursive governance relationships
* federation orchestration systems
* topology graph systems
* recursive certification propagation

Near-term enterprise expansion should remain:

* metadata-oriented
* scope-oriented
* deterministic
* operationally constrained

Certification Scope is the preferred enterprise scaling primitive.

---

# CURRENT IMPLEMENTATION PRIORITY

Current implementation priority is:

## Phase 11A — Deterministic Operational Hardening

Primary priorities:

1. canonical rebuild integrity
2. operational dependency stabilization
3. publication enforcement hardening
4. verification infrastructure hardening
5. lifecycle propagation hardening
6. governance observability stabilization
7. operational workflow depth

Current highest-value operational target:

```text
99_RUN_CANONICAL_PIPELINE.sql
```

This file is evolving into:

* canonical validation authority
* deterministic governance integrity validation infrastructure
* institutional operational governance validation infrastructure

---

# LONG-TERM DIRECTION

GAFAIG is evolving from:

```text
deterministic certification infrastructure
```

toward:

```text
deterministic adaptive governance infrastructure
```

and eventually toward:

```text
adaptive multi-jurisdiction governance topology infrastructure
```

This evolution must remain:

* deterministic
* progressive
* operationally disciplined
* publication-safe
* verification-safe
* institutionally auditable
* human-governed

Operational simplicity must remain protected.

Deterministic trust integrity must remain non-negotiable.
