# APPLICANT_SCHEMA_INVENTORY.md

# GAFAIG — APPLICANT SCHEMA INVENTORY

Version: 1.0

Status: CONSTITUTIONAL SCHEMA INVENTORY

Authority Level: Applicant Schema Mapping Authority

Last Updated: 2026-06-12

---

# PURPOSE

This document defines the Applicant Schema Inventory for GAFAIG.

The Applicant Schema Inventory exists to support the Organization Submission Requirements Audit by identifying the applicant-facing Snowflake tables, freeze tables, canonical views, summary views, and infrastructure layers that currently support applicant intake, applicant lifecycle management, certification, publication authorization, public registry continuity, and public certification registry infrastructure.

This inventory is a bridge document between:

```text
ORGANIZATION_SUBMISSION_CONTRACT.md
```

and:

```text
ORGANIZATION_SUBMISSION_VALIDATION_MATRIX.md
```

It exists so the validation matrix can be mapped against actual applicant infrastructure rather than placeholder table names.

---

# CONSTITUTIONAL FREEZE GATE

Applicant Infrastructure may not proceed beyond:

```text
APPLICANT_142_APPLICANT_PUBLIC_CERTIFICATION_REGISTRY_INTERFACE_ENGINE.sql
```

until the Organization Submission Requirements Audit confirms that every REQUIRED organization submission field is either:

```text
COVERED
```

or assigned to a corrective intake infrastructure file.

Optional and conditional fields may remain PARTIAL if extensibility support exists.

---

# APPLICANT ARCHITECTURE STATUS

Current validated Applicant Infrastructure endpoint:

```text
APPLICANT_142_APPLICANT_PUBLIC_CERTIFICATION_REGISTRY_INTERFACE_ENGINE.sql
```

Current execution status:

```text
APPLICANT_000–003      Foundational Applicant Infrastructure
APPLICANT_010–040      Applicant Portal Infrastructure
APPLICANT_041–043      Applicant Case Infrastructure
APPLICANT_044–092      Applicant Case / Evidence / Certification / Suspension / Appeal / Reinstatement Infrastructure
APPLICANT_093–098      Certification Public Status + Publication Authorization Infrastructure
APPLICANT_099–112      Public Registry Continuity + External Verification + Trust Validation Infrastructure
APPLICANT_113–142      Public Certification Trust / Registry / API / Interface Infrastructure
```

---

# IMPORTANT CONSTITUTIONAL DISTINCTION

The Applicant Infrastructure built through APPLICANT_142 is workflow-complete for applicant lifecycle propagation, but the Organization Submission Contract must still be mapped against actual Snowflake storage destinations.

This means:

```text
Workflow infrastructure exists.
Submission field authority must be verified.
```

The purpose of this inventory is not to declare every field covered.

The purpose is to identify the actual schema layer candidates that may satisfy the Organization Submission Validation Matrix.

---

# INVENTORY STATUS DEFINITIONS

## CONFIRMED

The object name is known from generated Applicant Infrastructure or canonical GAFAIG documentation.

## TO VERIFY

The object is expected or implied but must be confirmed against Snowflake.

## GAP CANDIDATE

The expected object may not yet exist and may require corrective SQL infrastructure.

---

# SECTION 1 — CORE GOVERNANCE TABLE CANDIDATES

These tables may provide authoritative storage for applicant submission, verification, certification, and registry continuity.

