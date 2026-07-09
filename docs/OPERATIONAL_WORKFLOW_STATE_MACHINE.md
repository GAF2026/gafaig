# OPERATIONAL_WORKFLOW_STATE_MACHINE.md

Last Updated: 2026-06-27

# PURPOSE

This document defines the canonical Operational Workflow State Machine for the Global Authority for AI Governance (GAFAIG).

The Operational Workflow State Machine defines how operational cases move through human workflow stages after application submission while preserving the constitutional governance model, deterministic Snowflake authority, and human governance supremacy.

This document is subordinate to:

- Constitutional governance authority
- Governance execution authority
- Applicant Lifecycle authority
- Repository Maturity authority
- OPERATIONAL_WORKFLOW_ARCHITECTURE.md

This document does not create governance authority.

This document does not create findings authority.

This document does not create scoring authority.

This document does not create decision authority.

This document does not create certification authority.

This document does not create publication authority.

This document does not create registry authority.

Snowflake remains the source of truth.

Human governance authority remains supreme.

---

# ARCHITECTURAL POSITION

The Operational Workflow State Machine belongs to the Operational Workflow Layer.

The Operational Workflow Layer follows the Repository Maturity Layer.

The Repository Interaction Layer remains deferred until after the Operational Workflow Layer.

Platform sequence:

1. Constitutional Architecture
2. Governance Architecture
3. Applicant Lifecycle Architecture
4. Repository Maturity Layer
5. Operational Workflow Architecture
6. Operational Workflow State Machine
7. Operational Workflow Layer Implementation
8. Repository Interaction Layer
9. Advanced Operational Automation

---

# STATE MACHINE PRINCIPLE

The state machine exists to answer:

What should this user do next?

It does not ask:

Which repository should this user inspect first?

Repositories provide operational data.

Workflow provides operational direction.

Every case must be able to expose:

- Current Stage
- Current Owner
- Waiting On
- Next Required Action
- Blocking Items
- Completion Condition
- Allowed Transitions
- Authority Boundary

---

# STATE MACHINE AUTHORITY BOUNDARY

Operational workflow states are operational guidance states.

They are not governance findings.

They are not governance scores.

They are not governance decisions.

They are not certification determinations.

They are not publication determinations.

They are not registry determinations.

Operational workflow states may display, summarize, or route existing Snowflake-originated case and repository state.

Operational workflow states must not recompute governance outcomes.

Operational workflow states must not override governance decisions.

Operational workflow states must not alter constitutional execution.

Operational workflow states must fail closed when required source data is unavailable.

---

# CANONICAL STATE ATTRIBUTES

Each workflow state SHALL be defined using the following attributes:

- State
- Canonical Code
- Primary Owner
- Visible to Applicant
- Visible to GAFAIG Operations Reviewer
- Visible to Governance Reviewer
- Visible to Certification Authority
- Visible to Platform Administrator
- Entry Condition
- Exit Condition
- Next Required Action
- Waiting On
- Blocking Conditions
- Allowed Transitions
- Snowflake Source
- Repository Support
- Authority Boundary

---

# PARTICIPANT OWNERSHIP MODEL

## Applicant

The Applicant owns actions requiring submission, upload, response, remediation, renewal materials, appeal materials, or other applicant-originated operational content.

## GAFAIG Operations Reviewer

The GAFAIG Operations Reviewer owns operational intake, repository review, information request preparation, deficiency preparation, remediation review, and operational routing.

## Governance Reviewer

The Governance Reviewer owns governance review actions that are constitutionally authorized and human-controlled.

## Certification Authority

The Certification Authority owns certification issuance operations after required governance authority exists.

## Platform Administrator

The Platform Administrator owns operational monitoring, routing support, access support, exception handling, and platform administration.

---

# CANONICAL WORKFLOW STATES

## STATE 1 — APPLICATION SUBMITTED

Canonical Code:

APPLICATION_SUBMITTED

Primary Owner:

Applicant / Platform

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless routed

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

An applicant submission exists in the Applicant Lifecycle workflow and is visible through Snowflake-backed applicant or administrative views.

Exit Condition:

The submission has been accepted for intake review.

Next Required Action:

GAFAIG Operations Reviewer reviews the submitted application record for intake completeness.

Waiting On:

GAFAIG Operations Reviewer

Blocking Conditions:

- Missing application record
- Missing organization context
- Applicant session cannot be mapped to organization
- Snowflake query unavailable

Allowed Transitions:

- INTAKE_REVIEW
- APPLICATION_INCOMPLETE
- APPLICATION_HOLD

Snowflake Source:

- GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS
- Applicant lifecycle submission records

Repository Support:

- Cases Repository
- Dashboard
- Progress Repository

Authority Boundary:

This state confirms operational submission visibility only. It does not validate governance eligibility, certification readiness, or registry publication.

---

## STATE 2 — APPLICATION INCOMPLETE

Canonical Code:

APPLICATION_INCOMPLETE

Primary Owner:

Applicant

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

Initial intake identifies missing applicant submission information.

Exit Condition:

Applicant supplies required missing information or the case is administratively held.

Next Required Action:

Applicant supplies missing application information.

Waiting On:

Applicant

Blocking Conditions:

- Required applicant information missing
- Applicant contact unavailable
- Organization identity unresolved

Allowed Transitions:

