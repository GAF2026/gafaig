# ORGANIZATION_SUBMISSION_VALIDATION_MATRIX.md

# GAFAIG — ORGANIZATION SUBMISSION VALIDATION MATRIX

Version: 1.0

Status: CONSTITUTIONAL AUDIT MATRIX

Authority Level: Applicant Intake Validation Authority

Last Updated: 2026-06-12

---

# PURPOSE

This document maps the GAFAIG Organization Submission Contract to the required validation destinations across applicant infrastructure, Snowflake storage, verification, certification, and registry layers.

This matrix exists to prevent GAFAIG from continuing Applicant Infrastructure expansion before confirming that required organization submission data is represented by canonical intake authority.

Freeze gate:

```text
Do not continue APPLICANT_143+ until required submission fields are mapped.
```

---

# STATUS DEFINITIONS

## COVERED

The field has a known canonical destination in Snowflake and is supported by applicant workflow, verification, certification, and registry continuity.

## PARTIAL

The field is conceptually supported, but one or more required destinations are not yet confirmed.

## MISSING

The field has no confirmed canonical destination and requires new infrastructure or contract expansion.

## NOT REQUIRED

The field is intentionally excluded from GAFAIG required intake.

---

# FIELD CLASSIFICATION DEFINITIONS

## REQUIRED

Required for every applicant organization.

## OPTIONAL

Helpful when available but not required for submission.

## CONDITIONAL

Required only if the triggering condition applies.

---

# PHASE 1 — ORGANIZATION PROFILE VALIDATION MATRIX

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Organization Legal Name | REQUIRED | CORE.APPLICATIONS / Applicant Organization Table | TO VERIFY | Applicant Intake | Case Creation | Certification Attribution | Registry Attribution | PARTIAL |
| Organization Type | REQUIRED | CORE.APPLICATIONS / Applicant Organization Table | TO VERIFY | Applicant Intake | Scope Validation | Certification Scope | Registry Metadata | PARTIAL |
| Country | REQUIRED | CORE.APPLICATIONS / Applicant Organization Table | TO VERIFY | Applicant Intake | Jurisdiction Context | Certification Context | Public Registry Context | PARTIAL |
| Website or Primary Domain | REQUIRED | CORE.APPLICATIONS / Applicant Organization Table | TO VERIFY | Applicant Intake | Identity Validation | Certification Attribution | Registry Display | PARTIAL |
| Organization Description | REQUIRED | CORE.APPLICATIONS / Applicant Organization Table | TO VERIFY | Applicant Intake | Scope Context | Certification Context | Public Summary Context | PARTIAL |
| Organization Display Name | OPTIONAL | Applicant Organization Table | TO VERIFY | Applicant Intake | Optional | Optional | Registry Display | PARTIAL |
| State / Province | OPTIONAL | Applicant Organization Table | TO VERIFY | Applicant Intake | Optional | Optional | Registry Context | PARTIAL |
| City | OPTIONAL | Applicant Organization Table | TO VERIFY | Applicant Intake | Optional | Optional | Registry Context | PARTIAL |
| Industry | OPTIONAL | Applicant Organization Table | TO VERIFY | Applicant Intake | Optional | Optional | Registry Filter | PARTIAL |
| Government Entity Indicator | OPTIONAL | Applicant Organization Table | TO VERIFY | Applicant Intake | Scope Context | Certification Context | Registry Filter | PARTIAL |
| Academic Institution Indicator | OPTIONAL | Applicant Organization Table | TO VERIFY | Applicant Intake | Scope Context | Certification Context | Registry Filter | PARTIAL |
| Nonprofit Indicator | OPTIONAL | Applicant Organization Table | TO VERIFY | Applicant Intake | Scope Context | Certification Context | Registry Filter | PARTIAL |
| Critical Infrastructure Indicator | OPTIONAL | Applicant Organization Table | TO VERIFY | Applicant Intake | Risk Context | Certification Context | Registry Filter | PARTIAL |

## PROHIBITED AS REQUIRED

| Field | Classification | Status | Reason |
|---|---|---|---|
| Organization Registration Number | NOT REQUIRED | EXCLUDED | Too invasive for baseline GAFAIG intake |
| Tax Identifier | NOT REQUIRED | EXCLUDED | Too invasive for baseline GAFAIG intake |
| Employee Count | NOT REQUIRED | EXCLUDED | Not required for governance verification |
| Annual Revenue / Revenue Band | NOT REQUIRED | EXCLUDED | Not required for governance verification |
| Ownership Structure | NOT REQUIRED | EXCLUDED | Not required for baseline certification |
| Subsidiary Indicator | NOT REQUIRED | EXCLUDED | Not required for baseline certification |