| Object | Object Type | Purpose | Candidate Audit Use | Status |
|---|---|---|---|---|
| CORE.SUBMISSIONS | TABLE | Submission intake tracking | Baseline submission intake | TO VERIFY |
| CORE.APPLICATIONS | TABLE | Application lifecycle tracking | Organization profile, submitter profile, application state | TO VERIFY |
| CORE.PARTICIPANTS | TABLE | Participant / entity / person linkage | Organization identity or applicant identity linkage | TO VERIFY |
| CORE.VERIFICATION_CASES | TABLE | Verification case management | Applicant case / certification scope | TO VERIFY |
| CORE.VERIFICATION_FINDINGS | TABLE | Governance findings | Verification findings | TO VERIFY |
| CORE.VERIFICATION_EVIDENCE | TABLE | Evidence storage | Artifact / evidence inventory | TO VERIFY |
| CORE.VERIFICATION_FINDING_EVIDENCE | TABLE | Finding-to-evidence linkage | Evidence validation linkage | TO VERIFY |
| CORE.VERIFICATION_EVENTS | TABLE | Governance event tracking | Audit / lifecycle event lineage | TO VERIFY |
| CORE.CASE_SCORE_SNAPSHOTS | TABLE | Governance score snapshots | Certification scoring output | TO VERIFY |
| CORE.DECISIONS | TABLE | Deterministic governance decisions | Certification decision authority | TO VERIFY |
| CORE.REGISTRY_SNAPSHOTS | TABLE | Append-only registry publication | Public registry publication | TO VERIFY |
| CORE.REGISTRY_AI_SYSTEMS | TABLE | Public AI system registry linkage | AI system registry projection | TO VERIFY |

---

# SECTION 2 — APPLICANT FOUNDATION LAYER

| File Range | Expected Objects | Purpose | Status |
|---|---|---|---|
| APPLICANT_000 | Applicant foundation objects | Applicant infrastructure foundation | TO VERIFY |
| APPLICANT_001 | Applicant lifecycle foundation / workspace chain | Organization workspace, systems, cases, evidence, artifacts, certifications, progress | TO VERIFY |
| APPLICANT_002 | Applicant foundation continuation | Applicant foundation continuity | TO VERIFY |
| APPLICANT_003 | Applicant foundation completion | Applicant foundation freeze / completion | TO VERIFY |

Potential required audit targets:

```text
Applicant Organization Table
Applicant Workspace Table
Applicant System Table
Applicant Case Table
Applicant Evidence Table
Applicant Artifact Table
Applicant Certification Table
Applicant Progress Table
```

Current status:

```text
TO VERIFY AGAINST ACTUAL SNOWFLAKE OBJECTS
```

---

# SECTION 3 — APPLICANT PORTAL INFRASTRUCTURE

| File Range | Purpose | Audit Relevance | Status |
|---|---|---|---|
| APPLICANT_010–040 | Applicant portal visibility, navigation, rendering, layout, workspace, experience | Portal display and applicant workflow visibility | CONFIRMED AS WORKFLOW LAYER |
| APPLICANT_040_APPLICANT_PORTAL_EXPERIENCE_SURFACE.sql | Applicant portal experience surface | Applicant user-facing continuity | CONFIRMED AS WORKFLOW LAYER |

Potential audit relevance:

```text
Submitter access
Applicant visibility
Application status visibility
Portal continuity
Publication election visibility
Renewal visibility
```

Important limitation:

```text
Portal infrastructure is not necessarily field storage authority.
```

---

# SECTION 4 — APPLICANT CASE INFRASTRUCTURE

| File | Purpose | Audit Relevance | Status |
|---|---|---|---|
| APPLICANT_041_APPLICANT_CASE_WORKSPACE.sql | Applicant case workspace | Case visibility and workspace continuity | TO VERIFY |
| APPLICANT_042_APPLICANT_CASE_DETAIL_SURFACE.sql | Applicant case detail surface | Case detail projection | TO VERIFY |
| APPLICANT_043_APPLICANT_CASE_LIFECYCLE_SURFACE.sql | Applicant case lifecycle surface | Lifecycle visibility | TO VERIFY |

Known architectural constraint:

```text
Beginning with APPLICANT_044, Applicant Infrastructure must consume freeze outputs rather than deep recursive views.
```

---

# SECTION 5 — APPLICANT FREEZE-BASED VALIDATION INFRASTRUCTURE