- APPLICATION_SUBMITTED
- INTAKE_REVIEW
- APPLICATION_HOLD
- CASE_CLOSED

Snowflake Source:

- Applicant lifecycle submission records
- Information request records if available
- GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS

Repository Support:

- Information Requests Repository
- Requests Repository
- Cases Repository

Authority Boundary:

This state is operational. It does not constitute deficiency issuance, governance rejection, or certification denial.

---

## STATE 3 — APPLICATION HOLD

Canonical Code:

APPLICATION_HOLD

Primary Owner:

GAFAIG Operations Reviewer / Platform Administrator

Visible to Applicant:

Yes, if applicant-facing hold notice is authorized

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless routed

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

The case cannot proceed due to operational, access, identity, completeness, or administrative conditions.

Exit Condition:

Hold condition is resolved or case is closed.

Next Required Action:

Responsible GAFAIG operator resolves the blocking condition or requests applicant action.

Waiting On:

GAFAIG Operations Reviewer, Platform Administrator, or Applicant depending on blocking condition

Blocking Conditions:

- Organization mapping issue
- Applicant authentication issue
- Missing submission dependency
- Administrative exception
- Platform support issue

Allowed Transitions:

- APPLICATION_SUBMITTED
- INTAKE_REVIEW
- APPLICATION_INCOMPLETE
- CASE_CLOSED

Snowflake Source:

- Applicant lifecycle records
- Operational support records when implemented
- GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS

Repository Support:

- Cases Repository
- Dashboard
- Progress Repository

Authority Boundary:

Hold status is operational only. It does not alter governance authority or certification eligibility.

---

## STATE 4 — INTAKE REVIEW

Canonical Code:

INTAKE_REVIEW

Primary Owner:

GAFAIG Operations Reviewer

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless escalated

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

Application submission exists and is ready for operational intake review.

Exit Condition:

Intake review completes and the case is ready for evidence review or information request.

Next Required Action:

GAFAIG Operations Reviewer reviews application completeness, organization context, and intake readiness.

Waiting On:

GAFAIG Operations Reviewer

Blocking Conditions:

- Unresolved applicant identity
- Unresolved organization context
- Missing intake data
- Unavailable Snowflake source data

Allowed Transitions:

- EVIDENCE_REVIEW
- INFORMATION_REQUEST
- APPLICATION_INCOMPLETE
- APPLICATION_HOLD
- CASE_CLOSED

Snowflake Source:

- GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS
- Applicant lifecycle records

Repository Support:

- Cases Repository
- Dashboard
- Progress Repository

Authority Boundary:

Intake review is operational. It does not create governance findings, scoring, decisions, or certification outcomes.

---

## STATE 5 — EVIDENCE REVIEW

Canonical Code:

EVIDENCE_REVIEW

Primary Owner:

GAFAIG Operations Reviewer

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless routed

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

Case has passed intake review and evidence repository visibility is available.

Exit Condition:

Evidence is accepted for validation, additional information is requested, or deficiency is identified.

Next Required Action:

GAFAIG Operations Reviewer reviews available evidence and determines whether additional evidence, information, or remediation is needed.

Waiting On:

GAFAIG Operations Reviewer

Blocking Conditions:

- No evidence available
- Evidence unavailable in Snowflake
- Evidence cannot be associated with case
- Required evidence category missing

Allowed Transitions:

- INFORMATION_REQUEST
- APPLICANT_RESPONSE
- EVIDENCE_VALIDATION
- DEFICIENCY_IDENTIFIED
- GOVERNANCE_REVIEW
- APPLICATION_HOLD

Snowflake Source:

- GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
- GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS
- Evidence repository records

Repository Support:

- Evidence Repository
- Artifact Repository
- Requests Repository
- Progress Repository

Authority Boundary:

Evidence review is operational review. It does not create governance findings or final governance decisions.

---

## STATE 6 — INFORMATION REQUEST

Canonical Code:

INFORMATION_REQUEST

Primary Owner:

GAFAIG Operations Reviewer

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless escalated

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

GAFAIG requires additional applicant information to continue operational review.

Exit Condition:

Applicant response is submitted or request is withdrawn/closed.

Next Required Action:

Applicant responds to the information request.

Waiting On:

Applicant

Blocking Conditions:

- Request not visible to applicant
- Applicant response missing
- Due date expired
- Request cannot be associated with case

Allowed Transitions:

- APPLICANT_RESPONSE
- APPLICATION_HOLD
- CASE_CLOSED

Snowflake Source:

- Applicant information request records
- GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS
- GAFAIG_DB.CORE.VERIFICATION_EVIDENCE where request responses are persisted

Repository Support:

- Information Requests Repository
- Requests Repository
- Evidence Repository

Authority Boundary:

Information requests are operational. They do not constitute deficiency, denial, certification decision, or governance finding unless later used by authorized governance processes.

---

## STATE 7 — APPLICANT RESPONSE

Canonical Code:

APPLICANT_RESPONSE

Primary Owner:

Applicant

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless routed

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

Applicant has an open information request, evidence request, or response requirement.

Exit Condition:

Applicant response is submitted and visible to GAFAIG Operations Reviewer.

Next Required Action:

GAFAIG Operations Reviewer reviews the applicant response.

Waiting On:

GAFAIG Operations Reviewer after response submission; Applicant before submission

Blocking Conditions:

- Response not submitted
- Response not associated with case
- Response persistence failed
- Response file or record unavailable