---

# PHASE 2 — SUBMITTER PROFILE VALIDATION MATRIX

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Submitter Name | REQUIRED | CORE.APPLICATIONS / Applicant Submitter Table | TO VERIFY | Applicant Intake | Submission Accountability | Certification Attestation | Not Public | PARTIAL |
| Submitter Role | REQUIRED | CORE.APPLICATIONS / Applicant Submitter Table | TO VERIFY | Applicant Intake | Submission Accountability | Certification Attestation | Not Public | PARTIAL |
| Submitter Email | REQUIRED | CORE.APPLICATIONS / Applicant Submitter Table | TO VERIFY | Applicant Intake | Communication | Renewal / Notice | Not Public | PARTIAL |
| Certification Attestation | REQUIRED | CORE.APPLICATIONS / Attestation Table | TO VERIFY | Applicant Intake | Submission Authenticity | Certification Authority | Not Public | PARTIAL |
| Secondary Contact Email | OPTIONAL | Applicant Contact Table | TO VERIFY | Applicant Portal | Communication | Renewal / Notice | Not Public | PARTIAL |

## PROHIBITED AS REQUIRED

| Field | Classification | Status | Reason |
|---|---|---|---|
| CEO Name | NOT REQUIRED | EXCLUDED | Executive roster is not required |
| Governance Officer Name | NOT REQUIRED | EXCLUDED | Too invasive for baseline intake |
| Legal Officer Name | NOT REQUIRED | EXCLUDED | Too invasive for baseline intake |
| Security Officer Name | NOT REQUIRED | EXCLUDED | Too invasive for baseline intake |
| Compliance Officer Name | NOT REQUIRED | EXCLUDED | Too invasive for baseline intake |
| Phone Number | NOT REQUIRED | EXCLUDED | Email is sufficient for baseline intake |

---

# PHASE 3 — AI SYSTEM INVENTORY VALIDATION MATRIX

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| System Name | REQUIRED | CORE.REGISTRY_AI_SYSTEMS / Applicant System Table | TO VERIFY | System Inventory | System Scope Validation | Certification Scope | Public System Registry | PARTIAL |
| System Description | REQUIRED | CORE.REGISTRY_AI_SYSTEMS / Applicant System Table | TO VERIFY | System Inventory | System Scope Validation | Certification Scope | Public System Registry | PARTIAL |
| System Purpose | REQUIRED | Applicant System Table | TO VERIFY | System Inventory | System Scope Validation | Certification Scope | Registry Context | PARTIAL |
| Deployment Status | REQUIRED | Applicant System Table | TO VERIFY | System Inventory | Deployment Validation | Certification Scope | Registry Context | PARTIAL |
| Lifecycle Status | OPTIONAL | Applicant System Table | TO VERIFY | System Inventory | Lifecycle Context | Certification Context | Registry Context | PARTIAL |
| System Category | OPTIONAL | Applicant System Table | TO VERIFY | System Inventory | Scope Context | Certification Context | Registry Filter | PARTIAL |
| System Criticality | OPTIONAL | Applicant System Table | TO VERIFY | System Inventory | Risk Context | Certification Context | Registry Filter | PARTIAL |
| Human Oversight Classification | OPTIONAL | Applicant System Table | TO VERIFY | System Inventory | Oversight Validation | Certification Context | Registry Context | PARTIAL |

## PROHIBITED AS REQUIRED

| Field | Classification | Status | Reason |
|---|---|---|---|
| Business Owner Name | NOT REQUIRED | EXCLUDED | Internal personnel data is not required |
| Technical Owner Name | NOT REQUIRED | EXCLUDED | Internal personnel data is not required |

---

# PHASE 4 — MODEL INVENTORY VALIDATION MATRIX

Trigger Condition:

```text
Required only if the certification scope includes one or more AI models.
```

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Model Name | CONDITIONAL | Applicant Model Table | TO VERIFY | Model Inventory | Model Scope Validation | Certification Scope | Optional Registry Context | PARTIAL |
| Model Provider | CONDITIONAL | Applicant Model Table | TO VERIFY | Model Inventory | Model Source Context | Certification Scope | Optional Registry Context | PARTIAL |
| Model Purpose | CONDITIONAL | Applicant Model Table | TO VERIFY | Model Inventory | Model Use Validation | Certification Scope | Optional Registry Context | PARTIAL |
| Model Version | OPTIONAL | Applicant Model Table | TO VERIFY | Model Inventory | Optional | Optional | Optional | PARTIAL |
| Model Family | OPTIONAL | Applicant Model Table | TO VERIFY | Model Inventory | Optional | Optional | Optional | PARTIAL |
| Model Risk Category | OPTIONAL | Applicant Model Table | TO VERIFY | Model Inventory | Risk Context | Certification Context | Optional | PARTIAL |
| Training Description | OPTIONAL | Applicant Model Table | TO VERIFY | Model Inventory | Optional Evidence Context | Optional | Not Public | PARTIAL |
| Open Source Indicator | OPTIONAL | Applicant Model Table | TO VERIFY | Model Inventory | Optional | Optional | Optional | PARTIAL |
| Foundation Model Indicator | OPTIONAL | Applicant Model Table | TO VERIFY | Model Inventory | Optional | Optional | Optional | PARTIAL |

---

# PHASE 5 — USE CASE INVENTORY VALIDATION MATRIX

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Use Case Name | REQUIRED | Applicant Use Case Table | TO VERIFY | Use Case Inventory | Scope Validation | Certification Scope | Optional Registry Context | PARTIAL |
| Use Case Description | REQUIRED | Applicant Use Case Table | TO VERIFY | Use Case Inventory | Scope Validation | Certification Scope | Optional Registry Context | PARTIAL |
| Business Function | OPTIONAL | Applicant Use Case Table | TO VERIFY | Use Case Inventory | Optional | Optional | Optional | PARTIAL |
| Stakeholder Groups | OPTIONAL | Applicant Use Case Table | TO VERIFY | Use Case Inventory | Optional Risk Context | Optional | Optional | PARTIAL |
| Public Impact Indicator | OPTIONAL | Applicant Use Case Table | TO VERIFY | Use Case Inventory | Risk Context | Certification Context | Registry Context | PARTIAL |
| Safety Impact Indicator | OPTIONAL | Applicant Use Case Table | TO VERIFY | Use Case Inventory | Risk Context | Certification Context | Registry Context | PARTIAL |
| High Impact Indicator | OPTIONAL | Applicant Use Case Table | TO VERIFY | Use Case Inventory | Risk Context | Certification Context | Registry Context | PARTIAL |
| Human Subject Impact Indicator | OPTIONAL | Applicant Use Case Table | TO VERIFY | Use Case Inventory | Risk Context | Certification Context | Registry Context | PARTIAL |

---

# PHASE 6 — RISK CLASSIFICATION VALIDATION MATRIX

Trigger Condition:

```text
Required only when humans, decisions, or public outcomes are affected.
```

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Risk Category | CONDITIONAL | Applicant Risk Table | TO VERIFY | Risk Inventory | Risk Validation | Certification Context | Optional Registry Context | PARTIAL |
| Risk Rating | CONDITIONAL | Applicant Risk Table | TO VERIFY | Risk Inventory | Risk Validation | Certification Context | Optional Registry Context | PARTIAL |
| Risk Methodology | OPTIONAL | Applicant Risk Table | TO VERIFY | Risk Inventory | Optional | Optional | Not Public | PARTIAL |
| Impact Rating | OPTIONAL | Applicant Risk Table | TO VERIFY | Risk Inventory | Optional | Optional | Optional | PARTIAL |
| Likelihood Rating | OPTIONAL | Applicant Risk Table | TO VERIFY | Risk Inventory | Optional | Optional | Optional | PARTIAL |
| Residual Risk Rating | OPTIONAL | Applicant Risk Table | TO VERIFY | Risk Inventory | Optional | Optional | Optional | PARTIAL |

---

# PHASE 7 — CONTROL ATTESTATION VALIDATION MATRIX

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Control Name | REQUIRED | Applicant Control Table / CORE.STANDARD_CONTROLS | TO VERIFY | Control Attestation | Control Validation | Certification Scoring | Not Public | PARTIAL |
| Control Status | REQUIRED | Applicant Control Attestation Table | TO VERIFY | Control Attestation | Control Validation | Certification Scoring | Not Public | PARTIAL |
| Validation Frequency | OPTIONAL | Applicant Control Attestation Table | TO VERIFY | Control Attestation | Optional | Optional | Not Public | PARTIAL |
| Control Effectiveness Rating | OPTIONAL | Applicant Control Attestation Table | TO VERIFY | Control Attestation | Optional | Optional | Not Public | PARTIAL |