| File Range | Purpose | Audit Relevance | Status |
|---|---|---|---|
| APPLICANT_044–092 | Applicant validation, review, certification, suspension, appeal, reinstatement infrastructure | Workflow propagation and certification state management | TO VERIFY |
| APPLICANT_044 | Applicant Submission Validation Freeze | First freeze-based validation boundary | TO VERIFY |
| APPLICANT_080–082 | Certification Suspension Notice / Execution / Completion | Suspension lifecycle | CONFIRMED GENERATED |
| APPLICANT_083–087 | Certification Appeal / Notice / Review / Decision / Completion | Appeal lifecycle | CONFIRMED GENERATED |
| APPLICANT_088–092 | Certification Reinstatement / Notice / Review / Decision / Completion | Reinstatement lifecycle | CONFIRMED GENERATED |

Audit relevance:

```text
Certification lifecycle state
Suspension state
Appeal state
Reinstatement state
Workflow continuity
```

Important limitation:

```text
These layers generally propagate state and do not necessarily collect baseline organization submission fields.
```

---

# SECTION 6 — PUBLICATION AUTHORIZATION INFRASTRUCTURE

| File | Object Pattern | Purpose | Status |
|---|---|---|---|
| APPLICANT_093 | APPLICANT_093_CERTIFICATION_PUBLIC_STATUS_ENGINE_FREEZE | Certification public status | CONFIRMED GENERATED |
| APPLICANT_094 | APPLICANT_094_PUBLICATION_AUTHORIZATION_REQUEST_ENGINE_FREEZE | Publication authorization request | CONFIRMED GENERATED |
| APPLICANT_095 | APPLICANT_095_PUBLICATION_AUTHORIZATION_CONSENT_ENGINE_FREEZE | Publication authorization consent | CONFIRMED GENERATED |
| APPLICANT_096 | APPLICANT_096_PUBLICATION_AUTHORIZATION_DECISION_ENGINE_FREEZE | Publication authorization decision | CONFIRMED GENERATED |
| APPLICANT_097 | APPLICANT_097_PUBLICATION_AUTHORIZATION_COMPLETION_ENGINE_FREEZE | Publication authorization completion | CONFIRMED GENERATED |
| APPLICANT_098 | APPLICANT_098_PUBLIC_REGISTRY_PUBLICATION_ENGINE_FREEZE | Public registry publication | CONFIRMED GENERATED |
| APPLICANT_099 | APPLICANT_099_PUBLICATION_AUTHORIZATION_REOPEN_ENGINE_FREEZE | Publication authorization reopen | CONFIRMED GENERATED |

Audit relevance:

```text
Registry Publication Consent
Public Summary Consent
Certification Mark Consent
API Publication Consent
Publication authorization lifecycle
```

Potential validation matrix linkage:

| Submission Contract Field | Candidate Layer |
|---|---|
| Registry Publication Consent | APPLICANT_094–097 |
| Public Summary Consent | APPLICANT_095–097 |
| Certification Mark Consent | Future badge consent layer or APPLICANT_095–097 |
| API Publication Consent | APPLICANT_095–097 / APPLICANT_141 |

---

# SECTION 7 — PUBLIC REGISTRY CONTINUITY INFRASTRUCTURE