Allowed Transitions:

- EVIDENCE_VALIDATION
- INFORMATION_REQUEST
- DEFICIENCY_IDENTIFIED
- REMEDIATION_REQUIRED
- GOVERNANCE_REVIEW
- APPLICATION_HOLD

Snowflake Source:

- GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
- Request response records
- Applicant lifecycle response records

Repository Support:

- Requests Repository
- Information Requests Repository
- Evidence Repository
- Artifact Repository

Authority Boundary:

Applicant response is operational input. It does not itself determine governance outcome, certification status, or registry publication.

---

## STATE 8 — EVIDENCE VALIDATION

Canonical Code:

EVIDENCE_VALIDATION

Primary Owner:

GAFAIG Operations Reviewer

Visible to Applicant:

Yes, as status visibility

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless routed

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

Evidence or applicant response has been submitted and is ready for operational validation.

Exit Condition:

Evidence is accepted for governance review, more information is requested, or deficiency is identified.

Next Required Action:

GAFAIG Operations Reviewer validates evidence completeness, case association, and operational usability.

Waiting On:

GAFAIG Operations Reviewer

Blocking Conditions:

- Evidence incomplete
- Evidence cannot be opened or inspected
- Evidence cannot be associated with case
- Evidence conflicts with required submission category

Allowed Transitions:

- INFORMATION_REQUEST
- DEFICIENCY_IDENTIFIED
- REMEDIATION_REQUIRED
- GOVERNANCE_REVIEW
- APPLICATION_HOLD

Snowflake Source:

- GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
- Evidence repository records
- Artifact repository records

Repository Support:

- Evidence Repository
- Artifact Repository
- Progress Repository
- Review Status

Authority Boundary:

Evidence validation is operational validation. It does not create constitutional findings, scoring, decision, certification, or publication authority.

---

## STATE 9 — DEFICIENCY IDENTIFIED

Canonical Code:

DEFICIENCY_IDENTIFIED

Primary Owner:

GAFAIG Operations Reviewer

Visible to Applicant:

Yes, when applicant action is required

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless escalated

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

Operational review identifies a deficiency requiring applicant remediation.

Exit Condition:

Deficiency is issued to applicant, remediated, withdrawn, or case is closed.

Next Required Action:

Applicant reviews deficiency and prepares remediation.

Waiting On:

Applicant

Blocking Conditions:

- Deficiency record missing
- Deficiency not visible to applicant
- Deficiency lacks required remediation guidance
- Due date or response requirements missing

Allowed Transitions:

- REMEDIATION_REQUIRED
- REMEDIATION_SUBMITTED
- INFORMATION_REQUEST
- APPLICATION_HOLD
- CASE_CLOSED

Snowflake Source:

- Deficiency records
- Applicant lifecycle deficiency records
- GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS
- GAFAIG_DB.CORE.VERIFICATION_EVIDENCE where applicable

Repository Support:

- Deficiency Repository
- Remediation Repository
- Requests Repository
- Progress Repository

Authority Boundary:

Operational deficiency visibility does not itself create governance denial or certification rejection. Governance authority remains separate.

---

## STATE 10 — REMEDIATION REQUIRED

Canonical Code:

REMEDIATION_REQUIRED

Primary Owner:

Applicant

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless routed

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

A deficiency or remediation requirement exists and requires applicant action.

Exit Condition:

Applicant submits remediation or the case is closed/held.

Next Required Action:

Applicant submits remediation package.

Waiting On:

Applicant

Blocking Conditions:

- Remediation materials missing
- Applicant cannot access remediation requirement
- Deficiency linkage missing
- Remediation deadline expired

Allowed Transitions:

- REMEDIATION_SUBMITTED
- INFORMATION_REQUEST
- APPLICATION_HOLD
- CASE_CLOSED

Snowflake Source:

- Deficiency records
- Remediation records
- GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
- Applicant lifecycle remediation records

Repository Support:

- Deficiency Repository
- Remediation Repository
- Evidence Repository
- Artifact Repository

Authority Boundary:

Remediation requirement is operational. It does not determine governance outcome or certification status.

---

## STATE 11 — REMEDIATION SUBMITTED

Canonical Code:

REMEDIATION_SUBMITTED

Primary Owner:

Applicant / GAFAIG Operations Reviewer

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless routed

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

Applicant submits remediation package or remediation evidence.

Exit Condition:

GAFAIG Operations Reviewer accepts, rejects operationally, requests further information, or routes to governance review.

Next Required Action:

GAFAIG Operations Reviewer reviews submitted remediation.

Waiting On:

GAFAIG Operations Reviewer

Blocking Conditions:

- Remediation record missing
- Remediation not linked to deficiency
- Evidence inaccessible
- Submission incomplete

Allowed Transitions:

- REMEDIATION_REVIEW
- INFORMATION_REQUEST
- REMEDIATION_REQUIRED
- GOVERNANCE_REVIEW
- APPLICATION_HOLD

Snowflake Source:

- GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
- Remediation repository records
- Applicant lifecycle remediation records

Repository Support:

- Remediation Repository
- Deficiency Repository
- Evidence Repository
- Artifact Repository
- Review Status

Authority Boundary:

Submission of remediation does not determine acceptance or certification. It creates operational material for review only.

---

## STATE 12 — REMEDIATION REVIEW

Canonical Code:

REMEDIATION_REVIEW

