# OPERATIONAL_GUIDANCE_SUPPORT_OWNERSHIP.md

Last Updated: 2026-08-11

# PURPOSE

This document defines the canonical support ownership model for the GAFAIG
Operational Guidance implementation.

It establishes responsibility for operating, triaging, escalating, maintaining,
and recovering Operational Guidance without changing constitutional,
governance, certification, publication, registry, verification, or workflow
authority.

Snowflake remains the source of truth.

Human governance authority remains supreme.

Operational Guidance remains advisory, read-only, deterministic, and
non-authoritative.

------------------------------------------------------------------------

# STATUS

This is an operational support and production-readiness document.

It does not create architecture authority.

It does not create constitutional authority.

It does not create governance authority.

It does not create certification authority.

It does not create publication authority.

It does not create registry authority.

It does not create verification authority.

It does not authorize workflow mutation.

It does not authorize repository mutation.

It does not authorize automatic blocker resolution.

It does not authorize automatic waiting-state resolution.

It does not authorize automatic ownership reassignment.

------------------------------------------------------------------------

# SCOPE

This support ownership model applies to the implemented Operational Guidance
runtime, including:

- Repository Context Guidance
- Next Action Guidance
- Blocking Guidance
- Waiting-On Guidance
- Composite Guidance
- Operational Summary Guidance
- Applicant Guidance API routes
- Applicant Guidance workspace presentation
- Guidance execution telemetry
- Guidance recovery procedures
- Guidance authentication and organization-scope enforcement

------------------------------------------------------------------------

# SUPPORT OWNERSHIP PRINCIPLE

Operational Guidance support ownership governs technical and operational
responsibility only.

Support ownership does not grant authority to:

- change governance outcomes;
- certify cases;
- publish cases;
- modify registry state;
- alter verification state;
- override deterministic Guidance rules;
- manually clear blocking conditions;
- manually clear waiting conditions;
- automatically reassign operational ownership;
- advance workflow state outside authorized mechanisms.

------------------------------------------------------------------------

# PRIMARY SUPPORT OWNER

The primary Operational Guidance support owner is the:

Platform Administrator

The Platform Administrator is responsible for:

- application runtime availability;
- Operational Guidance service health;
- Guidance telemetry review;
- authentication runtime health;
- organization-scope enforcement health;
- Guidance engine registration integrity;
- application configuration;
- deployment recovery;
- targeted technical validation;
- production incident coordination;
- escalation when authority boundaries may be affected.

The Platform Administrator is not authorized by this support role to alter
governance decisions, certification decisions, publication decisions, registry
state, or verification authority.

------------------------------------------------------------------------

# ENGINEERING MAINTENANCE OWNER

Operational Guidance implementation maintenance is owned by the authorized
GAFAIG engineering function.

Engineering maintenance responsibilities include:

- Guidance engine code maintenance;
- deterministic rule implementation;
- Guidance service maintenance;
- API integration maintenance;
- telemetry maintenance;
- type safety;
- test maintenance;
- implementation defects;
- performance remediation;
- approved deployment corrections.

Engineering maintenance must preserve the canonical architecture and authority
boundaries.

Engineering changes may not silently redefine operational doctrine.

------------------------------------------------------------------------

# APPLICANT SUPPORT RESPONSIBILITY

Applicant-facing support may assist users with:

- login access;
- navigation;
- locating case Guidance;
- understanding whether Guidance is AVAILABLE, INCOMPLETE, BLOCKED, WAITING,
  UNRESOLVED, or otherwise unavailable;
- reporting apparent data visibility issues;
- reporting stale or unexpected Guidance;
- collecting non-sensitive incident information.

Applicant-facing support may not:

- reveal another organization's case data;
- override organization scope;
- change Guidance results;
- alter repository records;
- clear blocking conditions;
- clear waiting conditions;
- change governance state;
- change certification state;
- publish records;
- modify registry records;
- modify verification results.

------------------------------------------------------------------------

# GOVERNANCE PARTICIPANT RESPONSIBILITY

