# OPERATIONAL_GUIDANCE_KNOWN_LIMITATIONS.md

Last Updated: 2026-08-11

# PURPOSE

This document defines the canonical known-limitations, operational-risk, and
open-issue record for the GAFAIG Operational Guidance implementation.

It identifies conditions that remain intentionally unresolved, externally
dependent, operationally constrained, or not yet production-proven.

This document exists to prevent known limitations from being mistaken for
implemented capability and to prevent unresolved conditions from being
silently inferred away.

Snowflake remains the source of truth.

Human governance authority remains supreme.

Operational Guidance remains advisory, read-only, deterministic, and
non-authoritative.

------------------------------------------------------------------------

# STATUS

This is an Operational Guidance production-readiness document.

It records known limitations and operational risks.

It does not authorize implementation.

It does not authorize SQL.

It does not authorize schema modification.

It does not authorize API modification.

It does not authorize workflow modification.

It does not authorize repository mutation.

It does not create constitutional authority.

It does not create governance authority.

It does not create certification authority.

It does not create publication authority.

It does not create registry authority.

It does not create verification authority.

------------------------------------------------------------------------

# LIMITATION CLASSIFICATION

Each recorded item uses one of the following classifications:

KNOWN LIMITATION

A capability is intentionally unavailable, incomplete, or unresolved in the
current implementation.

OPERATIONAL RISK

Implemented behavior exists, but a production-operational condition requires
continued control or observation.

OPEN ISSUE

A condition requires future investigation, verification, or authorized
implementation before it can be considered closed.

EXTERNAL DEPENDENCY

The condition depends on infrastructure, authoritative data, deployment
configuration, or another system outside the Guidance engine itself.

------------------------------------------------------------------------

# DISPOSITION CLASSIFICATION

Each item uses one of the following dispositions:

ACCEPTED

The condition is understood and may remain in the current implementation.

MONITOR

The condition is operationally acceptable but should remain observable.

REQUIRES VERIFICATION

The implementation or production environment requires additional evidence.

DEFERRED

Resolution belongs to a future authorized implementation phase.

ESCALATE IF OBSERVED

The condition is not necessarily occurring, but observation in production
requires escalation.

------------------------------------------------------------------------

# OG-KL-001 — CANONICAL REPOSITORY RELATIONSHIP RUNTIME SOURCE

Classification:

KNOWN LIMITATION

Disposition:

DEFERRED

Current State:

The Operational Guidance implementation does not currently have an
authoritative canonical runtime source for repository relationships.

Relationship context therefore remains:

UNRESOLVED

where no authoritative relationship source is available.

The runtime explicitly does not infer relationships from:

- shared case identifiers;
- shared organization identifiers;
- temporal proximity;
- repository co-occurrence;
- naming similarity;
- apparent operational association.

Operational Effect:

Repository Context may remain INCOMPLETE.

Downstream Composite Guidance and Operational Summary may therefore also remain
INCOMPLETE where relationship completeness is required.

Required Behavior:

Preserve the unresolved condition.

Do not manufacture repository relationships merely to obtain AVAILABLE
Guidance.

Authority Boundary:

Resolution of this limitation requires separately authorized relationship
implementation and does not arise from Operational Guidance support or
recovery authority.

------------------------------------------------------------------------

# OG-KL-002 — EXTERNAL PRODUCTION OBSERVABILITY

Classification:

KNOWN LIMITATION / EXTERNAL DEPENDENCY

Disposition:

REQUIRES VERIFICATION

Current State:

Operational Guidance has implemented application-level structured telemetry.

Runtime verification has demonstrated telemetry for the Guidance execution
chain, including:

- Repository Context;
- Next Action;
- Blocking;
- Waiting-On;
- Composite Guidance;
- Operational Summary.

Telemetry includes operational metadata such as:

- correlationId;
- engineName;
- engineVersion;
- status;
- execution timestamps;
- duration;
- failure information where applicable;
- case-scope presence without requiring the case identifier itself.

The existence of application telemetry does not establish that a dedicated
external production log aggregation, alerting, or observability provider has
been configured.

Operational Effect:

Application-level events are available to the runtime log stream.