| File | Object Pattern | Purpose | Status |
|---|---|---|---|
| APPLICANT_100 | APPLICANT_100_PUBLIC_REGISTRY_REVOCATION_ENGINE_FREEZE | Public registry revocation | CONFIRMED GENERATED |
| APPLICANT_101 | APPLICANT_101_PUBLIC_REGISTRY_REPUBLICATION_ENGINE_FREEZE | Public registry republication | CONFIRMED GENERATED |
| APPLICANT_102 | APPLICANT_102_PUBLIC_REGISTRY_AUDIT_ENGINE_FREEZE | Public registry audit | CONFIRMED GENERATED |
| APPLICANT_103 | APPLICANT_103_PUBLIC_REGISTRY_HISTORY_ENGINE_FREEZE | Public registry history | CONFIRMED GENERATED |
| APPLICANT_104 | APPLICANT_104_PUBLIC_REGISTRY_RETENTION_ENGINE_FREEZE | Public registry retention | CONFIRMED GENERATED |
| APPLICANT_105 | APPLICANT_105_PUBLIC_REGISTRY_ARCHIVAL_ENGINE_FREEZE | Public registry archival | CONFIRMED GENERATED |
| APPLICANT_106 | APPLICANT_106_PUBLIC_REGISTRY_RESTORATION_ENGINE_FREEZE | Public registry restoration | CONFIRMED GENERATED |
| APPLICANT_107 | APPLICANT_107_PUBLIC_REGISTRY_LIFECYCLE_AUDIT_ENGINE_FREEZE | Public registry lifecycle audit | CONFIRMED GENERATED |
| APPLICANT_108 | APPLICANT_108_PUBLIC_REGISTRY_SURVIVABILITY_ENGINE_FREEZE | Public registry survivability | CONFIRMED GENERATED |
| APPLICANT_109 | APPLICANT_109_PUBLIC_REGISTRY_PORTABILITY_ENGINE_FREEZE | Public registry portability | CONFIRMED GENERATED |
| APPLICANT_110 | APPLICANT_110_PUBLIC_REGISTRY_MIGRATION_ENGINE_FREEZE | Public registry migration | CONFIRMED GENERATED |
| APPLICANT_111 | APPLICANT_111_PUBLIC_REGISTRY_EXTERNAL_VERIFICATION_ENGINE_FREEZE | External verification | CONFIRMED GENERATED |
| APPLICANT_112 | APPLICANT_112_PUBLIC_REGISTRY_TRUST_VALIDATION_ENGINE_FREEZE | Trust validation | CONFIRMED GENERATED |

Audit relevance:

```text
Registry continuity
Publication survivability
External verification readiness
Public trust validation
```

Important limitation:

```text
These are downstream registry continuity layers, not baseline intake storage layers.
```

---

# SECTION 8 — PUBLIC TRUST SURFACE INFRASTRUCTURE