Primary Owner:

GAFAIG Operations Reviewer

Visible to Applicant:

Yes, as review status

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless routed

Visible to Certification Authority:

No

Visible to Platform Administrator:

Yes

Entry Condition:

Remediation has been submitted and is ready for operational review.

Exit Condition:

Remediation is accepted for governance review, returned for further remediation, or case is held/closed.

Next Required Action:

GAFAIG Operations Reviewer reviews remediation package.

Waiting On:

GAFAIG Operations Reviewer

Blocking Conditions:

- Remediation incomplete
- Deficiency linkage unavailable
- Evidence unavailable
- Reviewer cannot validate operational completeness

Allowed Transitions:

- REMEDIATION_REQUIRED
- INFORMATION_REQUEST
- GOVERNANCE_REVIEW
- APPLICATION_HOLD
- CASE_CLOSED

Snowflake Source:

- Remediation repository records
- Deficiency repository records
- GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
- GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS

Repository Support:

- Remediation Repository
- Deficiency Repository
- Review Status
- Progress Repository

Authority Boundary:

Remediation review is operational. It does not create governance decision authority.

---

## STATE 13 — GOVERNANCE REVIEW

Canonical Code:

GOVERNANCE_REVIEW

Primary Owner:

Governance Reviewer

Visible to Applicant:

Yes, as status visibility only

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

No, unless governance review has advanced

Visible to Platform Administrator:

Yes

Entry Condition:

Case is operationally ready for governance review under authorized governance processes.

Exit Condition:

Governance review completes, additional information is requested, deficiency is identified, or case is held.

Next Required Action:

Governance Reviewer performs authorized governance review.

Waiting On:

Governance Reviewer

Blocking Conditions:

- Governance execution not authorized
- Required governance evidence missing
- Review dependency unresolved
- Human governance review unavailable

Allowed Transitions:

- INFORMATION_REQUEST
- DEFICIENCY_IDENTIFIED
- DECISION_PENDING
- APPLICATION_HOLD

Snowflake Source:

- Governance review records
- Verification case records
- Evidence records
- Applicant lifecycle records
- Governance execution outputs where authorized

Repository Support:

- Review Status
- Evidence Repository
- Artifact Repository
- Progress Repository
- Decision Status

Authority Boundary:

Only constitutionally authorized governance processes may create governance outcomes. Operational workflow only routes and displays state.

---

## STATE 14 — DECISION PENDING

Canonical Code:

DECISION_PENDING

Primary Owner:

Governance Reviewer / Certification Authority depending on decision type

Visible to Applicant:

Yes, as status visibility only

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes, where certification decision is pending

Visible to Platform Administrator:

Yes

Entry Condition:

Governance review is complete or case is otherwise ready for an authorized decision.

Exit Condition:

Decision is issued, additional review is required, or case is held.

Next Required Action:

Authorized human decision-maker records decision through approved governance or certification process.

Waiting On:

Authorized decision-maker

Blocking Conditions:

- Decision authority not assigned
- Governance review incomplete
- Required evidence missing
- Certification authority unavailable
- Decision process not authorized

Allowed Transitions:

- DECISION_ISSUED
- GOVERNANCE_REVIEW
- INFORMATION_REQUEST
- DEFICIENCY_IDENTIFIED
- APPLICATION_HOLD

Snowflake Source:

- Decision records
- Governance review records
- Certification records where applicable
- Applicant lifecycle records

Repository Support:

- Decision Status
- Review Status
- Certification Repository
- Progress Repository

Authority Boundary:

Operational workflow may expose decision pending state but does not issue decisions.

---

## STATE 15 — DECISION ISSUED

Canonical Code:

DECISION_ISSUED

Primary Owner:

Governance Reviewer / Certification Authority

Visible to Applicant:

Yes, according to disclosure policy

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Authorized human decision has been recorded.

Exit Condition:

Case moves to certification, closure, remediation, appeal, or publication pathway depending on decision.

Next Required Action:

System routes case according to recorded decision and applicable authority.

Waiting On:

GAFAIG Operations Reviewer, Certification Authority, Applicant, or Platform depending on outcome

Blocking Conditions:

- Decision record unavailable
- Decision outcome not authorized for disclosure
- Certification dependency unresolved
- Appeal or remediation path required

Allowed Transitions:

- CERTIFICATION_READY
- CERTIFICATION_ISSUED
- REMEDIATION_REQUIRED
- APPEAL_PENDING
- CASE_CLOSED
- PUBLICATION_PENDING

Snowflake Source:

- Decision records
- Applicant lifecycle decision records
- Governance decision records where authorized

Repository Support:

- Decision Status
- Certification Repository
- Progress Repository

Authority Boundary:

Decision issuance must originate from authorized governance or certification authority, not from workflow display logic.

---

## STATE 16 — CERTIFICATION READY

Canonical Code:

CERTIFICATION_READY

Primary Owner:

Certification Authority

Visible to Applicant:

Yes, as status visibility

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

A favorable authorized decision or certification readiness state exists.

Exit Condition:

Certification is issued, held, or blocked.

Next Required Action:

Certification Authority performs certification issuance process.

Waiting On:

Certification Authority

Blocking Conditions:

- Certification authority not assigned
- Required certification metadata missing
- Decision record incomplete
- Publication or disclosure constraints unresolved

Allowed Transitions:

- CERTIFICATION_ISSUED
- PUBLICATION_PENDING
- APPLICATION_HOLD
- CASE_CLOSED

Snowflake Source:

- Certification records
- Decision records
- Applicant lifecycle records

Repository Support:

- Certification Repository
- Decision Status
- Progress Repository

Authority Boundary:

Workflow may indicate readiness but may not issue certification.

---

## STATE 17 — CERTIFICATION ISSUED

Canonical Code:

CERTIFICATION_ISSUED

Primary Owner:

Certification Authority

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Certification has been issued through authorized certification process.

Exit Condition:

Case moves to publication consideration, active certification monitoring, renewal, expiration, suspension, revocation, appeal, or closure.

Next Required Action:

Determine publication pathway and lifecycle monitoring requirements.

Waiting On:

Certification Authority / GAFAIG Operations Reviewer

Blocking Conditions:

- Certification record unavailable
- Certification metadata incomplete
- Publication consent missing where required
- Registry publication not authorized

Allowed Transitions:

- PUBLICATION_PENDING
- CERTIFICATION_ACTIVE
- RENEWAL_PENDING
- EXPIRATION_PENDING
- SUSPENSION_PENDING
- REVOCATION_PENDING
- CASE_CLOSED

Snowflake Source:

- Certification records
- Applicant lifecycle certification records
- Registry publication records if published

Repository Support:

- Certification Repository
- Progress Repository
- Decision Status

Authority Boundary:

Certification issuance must originate from authorized certification authority. Workflow may display issued status only.

---

## STATE 18 — PUBLICATION PENDING

Canonical Code:

PUBLICATION_PENDING

Primary Owner:

Certification Authority / Platform Administrator

Visible to Applicant:

Yes, according to publication policy

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Certification or registry-eligible record exists but publication has not occurred or is pending authorization.

Exit Condition:

Publication is completed, declined, deferred, or held.

Next Required Action:

Determine publication authorization and registry readiness.

Waiting On:

Certification Authority / Platform Administrator / Applicant if consent required

Blocking Conditions:

- Publication consent missing
- Registry eligibility unresolved
- Public disclosure thresholds unmet
- Publication authority not authorized

Allowed Transitions:

- PUBLISHED
- CERTIFICATION_ACTIVE
- PUBLICATION_DEFERRED
- APPLICATION_HOLD

Snowflake Source:

- Certification records
- Publication records
- Registry snapshot records
- Public registry views

Repository Support:

- Certification Repository
- Decision Status
- Progress Repository

Authority Boundary:

Workflow may display publication pending state but cannot publish to registry.

---

## STATE 19 — PUBLISHED

Canonical Code:

PUBLISHED

Primary Owner:

Platform Administrator / Certification Authority

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

A registry-eligible record has been published through authorized publication process.

Exit Condition:

Certification remains active, enters renewal, expiration, suspension, revocation, appeal, or archival pathway.

Next Required Action:

Monitor certification lifecycle and registry continuity.

Waiting On:

Platform / Lifecycle monitoring

Blocking Conditions:

- Registry snapshot unavailable
- Public record verification failure
- Signature or proof unavailable
- Publication discontinuity detected

Allowed Transitions:

- CERTIFICATION_ACTIVE
- RENEWAL_PENDING
- EXPIRATION_PENDING
- SUSPENSION_PENDING
- REVOCATION_PENDING
- APPEAL_PENDING

Snowflake Source:

- Registry snapshots
- Public registry views
- Certification records
- Verification signature records

Repository Support:

- Certification Repository
- Progress Repository
- Public Registry surfaces

Authority Boundary:

Published state reflects authorized publication only. Workflow cannot create publication authority.

---

## STATE 20 — CERTIFICATION ACTIVE

Canonical Code:

CERTIFICATION_ACTIVE

Primary Owner:

Certification Authority / Platform

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Certification has been issued and is currently active.

Exit Condition:

Certification enters renewal, expiration, suspension, revocation, appeal, or closure pathway.

Next Required Action:

Monitor lifecycle status.

Waiting On:

Platform / Certification Authority

Blocking Conditions:

- Certification lifecycle data missing
- Validity period unavailable
- Renewal window unresolved
- Monitoring dependency unavailable

Allowed Transitions:

- RENEWAL_PENDING
- EXPIRATION_PENDING
- SUSPENSION_PENDING
- REVOCATION_PENDING
- APPEAL_PENDING
- CASE_CLOSED

Snowflake Source:

- Certification records
- Lifecycle records
- Registry records where applicable

Repository Support:

- Certification Repository
- Progress Repository
- Decision Status

Authority Boundary:

Active certification must reflect authoritative certification records only.

---

## STATE 21 — RENEWAL PENDING

Canonical Code:

RENEWAL_PENDING

Primary Owner:

Applicant / Certification Authority

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless renewal governance review is required

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Certification is approaching renewal window or renewal has been requested.

Exit Condition:

Renewal submission is received, renewal review begins, certification expires, or renewal is closed.

Next Required Action:

Applicant submits renewal materials or Certification Authority reviews renewal eligibility.

Waiting On:

Applicant or Certification Authority depending on renewal stage

Blocking Conditions:

- Renewal window not open
- Renewal materials missing
- Certification record unavailable
- Renewal eligibility unresolved

Allowed Transitions:

- APPLICANT_RESPONSE
- EVIDENCE_REVIEW
- GOVERNANCE_REVIEW
- CERTIFICATION_READY
- CERTIFICATION_ACTIVE
- EXPIRATION_PENDING
- CASE_CLOSED

Snowflake Source:

- Renewal records
- Certification records
- Applicant lifecycle renewal records

Repository Support:

- Certification Repository
- Evidence Repository
- Progress Repository

Authority Boundary:

Renewal workflow does not itself renew certification. Renewal requires authorized lifecycle and certification authority.

---

## STATE 22 — EXPIRATION PENDING

Canonical Code:

EXPIRATION_PENDING

Primary Owner:

Certification Authority / Platform

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

No, unless escalation occurs

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Certification is approaching expiration or expiration condition is detected.

Exit Condition:

Certification is renewed, expired, suspended, revoked, or administratively handled.

Next Required Action:

Applicant or Certification Authority resolves renewal or expiration pathway.

Waiting On:

Applicant / Certification Authority

Blocking Conditions:

- Expiration date missing
- Renewal status unresolved
- Lifecycle status unavailable

Allowed Transitions:

- RENEWAL_PENDING
- CERTIFICATION_ACTIVE
- EXPIRED
- SUSPENSION_PENDING
- REVOCATION_PENDING
- CASE_CLOSED

Snowflake Source:

- Certification lifecycle records
- Renewal records
- Expiration records

Repository Support:

- Certification Repository
- Progress Repository

Authority Boundary:

Expiration workflow reflects lifecycle state only and does not create certification authority.

---

## STATE 23 — EXPIRED

Canonical Code:

EXPIRED

Primary Owner:

Certification Authority / Platform

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes, if governance context is required

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Certification validity has expired or expiration has been recorded.

Exit Condition:

Renewal, reinstatement, appeal, closure, or archival pathway begins.

Next Required Action:

Determine renewal, reinstatement, appeal, or closure path.

Waiting On:

Applicant / Certification Authority / Platform

Blocking Conditions:

- Expiration record missing
- Registry status unresolved
- Renewal eligibility unresolved

Allowed Transitions:

- RENEWAL_PENDING
- APPEAL_PENDING
- REINSTATEMENT_PENDING
- CASE_CLOSED

Snowflake Source:

- Certification lifecycle records
- Expiration records
- Registry records where applicable

Repository Support:

- Certification Repository
- Progress Repository
- Decision Status

Authority Boundary:

Expired state reflects authoritative lifecycle data only.

---

## STATE 24 — SUSPENSION PENDING

Canonical Code:

SUSPENSION_PENDING

Primary Owner:

Certification Authority / Governance Reviewer

Visible to Applicant:

Yes, according to disclosure policy

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Suspension review has been initiated or a suspension condition has been detected.

Exit Condition:

Certification is suspended, review continues, deficiency/remediation path begins, or suspension is declined.

Next Required Action:

Authorized reviewer evaluates suspension condition.

Waiting On:

Certification Authority / Governance Reviewer

Blocking Conditions:

- Suspension authority not assigned
- Evidence unavailable
- Disclosure conditions unresolved
- Human review incomplete

Allowed Transitions:

- SUSPENDED
- GOVERNANCE_REVIEW
- REMEDIATION_REQUIRED
- CERTIFICATION_ACTIVE
- APPEAL_PENDING
- CASE_CLOSED

Snowflake Source:

- Suspension records
- Certification records
- Governance records where authorized

Repository Support:

- Certification Repository
- Review Status
- Decision Status
- Evidence Repository

Authority Boundary:

Workflow cannot suspend certification. Suspension requires authorized process.

---

## STATE 25 — SUSPENDED

Canonical Code:

SUSPENDED

Primary Owner:

Certification Authority / Platform

Visible to Applicant:

Yes, according to policy

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Authorized suspension has been recorded.

Exit Condition:

Reinstatement, revocation, appeal, remediation, or closure pathway begins.

Next Required Action:

Determine remediation, reinstatement, appeal, or revocation path.

Waiting On:

Applicant / Certification Authority / Governance Reviewer

Blocking Conditions:

- Suspension record unavailable
- Reinstatement path unresolved
- Appeal rights unresolved
- Registry disclosure unresolved

Allowed Transitions:

- REMEDIATION_REQUIRED
- REINSTATEMENT_PENDING
- REVOCATION_PENDING
- APPEAL_PENDING
- CASE_CLOSED

Snowflake Source:

- Suspension records
- Certification records
- Registry records where applicable

Repository Support:

- Certification Repository
- Decision Status
- Progress Repository

Authority Boundary:

Suspended state must reflect authorized suspension record.

---

## STATE 26 — REVOCATION PENDING

Canonical Code:

REVOCATION_PENDING

Primary Owner:

Certification Authority / Governance Reviewer

Visible to Applicant:

Yes, according to disclosure policy

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Revocation review has been initiated or revocation condition is detected.

Exit Condition:

Certification is revoked, review continues, remediation occurs, appeal begins, or revocation is declined.

Next Required Action:

Authorized reviewer evaluates revocation condition.

Waiting On:

Certification Authority / Governance Reviewer

Blocking Conditions:

- Revocation authority not assigned
- Evidence unavailable
- Human review incomplete
- Disclosure policy unresolved

Allowed Transitions:

- REVOKED
- SUSPENDED
- REMEDIATION_REQUIRED
- CERTIFICATION_ACTIVE
- APPEAL_PENDING
- CASE_CLOSED