Centralized retention, alert routing, dashboards, and external incident
notification are not certified by the Operational Guidance implementation
alone.

Required Behavior:

Do not describe external production monitoring or alerting as certified until
the production deployment environment is separately verified.

------------------------------------------------------------------------

# OG-KL-003 — PRODUCTION ALERT THRESHOLDS

Classification:

OPERATIONAL RISK

Disposition:

MONITOR

Current State:

Operational Guidance supports a configurable slow-execution threshold through:

GAFAIG_GUIDANCE_SLOW_THRESHOLD_MS

The current development configuration uses:

2000 milliseconds

This provides application-level slow-execution telemetry.

A production incident-response threshold model based on production traffic
history has not yet been established by this document.

Operational Effect:

Slow execution can be identified.

Production-specific performance baselines may require future adjustment based
on observed workload.

Required Behavior:

Threshold changes must address operational performance only.

They must not alter deterministic Guidance rules or authority boundaries.

------------------------------------------------------------------------

# OG-KL-004 — TELEMETRY RETENTION

Classification:

EXTERNAL DEPENDENCY

Disposition:

REQUIRES VERIFICATION

Current State:

Operational Guidance emits structured application telemetry.

Long-term production retention is dependent on the production hosting and
observability environment.

This implementation does not itself create a telemetry persistence database.

Operational Effect:

Historical availability of telemetry depends on the production logging
configuration.

Required Behavior:

Do not treat application telemetry as a permanent governance or audit record.

Telemetry remains operational evidence and is not a replacement for
authoritative Snowflake state.

------------------------------------------------------------------------

# OG-KL-005 — SNOWFLAKE AVAILABILITY

Classification:

EXTERNAL DEPENDENCY

Disposition:

MONITOR

Current State:

Operational Guidance depends on authoritative Snowflake reads.

Repository Context requires access to authoritative workflow and repository
records.

Operational Effect:

Snowflake connection or query failure may cause Guidance to become UNAVAILABLE,
UNRESOLVED, INCOMPLETE, or otherwise fail closed depending on the affected
dependency.

Required Behavior:

Do not substitute cached, invented, or inferred authoritative state merely to
keep Guidance available.

Snowflake remains the source of truth.

------------------------------------------------------------------------

# OG-KL-006 — SNOWFLAKE WRITE AUTHORITY

Classification:

OPERATIONAL RISK

Disposition:

ESCALATE IF OBSERVED

Current State:

Operational Guidance is designed as a read-only advisory capability.

Review of the Operational Guidance implementation did not identify Guidance
SQL write operations.

No new Operational Guidance SQL files were identified during the implementation
review.

Operational Effect:

Operational Guidance should not require INSERT, UPDATE, DELETE, MERGE, CREATE,
ALTER, DROP, TRUNCATE, or authoritative mutation procedures in order to
resolve Guidance.

Required Behavior:

Any future discovery that Operational Guidance requires or performs
authoritative writes must be treated as an authority-boundary issue and
reviewed before production use.

------------------------------------------------------------------------

# OG-KL-007 — APPLICATION AUTHENTICATION TRANSITION

Classification:

OPERATIONAL RISK

Disposition:

MONITOR

Current State:

Applicant Guidance access has been validated using signed applicant sessions.

Authenticated same-organization access succeeds.

Unauthenticated Guidance access fails.

Organization-scope failure behavior has also been demonstrated.

Legacy/demo authentication mechanisms may continue to exist elsewhere in the
application for backward compatibility or development purposes.

Operational Effect:

Production Guidance security depends on preserving signed-session and
organization-scope enforcement.

Required Behavior:

Production applicant Guidance must not rely on a shared demo cookie as its
security boundary.

Any authentication bypass requires immediate escalation.

------------------------------------------------------------------------

# OG-KL-008 — ORGANIZATION SCOPE

Classification:

OPERATIONAL RISK

Disposition:

ESCALATE IF OBSERVED

Current State:

Operational Guidance preserves applicant organization scope.

Runtime validation demonstrated:

- authenticated access to a visible organization-scoped case;
- rejection of an unauthenticated Guidance request;
- fail-closed behavior for a case not visible within the authenticated
  organization scope.