| File | Object Pattern | Purpose | Status |
|---|---|---|---|
| APPLICANT_113 | APPLICANT_113_PUBLIC_REGISTRY_TRUST_SURFACE_ENGINE_FREEZE | Public registry trust surface | CONFIRMED GENERATED |
| APPLICANT_114 | APPLICANT_114_PUBLIC_VERIFICATION_SURFACE_ENGINE_FREEZE | Public verification surface | CONFIRMED GENERATED |
| APPLICANT_115 | APPLICANT_115_PUBLIC_CERTIFICATION_LOOKUP_ENGINE_FREEZE | Public certification lookup | CONFIRMED GENERATED |
| APPLICANT_116 | APPLICANT_116_PUBLIC_CERTIFICATION_SEARCH_ENGINE_FREEZE | Public certification search | CONFIRMED GENERATED |
| APPLICANT_117 | APPLICANT_117_PUBLIC_CERTIFICATION_DISCOVERY_ENGINE_FREEZE | Public certification discovery | CONFIRMED GENERATED |
| APPLICANT_118 | APPLICANT_118_PUBLIC_CERTIFICATION_DIRECTORY_ENGINE_FREEZE | Public certification directory | CONFIRMED GENERATED |
| APPLICANT_119 | APPLICANT_119_PUBLIC_CERTIFICATION_INDEX_ENGINE_FREEZE | Public certification index | CONFIRMED GENERATED |
| APPLICANT_120 | APPLICANT_120_PUBLIC_CERTIFICATION_VERIFICATION_ENGINE_FREEZE | Public certification verification | CONFIRMED GENERATED |
| APPLICANT_121 | APPLICANT_121_PUBLIC_CERTIFICATION_VALIDATION_ENGINE_FREEZE | Public certification validation | CONFIRMED GENERATED |
| APPLICANT_122 | APPLICANT_122_PUBLIC_CERTIFICATION_TRUST_ENGINE_FREEZE | Public certification trust | CONFIRMED GENERATED |
| APPLICANT_123 | APPLICANT_123_PUBLIC_CERTIFICATION_TRUST_SURFACE_ENGINE_FREEZE | Public certification trust surface | CONFIRMED GENERATED |
| APPLICANT_124 | APPLICANT_124_PUBLIC_CERTIFICATION_AUDIT_ENGINE_FREEZE | Public certification audit | CONFIRMED GENERATED |
| APPLICANT_125 | APPLICANT_125_PUBLIC_CERTIFICATION_AUDIT_TRAIL_ENGINE_FREEZE | Public certification audit trail | CONFIRMED GENERATED |
| APPLICANT_126 | APPLICANT_126_PUBLIC_CERTIFICATION_PUBLICATION_ENGINE_FREEZE | Public certification publication | CONFIRMED GENERATED |
| APPLICANT_127 | APPLICANT_127_PUBLIC_CERTIFICATION_DISCLOSURE_ENGINE_FREEZE | Public certification disclosure | CONFIRMED GENERATED |
| APPLICANT_128 | APPLICANT_128_PUBLIC_CERTIFICATION_DISTRIBUTION_ENGINE_FREEZE | Public certification distribution | CONFIRMED GENERATED |
| APPLICANT_129 | APPLICANT_129_PUBLIC_CERTIFICATION_VISIBILITY_ENGINE_FREEZE | Public certification visibility | CONFIRMED GENERATED |

Audit relevance:

```text
Public certification display
Public trust surface
Public verification readiness
Certification visibility
```

Important limitation:

```text
These layers do not replace baseline organization/system/use-case/evidence intake storage.
```

---

# SECTION 9 — PUBLIC CERTIFICATION REGISTRY INFRASTRUCTURE

| File | Object Pattern | Purpose | Status |
|---|---|---|---|
| APPLICANT_130 | APPLICANT_130_PUBLIC_CERTIFICATION_REGISTRY_ENGINE_FREEZE | Public certification registry | CONFIRMED GENERATED |
| APPLICANT_131 | APPLICANT_131_PUBLIC_CERTIFICATION_REGISTRY_SURFACE_ENGINE_FREEZE | Public certification registry surface | CONFIRMED GENERATED |
| APPLICANT_132 | APPLICANT_132_PUBLIC_CERTIFICATION_REGISTRY_DISCOVERY_ENGINE_FREEZE | Registry discovery | CONFIRMED GENERATED |
| APPLICANT_133 | APPLICANT_133_PUBLIC_CERTIFICATION_REGISTRY_SEARCH_ENGINE_FREEZE | Registry search | CONFIRMED GENERATED |
| APPLICANT_134 | APPLICANT_134_PUBLIC_CERTIFICATION_REGISTRY_INDEX_ENGINE_FREEZE | Registry index | CONFIRMED GENERATED |
| APPLICANT_135 | APPLICANT_135_PUBLIC_CERTIFICATION_REGISTRY_LOOKUP_ENGINE_FREEZE | Registry lookup | CONFIRMED GENERATED |
| APPLICANT_136 | APPLICANT_136_PUBLIC_CERTIFICATION_REGISTRY_DIRECTORY_ENGINE_FREEZE | Registry directory | CONFIRMED GENERATED |
| APPLICANT_137 | APPLICANT_137_PUBLIC_CERTIFICATION_REGISTRY_CATALOG_ENGINE_FREEZE | Registry catalog | CONFIRMED GENERATED |
| APPLICANT_138 | APPLICANT_138_PUBLIC_CERTIFICATION_REGISTRY_NAVIGATION_ENGINE_FREEZE | Registry navigation | CONFIRMED GENERATED |
| APPLICANT_139 | APPLICANT_139_PUBLIC_CERTIFICATION_REGISTRY_ACCESS_ENGINE_FREEZE | Registry access | CONFIRMED GENERATED |
| APPLICANT_140 | APPLICANT_140_PUBLIC_CERTIFICATION_REGISTRY_PORTAL_ENGINE_FREEZE | Registry portal | CONFIRMED GENERATED |
| APPLICANT_141 | APPLICANT_141_PUBLIC_CERTIFICATION_REGISTRY_API_ENGINE_FREEZE | Registry API | CONFIRMED GENERATED |
| APPLICANT_142 | APPLICANT_142_PUBLIC_CERTIFICATION_REGISTRY_INTERFACE_ENGINE_FREEZE | Registry interface | CONFIRMED GENERATED |

