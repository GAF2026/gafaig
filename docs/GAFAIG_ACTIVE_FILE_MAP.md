GAFAIG_ACTIVE_FILE_MAP.md
Last Updated: 2026-05-19

PURPOSE

This document defines the authoritative active file map for GAFAIG (Global Authority for AI Governance).

GAFAIG is a deterministic global AI governance authority infrastructure platform, governance trust distribution infrastructure, communication layer infrastructure, and public accountability infrastructure that enables organizations, AI systems, regulators, enterprises, governments, research institutions, universities, laboratories, non-profits, technology providers, and governance stakeholders to manage, evaluate, certify, publish, verify, monitor, observe, and coordinate AI governance outcomes through Snowflake-originated public governance trust surfaces and cryptographic verification infrastructure.

This file establishes:

canonical Snowflake files

canonical procedures

canonical views

canonical validation runners

active adaptive governance intelligence infrastructure files

governance observability ownership

governance simulation ownership

remediation orchestration ownership

public governance trust layer ownership

publication enforcement ownership

adaptive governance operational intelligence ownership

Snowflake ↔ VS Code parity expectations

canonical operational layering

deterministic operational governance validation

operational dependency discipline

publication enforcement infrastructure

verification enforcement infrastructure

and adaptive governance intelligence infrastructure preparation

Only files listed here are considered ACTIVE and CANONICAL.

Any file not listed here is:

legacy

experimental

archived

deprecated

non-canonical

GLOBAL POSITIONING EVOLUTION (CRITICAL)

GAFAIG has evolved beyond the earlier framing of:

"registry platform"

The platform must now be consistently positioned as:

deterministic global AI governance infrastructure

AND:

public accountability infrastructure for artificial intelligence

This evolution reflects the expansion of GAFAIG into:

deterministic certification infrastructure

governance execution infrastructure

adaptive governance intelligence infrastructure

governance observability infrastructure

governance simulation infrastructure

remediation orchestration infrastructure

append-only publication infrastructure

cryptographic public governance trust infrastructure

independent verification infrastructure

global governance coordination infrastructure

communication layer infrastructure

governance trust distribution infrastructure

public accountability infrastructure

deterministic operational governance authority infrastructure

canonical operational validation infrastructure

publication enforcement infrastructure

verification enforcement infrastructure

governance continuity infrastructure

lifecycle observability infrastructure

governance drift intelligence infrastructure

operational governance intelligence infrastructure

adaptive governance intelligence infrastructure preparation

CRITICAL:

This positioning evolution must NOT weaken:

Snowflake-first execution

deterministic trust guarantees

publication control

append-only registry behavior

proof.messageString verification enforcement

cryptographic verification integrity

fail-closed verification behavior

adaptive governance intelligence advisory-only boundaries

This positioning must remain synchronized across:

documentation

SQL layer naming

API terminology

SDK terminology

widget terminology

public UI terminology

verification messaging

registry messaging

observability messaging

simulation messaging

CORE SYSTEM PRINCIPLES

Snowflake is the ONLY source of truth.

API:

pass-through only

no trust computation

no scoring logic

no publication logic

no ID generation

no verification reconstruction

UI:

display only

no derived trust logic

no registry mutation

no publication mutation

no proof mutation

no ID generation

Registry:

append-only

IDs:

generated ONLY in Snowflake

Verification:

MUST use proof.messageString only

Never reconstruct signed payloads from JSON fields.

Operational simplicity must remain protected.

Enterprise scalability must evolve progressively.

Adaptive governance intelligence infrastructure must remain deterministic.

PUBLICATION RULE (CRITICAL)

Certification and publication are separate states.

Certification:

private

deterministic

Snowflake-controlled

not automatically public

Publication:

explicit

optional

controlled

Snowflake-executed

Public visibility requires:

PUBLISHED = TRUE

Publication is not implied by:

approval

scoring

certification

adaptive governance intelligence recommendation

adaptive governance intelligence review

adaptive governance intelligence consensus

adaptive governance intelligence risk state

remediation state

monitoring state

simulation state

PUBLIC VISIBILITY ENFORCEMENT

All public surfaces MUST enforce:

WHERE PUBLISHED = TRUE

Applies to:

CORE.V_REGISTRY_PUBLIC

CORE.V_REGISTRY_LATEST_APPROVED

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

APIs

UI

widgets

SDK

verification endpoints

No unpublished records may appear publicly.

ID PARITY RULE (CRITICAL)

All IDs must be:

generated in Snowflake ONLY

never generated in API/UI

passed through unchanged

Applies to:

APPLICATION_ID

REQUEST_ID

CASE_ID

FINDING_ID

EVIDENCE_ID

EVENT_ID

REGISTRY_ID

REGISTRY_SNAPSHOT_ID

AI_OBSERVATION_ID

AI_RECOMMENDATION_ID

REVIEW_ID

AI_REVIEW_ASSIGNMENT_ID

AI_CONSENSUS_DECISION_ID

AI_POLICY_REQUIREMENT_ID

AI_POLICY_MAPPING_ID

AI_GOVERNANCE_RISK_SNAPSHOT_ID

AI_GOVERNANCE_DRIFT_EVENT_ID

AI_REMEDIATION_TASK_ID

AI_WORKFLOW_ACTION_ID

AI_GOVERNANCE_EXECUTION_ID

AI_GOVERNANCE_APPROVAL_ID

AI_GOVERNANCE_STATE_TRANSITION_ID

AI_RECERTIFICATION_QUEUE_ID

AI_SIMULATION_SCENARIO_ID

AI_SIMULATION_RUN_ID

AI_SIMULATION_EVENT_ID

Violation = system corruption

GOVERNANCE LAYERING ARCHITECTURE (CANONICAL)

GAFAIG now operates through canonical governance infrastructure layers.

The platform is intentionally separated into:

Layer 1 — Deterministic Governance Authority Infrastructure

↓

FOUNDATION GOVERNANCE BASELINE

↓

GOVERNANCE COORDINATION INTELLIGENCE

↓

GOVERNANCE DISTRIBUTION INTELLIGENCE

↓

GOVERNANCE NETWORK INTELLIGENCE

↓