Operational Effect:

Organization isolation is a critical production boundary.

Required Behavior:

Any suspected cross-organization data visibility must be treated as a critical
incident.

Organization scope must never be broadened as a recovery shortcut.

------------------------------------------------------------------------

# OG-KL-009 — GUIDANCE RESULT COMPLETENESS

Classification:

KNOWN LIMITATION

Disposition:

ACCEPTED

Current State:

A successful HTTP request does not imply that every Guidance component is
AVAILABLE.

Valid deterministic outcomes may include:

- AVAILABLE;
- READY;
- BLOCKED;
- WAITING;
- INCOMPLETE;
- UNRESOLVED;
- NOT_VISIBLE;
- UNAUTHORIZED;
- INCONSISTENT;
- STALE;
- UNAVAILABLE;
- ERROR;
- NOT_ELIGIBLE.

Operational Effect:

Participant-facing Guidance may legitimately remain incomplete when
authoritative dependencies are incomplete.

Required Behavior:

Do not transform a legitimate INCOMPLETE or UNRESOLVED result into AVAILABLE
for presentation convenience.

------------------------------------------------------------------------

# OG-KL-010 — HTTP STATUS AND GUIDANCE STATUS DISTINCTION

Classification:

KNOWN LIMITATION

Disposition:

ACCEPTED

Current State:

HTTP transport success and Guidance semantic status are separate concepts.

A request may successfully execute at the HTTP layer while returning a
Guidance state such as INCOMPLETE.

Conversely, fail-closed conditions may use HTTP error status codes appropriate
to authentication, visibility, conflict, dependency, or execution failure.

Operational Effect:

Monitoring and support must evaluate both:

- HTTP status;
- Guidance status.

Required Behavior:

Do not use HTTP 200 alone as evidence that all authoritative Guidance
dependencies resolved successfully.

------------------------------------------------------------------------

# OG-KL-011 — GUIDANCE TELEMETRY DATA MINIMIZATION

Classification:

OPERATIONAL RISK

Disposition:

MONITOR

Current State:

Operational Guidance telemetry is intentionally designed to avoid requiring
sensitive operational payload data.

Telemetry should not require:

- case identifiers;
- organization names;
- applicant email addresses;
- repository payloads;
- evidence contents;
- source record contents;
- session tokens;
- passwords;
- signing keys;
- Snowflake credentials.

Operational Effect:

Troubleshooting relies primarily on correlation IDs and execution metadata.

Required Behavior:

Future telemetry expansion must preserve data minimization unless separately
reviewed and authorized.

------------------------------------------------------------------------

# OG-KL-012 — GUIDANCE PERFORMANCE

Classification:

OPERATIONAL RISK

Disposition:

MONITOR

Current State:

Repository Context performs authoritative Snowflake reads.

Its latency may therefore exceed the execution time of downstream deterministic
in-memory Guidance engines.

Operational Effect:

Snowflake connectivity, connection creation, query execution, and production
runtime conditions may affect Guidance response time.

Required Behavior:

Performance optimization must not:

- bypass authoritative reads;
- weaken organization scope;
- infer missing authoritative state;
- alter deterministic resolution;
- create unauthorized caching of governance conclusions.

------------------------------------------------------------------------

# OG-KL-013 — AUTOMATIC ACTION EXECUTION

Classification:

KNOWN LIMITATION

Disposition:

ACCEPTED

Current State:

Operational Guidance does not automatically execute the actions it recommends.

It does not automatically:

- resolve blockers;
- clear waiting conditions;
- reassign owners;
- advance workflow;
- mutate repositories;
- certify;
- publish;
- modify registry state;
- modify verification state.

Operational Effect:

Human or separately authorized system action remains required.

Required Behavior:

This limitation is intentional and reflects the Operational Guidance authority
boundary.

------------------------------------------------------------------------

# OG-KL-014 — GUIDANCE IS NOT GOVERNANCE AUTHORITY

Classification:

KNOWN LIMITATION

Disposition:

ACCEPTED

Current State:

Operational Guidance consumes authoritative operational state and produces
advisory deterministic Guidance.

