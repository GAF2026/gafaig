GAFAIG_ACTIVE_FILE_MAP.md
Last Updated: 2026-05-07
PURPOSE
This document defines the authoritative active file map for GAFAIG (Global Authority for AI Governance).
GAFAIG is a deterministic global AI governance infrastructure platform that enables organizations, AI systems, regulators, enterprises, governments, research institutions, universities, laboratories, non-profits, technology providers, and governance stakeholders to manage, evaluate, certify, publish, verify, monitor, observe, and coordinate AI governance outcomes through Snowflake-originated public trust records and cryptographic proof infrastructure.
This file establishes:


canonical Snowflake files


canonical procedures


canonical views


canonical validation runners


active AI governance layer files


governance observability ownership


governance simulation ownership


remediation orchestration ownership


public trust layer ownership


publication enforcement ownership


AI operational governance ownership


Snowflake ↔ VS Code parity expectations


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
This evolution reflects the expansion of GAFAIG into:


deterministic certification infrastructure


governance execution infrastructure


governance intelligence infrastructure


governance observability infrastructure


governance simulation infrastructure


remediation orchestration infrastructure


append-only publication infrastructure


cryptographic public trust infrastructure


independent verification infrastructure


global governance coordination infrastructure


CRITICAL:
This positioning evolution must NOT weaken:


Snowflake-first execution


deterministic trust guarantees


publication control


append-only registry behavior


proof.messageString verification enforcement


cryptographic verification integrity


fail-closed verification behavior


AI advisory-only boundaries


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


AI recommendation


AI review


AI consensus


AI risk state


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
→ AI INPUT
→ AI OBSERVATIONS
→ AI RECOMMENDATIONS
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

ACTIVE CANONICAL FILES
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


governance intelligence


governance simulations


governance observability


remediation orchestration


public trust infrastructure


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

15 — AI LAYER TABLES
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


AI tables are advisory and operational only unless explicitly consumed by later deterministic Snowflake governance procedures.

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

25 — AI INPUT VIEWS
AI_LAYER_INPUT_VIEWS.sql
Defines:


CORE.V_AI_CASE_INPUT


CORE.V_AI_FINDING_INPUT


CORE.V_AI_EVIDENCE_INPUT


CORE.V_AI_EVENT_INPUT


CORE.V_AI_DECISION_INPUT


CORE.V_AI_REGISTRY_SNAPSHOT_INPUT


Purpose:


deterministic AI input layer


read-only AI analysis surface


Rules:


MUST NOT use public views as source of private AI analysis


MUST NOT use UI-derived fields


MUST NOT introduce scoring logic


MUST NOT mutate source data



30 — CORE PROCEDURES
23_SP_CREATE_CASE_FROM_APPLICATION.sql
24_PROCEDURES_APPLICATION_INTAKE.sql
24_SP_SCORE_CASE_ENTERPRISE.sql
25_PROCEDURES_APPROVAL.sql
26_PROCEDURES_FINDINGS.sql
26_PROCEDURES_FINDINGS_UPDATE.sql
27_PROCEDURES_EVIDENCE.sql
28_PROCEDURES_FINDING_EVIDENCE.sql
Rules:


deterministic transitions only


no external scoring


no API-generated IDs


no UI-generated IDs



35 — AI GENERATION + REVIEW LAYER
AI_LAYER_INGESTION_PROCEDURES.sql
Purpose:


AI ingestion


controlled AI writes


AI_LAYER_OBSERVATION_GENERATOR.sql
Defines:


CORE.SP_AI_GENERATE_CASE_OBSERVATIONS


Purpose:


deterministic observation generation


governance pattern detection


recommendation generation


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





36 — AI GOVERNANCE FEEDBACK
AI_LAYER_GOVERNANCE_FEEDBACK.sql
Purpose:


converts reviewed AI recommendations into internal governance feedback


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



37 — AI FEEDBACK VALIDATION
AI_LAYER_FEEDBACK_VALIDATION.sql
Purpose:


validates AI feedback outputs


detects missing/risky feedback mappings


supports internal validation of recommendation promotion


Rules:


validation only


no certification mutation


no registry mutation


no proof mutation



38 — AI ANALYTICS VIEWS
AI_LAYER_ANALYTICS_VIEWS.sql
Purpose:


operational analytics over observations, recommendations, reviews, standard updates, and risk patterns


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



39 — AI OPERATIONS DASHBOARD
AI_LAYER_OPERATIONS_DASHBOARD.sql
Purpose:


internal AI governance operations dashboard layer


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



40 — AI ORCHESTRATION
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



41 — AI HUMAN CONSENSUS + MULTI-REVIEW GOVERNANCE
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



42 — AI POLICY ENGINE
AI_LAYER_POLICY_ENGINE.sql
Purpose:


maps AI recommendations to governance policy domains


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



43 — AI RISK + DRIFT ENGINE
AI_LAYER_RISK_AND_DRIFT_ENGINE.sql
Purpose:


calculates internal AI governance risk


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



44 — AI REMEDIATION + WORKFLOW ORCHESTRATION
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



45 — AI AUTOMATION ENGINE
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



46 — AI EXECUTION GOVERNANCE
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



47 — AI CONTINUOUS MONITORING
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



48 — AI SIMULATION + STRESS TESTING
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



49 — AI GOVERNANCE TIMELINE
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


AI governance layer validation


publication enforcement validation


Validates:


tables


views


procedures


publication enforcement


AI layer existence


AI isolation


AI operations views


AI orchestration views


AI consensus governance


AI policy/risk/drift


AI remediation/automation/execution


AI continuous monitoring


AI simulation/stress testing


AI governance timeline


registry visibility


verification integrity


Current status:


ran successfully on 2026-05-07


returned GAFAIG_CANONICAL_PIPELINE_VALIDATION_COMPLETE


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



PUBLIC TRUST LAYER
PUBLIC API CONTRACTS
Operational APIs:


/api/registry


/api/registry/search


/api/verify/[registryId]


/api/badge/[registryId]


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


app/apply/success/[applicationId]/page.tsx


app/developers/page.tsx


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


external trust signal display only


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



AI LAYER SYSTEM RULES
AI is advisory and operational unless explicitly handled by Snowflake governance procedures.
AI:


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


AI DOES NOT:


score certification


certify


publish


modify public registry visibility


override Snowflake


modify signed payloads


mutate proof state


AI outputs require human review and/or controlled Snowflake governance processes before any downstream governance usage.

AI LAYER DATA FLOW
Verification Pipeline (Snowflake)
↓
AI Input Views (CORE.V_AI_*)
↓
AI Ingestion
↓
AI Observation Generation
↓
AI Recommendations
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

AI LAYER ISOLATION GUARANTEE
AI layer is isolated from:


CORE.CASE_SCORE_SNAPSHOTS


CORE.DECISIONS


CORE.REGISTRY_SNAPSHOTS


CORE.V_REGISTRY_PUBLIC


verification signature system


Unless an explicit canonical Snowflake procedure is built to bridge states, AI must not mutate certification, publication, registry, or proof state.
Violation = system corruption

CURRENT SYSTEM STATE
WORKING:


deterministic Snowflake pipeline


cryptographic verification


publication enforcement


append-only registry


public visibility enforcement


AI ingestion pipeline


AI observation generation


AI recommendation generation


human review workflow


governance feedback loop


AI analytics views


AI operations dashboard


AI orchestration layer


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


unified AI governance timeline


canonical validation runner with AI governance layer coverage


CURRENT PHASE:
GLOBAL AI GOVERNANCE INFRASTRUCTURE EXPANSION + DOCUMENTATION ALIGNMENT
RECENTLY VALIDATED:


AI_LAYER_SIMULATION_STRESS_TESTING.sql


AI_LAYER_GOVERNANCE_TIMELINE.sql


99_RUN_CANONICAL_PIPELINE.sql


CANONICAL_RUN_ORDER.md


GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md


GAFAIG_VS_CODE_File_Tree.md


GAFAIG_CANONICAL_SUMMARY.md


NEXT BUILD PHASE OPTIONS:


AI governance graph


AI governance replay


agentic governance planning layer


enterprise oversight API design


internal admin UI/dashboard integration


governance observability UI


governance simulation UI


documentation lock-in and run-order parity



FINAL RULE
If a file is not listed here:
It is NOT canonical.
END OF FILE