---

# PHASE 8 — POLICY INVENTORY VALIDATION MATRIX

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Policy Name | OPTIONAL | Applicant Policy Table / Artifact Repository | TO VERIFY | Policy Inventory | Evidence Review | Certification Evidence | Not Public | PARTIAL |
| Policy Version | OPTIONAL | Applicant Policy Table / Artifact Repository | TO VERIFY | Policy Inventory | Evidence Review | Certification Evidence | Not Public | PARTIAL |
| Effective Date | OPTIONAL | Applicant Policy Table / Artifact Repository | TO VERIFY | Policy Inventory | Evidence Review | Certification Evidence | Not Public | PARTIAL |

---

# PHASE 9 — EVIDENCE INVENTORY VALIDATION MATRIX

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Artifact Name | REQUIRED | CORE.VERIFICATION_EVIDENCE / Applicant Artifact Table | TO VERIFY | Evidence Upload | Evidence Validation | Certification Evidence | Not Public | PARTIAL |
| Artifact Type | REQUIRED | CORE.VERIFICATION_EVIDENCE / Applicant Artifact Table | TO VERIFY | Evidence Upload | Evidence Validation | Certification Evidence | Not Public | PARTIAL |
| Artifact Upload | REQUIRED | CORE.VERIFICATION_EVIDENCE / Applicant Artifact Table | TO VERIFY | Evidence Upload | Evidence Validation | Certification Evidence | Not Public | PARTIAL |
| Artifact Version | OPTIONAL | Applicant Artifact Version Table | TO VERIFY | Evidence Upload | Evidence Validation | Certification Evidence | Not Public | PARTIAL |
| Artifact Classification | OPTIONAL | Applicant Artifact Table | TO VERIFY | Evidence Upload | Access Control | Certification Evidence | Not Public | PARTIAL |
| Artifact Expiration Date | OPTIONAL | Applicant Artifact Table | TO VERIFY | Evidence Upload | Evidence Freshness | Certification Evidence | Not Public | PARTIAL |

---

# PHASE 10 — INCIDENT REPORTING VALIDATION MATRIX

Trigger Condition:

```text
Required only when relevant AI incidents exist.
```

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Incident Category | CONDITIONAL | Applicant Incident Table | TO VERIFY | Incident Reporting | Incident Review | Certification Context | Not Public by Default | PARTIAL |
| Incident Date | CONDITIONAL | Applicant Incident Table | TO VERIFY | Incident Reporting | Incident Review | Certification Context | Not Public by Default | PARTIAL |
| Incident Description | CONDITIONAL | Applicant Incident Table | TO VERIFY | Incident Reporting | Incident Review | Certification Context | Not Public by Default | PARTIAL |
| Incident Severity | OPTIONAL | Applicant Incident Table | TO VERIFY | Incident Reporting | Optional | Optional | Not Public by Default | PARTIAL |
| Corrective Action | OPTIONAL | Applicant Incident Table | TO VERIFY | Incident Reporting | Optional | Certification Context | Not Public by Default | PARTIAL |
| Closure Status | OPTIONAL | Applicant Incident Table | TO VERIFY | Incident Reporting | Optional | Certification Context | Not Public by Default | PARTIAL |

---

# PHASE 11 — TESTING VALIDATION MATRIX

Trigger Condition:

```text
Required only when testing exists.
```

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Test Name | CONDITIONAL | Applicant Testing Table / Artifact Repository | TO VERIFY | Testing Inventory | Evidence Review | Certification Evidence | Not Public | PARTIAL |
| Test Result | CONDITIONAL | Applicant Testing Table / Artifact Repository | TO VERIFY | Testing Inventory | Evidence Review | Certification Evidence | Not Public | PARTIAL |
| Testing Organization | OPTIONAL | Applicant Testing Table / Artifact Repository | TO VERIFY | Testing Inventory | Optional | Optional | Not Public | PARTIAL |
| Remediation Summary | OPTIONAL | Applicant Testing Table / Artifact Repository | TO VERIFY | Testing Inventory | Optional | Certification Context | Not Public | PARTIAL |
| Retest Date | OPTIONAL | Applicant Testing Table / Artifact Repository | TO VERIFY | Testing Inventory | Optional | Certification Context | Not Public | PARTIAL |