It does not create governance authority.

Operational Effect:

A Guidance result cannot substitute for an authorized governance decision.

Required Behavior:

Human governance authority remains supreme.

------------------------------------------------------------------------

# OG-KL-015 — GUIDANCE IS NOT CERTIFICATION AUTHORITY

Classification:

KNOWN LIMITATION

Disposition:

ACCEPTED

Current State:

Operational Guidance may identify certification-related operational context.

It does not certify a participant, organization, case, system, or record.

Operational Effect:

Certification remains subject to the separately authorized certification
architecture and process.

------------------------------------------------------------------------

# OG-KL-016 — GUIDANCE IS NOT PUBLICATION OR REGISTRY AUTHORITY

Classification:

KNOWN LIMITATION

Disposition:

ACCEPTED

Current State:

Operational Guidance does not publish records and does not modify public
registry state.

Operational Effect:

Guidance output cannot itself establish publication or registry inclusion.

------------------------------------------------------------------------

# OG-KL-017 — GUIDANCE IS NOT VERIFICATION AUTHORITY

Classification:

KNOWN LIMITATION

Disposition:

ACCEPTED

Current State:

Operational Guidance does not establish cryptographic verification status.

It does not replace the canonical verification contract.

Operational Effect:

A Guidance result cannot be treated as proof that a registry record is
cryptographically verified.

------------------------------------------------------------------------

# OG-KL-018 — SUPPORT ORGANIZATION MATURITY

Classification:

KNOWN LIMITATION

Disposition:

ACCEPTED

Current State:

Operational Guidance has a defined support ownership model.

The Platform Administrator is the canonical operational owner unless an
authorized organizational support model supersedes that assignment.

A separate dedicated Operational Guidance support organization is not required
by the current implementation.

Operational Effect:

Support responsibility is defined without creating an unnecessary new
authority structure.

------------------------------------------------------------------------

# OG-KL-019 — RECOVERY AUTOMATION

Classification:

KNOWN LIMITATION

Disposition:

DEFERRED

Current State:

Operational Guidance recovery procedures are documented.

Recovery is not automatically executed by the Guidance engines.

Operational Effect:

Runtime recovery, rollback, diagnosis, and validation remain controlled
operational procedures.

Required Behavior:

Do not introduce automatic recovery that mutates authoritative state or
weakens fail-closed behavior.

------------------------------------------------------------------------

# OG-KL-020 — PRODUCTION ENVIRONMENT VERIFICATION

Classification:

OPEN ISSUE

Disposition:

REQUIRES VERIFICATION

Current State:

Operational Guidance implementation has been validated in the local development
environment through targeted checks including:

- TypeScript validation;
- Guidance smoke tests;
- signed applicant authentication;
- authenticated same-organization Guidance access;
- unauthenticated rejection;
- organization-scope fail-closed behavior;
- structured telemetry observation.

These results establish implementation evidence.

They do not by themselves establish that every production environment variable,
deployment setting, log-retention policy, alert route, or infrastructure
dependency is correctly configured in the deployed production environment.

Operational Effect:

Production deployment requires targeted environment verification.

Required Behavior:

Perform production-specific verification before declaring full Operational
Guidance production readiness.

------------------------------------------------------------------------

# OG-KL-021 — DEPENDENCY SECURITY REVIEW

Classification:

OPEN ISSUE

Disposition:

REQUIRES VERIFICATION

Current State:

During the Phase 12 controlled rollback rehearsal, dependency installation
completed successfully through npm ci.

The initial dependency audit reported:

- 23 vulnerabilities;
- 7 moderate;
- 15 high;
- 1 critical.

A subsequent production-only audit using npm audit --omit=dev reported:

- 16 production dependency vulnerabilities;
- 7 moderate;
- 8 high;
- 1 critical.

A remediation dry run using npm audit fix --omit=dev --dry-run established
that some production dependency findings have non-force remediation paths.

The dry run also established that the critical Next.js finding requires a
change from Next.js 14.2.5 to a patched version outside the currently stated
dependency range.

The Nodemailer high-severity findings likewise require a separately reviewed
breaking dependency change according to the npm remediation output.