Snowflake Source:

- Revocation records
- Certification records
- Governance records where authorized

Repository Support:

- Certification Repository
- Review Status
- Decision Status
- Evidence Repository

Authority Boundary:

Workflow cannot revoke certification. Revocation requires authorized process.

---

## STATE 27 — REVOKED

Canonical Code:

REVOKED

Primary Owner:

Certification Authority / Platform

Visible to Applicant:

Yes, according to policy

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Authorized revocation has been recorded.

Exit Condition:

Appeal, reinstatement, closure, or archival pathway begins.

Next Required Action:

Determine appeal, reinstatement, closure, or registry disclosure path.

Waiting On:

Applicant / Certification Authority / Platform

Blocking Conditions:

- Revocation record unavailable
- Appeal pathway unresolved
- Registry status unresolved

Allowed Transitions:

- APPEAL_PENDING
- REINSTATEMENT_PENDING
- CASE_CLOSED

Snowflake Source:

- Revocation records
- Certification records
- Registry records where applicable

Repository Support:

- Certification Repository
- Decision Status
- Progress Repository

Authority Boundary:

Revoked state must reflect authorized revocation record only.

---

## STATE 28 — APPEAL PENDING

Canonical Code:

APPEAL_PENDING

Primary Owner:

Applicant / Governance Reviewer / Certification Authority

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Applicant appeal has been submitted or appeal window is active.

Exit Condition:

Appeal is reviewed, resolved, denied, accepted, withdrawn, or closed.

Next Required Action:

Authorized appeal reviewer reviews appeal submission.

Waiting On:

Applicant before appeal submission; authorized reviewer after submission

Blocking Conditions:

- Appeal materials missing
- Appeal window expired
- Appeal authority unavailable
- Appeal record unavailable

Allowed Transitions:

- GOVERNANCE_REVIEW
- DECISION_PENDING
- CERTIFICATION_ACTIVE
- REINSTATEMENT_PENDING
- CASE_CLOSED

Snowflake Source:

- Appeal records
- Certification records
- Decision records
- Applicant lifecycle appeal records

Repository Support:

- Certification Repository
- Evidence Repository
- Review Status
- Decision Status

Authority Boundary:

Appeal workflow does not decide appeal outcome. Authorized human review remains required.

---

## STATE 29 — REINSTATEMENT PENDING

Canonical Code:

REINSTATEMENT_PENDING

Primary Owner:

Applicant / Certification Authority / Governance Reviewer

Visible to Applicant:

Yes

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes, when governance review required

Visible to Certification Authority:

Yes

Visible to Platform Administrator:

Yes

Entry Condition:

Reinstatement pathway has been initiated after suspension, revocation, expiration, or appeal.

Exit Condition:

Reinstatement is approved, denied, requires remediation, or case is closed.

Next Required Action:

Applicant submits reinstatement materials or authorized reviewer evaluates reinstatement eligibility.

Waiting On:

Applicant / Certification Authority / Governance Reviewer

Blocking Conditions:

- Reinstatement materials missing
- Reinstatement authority unavailable
- Certification history unavailable
- Governance review required but unavailable

Allowed Transitions:

- APPLICANT_RESPONSE
- EVIDENCE_REVIEW
- REMEDIATION_REQUIRED
- GOVERNANCE_REVIEW
- DECISION_PENDING
- CERTIFICATION_ACTIVE
- CASE_CLOSED

Snowflake Source:

- Reinstatement records
- Certification lifecycle records
- Appeal records where applicable
- Applicant lifecycle reinstatement records

Repository Support:

- Certification Repository
- Evidence Repository
- Remediation Repository
- Review Status
- Decision Status

Authority Boundary:

Workflow does not reinstate certification. Reinstatement requires authorized process.

---

## STATE 30 — CASE CLOSED

Canonical Code:

CASE_CLOSED

Primary Owner:

GAFAIG Operations Reviewer / Platform Administrator / Authorized Authority

Visible to Applicant:

Yes, according to disclosure policy

Visible to GAFAIG Operations Reviewer:

Yes

Visible to Governance Reviewer:

Yes, if governance context exists

Visible to Certification Authority:

Yes, if certification context exists

Visible to Platform Administrator:

Yes

Entry Condition:

Case has reached an operational close condition, including completion, withdrawal, denial, expiration closure, abandonment, or administrative closure.

Exit Condition:

None unless reopened through authorized reopening, appeal, renewal, or reinstatement process.

Next Required Action:

No applicant action unless reopening, appeal, renewal, or reinstatement is available.

Waiting On:

None, unless reopening path exists

Blocking Conditions:

- Closure reason missing
- Disclosure status unresolved
- Archival requirements incomplete

Allowed Transitions:

- APPEAL_PENDING
- REINSTATEMENT_PENDING
- RENEWAL_PENDING
- APPLICATION_HOLD where reopened administratively

Snowflake Source:

- Applicant lifecycle closure records
- Decision records
- Certification records
- Archival records where implemented

Repository Support:

- Cases Repository
- Progress Repository
- Decision Status
- Certification Repository

Authority Boundary:

Closure must reflect authorized operational or governance process. Workflow display cannot close a case independently.

---

# TRANSITION RULES

## Rule 1 — Deterministic Source Requirement

No workflow transition may be displayed unless supported by Snowflake-originated state or deterministic absence of required state.