GOVERNANCE TELEMETRY INTELLIGENCE

↓

GOVERNANCE RESILIENCE INTELLIGENCE

↓

GOVERNANCE STABILITY INTELLIGENCE

↓

GOVERNANCE CONTINUITY INTELLIGENCE

↓

GLOBAL GOVERNANCE ORCHESTRATION

↓

GLOBAL GOVERNANCE PUBLIC INTELLIGENCE

↓

GLOBAL GOVERNANCE TRUST SURFACE

↓

Layer 2 — Adaptive Governance Intelligence Infrastructure

Layer 3 — Governance Observability Infrastructure

Layer 4 — Public Governance Trust Infrastructure

This separation preserves:

deterministic governance authority

governance auditability

publication integrity

verification integrity

registry integrity

institutional trust continuity

Adaptive governance intelligence infrastructure may influence governance workflows, but may never directly mutate governance authority.

Deterministic governance authority remains permanently authoritative.

LAYER 1 — DETERMINISTIC GOVERNANCE AUTHORITY INFRASTRUCTURE

Application Intake Infrastructure

11_TABLES_APPLICATIONS.sql

24_PROCEDURES_APPLICATION_INTAKE.sql

app/apply/page.tsx

app/apply/intake/page.tsx

app/apply/review/page.tsx

app/apply/success/[applicationId]/page.tsx

app/api/apply/route.ts

Deterministic Governance Workflow Infrastructure

23_SP_CREATE_CASE_FROM_APPLICATION.sql

26_PROCEDURES_FINDINGS.sql

27_PROCEDURES_EVIDENCE.sql

24_SP_SCORE_CASE_ENTERPRISE.sql

25_PROCEDURES_DECISION.sql

Governance Lifecycle Observability Infrastructure

26_VIEWS_CASE_LIFECYCLE.sql

26_VIEWS_DECISION_LIFECYCLE.sql

26_VIEWS_APPLICATION_STATUS.sql

26_VIEWS_GOVERNANCE_TIMELINE.sql

Publication Governance Infrastructure

27_VIEWS_PUBLICATION_GATING.sql

27_VIEWS_REGISTRY_PUBLICATION_ELIGIBILITY.sql

Deterministic Validation Infrastructure

97B_SMOKE_TEST_APPLICATION_TO_CASE_BRIDGE.sql

97C_SMOKE_TEST_FINDINGS_EVIDENCE_SCORING.sql

97D_SMOKE_TEST_DECISION_LIFECYCLE.sql

97E_SMOKE_TEST_LIFECYCLE_OBSERVABILITY.sql

LAYER 2 — ADAPTIVE GOVERNANCE INTELLIGENCE INFRASTRUCTURE (PLANNED)

Future adaptive governance intelligence infrastructure will include:

governance drift detection

AI evolution monitoring

autonomy escalation monitoring

oversight degradation detection

governance anomaly detection

governance forecasting

continuous governance reassessment

recertification intelligence

governance continuity intelligence

lifecycle observability intelligence

operational governance intelligence

Governance Drift Intelligence

Examples:

V_GOVERNANCE_DRIFT_SIGNALS.sql

V_GOVERNANCE_DRIFT_ANALYTICS.sql

AI Evolution Monitoring

Examples:

V_AI_EVOLUTION_MONITORING.sql

V_AUTONOMY_ESCALATION.sql

Continuous Governance Intelligence

Examples:

V_CONTINUOUS_GOVERNANCE_MONITORING.sql

V_RECERTIFICATION_INTELLIGENCE.sql

GOVERNANCE OBSERVABILITY INFRASTRUCTURE

GAFAIG lifecycle observability now operates through:

V_APPLICATION_STATUS

V_CASE_LIFECYCLE

V_DECISION_LIFECYCLE

V_GOVERNANCE_TIMELINE

V_PUBLICATION_GATING

V_REGISTRY_PUBLICATION_ELIGIBILITY

This infrastructure establishes deterministic governance telemetry continuity across the platform.

Governance observability infrastructure is intentionally separated from public governance trust infrastructure.

Governance observability infrastructure governs:

telemetry

continuity analytics

operational governance intelligence

lifecycle visibility

governance observability

Public governance trust infrastructure governs:

public registry infrastructure

verification distribution

publication-safe trust projection

public accountability infrastructure

Observability infrastructure is projection-only relative to governance authority.

APPLICANT STATUS + PORTAL INFRASTRUCTURE (PLANNED)

Planned infrastructure references include:

app/portal/page.tsx

app/portal/applications/page.tsx

app/portal/application/[applicationId]/page.tsx

app/login/page.tsx

app/register/page.tsx