No remediation command was executed.

The repository dependency state was not modified by the assessment.

These findings establish a dependency-security review condition.

They do not by themselves establish that every reported vulnerability is
reachable, exploitable, or applicable to the GAFAIG production execution
path.

No dependency upgrade or package modification is authorized by this known
limitations record.

Operational Effect:

Operational Guidance must not be declared fully production-ready until the
reported dependency-security condition has been assessed and an appropriate
production-readiness disposition has been recorded.

This condition does not invalidate the successful Phase 11 validation or the
successful controlled rollback rehearsal.

Required Behavior:

Perform a targeted dependency-security assessment before separate production
deployment authorization.

Determine whether the reported critical and high-severity findings affect the
GAFAIG production execution path.

Identify the appropriate remediation or risk disposition through the
authorized engineering process.

Do not run an automatic or forced dependency upgrade merely to clear the
audit result.

Preserve existing architecture, Snowflake source-of-truth doctrine, Human
Governance Authority, organization isolation, deterministic behavior, and
fail-closed behavior during any separately authorized remediation.

------------------------------------------------------------------------

# CURRENT OPEN-ISSUE SUMMARY

The following conditions remain open or externally dependent:

1. Canonical repository relationship runtime source remains unresolved.
2. External production observability configuration requires verification.
3. Production telemetry retention requires verification.
4. Production-specific alert and performance thresholds may require tuning.
5. Production environment configuration requires targeted verification.
6. Dependency-security findings from the Phase 12 rollback rehearsal require
   targeted assessment before full production readiness.

These conditions do not authorize architectural expansion.

------------------------------------------------------------------------

# RISK REVIEW PRINCIPLE

A known limitation must not be silently removed from this document merely
because it is inconvenient operationally.

An item may be closed only when objective implementation or verification
evidence supports closure.

Where resolution requires new architecture or implementation authority, the
item must remain open until that authority exists.

------------------------------------------------------------------------

# CLOSURE REQUIREMENTS

A limitation or open issue may be marked resolved only when:

- the required capability exists;
- the capability has been validated;
- authority boundaries remain preserved;
- organization scope remains preserved where applicable;
- fail-closed behavior remains preserved;
- relevant documentation is synchronized.

External production conditions require production evidence rather than local
development evidence alone.

------------------------------------------------------------------------

# RELATIONSHIP TO RECOVERY

Known limitations must be consulted during incident recovery.

A documented limitation should not be misdiagnosed as a runtime defect.

Conversely, a genuine runtime defect must not be dismissed merely because a
related known limitation exists.

Refer to:

OPERATIONAL_GUIDANCE_RECOVERY_RUNBOOK.md

for recovery procedures.

------------------------------------------------------------------------

# RELATIONSHIP TO SUPPORT OWNERSHIP

Known limitations and operational risks are triaged according to:

OPERATIONAL_GUIDANCE_SUPPORT_OWNERSHIP.md

Support ownership does not grant authority to close an architectural limitation
through inference or unauthorized implementation.

------------------------------------------------------------------------

# DOCUMENT RELATIONSHIPS

This document operates alongside:

- OPERATIONAL_GUIDANCE_ARCHITECTURE.md
- OPERATIONAL_GUIDANCE_IMPLEMENTATION_PLAN.md
- OPERATIONAL_GUIDANCE_RECOVERY_RUNBOOK.md
- OPERATIONAL_GUIDANCE_SUPPORT_OWNERSHIP.md
- REPOSITORY_RELATIONSHIP_ARCHITECTURE.md
- ENGINEERING_RULES.md
- MASTER_STATE.md
- CURRENT_FOCUS.md

Where conflict exists, higher-order constitutional, governance, certification,
publication, registry, verification, and Snowflake doctrine remains
authoritative.

------------------------------------------------------------------------

# FINAL LIMITATIONS DOCTRINE

Known limitations remain visible until objectively resolved.

Operational risk does not create authority.

Open issues do not authorize implementation.

Missing authoritative state must not be inferred into existence.

Snowflake remains the source of truth.

Human governance authority remains supreme.

END OF FILE