Governance participants remain responsible only for governance actions within
their existing authorized roles.

Operational Guidance may surface advisory information to governance
participants where authorized.

Governance participants do not become technical support owners merely because
Guidance references governance workflow state.

Operational Guidance support must not transfer governance authority to
engineering or platform operations.

------------------------------------------------------------------------

# CERTIFICATION AUTHORITY RESPONSIBILITY

Certification Authority responsibility remains separate from Operational
Guidance support ownership.

The Certification Authority may be represented in Guidance as:

- current owner;
- waiting-on participant;
- related operational participant;
- next-stage dependency.

Operational Guidance support personnel may diagnose why Guidance references the
Certification Authority.

They may not perform Certification Authority actions unless separately
authorized to do so.

------------------------------------------------------------------------

# INCIDENT INTAKE OWNER

The Platform Administrator is the initial owner for reported Operational
Guidance incidents involving:

- HTTP failures;
- authentication failures;
- authorization failures;
- unexpected NOT_VISIBLE results;
- unexpected UNRESOLVED results;
- Guidance engine failures;
- telemetry errors;
- slow execution;
- deployment failures;
- missing engine registration;
- application runtime instability.

------------------------------------------------------------------------

# INCIDENT CLASSIFICATION

Operational Guidance incidents should be classified as one of:

AUTHENTICATION

Examples:

- signed applicant login fails;
- valid session is rejected;
- unauthenticated access is incorrectly permitted.

ORGANIZATION_SCOPE

Examples:

- legitimate same-organization case is not visible;
- cross-organization case appears visible;
- repository records appear outside expected scope.

ENGINE_EXECUTION

Examples:

- Guidance engine returns ERROR;
- engine registration is missing;
- deterministic service fails.

SOURCE_DEPENDENCY

Examples:

- Snowflake unavailable;
- required authoritative source missing;
- conflicting authoritative rows.

PERFORMANCE

Examples:

- repeated slow-execution telemetry;
- abnormal Snowflake query latency;
- application runtime degradation.

PRESENTATION

Examples:

- Guidance payload resolves correctly but applicant workspace presentation is
  incorrect;
- responsive UI presentation fails.

KNOWN_LIMITATION

Examples:

- canonical relationship runtime source is unavailable;
- unresolved relationship context is intentionally preserved.

AUTHORITY_BOUNDARY

Examples:

- Guidance appears to mutate workflow;
- Guidance appears to modify repository state;
- Guidance appears to create governance, certification, publication, registry,
  or verification authority.

AUTHORITY_BOUNDARY incidents require immediate escalation.

------------------------------------------------------------------------

# SEVERITY MODEL

SEVERITY 1 — CRITICAL

Conditions include:

- cross-organization data exposure;
- authentication bypass;
- Guidance mutation of authoritative state;
- unauthorized governance or certification action;
- unauthorized publication or registry mutation;
- verification authority compromise.

Required action:

- contain access immediately;
- preserve evidence;
- escalate immediately;
- do not restore service by weakening controls.

SEVERITY 2 — HIGH

Conditions include:

- widespread Guidance outage;
- multiple Guidance engines failing;
- Snowflake source dependency unavailable;
- production Guidance API broadly unavailable;
- repeated ERROR responses affecting participant operations.

Required action:

- Platform Administrator owns incident coordination;
- engineering investigation begins promptly;
- fail-closed behavior must remain active.

SEVERITY 3 — MODERATE

Conditions include:

- isolated case Guidance failure;
- isolated engine issue;
- unexpected UNRESOLVED state;
- repeated slow Guidance execution;
- limited presentation defect.

Required action:

- targeted diagnosis;
- preserve authority boundaries;
- correct through normal engineering process.

SEVERITY 4 — LOW

Conditions include:

- cosmetic presentation issue;
- non-blocking telemetry formatting issue;
- HTTP-status consistency issue with otherwise correct fail-closed behavior;
- documentation inconsistency.

Required action:

- track and correct through normal maintenance.

------------------------------------------------------------------------

# SUPPORT HANDOFF MODEL