Audit relevance:

```text
Public registry discoverability
Public registry API readiness
Public registry interface readiness
```

Important limitation:

```text
These layers are downstream of certification and publication authorization.
They are not primary intake field storage authority.
```

---

# SECTION 10 — ORGANIZATION SUBMISSION CONTRACT FIELD-TO-SCHEMA CANDIDATES

## Required Organization Profile Fields

| Field | Candidate Object | Candidate Column | Current Status |
|---|---|---|---|
| Organization Legal Name | CORE.APPLICATIONS / CORE.PARTICIPANTS / Applicant Organization Table | TO VERIFY | PARTIAL |
| Organization Type | CORE.APPLICATIONS / Applicant Organization Table | TO VERIFY | PARTIAL |
| Country | CORE.APPLICATIONS / CORE.PARTICIPANTS / Applicant Organization Table | TO VERIFY | PARTIAL |
| Website or Primary Domain | CORE.APPLICATIONS / Applicant Organization Table | TO VERIFY | PARTIAL |
| Organization Description | CORE.APPLICATIONS / Applicant Organization Table | TO VERIFY | PARTIAL |

## Required Submitter Profile Fields

| Field | Candidate Object | Candidate Column | Current Status |
|---|---|---|---|
| Submitter Name | CORE.APPLICATIONS / CORE.SUBMISSIONS / Applicant Submitter Table | TO VERIFY | PARTIAL |
| Submitter Role | CORE.APPLICATIONS / Applicant Submitter Table | TO VERIFY | PARTIAL |
| Submitter Email | CORE.APPLICATIONS / CORE.SUBMISSIONS / Applicant Submitter Table | TO VERIFY | PARTIAL |
| Certification Attestation | CORE.APPLICATIONS / Applicant Attestation Table | TO VERIFY | PARTIAL |

## Required AI System Inventory Fields

| Field | Candidate Object | Candidate Column | Current Status |
|---|---|---|---|
| System Name | CORE.REGISTRY_AI_SYSTEMS / Applicant System Table | TO VERIFY | PARTIAL |
| System Description | CORE.REGISTRY_AI_SYSTEMS / Applicant System Table | TO VERIFY | PARTIAL |
| System Purpose | Applicant System Table | TO VERIFY | PARTIAL |
| Deployment Status | Applicant System Table | TO VERIFY | PARTIAL |

## Required Use Case Inventory Fields

| Field | Candidate Object | Candidate Column | Current Status |
|---|---|---|---|
| Use Case Name | Applicant Use Case Table | TO VERIFY | PARTIAL |
| Use Case Description | Applicant Use Case Table | TO VERIFY | PARTIAL |

## Required Control Attestation Fields

| Field | Candidate Object | Candidate Column | Current Status |
|---|---|---|---|
| Control Name | CORE.STANDARD_CONTROLS / Applicant Control Table | TO VERIFY | PARTIAL |
| Control Status | Applicant Control Attestation Table | TO VERIFY | PARTIAL |