## Rule 2 — Fail-Closed Behavior

If workflow state cannot be determined, the system must fail to a safe operational state:

APPLICATION_HOLD

or

PENDING_REVIEW

depending on context.

## Rule 3 — No Governance Computation

Workflow transitions must not compute governance findings, scoring, decision, certification, publication, or registry status.

## Rule 4 — Human Authority Preservation

Where a state requires human review, the workflow may identify the action but not execute the human judgment.

## Rule 5 — Organization Scope

Applicant-facing workflow states must be scoped to the authenticated applicant organization.

## Rule 6 — Repository Support

Repositories support workflow state but do not define workflow authority.

## Rule 7 — Case-Centric Priority

When multiple repository records exist, the case workspace must present the next action according to workflow priority, not repository navigation order.

---

# NEXT ACTION PRIORITY ORDER

When multiple possible actions exist for a case, the system should prioritize the next action using the following order:

1. Applicant-blocking action
2. GAFAIG Operations Reviewer-blocking action
3. Governance Reviewer-blocking action
4. Certification Authority-blocking action
5. Platform Administrator-blocking action
6. Monitoring-only state
7. Closed or archival state

Applicant-facing dashboards should prioritize actions waiting on the applicant.

Reviewer-facing dashboards should prioritize actions waiting on the reviewer.

Administrative dashboards should prioritize blocked, failed, overdue, or ambiguous cases.

---

# DEFAULT STATE RESOLUTION

When case status and repository records are insufficient to determine a specific operational state:

- if case has no resolved intake status, use APPLICATION_SUBMITTED or INTAKE_REVIEW
- if evidence exists but no review outcome exists, use EVIDENCE_REVIEW or EVIDENCE_VALIDATION
- if request exists and no response exists, use INFORMATION_REQUEST
- if response exists and no reviewer action exists, use APPLICANT_RESPONSE
- if deficiency exists and no remediation exists, use REMEDIATION_REQUIRED
- if remediation exists and no review outcome exists, use REMEDIATION_REVIEW
- if governance review exists and no decision exists, use GOVERNANCE_REVIEW
- if decision exists and certification does not, use CERTIFICATION_READY or CASE_CLOSED depending on outcome
- if certification exists, use CERTIFICATION_ACTIVE unless lifecycle state indicates otherwise

---

# CASE WORKSPACE REQUIREMENTS

Each case workspace SHALL expose:

- Case identifier
- Organization
- Current state
- Current owner
- Waiting on
- Next required action
- Blocking items
- Repository summary
- Evidence summary
- Request summary
- Deficiency summary
- Remediation summary
- Review summary
- Decision summary
- Certification summary
- Timeline
- Allowed next transitions

The case workspace must not require users to infer operational status by manually inspecting every repository page.

---

# APPLICANT DASHBOARD REQUIREMENTS

Applicant dashboard SHALL prioritize:

- Actions waiting on applicant
- Open information requests
- Missing evidence
- Deficiency responses
- Remediation submissions
- Renewal requirements
- Appeal or reinstatement options where applicable

Applicant dashboard SHALL NOT present governance-private information.

---

# REVIEWER DASHBOARD REQUIREMENTS

Reviewer dashboard SHALL prioritize:

- Cases waiting on intake review
- Cases waiting on evidence review
- Applicant responses waiting review
- Remediation submissions waiting review
- Cases ready for governance review
- Cases blocked by missing data
- Cases exceeding operational timelines

Reviewer dashboard SHALL NOT create governance authority.

---

# GOVERNANCE DASHBOARD REQUIREMENTS

Governance dashboard SHALL prioritize:

- Cases authorized for governance review
- Cases awaiting human governance judgment
- Cases requiring governance escalation
- Cases ready for decision

Governance dashboard SHALL remain subordinate to constitutional governance authority.

---

# CERTIFICATION DASHBOARD REQUIREMENTS

Certification dashboard SHALL prioritize:

- Cases ready for certification
- Certifications pending issuance
- Certifications pending publication review
- Renewals
- Expiration risks
- Suspension/revocation/reinstatement pathways

Certification dashboard SHALL NOT issue certification without authorized process.

---

# PLATFORM ADMINISTRATOR DASHBOARD REQUIREMENTS

Platform administrator dashboard SHALL prioritize:

- blocked workflow states
- failed source queries
- ambiguous state resolution
- organization mapping failures
- access failures
- overdue cases
- integration failures

Administrative visibility does not create governance authority.

---

# IMPLEMENTATION NOTES

Future implementation SHOULD create deterministic workflow utilities that resolve:

- workflowState
- workflowStage
- workflowOwner
- waitingOn
- nextAction
- blockingItems
- allowedTransitions
- repositorySupport
- authorityBoundary

Future implementation SHOULD NOT duplicate logic across Applicant APIs, Reviewer APIs, Governance APIs, or Admin APIs.

Future implementation SHOULD preserve shared service patterns introduced during Repository Maturity.

---

# COMPLETION CRITERIA

The Operational Workflow State Machine is complete when:

- every canonical state is represented
- every state has ownership
- every state has deterministic entry and exit rules
- every state has next action guidance
- every state has authority boundaries
- every applicant-facing state is organization-scoped
- every transition preserves Snowflake authority
- every transition preserves human governance authority
- no governance computation is introduced into workflow logic

---

# END OF FILE