---

# PHASE 12 — CERTIFICATION CONSENT VALIDATION MATRIX

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Certification Request | REQUIRED | Applicant Certification Request Table | TO VERIFY | Certification Intake | Request Validation | Certification Workflow | Not Public | PARTIAL |
| Certification Attestation | REQUIRED | Applicant Certification Attestation Table | TO VERIFY | Certification Intake | Attestation Validation | Certification Workflow | Not Public | PARTIAL |
| Certification Agreement Acceptance | REQUIRED | Applicant Agreement Table | TO VERIFY | Certification Intake | Agreement Validation | Certification Workflow | Not Public | PARTIAL |

---

# PHASE 13 — PUBLICATION CONSENT VALIDATION MATRIX

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Registry Publication Consent | REQUIRED | Applicant Publication Consent Table / A093–A098 Freeze Chain | TO VERIFY | Publication Consent | Consent Validation | Certification Publication | Registry Publication | PARTIAL |
| Public Summary Consent | OPTIONAL | Applicant Publication Consent Table | TO VERIFY | Publication Consent | Optional | Optional | Registry Summary | PARTIAL |
| Certification Mark Consent | OPTIONAL | Applicant Publication Consent Table | TO VERIFY | Publication Consent | Optional | Optional | Certification Badge | PARTIAL |
| API Publication Consent | OPTIONAL | Applicant Publication Consent Table | TO VERIFY | Publication Consent | Optional | Optional | Registry API | PARTIAL |

---

# PHASE 14 — RENEWAL VALIDATION MATRIX

| Field | Classification | Snowflake Table | Snowflake Column | Applicant Layer | Verification Layer | Certification Layer | Registry Layer | Status |
|---|---|---|---|---|---|---|---|---|
| Renewal Contact Email | REQUIRED | Applicant Renewal Table / Contact Table | TO VERIFY | Renewal Intake | Renewal Communication | Renewal Workflow | Not Public | PARTIAL |
| Renewal Frequency | OPTIONAL | Applicant Renewal Table | TO VERIFY | Renewal Intake | Optional | Renewal Workflow | Registry Continuity | PARTIAL |
| Change Reporting Contact | OPTIONAL | Applicant Renewal Table / Contact Table | TO VERIFY | Renewal Intake | Optional | Change Reporting | Not Public | PARTIAL |

---

# CONSTITUTIONAL AUDIT FINDINGS

## FINDING 1 — WORKFLOW INFRASTRUCTURE EXISTS

GAFAIG Applicant Infrastructure has extensive workflow infrastructure through APPLICANT_142.

Status:

```text
COVERED FOR WORKFLOW
```

## FINDING 2 — INTAKE CONTRACT IS NOT YET FULLY MAPPED

The Organization Submission Contract has not yet been fully mapped to actual Snowflake columns.

Status:

```text
PARTIAL
```

## FINDING 3 — REQUIRED FIELD DESTINATIONS MUST BE VERIFIED

Before APPLICANT_143+, every REQUIRED field must be confirmed as:

```text
TABLE EXISTS
COLUMN EXISTS
WORKFLOW EXISTS
VERIFICATION DESTINATION EXISTS
CERTIFICATION DESTINATION EXISTS
REGISTRY DESTINATION EXISTS WHERE APPLICABLE
```

Status:

```text
OPEN
```

## FINDING 4 — OPTIONAL / CONDITIONAL FIELD FLEXIBILITY IS PRESERVED

The matrix protects small organizations by allowing many fields to remain optional or conditional.

Status:

```text
PASS
```

---

# FREEZE GATE

Applicant Infrastructure may resume with APPLICANT_143 only after:

```text
All REQUIRED fields are either COVERED or assigned to a corrective SQL file.
```

Optional and conditional fields may remain PARTIAL if extensibility exists.

---

# NEXT REQUIRED ACTION

Generate a Snowflake audit query pack:

```text
ORGANIZATION_SUBMISSION_SCHEMA_AUDIT_QUERIES.sql
```

Purpose:

```text
Query INFORMATION_SCHEMA.COLUMNS to verify table and column existence for all required fields.
```

This query pack should produce:

```text
REQUIRED_FIELD
EXPECTED_TABLE
EXPECTED_COLUMN
EXISTS_FLAG
STATUS
```

and become the execution proof for this validation matrix.