## Required Evidence Inventory Fields

| Field | Candidate Object | Candidate Column | Current Status |
|---|---|---|---|
| Artifact Name | CORE.VERIFICATION_EVIDENCE / Applicant Artifact Table | TO VERIFY | PARTIAL |
| Artifact Type | CORE.VERIFICATION_EVIDENCE / Applicant Artifact Table | TO VERIFY | PARTIAL |
| Artifact Upload | CORE.VERIFICATION_EVIDENCE / Applicant Artifact Table | TO VERIFY | PARTIAL |

## Required Certification Consent Fields

| Field | Candidate Object | Candidate Column | Current Status |
|---|---|---|---|
| Certification Request | Applicant Certification Request Table | TO VERIFY | PARTIAL |
| Certification Attestation | Applicant Certification Attestation Table | TO VERIFY | PARTIAL |
| Certification Agreement Acceptance | Applicant Agreement Table | TO VERIFY | PARTIAL |

## Required Publication Consent Fields

| Field | Candidate Object | Candidate Column | Current Status |
|---|---|---|---|
| Registry Publication Consent | APPLICANT_094–097 / Applicant Publication Consent Table | TO VERIFY | PARTIAL |

## Required Renewal Fields

| Field | Candidate Object | Candidate Column | Current Status |
|---|---|---|---|
| Renewal Contact Email | Applicant Renewal Table / Applicant Contact Table | TO VERIFY | PARTIAL |

---

# SECTION 11 — GAP CANDIDATE OBJECTS

The following objects may need to be created or confirmed before APPLICANT_143 resumes:

```text
CORE.APPLICANT_ORGANIZATIONS
CORE.APPLICANT_SUBMITTERS
CORE.APPLICANT_SYSTEMS
CORE.APPLICANT_MODELS
CORE.APPLICANT_USE_CASES
CORE.APPLICANT_RISK_CLASSIFICATIONS
CORE.APPLICANT_CONTROL_ATTESTATIONS
CORE.APPLICANT_POLICIES
CORE.APPLICANT_ARTIFACTS
CORE.APPLICANT_INCIDENTS
CORE.APPLICANT_TESTING_RESULTS
CORE.APPLICANT_CERTIFICATION_CONSENTS
CORE.APPLICANT_PUBLICATION_CONSENTS
CORE.APPLICANT_RENEWAL_CONTACTS
```

These names are candidate schema anchors only.

They are not declared canonical until verified or created by deterministic Snowflake SQL.

---

# SECTION 12 — NEXT REQUIRED ARTIFACT

The next required artifact is:

```text
ORGANIZATION_SUBMISSION_SCHEMA_AUDIT_QUERIES.sql
```

This query pack must inspect:

```text
GAFAIG_DB.INFORMATION_SCHEMA.TABLES
GAFAIG_DB.INFORMATION_SCHEMA.COLUMNS
```

and produce a status report for every REQUIRED Organization Submission Contract field.

Expected output columns:

```text
FIELD_GROUP
FIELD_NAME
CLASSIFICATION
CANDIDATE_TABLE
CANDIDATE_COLUMN
TABLE_EXISTS_FLAG
COLUMN_EXISTS_FLAG
STATUS
```

Allowed statuses:

```text
COVERED
PARTIAL
MISSING
```

---

# CONSTITUTIONAL FINDING

Applicant Infrastructure through APPLICANT_142 is structurally strong and workflow-complete.

However, intake-field coverage must be verified before public trust / badge / governance intelligence layers continue.

Current status:

```text
APPLICANT WORKFLOW INFRASTRUCTURE: COMPLETE THROUGH A142
ORGANIZATION SUBMISSION CONTRACT: CREATED
VALIDATION MATRIX: CREATED
APPLICANT SCHEMA INVENTORY: CREATED
SCHEMA AUDIT QUERIES: REQUIRED NEXT
APPLICANT_143+: PAUSED
```