app/api/auth/*

V_APPLICANT_STATUS.sql

Planned capabilities include:

applicant authentication

organization identity continuity

lifecycle visibility

certification continuity visibility

publication election workflows

recertification continuity

governance communication continuity

CANONICAL OPERATIONAL LAYERING

GAFAIG now operates through canonical operational layers.

Operational layers exist to preserve:

deterministic rebuild integrity

operational dependency discipline

publication enforcement integrity

verification enforcement integrity

governance lifecycle integrity

institutional auditability

enterprise scalability preparation

adaptive governance intelligence infrastructure preparation

Operational layers include:

Layer 1 — Deterministic Schema Build

Purpose:

canonical tables

canonical views

deterministic procedures

append-only registry structures

publication-safe projections

Layer 2 — Governance Workflow Infrastructure

Purpose:

adaptive governance intelligence workflows

remediation orchestration

governance execution

governance monitoring

governance simulations

governance observability

governance continuity intelligence

operational governance intelligence

Layer 3 — Publication + Verification Infrastructure

Purpose:

publication enforcement

verification infrastructure

public governance trust distribution

widgets

SDKs

public verification surfaces

Layer 4 — Operational Validation Infrastructure

Purpose:

deterministic validation

operational dependency validation

publication enforcement validation

verification enforcement validation

lifecycle integrity validation

Canonical operational authority is now anchored by:

CANONICAL_OPERATIONAL_MAP.md

and:

99_RUN_CANONICAL_PIPELINE.sql

Operational layering must remain:

deterministic

publication-safe

verification-safe

append-safe

institutionally auditable

progressively scalable

CANONICAL SYSTEM FLOW

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ DECISION
→ CERTIFICATION (PRIVATE)
→ REGISTRY SNAPSHOT
→ ADAPTIVE GOVERNANCE INTELLIGENCE INPUT
→ GOVERNANCE OBSERVATIONS
→ GOVERNANCE RECOMMENDATIONS
→ HUMAN REVIEW
→ CONSENSUS GOVERNANCE
→ POLICY MATCHING
→ RISK + DRIFT
→ REMEDIATION
→ AUTOMATION
→ EXECUTION GOVERNANCE
→ CONTINUOUS MONITORING
→ SIMULATION / STRESS TESTING
→ GOVERNANCE TIMELINE
→ PUBLICATION
→ PUBLIC VIEWS
→ API
→ UI
→ VERIFICATION
→ OPERATIONAL VALIDATION

ACTIVE CANONICAL FILES

CANONICAL OPERATIONAL AUTHORITY

CANONICAL_OPERATIONAL_MAP.md

Purpose:

canonical operational layering authority

deterministic operational governance doctrine

operational dependency doctrine

publication enforcement doctrine

verification enforcement doctrine

adaptive governance intelligence infrastructure preparation doctrine

Rules:

must remain deterministic

must preserve operational simplicity

must preserve publication-safe governance scaling

must preserve verification-safe operational integrity

must preserve progressive enterprise scalability boundaries

00 — ENVIRONMENT

00_CORE_SETUP.sql

Purpose:

initializes canonical Snowflake environment

01 — REBUILD

01_REBUILD_ENVIRONMENT_CANONICAL.sql

Purpose:

deterministic rebuild

canonical reset

reproducibility

PREVIOUS CRITICAL BLOCKER (HISTORICAL CONTEXT)

Earlier in the GAFAIG build process, the following files were identified as canonical rebuild blockers:

12_TABLES_PARTICIPANTS.sql

15_TABLES_EVENTS.sql

These files previously required alignment to preserve:

deterministic rebuild ordering

downstream dependency integrity

canonical pipeline stability

The platform has since evolved beyond that earlier stabilization phase into:

adaptive governance intelligence infrastructure

governance simulations

governance observability

remediation orchestration

public governance trust infrastructure

cryptographic verification hardening

global AI governance infrastructure expansion

Future canonical rebuild validation remains important before major infrastructure expansion, but these files should NOT be treated as unresolved blockers unless active compile/runtime failures reappear during Snowflake validation.

10 — CORE TABLES

10_TABLES_SUBMISSIONS.sql

11_TABLES_APPLICATIONS.sql

12_TABLES_PARTICIPANTS.sql

13_TABLES_VERIFICATION_CASES.sql

14_TABLES_VERIFICATION_FINDINGS.sql

14_TABLES_VERIFICATION_EVIDENCE.sql

14_TABLES_VERIFICATION_FINDING_EVIDENCE.sql

15_TABLES_EVENTS.sql

16_TABLES_CASE_SCORE_SNAPSHOTS.sql

17_TABLES_DECISIONS.sql

18_TABLES_REGISTRY_SNAPSHOTS.sql

19_TABLES_REGISTRY_AI_SYSTEMS.sql

Purpose:

canonical private verification data model

deterministic case, finding, evidence, event, scoring, decision, and registry snapshot storage

Rules:

IDs generated only in Snowflake

registry remains append-only

public visibility controlled only by publication state

Protected append-only tables:

CORE.REGISTRY_SNAPSHOTS

CORE.REGISTRY_AI_SYSTEMS

Canonical publish path ONLY:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4(...)

15 — ADAPTIVE GOVERNANCE INTELLIGENCE INFRASTRUCTURE TABLES

AI_LAYER_TABLES.sql

Defines:

CORE.AI_OBSERVATIONS

CORE.AI_RECOMMENDATIONS

CORE.AI_RISK_PATTERNS

CORE.AI_STANDARD_UPDATES

CORE.AI_RECOMMENDATION_REVIEWS

CORE.AI_CONSENSUS_DECISIONS

CORE.AI_POLICY_REQUIREMENTS

CORE.AI_POLICY_MAPPINGS

CORE.AI_GOVERNANCE_RISK_SNAPSHOTS

CORE.AI_GOVERNANCE_DRIFT_EVENTS

CORE.AI_REMEDIATION_TASKS

CORE.AI_WORKFLOW_ACTIONS

CORE.AI_GOVERNANCE_EXECUTIONS

CORE.AI_GOVERNANCE_APPROVALS

CORE.AI_CONTINUOUS_MONITORING

CORE.AI_RECERTIFICATION_QUEUE

CORE.AI_GOVERNANCE_SIMULATION_SCENARIOS

CORE.AI_GOVERNANCE_SIMULATION_RUNS

CORE.AI_GOVERNANCE_SIMULATION_EVENTS

Rules:

isolated from scoring

isolated from publication

isolated from proof system

isolated from registry mutation

Adaptive governance intelligence infrastructure tables are advisory and operational only unless explicitly consumed by later deterministic Snowflake governance procedures.

20 — CORE VIEWS

20_VIEWS_VERIFICATION_CASE_DETAIL.sql

21_VIEWS_PUBLIC_REGISTRY.sql

Defines:

CORE.V_REGISTRY_PUBLIC

CORE.V_REGISTRY_LATEST_APPROVED

Rules:

projection only

MUST enforce PUBLISHED = TRUE

MUST NOT expose unpublished records

MUST NOT expose internal/private trust state

22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

Defines:

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Rules:

public AI systems view only

MUST join to public/published registry surface

MUST NOT expose unpublished systems

22_VIEWS_EXPLORER_STATS.sql

26_VIEWS_CASE_RENEWAL_STATUS.sql

26_VIEWS_CASE_LIFECYCLE.sql

26_VIEWS_DECISION_LIFECYCLE.sql

26_VIEWS_APPLICATION_STATUS.sql

26_VIEWS_GOVERNANCE_TIMELINE.sql

27_VIEWS_PUBLICATION_GATING.sql

27_VIEWS_REGISTRY_PUBLICATION_ELIGIBILITY.sql

ACTIVE — CANONICAL GOVERNANCE OBSERVABILITY INFRASTRUCTURE

23_VIEWS_LIFECYCLE_PUBLIC.sql

24_VIEWS_RENEWAL_PUBLIC.sql

25_VIEWS_OBSERVABILITY_PUBLIC.sql

PUBLIC_OBSERVABILITY_RULES.md

Purpose:

public lifecycle governance visibility

renewal governance observability

publication-safe governance telemetry

certification continuity intelligence

global governance observability infrastructure

Rules:

projection-only

publication-controlled

append-safe

verification-safe

Must NEVER expose:

private findings

private evidence

internal scoring

internal governance telemetry

adaptive governance intelligence recommendation internals

non-public certification states

25 — ADAPTIVE GOVERNANCE INTELLIGENCE INPUT VIEWS

AI_LAYER_INPUT_VIEWS.sql

Defines:

CORE.V_AI_CASE_INPUT

CORE.V_AI_FINDING_INPUT

CORE.V_AI_EVIDENCE_INPUT

CORE.V_AI_EVENT_INPUT

CORE.V_AI_DECISION_INPUT

CORE.V_AI_REGISTRY_SNAPSHOT_INPUT

Purpose:

deterministic adaptive governance intelligence input layer

read-only adaptive governance intelligence analysis surface

Rules:

MUST NOT use public views as source of private adaptive governance intelligence analysis

MUST NOT use UI-derived fields

MUST NOT introduce scoring logic

MUST NOT mutate source data

30 — CORE PROCEDURES

23_SP_CREATE_CASE_FROM_APPLICATION.sql

24_PROCEDURES_APPLICATION_INTAKE.sql

24_SP_SCORE_CASE_ENTERPRISE.sql

25_PROCEDURES_APPROVAL.sql

25_PROCEDURES_DECISION.sql

26_PROCEDURES_FINDINGS.sql

26_PROCEDURES_FINDINGS_UPDATE.sql

27_PROCEDURES_EVIDENCE.sql

28_PROCEDURES_FINDING_EVIDENCE.sql

Rules:

deterministic transitions only

no external scoring

no API-generated IDs

no UI-generated IDs

35 — ADAPTIVE GOVERNANCE INTELLIGENCE GENERATION + REVIEW LAYER

AI_LAYER_INGESTION_PROCEDURES.sql

Purpose:

adaptive governance intelligence ingestion

controlled adaptive governance intelligence writes

AI_LAYER_OBSERVATION_GENERATOR.sql

Defines:

CORE.SP_AI_GENERATE_CASE_OBSERVATIONS

Purpose:

deterministic governance observation generation

governance pattern detection

governance recommendation generation

Outputs:

CORE.AI_OBSERVATIONS

CORE.AI_RECOMMENDATIONS

Rules:

advisory only

MUST NOT affect scoring

MUST NOT affect certification

MUST NOT affect registry publication

MUST NOT affect proof state

AI_LAYER_REVIEW_WORKFLOW.sql

Defines:

CORE.SP_AI_REVIEW_RECOMMENDATION_V2

Purpose:

human review loop

governance review audit trail

recommendation approval/rejection

Rules:

updates REVIEW_STATUS only

MUST NOT modify:

scoring

certification

registry state

proof state

36 — ADAPTIVE GOVERNANCE INTELLIGENCE FEEDBACK

AI_LAYER_GOVERNANCE_FEEDBACK.sql

Purpose:

converts reviewed adaptive governance intelligence recommendations into internal governance feedback

records risk patterns

records standard update proposals

supports advisory governance learning loop

Defines:

CORE.SP_AI_PROMOTE_APPROVED_RECOMMENDATION

CORE.V_AI_GOVERNANCE_FEEDBACK

CORE.V_AI_GOVERNANCE_FEEDBACK_ROLLUP

Rules:

feedback is internal/advisory

MUST NOT alter certification

MUST NOT alter scoring

MUST NOT alter registry/publication

MUST NOT alter proof state

37 — ADAPTIVE GOVERNANCE INTELLIGENCE FEEDBACK VALIDATION

AI_LAYER_FEEDBACK_VALIDATION.sql

Purpose:

validates adaptive governance intelligence feedback outputs

detects missing/risky feedback mappings

supports internal validation of recommendation promotion

Rules:

validation only

no certification mutation

no registry mutation

no proof mutation

38 — GOVERNANCE OBSERVABILITY + ANALYTICS VIEWS

AI_LAYER_ANALYTICS_VIEWS.sql

Purpose:

governance observability analytics over observations, recommendations, reviews, standard updates, and risk patterns

Defines:

CORE.V_AI_OBSERVATION_SUMMARY

CORE.V_AI_RECOMMENDATION_SUMMARY

CORE.V_AI_REVIEW_AUDIT

CORE.V_AI_GOVERNANCE_FEEDBACK

CORE.V_AI_GOVERNANCE_FEEDBACK_ROLLUP

Rules:

read-only analytics

no scoring mutation

no publication mutation

no proof mutation

39 — GOVERNANCE OPERATIONS DASHBOARD

AI_LAYER_OPERATIONS_DASHBOARD.sql

Purpose:

internal adaptive governance intelligence operations dashboard layer

review queues

escalation queues

workflow metrics

Defines:

CORE.V_AI_PENDING_REVIEW_QUEUE

CORE.V_AI_HIGH_CONFIDENCE_RECOMMENDATIONS

CORE.V_AI_HIGH_SEVERITY_OBSERVATION_QUEUE

CORE.V_AI_GOVERNANCE_ACTION_QUEUE

CORE.V_AI_REVIEWER_THROUGHPUT

CORE.V_AI_WORKFLOW_METRICS

CORE.V_AI_CASE_GOVERNANCE_SUMMARY

CORE.V_AI_GOVERNANCE_ESCALATION_QUEUE

Rules:

dashboard/read-only visibility only

no certification mutation

no publication mutation

no proof mutation

40 — GOVERNANCE ORCHESTRATION

AI_LAYER_ORCHESTRATION.sql

Purpose:

internal routing, SLA aging, reviewer workload, category routing, audit history, and consensus readiness

Defines:

CORE.V_AI_REVIEW_ROUTING_QUEUE

CORE.V_AI_REVIEW_SLA_AGING

CORE.V_AI_REVIEWER_WORKLOAD

CORE.V_AI_GOVERNANCE_CATEGORY_ROUTING

CORE.V_AI_ORCHESTRATION_METRICS

CORE.V_AI_GOVERNANCE_AUDIT_HISTORY

CORE.V_AI_CONSENSUS_READINESS

Rules:

orchestration visibility only

no scoring mutation

no certification mutation

no publication mutation

no proof mutation

41 — HUMAN CONSENSUS + MULTI-REVIEW GOVERNANCE

AI_LAYER_MULTI_REVIEW_GOVERNANCE.sql

Purpose:

human consensus governance

multi-review decisioning

latest consensus visibility

Defines:

CORE.AI_REVIEW_ASSIGNMENTS

CORE.AI_GOVERNANCE_COMMITTEE

CORE.AI_CONSENSUS_DECISIONS

CORE.SP_AI_FINALIZE_CONSENSUS

CORE.V_AI_CONSENSUS_QUEUE

CORE.V_AI_ESCALATED_CONSENSUS

CORE.V_AI_REVIEW_ASSIGNMENT_STATUS

CORE.V_AI_COMMITTEE_WORKLOAD

CORE.V_AI_CONSENSUS_AUDIT

CORE.V_AI_LATEST_CONSENSUS

Rules:

consensus is advisory/internal governance state

consensus does NOT alter certification state

consensus does NOT alter scoring state

consensus does NOT alter registry/publication state

consensus does NOT alter verification/proof state

human governance remains authoritative

42 — GOVERNANCE POLICY ENGINE

AI_LAYER_POLICY_ENGINE.sql

Purpose:

maps adaptive governance intelligence recommendations to governance policy domains

detects policy gaps and exposures

supports remediation prioritization

Defines:

CORE.SP_AI_DETECT_POLICY_GAPS

CORE.SP_AI_MATCH_POLICY

CORE.V_AI_POLICY_MATCHES

CORE.V_AI_POLICY_EXPOSURES

Rules:

policy matching is internal governance analysis

no certification mutation

no publication mutation

no proof mutation

43 — GOVERNANCE RISK + DRIFT ENGINE

AI_LAYER_RISK_AND_DRIFT_ENGINE.sql

Purpose:

calculates internal governance risk

tracks governance debt

detects drift events

supports escalation queues

Defines:

CORE.SP_AI_CALCULATE_GOVERNANCE_RISK

CORE.V_AI_LATEST_GOVERNANCE_RISK

CORE.V_AI_OPEN_GOVERNANCE_DRIFT

CORE.V_AI_GOVERNANCE_RISK_ANALYTICS

CORE.V_AI_DRIFT_ESCALATION_QUEUE

Rules:

risk/drift is internal governance state

no certification mutation

no publication mutation

no registry mutation

no proof mutation

44 — GOVERNANCE REMEDIATION + WORKFLOW ORCHESTRATION

AI_LAYER_REMEDIATION_ORCHESTRATION.sql

Purpose:

creates remediation tasks

tracks remediation workflow actions

supports governance recovery readiness

Defines:

CORE.SP_AI_CREATE_REMEDIATION_TASK

CORE.SP_AI_PROCESS_SLA_ESCALATIONS

CORE.V_AI_REMEDIATION_QUEUE

CORE.V_AI_OVERDUE_REMEDIATIONS

CORE.V_AI_GOVERNANCE_RECOVERY

CORE.V_AI_GOVERNANCE_DEBT_BURNDOWN

CORE.V_AI_WORKFLOW_ACTION_AUDIT

Rules:

remediation is internal workflow state

no certification mutation

no publication mutation

no registry mutation

no proof mutation

45 — GOVERNANCE AUTOMATION ENGINE

AI_LAYER_AUTOMATION_ENGINE.sql

Purpose:

identifies automation candidates

processes automation command queue

creates remediation tasks from drift/policy/stale review signals

Defines:

CORE.SP_AI_PROCESS_AUTOMATION_QUEUE

CORE.V_AI_DRIFT_REMEDIATION_CANDIDATES

CORE.V_AI_STALE_REVIEW_CANDIDATES

CORE.V_AI_POLICY_REMEDIATION_CANDIDATES

CORE.V_AI_GOVERNANCE_RECOVERY_READINESS

CORE.V_AI_AUTOMATION_COMMAND_QUEUE

Rules:

automation may create internal remediation workflow records

automation MUST NOT certify

automation MUST NOT publish

automation MUST NOT mutate registry/proof state

46 — GOVERNANCE EXECUTION GOVERNANCE

AI_LAYER_EXECUTION_GOVERNANCE.sql

Purpose:

governance execution state transitions

remediation execution audit

human approval for governance recovery

certification eligibility candidate visibility

Defines:

CORE.SP_AI_TRANSITION_GOVERNANCE_STATE

CORE.SP_AI_EXECUTE_REMEDIATION

CORE.SP_AI_APPROVE_GOVERNANCE_RECOVERY

CORE.V_AI_LATEST_GOVERNANCE_STATE

CORE.V_AI_GOVERNANCE_EXECUTION_AUDIT

CORE.V_AI_GOVERNANCE_APPROVAL_AUDIT

CORE.V_AI_CERTIFICATION_ELIGIBILITY_CANDIDATES

Rules:

execution governance is internal operational control

eligibility is advisory/candidate visibility only

no automatic certification

no automatic publication

no registry/proof mutation

47 — GOVERNANCE CONTINUOUS MONITORING

AI_LAYER_CONTINUOUS_MONITORING.sql

Purpose:

creates and manages continuous monitoring for certified/public records

computes trust decay analytics

identifies recertification candidates

creates recertification queue entries

Defines:

CORE.SP_AI_RUN_CONTINUOUS_MONITORING

CORE.SP_AI_PROCESS_MONITORING_AGING

CORE.V_AI_TRUST_DECAY_ANALYTICS

CORE.V_AI_RECERTIFICATION_CANDIDATES

CORE.V_AI_RECERTIFICATION_QUEUE

Rules:

monitoring is internal governance oversight

recertification queue is internal workflow state

no automatic decertification

no automatic publication change

no proof mutation

48 — GOVERNANCE SIMULATION + STRESS TESTING

AI_LAYER_SIMULATION_STRESS_TESTING.sql

Purpose:

creates simulation scenarios

runs governance stress simulations

calculates simulated risk and trust decay deltas

provides simulation impact and dashboard rollups

prevents accidental duplicate scenario/run drift

Defines:

CORE.SP_AI_CREATE_SIMULATION_SCENARIO

CORE.SP_AI_RUN_GOVERNANCE_SIMULATION

CORE.V_AI_SIMULATION_SCENARIO_LIBRARY

CORE.V_AI_SIMULATION_RUN_SUMMARY

CORE.V_AI_SIMULATION_IMPACT

CORE.V_AI_SIMULATION_DASHBOARD_ROLLUP

Rules:

simulation is operational analysis only

simulation MUST NOT alter certification

simulation MUST NOT alter publication

simulation MUST NOT alter registry state

simulation MUST NOT alter proof state

duplicate scenario prevention required

recent duplicate run prevention required

49 — GOVERNANCE TIMELINE

AI_LAYER_GOVERNANCE_TIMELINE.sql

Purpose:

unified chronological internal governance event stream

combines observations, recommendations, reviews, consensus, drift, remediation, workflow actions, execution, approvals, and simulations

supports dashboards, investigations, explainability, regulator review, future UI timelines, and enterprise oversight APIs

Defines:

CORE.V_AI_GOVERNANCE_TIMELINE

CORE.V_AI_GOVERNANCE_TIMELINE_LATEST

CORE.V_AI_GOVERNANCE_TIMELINE_ROLLUP

Rules:

timeline is read-only visibility

no certification mutation

no publication mutation

no registry mutation

no proof mutation

timeline does not create source events

timeline only projects existing Snowflake governance records

50 — SCORING ENGINE

GAFAIG - Governance Scoring (Enterprise v1.2).sql

Defines:

CORE.V_GOVERNANCE_SCORE_CASE

CORE.V_CASE_TIER_BAND

Rules:

Snowflake-only scoring

deterministic execution

private trust computation

60 — PUBLICATION

ACTIVE

GAFAIG - CORE.REGISTRY_PUBLISH_V4.sql

Defines:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4

Behavior:

PUBLISH = TRUE → public record

PUBLISH = FALSE → private snapshot

Rules:

explicit publication required

append-only registry

publication separate from certification

private snapshots are allowed

unpublished snapshots must not surface publicly

LEGACY

GAFAIG - CORE.REGISTRY_PUBLISH.sql

Defines:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Status:

compatibility only

not canonical

do not use for new logic

70 — SEED DATA

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Rules:

ONLY canonical seed file

MUST use procedures

MUST NOT insert registry rows directly

MUST NOT bypass publication procedure

seed data is for testing and platform buildout only

Do not create additional seed files.

Future seed expansion must happen by editing the canonical/master seed file or by modifying canonical files before/after it in the run order.

80 — VALIDATION

99_RUN_CANONICAL_PIPELINE.sql

Purpose:

canonical validation runner

non-destructive validation

system integrity verification

Snowflake object presence checks

adaptive governance intelligence infrastructure validation

publication enforcement validation

operational dependency validation

verification enforcement validation

deterministic governance integrity validation

canonical operational layering validation

governance observability validation

lifecycle observability validation

Validates:

tables

views

procedures

publication enforcement

adaptive governance intelligence infrastructure existence

adaptive governance intelligence infrastructure isolation

governance operations views

governance orchestration views

adaptive governance intelligence consensus governance

governance policy/risk/drift

governance remediation/automation/execution

governance continuous monitoring

governance simulation/stress testing

governance timeline

registry visibility

verification integrity

Current status:

evolving into canonical deterministic governance validation authority infrastructure

Current validation scope includes:

publication enforcement validation

verification enforcement validation

operational dependency validation

deterministic governance integrity validation

canonical operational layering validation

adaptive governance intelligence operational validation

governance observability validation

lifecycle observability validation

Current validation marker:

GAFAIG_CANONICAL_PIPELINE_VALIDATION_COMPLETE

97B_SMOKE_TEST_APPLICATION_TO_CASE_BRIDGE.sql

Purpose:

application-to-case bridge smoke testing

97C_SMOKE_TEST_FINDINGS_EVIDENCE_SCORING.sql

Purpose:

findings, evidence, and scoring smoke testing

97D_SMOKE_TEST_DECISION_LIFECYCLE.sql

Purpose:

decision lifecycle smoke testing

97E_SMOKE_TEST_LIFECYCLE_OBSERVABILITY.sql

Purpose:

lifecycle observability smoke testing

98_SMOKE_TEST_REGISTRY_PUBLIC_SURFACE.sql

Purpose:

public registry smoke testing

verifies published/public registry surface

98_END_TO_END_CERTIFICATION_DEMO.sql

Purpose:

end-to-end certification demo validation

98_ENVIRONMENT_DIAGNOSTICS.sql

Purpose:

environment diagnostics

98_DIAGNOSTICS_PUBLIC_VIEWS.sql

Purpose:

public view diagnostics

81 — GOVERNANCE INTELLIGENCE INFRASTRUCTURE

Purpose:

governance intelligence synchronization infrastructure

governance telemetry synchronization infrastructure

governance orchestration synchronization infrastructure

public governance intelligence propagation infrastructure

governance trust surface infrastructure

global governance orchestration infrastructure

global governance public intelligence infrastructure

global governance trust surface infrastructure

deterministic governance orchestration infrastructure

governance intelligence freeze-lock infrastructure

Files:

101A_FOUNDATION_GOVERNANCE_BASELINE.sql

101_VIEWS_GOVERNANCE_COORDINATION_INTELLIGENCE.sql

102_VIEWS_GOVERNANCE_DISTRIBUTION_INTELLIGENCE.sql

103_VIEWS_GOVERNANCE_NETWORK_INTELLIGENCE.sql

104_VIEWS_GOVERNANCE_TELEMETRY_INTELLIGENCE.sql

105_VIEWS_GOVERNANCE_RESILIENCE_INTELLIGENCE.sql

106_VIEWS_GOVERNANCE_STABILITY_INTELLIGENCE.sql

107_VIEWS_GOVERNANCE_CONTINUITY_INTELLIGENCE.sql

108_VIEWS_GLOBAL_GOVERNANCE_ORCHESTRATION.sql

109_VIEWS_GLOBAL_GOVERNANCE_PUBLIC_INTELLIGENCE.sql

110_VIEWS_GLOBAL_GOVERNANCE_TRUST_SURFACE.sql

Rules:

projection-only

deterministic synchronization only

publication-safe governance intelligence projection only

no governance authority mutation

no registry mutation

no certification mutation

no publication mutation

governance network intelligence synchronization

governance telemetry intelligence synchronization

governance resilience intelligence synchronization

governance stability intelligence synchronization

governance continuity intelligence synchronization

global governance orchestration synchronization

global governance public intelligence synchronization

global governance trust surface synchronization

governance intelligence synchronization infrastructure

governance intelligence freeze-lock infrastructure

82 — GOVERNANCE INTELLIGENCE VALIDATION + FREEZE-LOCK INFRASTRUCTURE

Files:

109A_SMOKE_TEST_GOVERNANCE_INTELLIGENCE_STACK.sql

109B_CANONICAL_GOVERNANCE_INTELLIGENCE_FREEZE.sql

Purpose:

governance intelligence synchronization validation

orchestration propagation validation

public governance intelligence propagation validation

governance trust surface propagation validation

deterministic governance observability validation

governance intelligence freeze-lock stabilization

pre-analytics expansion stabilization

deterministic governance continuity checkpointing

governance orchestration continuity validation

Rules:

validation-only

non-destructive

append-safe

deterministic

freeze-lock checkpoint safe

publication-safe

verification-safe

PUBLIC GOVERNANCE TRUST LAYER

PUBLIC API CONTRACTS

Operational APIs:

/api/registry

/api/registry/search

/api/verify/[registryId]

/api/badge/[registryId]

/app/api/apply/route.ts

app/api/auth/*

Source:

CORE.V_REGISTRY_PUBLIC

Rules:

projection only

no recomputation

no private records

no unpublished records

no trust logic in API

no scoring logic in API

no publication logic in API

no ID generation in API

publication-bound verification enforcement

verification-safe trust distribution

append-only public governance trust projection enforcement

PUBLIC UI CONTRACTS

Core public pages:

app/page.tsx

app/mission/page.tsx

app/framework/page.tsx

app/registry/page.tsx

app/registry/[registryId]/page.tsx

app/explorer/page.tsx

app/verify/page.tsx

app/verify/[registryId]/page.tsx

app/demo/page.tsx

app/apply/page.tsx

app/apply/intake/page.tsx

app/apply/review/page.tsx

app/apply/success/[applicationId]/page.tsx

app/developers/page.tsx

Planned applicant portal pages:

app/portal/page.tsx

app/portal/applications/page.tsx

app/portal/application/[applicationId]/page.tsx

app/login/page.tsx

app/register/page.tsx

Rules:

UI is display only

no trust computation

no scoring computation

no publication computation

no registry mutation

no proof reconstruction

no internal/private ID exposure unless explicitly intended for internal/admin workflows

WIDGET / SDK CONTRACTS

Operational files:

public/widget/gafaig-widget.js

public/widget/gafaig-widget.v1.js

public/widget/gafaig-verify.js

public/widget/gafaig-verify.v1.js

public/sdk/gafaig.v1.js

Rules:

external governance trust signal display only

verification must call canonical verify endpoint

must not reconstruct proof payloads

must not infer trust from UI state

must not expose unpublished records

VERIFICATION RULES

Verification MUST use:

proof.messageString ONLY

Never:

reconstruct payloads

verify from JSON fields

mutate signed payloads

trust UI-computed values

trust API-computed values

Verification trust requires:

Snowflake-originated public record

canonical messageString

signature

public key

fail-closed verification behavior

publication-bound verification enforcement

deterministic verification enforcement

verification infrastructure hardening

ADAPTIVE GOVERNANCE INTELLIGENCE INFRASTRUCTURE RULES

Adaptive governance intelligence infrastructure is advisory and operational unless explicitly handled by deterministic Snowflake governance procedures.

Adaptive governance intelligence infrastructure:

observes

detects patterns

generates recommendations

supports human review

supports consensus

detects policy gaps

calculates internal risk/drift

creates remediation workflow

supports automation

tracks execution governance

monitors certified records

simulates stress scenarios

produces internal governance timeline visibility

generates governance continuity intelligence

generates operational governance intelligence

Adaptive governance intelligence infrastructure DOES NOT:

score certification

certify

publish

modify public registry visibility

override Snowflake

modify signed payloads

mutate proof state

Adaptive governance intelligence outputs require human review and/or controlled Snowflake governance processes before any downstream governance usage.

Adaptive governance intelligence infrastructure remains operationally subordinate to deterministic governance authority.

ADAPTIVE GOVERNANCE INTELLIGENCE INFRASTRUCTURE DATA FLOW

Verification Pipeline (Snowflake)
↓
Adaptive Governance Intelligence Input Views (CORE.V_AI_*)
↓
Adaptive Governance Intelligence Ingestion
↓
Governance Observation Generation
↓
Governance Recommendations
↓
Human Review
↓
Consensus Governance
↓
Policy Matching
↓
Risk + Drift
↓
Remediation
↓
Automation
↓
Execution Governance
↓
Continuous Monitoring
↓
Simulation / Stress Testing
↓
Governance Timeline

ADAPTIVE GOVERNANCE INTELLIGENCE INFRASTRUCTURE ISOLATION GUARANTEE

Adaptive governance intelligence infrastructure is isolated from:

CORE.CASE_SCORE_SNAPSHOTS

CORE.DECISIONS

CORE.REGISTRY_SNAPSHOTS

CORE.V_REGISTRY_PUBLIC

verification signature system

Unless an explicit canonical Snowflake procedure is built to bridge states, adaptive governance intelligence infrastructure must not mutate certification, publication, registry, or proof state.

Violation = system corruption

AUTHORITATIVE GOVERNANCE BOUNDARY

Deterministic governance authority remains permanently authoritative.

Adaptive governance intelligence infrastructure may:

observe

recommend

escalate

generate governance intelligence

trigger governance review workflows

Adaptive governance intelligence infrastructure may NEVER directly:

certify

publish

verify

revoke

mutate registry authority

mutate verification authority

alter deterministic governance state

without deterministic Layer 1 governance authority execution.

COMMUNICATION LAYER ARCHITECTURE

GAFAIG now operates simultaneously across:

Layer 1:
Public Human Narrative

Audience:

citizens

consumers

workers

humanity

Focus:

accountability

governance visibility

public understanding

public legitimacy

Future domain:

theglobalauthorityforaigovernance.com

Layer 2:
Institutional Governance Infrastructure

Audience:

enterprises

regulators

governments

governance professionals

Focus:

governance operations

certification surfaces

governance observability

public governance trust infrastructure

deterministic governance authority infrastructure

adaptive governance intelligence infrastructure

governance observability infrastructure

Primary domain:

gafaig.com

Layer 3:
Developer / Verification Infrastructure

Audience:

developers

integrators

auditors

Focus:

proof.messageString

Ed25519

SDKs

APIs

cryptographic verification

deterministic governance authority infrastructure

public governance trust infrastructure

Narrative legitimacy is now considered:

critical infrastructure.

PUBLIC ACCOUNTABILITY INFRASTRUCTURE

GAFAIG is evolving into public accountability infrastructure for artificial intelligence.

The registry is NOT the platform itself.

The registry is:

the visible public governance trust manifestation layer.

The long-term objective is:

machine-verifiable human accountability for artificial intelligence systems.

Public accountability infrastructure requires:

deterministic source-of-truth governance records

publication-controlled certification surfaces

append-only registry behavior

cryptographic verification

public governance legitimacy

governance visibility

verification portability

governance trust distribution

deterministic operational governance integrity

publication enforcement integrity

verification enforcement integrity

operational governance auditability

adaptive governance intelligence infrastructure preparation

CURRENT SYSTEM STATE

WORKING:

communication layer architecture

narrative infrastructure stabilization

governance trust distribution infrastructure

public accountability infrastructure

governance legitimacy infrastructure

deterministic Snowflake pipeline

cryptographic verification

publication enforcement

append-only registry

public visibility enforcement

deterministic governance authority infrastructure

adaptive governance intelligence infrastructure

governance observability infrastructure

publication governance infrastructure

lifecycle observability infrastructure

applicant continuity infrastructure preparation

adaptive governance intelligence ingestion pipeline

governance observation generation

governance recommendation generation

human review workflow

governance feedback loop

governance observability analytics views

governance operations dashboard

governance orchestration layer

multi-review consensus governance

latest consensus view

policy engine

policy exposure rollups

risk + drift engine

remediation orchestration

automation engine

execution governance

continuous monitoring

recertification queue

simulation + stress testing

duplicate scenario protection

duplicate simulation run protection

simulation dashboard rollup

unified governance timeline

deterministic governance authority validation infrastructure

canonical operational layering

operational dependency stabilization

publication enforcement hardening

verification enforcement hardening

deterministic governance operational validation

governance intelligence infrastructure maturity

governance telemetry synchronization maturity

governance coordination intelligence maturity

governance distribution intelligence maturity

governance network intelligence maturity

governance resilience intelligence maturity

governance stability intelligence maturity

governance continuity intelligence maturity

global governance orchestration maturity

global governance public intelligence maturity

global governance trust surface maturity

governance intelligence synchronization maturity

governance intelligence freeze-lock maturity

deterministic governance orchestration maturity

public governance intelligence propagation maturity

CURRENT PHASE:

PHASE 11B — GOVERNANCE INTELLIGENCE SYNCHRONIZATION + GLOBAL GOVERNANCE ORCHESTRATION + PUBLIC GOVERNANCE TRUST SURFACE STABILIZATION

Current hardening priorities include:

Layer 1 — Deterministic Governance Authority Infrastructure hardening

Layer 2 — Adaptive Governance Intelligence Infrastructure preparation

RECENTLY VALIDATED:

AI_LAYER_SIMULATION_STRESS_TESTING.sql

AI_LAYER_GOVERNANCE_TIMELINE.sql

99_RUN_CANONICAL_PIPELINE.sql

CANONICAL_RUN_ORDER.md

GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md

GAFAIG_VS_CODE_File_Tree.md

GAFAIG_CANONICAL_SUMMARY.md

NEXT BUILD PHASE PRIORITIES:

canonical rebuild stabilization

operational dependency stabilization

publication enforcement hardening

verification infrastructure hardening

lifecycle propagation stabilization

governance observability stabilization

operational governance workflow depth

adaptive governance intelligence infrastructure preparation

enterprise scalability preparation

operational simplicity preservation

deterministic governance operational maturity

progressive governance infrastructure scaling

CANONICAL OPERATIONAL STATUS

ACTIVE

GAFAIG now operates as:

deterministic governance operating infrastructure

with:

canonical operational layering

deterministic operational validation

publication enforcement infrastructure

verification enforcement infrastructure

operational dependency discipline

governance observability infrastructure

public governance trust infrastructure

adaptive governance intelligence infrastructure preparation

The platform is evolving from:

deterministic certification infrastructure

toward:

deterministic adaptive governance infrastructure

while preserving:

Snowflake-first authority

append-only registry integrity

publication separation

proof.messageString verification doctrine

adaptive governance intelligence advisory-only boundaries

operational simplicity during enterprise scalability expansion

FINAL AUTHORITATIVE GOVERNANCE PRINCIPLE

GAFAIG intentionally separates:

deterministic governance authority

adaptive governance intelligence

governance observability

public governance trust infrastructure

This separation preserves:

governance determinism

governance auditability

publication integrity

verification integrity

registry integrity

institutional trust continuity

international governance defensibility

Deterministic governance authority remains permanently authoritative.

FINAL RULE

If a file is not listed here:

It is NOT canonical.
END OF FILE