Operational Guidance support uses the following handoff path:

Applicant or participant
→ Applicant Support or Operations
→ Platform Administrator
→ Engineering Maintenance
→ Governance / Certification / Security escalation only when required by the
  nature of the incident.

Technical support must not route ordinary implementation defects to governance
participants unless authoritative governance involvement is actually required.

------------------------------------------------------------------------

# PLATFORM ADMINISTRATOR RESPONSIBILITIES

The Platform Administrator may:

- inspect runtime status;
- inspect telemetry;
- inspect correlation IDs;
- verify environment configuration;
- verify signed-session behavior;
- verify organization-scope behavior;
- restart application runtime;
- initiate approved application rollback;
- run typecheck;
- run Guidance smoke tests;
- run targeted authenticated Guidance requests;
- coordinate incident response;
- escalate defects.

The Platform Administrator may not:

- rewrite Guidance payloads;
- bypass organization scope;
- manually manufacture AVAILABLE results;
- directly change governance outcomes;
- alter certification outcomes;
- publish or unpublish records outside authorized publication mechanisms;
- modify registry authority;
- alter verification conclusions.

------------------------------------------------------------------------

# ENGINEERING RESPONSIBILITIES

Engineering may:

- diagnose code defects;
- repair deterministic Guidance logic;
- repair telemetry;
- repair API integration;
- repair authentication implementation;
- repair organization-scope enforcement;
- repair engine registration;
- optimize performance;
- add approved tests;
- restore known-good application behavior.

Engineering may not:

- redesign architecture during incident recovery without authorization;
- redefine governance policy;
- change certification criteria;
- create new publication authority;
- create registry authority;
- infer missing authoritative relationships merely to make Guidance resolve.

------------------------------------------------------------------------

# APPLICANT SUPPORT RESPONSIBILITIES

Applicant Support may collect:

- user-visible error message;
- approximate incident time;
- affected page or route;
- case identifier provided by the authenticated applicant;
- visible Guidance status;
- correlation ID where surfaced.

Applicant Support should avoid collecting:

- session tokens;
- passwords;
- private signing keys;
- Snowflake credentials;
- unrelated repository contents;
- unnecessary personal information.

------------------------------------------------------------------------

# TELEMETRY OWNERSHIP

Operational Guidance structured telemetry is operationally owned by the
Platform Administrator.

Engineering owns telemetry implementation correctness.

Telemetry may be used to:

- identify failing engines;
- correlate execution chains;
- identify repeated errors;
- identify slow execution;
- distinguish dependency failures from engine failures.

Telemetry must not become a parallel source of governance truth.

Telemetry is operational evidence only.

------------------------------------------------------------------------

# AUTHENTICATION SUPPORT OWNERSHIP

Authentication runtime support is owned operationally by the Platform
Administrator and technically by Engineering.

Support may verify:

- applicant login route availability;
- signed session issuance;
- session expiration behavior;
- production session-secret presence;
- unauthorized access rejection.

Support must not provide authentication bypasses.

------------------------------------------------------------------------

# ORGANIZATION-SCOPE SUPPORT OWNERSHIP

Organization-scope enforcement is jointly owned by:

- Platform Administrator for runtime verification;
- Engineering for implementation correctness.

Any suspected cross-organization exposure must be treated as SEVERITY 1.

Support must preserve fail-closed behavior during diagnosis.

------------------------------------------------------------------------

# SNOWFLAKE DEPENDENCY OWNERSHIP

Snowflake remains the authoritative data source.

Operational Guidance support may verify:

- connectivity;
- configured warehouse;
- configured database;
- configured schema;
- configured read role;
- key-pair authentication;
- required read access.

Operational Guidance support does not own governance data correction merely
because Guidance consumes that data.

Authoritative data defects must be escalated to the owner of the authoritative
source.

------------------------------------------------------------------------

# KNOWN-LIMITATION OWNERSHIP

A known limitation is not automatically an incident.

Where architecture intentionally leaves a condition unresolved, support should:

1. identify the condition as a documented known limitation;
2. avoid treating it as an implementation defect;
3. avoid inventing missing authoritative state;
4. escalate only if the limitation now blocks an authorized production
   requirement.

------------------------------------------------------------------------

# RECOVERY OWNERSHIP

The Platform Administrator owns execution of the:

OPERATIONAL_GUIDANCE_RECOVERY_RUNBOOK.md

Engineering assists where code or deployment correction is required.

Recovery success must be verified with targeted checks rather than unnecessary
recursive execution of previously certified dependency chains.

------------------------------------------------------------------------

# CHANGE OWNERSHIP

Operational Guidance changes must pass through the authorized engineering
process.

Support incidents do not themselves authorize implementation changes.

Changes must preserve:

- Snowflake source-of-truth doctrine;
- human governance supremacy;
- read-only Guidance behavior;
- organization scope;
- deterministic resolution;
- fail-closed behavior;
- authority boundaries.

------------------------------------------------------------------------

# DEPLOYMENT OWNERSHIP

Operational Guidance application deployment is owned by the authorized
platform deployment function.

Deployment responsibility includes:

- approved build;
- environment configuration;
- application release;
- rollback capability;
- post-deployment targeted verification.

Deployment does not authorize Snowflake governance-state changes.

------------------------------------------------------------------------

# PRODUCTION ESCALATION CONDITIONS

Immediate escalation is required when:

- organization isolation may have failed;
- authentication may have been bypassed;
- Guidance may have mutated authoritative records;
- Guidance may have produced unauthorized governance conclusions;
- certification behavior may have been altered;
- publication behavior may have been altered;
- registry behavior may have been altered;
- verification behavior may have been altered;
- production recovery would require unauthorized write privileges.

------------------------------------------------------------------------

# SUPPORT EVIDENCE

Operational Guidance support should preserve appropriate incident evidence,
including:

- incident timestamp;
- correlation ID;
- engine name;
- engine version;
- Guidance status;
- failure code;
- duration;
- affected route;
- remediation performed;
- validation result.

Do not preserve secrets or unnecessary protected payload contents in support
records.

------------------------------------------------------------------------

# SUPPORT SUCCESS CRITERIA

A support incident may be closed when:

- the reported condition is understood;
- authority boundaries remain intact;
- organization scope remains intact;
- authentication remains intact;
- the affected runtime behavior is restored or correctly identified as a known
  limitation;
- targeted validation passes;
- any required engineering correction is complete;
- any required escalation has been completed;
- no unauthorized state mutation occurred.

------------------------------------------------------------------------

# CURRENT OPERATIONAL OWNERSHIP STATE

Operational Guidance currently has:

- signed applicant-session authentication;
- organization-scope enforcement;
- application-level structured Guidance telemetry;
- a dedicated Operational Guidance recovery runbook;
- deterministic Guidance engines;
- targeted typecheck and Guidance smoke validation.

External observability-provider ownership is not established by this document.

A separate dedicated support organization is not required by this document.

The Platform Administrator is the canonical operational owner unless and until
an authorized organizational support model supersedes this assignment.

------------------------------------------------------------------------

# DOCUMENT RELATIONSHIPS

This document operates alongside:

- OPERATIONAL_GUIDANCE_ARCHITECTURE.md
- OPERATIONAL_GUIDANCE_IMPLEMENTATION_PLAN.md
- OPERATIONAL_GUIDANCE_RECOVERY_RUNBOOK.md
- OPERATIONAL_WORKFLOW_ARCHITECTURE.md
- OPERATIONAL_RESPONSIBILITY_MATRIX.md
- ENGINEERING_RULES.md

Where conflict exists, higher-order constitutional, governance, certification,
publication, registry, verification, and Snowflake doctrine remains
authoritative.

------------------------------------------------------------------------

# FINAL SUPPORT DOCTRINE

Support ownership creates responsibility.

It does not create governance authority.

It does not create certification authority.

It does not create publication authority.

It does not create registry authority.

It does not create verification authority.

Snowflake remains the source of truth.

Human governance authority remains supreme.

END OF FILE