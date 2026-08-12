# OPERATIONAL_GUIDANCE_ROLLBACK_PROCEDURE.md

Last Updated: 2026-08-11

# PURPOSE

This document defines the canonical rollback procedure for the GAFAIG
Operational Guidance implementation.

It establishes how an authorized operator may restore a previously known-good
application version when an Operational Guidance deployment introduces a
production defect.

Rollback applies to the application implementation only.

Snowflake remains the source of truth.

Human governance authority remains supreme.

Operational Guidance remains advisory, read-only, deterministic, and
non-authoritative.

------------------------------------------------------------------------

# STATUS

This is an operational rollback and production-readiness document.

It does not authorize deployment.

It does not authorize a production release.

It does not create architecture authority.

It does not create constitutional authority.

It does not create governance authority.

It does not create certification authority.

It does not create publication authority.

It does not create registry authority.

It does not create verification authority.

It does not authorize workflow mutation.

It does not authorize repository mutation.

It does not authorize Snowflake data rollback.

------------------------------------------------------------------------

# SCOPE

This rollback procedure applies to the Operational Guidance application layer,
including:

- Repository Context Guidance
- Next Action Guidance
- Blocking Guidance
- Waiting-On Guidance
- Composite Guidance
- Operational Summary Guidance
- Guidance services
- Guidance API integration
- Applicant Guidance presentation
- Guidance telemetry
- Guidance authentication integration
- Guidance organization-scope enforcement

This procedure does not authorize rollback of authoritative Snowflake
governance state.

------------------------------------------------------------------------

# ROLLBACK PRINCIPLE

Operational Guidance is a read-only advisory application capability.

Application rollback must therefore remain separate from authoritative
Snowflake state.

A rollback restores previously known-good application behavior.

It must not rewrite authoritative data merely to make an older application
version operate successfully.

------------------------------------------------------------------------

# ROLLBACK OBJECTIVES

Rollback must:

1. restore a previously known-good application version;
2. preserve authoritative Snowflake data;
3. preserve workflow state;
4. preserve organization isolation;
5. preserve authentication enforcement;
6. preserve fail-closed behavior;
7. preserve Human Governance Authority;
8. avoid creating new authority;
9. verify restored behavior before normal operation resumes.

------------------------------------------------------------------------

# ROLLBACK AUTHORITY

Rollback may be initiated only through the authorized platform deployment or
operational function.

A technical failure does not itself create authority to:

- modify governance decisions;
- modify certification decisions;
- modify publication state;
- modify registry state;
- modify verification state;
- modify authoritative workflow state;
- modify repository records;
- weaken authentication;
- weaken organization isolation.

------------------------------------------------------------------------

# ROLLBACK TRIGGERS

Rollback should be considered when a newly deployed Operational Guidance
application version causes a material production regression that cannot be
safely corrected within the required operational window.

Examples include:

- widespread Guidance ERROR responses;
- widespread Guidance UNAVAILABLE responses caused by application defects;
- Guidance engine registration failure;
- application startup failure;
- Guidance API failure;
- applicant Guidance presentation failure that prevents operational use;
- authentication regression;
- organization-scope enforcement regression;
- telemetry regression that materially impairs incident diagnosis;
- severe performance regression;
- authority-boundary behavior inconsistent with the approved implementation.

------------------------------------------------------------------------

# IMMEDIATE ROLLBACK CONDITIONS

Rollback should receive immediate consideration when:

- cross-organization visibility may have been introduced;
- authentication enforcement may have regressed;
- Guidance may be exposing protected operational information;
- Guidance may be mutating authoritative state;
- Guidance may be bypassing fail-closed behavior;
- Guidance may be creating unauthorized governance, certification,
  publication, registry, or verification behavior.

Where a security or authority-boundary issue exists, containment takes
priority over application availability.

------------------------------------------------------------------------

# PRE-ROLLBACK TRIAGE

Before rollback:

1. Record the incident time.
2. Identify the affected deployment or application version.
3. Identify the last known-good application version.
4. Record relevant correlation IDs where available.
5. Record affected Guidance engines or routes.
6. Determine whether the incident involves:
   - authentication;
   - organization isolation;
   - engine execution;
   - API behavior;
   - presentation;
   - telemetry;
   - performance;
   - authority boundaries.
7. Preserve relevant operational evidence.
8. Confirm that rollback will target application code/configuration rather
   than authoritative Snowflake records.

Do not delay containment of a critical security or organization-isolation
failure merely to complete extended diagnosis.

------------------------------------------------------------------------

# KNOWN-GOOD VERSION REQUIREMENT

Rollback must target a previously known-good application version.

A known-good version should have evidence that the applicable implementation
state previously passed required validation.

Rollback must not target:

- an arbitrary development state;
- an unvalidated local working tree;
- an unknown commit;
- a version known to contain a more serious security or authority defect.

------------------------------------------------------------------------

# SOURCE CONTROL ROLLBACK MODEL

The application repository must be capable of identifying the deployed source
revision through normal source-control and deployment history.

The preferred rollback model is deployment of the previously known-good
revision rather than destructive rewriting of repository history.

Do not delete implementation history merely to perform a rollback.

Do not force source history backward when deployment of a known-good revision
can accomplish the operational objective.

------------------------------------------------------------------------

# APPLICATION ROLLBACK SEQUENCE

The canonical rollback sequence is:

1. Identify the current affected deployment.
2. Identify the previously known-good application revision.
3. Preserve incident evidence.
4. Contain the affected deployment if required.
5. Select the known-good application revision through the authorized
   deployment mechanism.
6. Verify required environment configuration remains available.
7. Deploy or restore the known-good application revision.
8. Confirm application startup.
9. Confirm authentication availability.
10. Perform targeted post-rollback validation.
11. Confirm telemetry or equivalent runtime evidence is available where
    supported by the restored revision.
12. Resume normal operation only after validation succeeds.

------------------------------------------------------------------------

# SNOWFLAKE PRESERVATION

Operational Guidance rollback must preserve authoritative Snowflake data.

Do not rollback or modify Snowflake records merely because application code is
being rolled back.

Do not alter:

- workflow state;
- evidence records;
- artifact records;
- information requests;
- deficiencies;
- remediation records;
- certification records;
- governance outcomes;
- publication state;
- registry state;
- verification state

unless a separately authorized process explicitly requires such action.

Application rollback and authoritative-data correction are separate
operations.

------------------------------------------------------------------------

# SCHEMA COMPATIBILITY

No Operational Guidance-specific Snowflake schema mutation was identified
during the production-readiness implementation review.

Operational Guidance is expected to consume existing authoritative read
surfaces.

If a future Operational Guidance release introduces an authorized schema
dependency, rollback compatibility must be reassessed before that release is
authorized.

Do not assume application rollback automatically makes incompatible schema
changes safe.

------------------------------------------------------------------------

# ENVIRONMENT CONFIGURATION

Before restoring a known-good application version, verify that its required
environment configuration remains available.

Relevant configuration may include:

- signed-session configuration;
- applicant authentication configuration;
- Snowflake connection configuration;
- Snowflake key-pair authentication;
- application URL configuration;
- Operational Guidance telemetry configuration where applicable.

Secrets must not be copied into incident records or telemetry.

------------------------------------------------------------------------

# AUTHENTICATION VALIDATION

After rollback:

1. authenticate through the approved applicant login path;
2. verify the signed applicant session is issued;
3. verify an authenticated same-organization request is accepted;
4. verify an unauthenticated Guidance request is rejected.

Rollback is not successful if authentication must be bypassed to restore
Guidance.

------------------------------------------------------------------------

# ORGANIZATION-ISOLATION VALIDATION

After rollback:

1. verify a known same-organization case is visible to the authenticated
   applicant;
2. verify a case outside the authenticated organization scope remains denied
   or fail closed;
3. verify repository visibility remains organization scoped.

Any cross-organization exposure requires immediate escalation.

------------------------------------------------------------------------

# GUIDANCE ENGINE VALIDATION

Where the restored revision contains the applicable Guidance engines, verify:

- Repository Context;
- Next Action;
- Blocking;
- Waiting-On;
- Composite Guidance;
- Operational Summary.

The objective is not to force every result to AVAILABLE.

The objective is to confirm deterministic execution and correct fail-closed
behavior.

INCOMPLETE or UNRESOLVED may be correct outcomes where authoritative
dependencies remain incomplete.

------------------------------------------------------------------------

# TARGETED VALIDATION COMMANDS

Where supported by the restored revision, run:

npm run typecheck

and:

npm run guidance:smoke

These are targeted application validation procedures.

Do not recursively execute unrelated previously certified dependency chains
unless a specific dependency failure requires additional validation.

------------------------------------------------------------------------

# TARGETED RUNTIME VALIDATION

After application restoration, perform a known-good authenticated Guidance
request using an authorized organization-scoped case.

Verify:

- expected HTTP behavior;
- expected Guidance semantic status;
- no unexpected ERROR;
- organization scope;
- correlation behavior where supported;
- telemetry where supported.

Then perform an unauthenticated request and confirm access fails.

Then perform an organization-scope negative test and confirm access fails
closed.

------------------------------------------------------------------------

# TELEMETRY VALIDATION

If the restored application revision includes Operational Guidance structured
telemetry, verify that execution events are emitted.

Where supported, verify:

- component;
- correlationId;
- engineName;
- engineVersion;
- status;
- duration.

Telemetry validation must not require exposing protected payload contents.

If the known-good revision predates dedicated Guidance telemetry, absence of
the newer telemetry implementation must be recorded as a rollback consequence
rather than concealed.

------------------------------------------------------------------------

# FAILURE OF ROLLBACK VALIDATION

If post-rollback validation fails:

1. do not declare recovery complete;
2. preserve fail-closed behavior;
3. determine whether the selected revision was actually known-good;
4. verify environment configuration;
5. verify Snowflake connectivity;
6. verify authentication configuration;
7. inspect runtime errors;
8. escalate according to the Operational Guidance support ownership model.

Do not modify authoritative state merely to make rollback validation pass.

------------------------------------------------------------------------

# ROLLBACK AND KNOWN LIMITATIONS

Rollback does not resolve architectural or operational limitations that already
existed in the known-good version.

For example, if the restored version lacks an authoritative canonical
repository relationship runtime source, relationship context may legitimately
remain UNRESOLVED.

Do not treat restoration of a known limitation as rollback failure.

Consult:

OPERATIONAL_GUIDANCE_KNOWN_LIMITATIONS.md

during post-rollback assessment.

------------------------------------------------------------------------

# ROLLBACK AND RECOVERY

Rollback is one recovery mechanism.

The broader incident and recovery process is defined in:

OPERATIONAL_GUIDANCE_RECOVERY_RUNBOOK.md

Use rollback when restoring a known-good application revision is safer than
attempting immediate repair of the affected deployment.

------------------------------------------------------------------------

# ROLLBACK OWNERSHIP

Operational rollback ownership follows:

OPERATIONAL_GUIDANCE_SUPPORT_OWNERSHIP.md

The Platform Administrator coordinates the operational rollback.

The authorized engineering function assists with source revision,
implementation diagnosis, and technical validation.

Rollback ownership does not create governance authority.

------------------------------------------------------------------------

# ROLLBACK EVIDENCE

Record:

- incident timestamp;
- affected application version;
- restored application version;
- rollback reason;
- relevant correlation IDs;
- validation commands executed;
- validation outcomes;
- authentication validation result;
- organization-isolation validation result;
- Guidance runtime validation result;
- telemetry validation result where applicable;
- unresolved limitations remaining after rollback.

Do not record secrets.

------------------------------------------------------------------------

# ROLLBACK SUCCESS CRITERIA

Rollback is successful only when:

- the known-good application version is restored;
- application startup succeeds;
- authentication behaves correctly;
- unauthenticated access fails;
- organization isolation is preserved;
- applicable Guidance engines execute deterministically;
- fail-closed behavior is preserved;
- authoritative Snowflake state remains intact;
- workflow state remains intact;
- no unauthorized repository mutation occurred;
- no unauthorized governance action occurred;
- no unauthorized certification action occurred;
- no unauthorized publication action occurred;
- no unauthorized registry action occurred;
- no unauthorized verification action occurred;
- targeted validation passes.

------------------------------------------------------------------------

# ROLLBACK FAILURE CRITERIA

Rollback must not be considered successful merely because:

- the application starts;
- an HTTP endpoint returns 200;
- one Guidance engine executes;
- a participant page renders.

The complete applicable post-rollback validation boundary must be satisfied.

------------------------------------------------------------------------

# PROHIBITED ROLLBACK ACTIONS

Do not:

- weaken authentication;
- bypass signed-session requirements;
- broaden organization scope;
- expose cross-organization records;
- hardcode successful Guidance results;
- transform UNRESOLVED into AVAILABLE manually;
- infer missing repository relationships;
- grant Guidance write authority;
- modify Snowflake authoritative state merely to satisfy the older application;
- clear blockers automatically;
- clear waiting conditions automatically;
- reassign owners automatically;
- advance workflow automatically;
- alter governance decisions;
- alter certification decisions;
- alter publication state;
- alter registry state;
- alter verification state;
- rewrite source-control history unnecessarily.

------------------------------------------------------------------------

# ROLLBACK REHEARSAL

Before full Operational Guidance production-readiness certification, the
rollback procedure should be rehearsed or otherwise objectively verified
against a controlled application deployment context.

The rehearsal must demonstrate that:

1. a known-good application revision can be identified;
2. the application can be restored to that revision;
3. authoritative Snowflake data remains untouched;
4. authentication remains enforced;
5. organization isolation remains enforced;
6. targeted validation can be executed;
7. normal operation can be resumed without expanding authority.

A rollback document alone establishes the procedure.

It does not establish that the rollback mechanism has been successfully
rehearsed.

------------------------------------------------------------------------

# CURRENT ROLLBACK READINESS STATE

Operational Guidance is architected and implemented as an application-layer,
read-only advisory capability.

No dedicated Operational Guidance Snowflake write or schema-mutation surface
was identified during the production-readiness review.

Application rollback is therefore separable from authoritative Snowflake-state
rollback under the current implementation.

The documented rollback procedure exists with explicit post-rollback
validation requirements.

Controlled rollback rehearsal or equivalent deployment-level verification
remains required before the rollback mechanism itself is considered
production-proven.

------------------------------------------------------------------------

# DEPLOYMENT AUTHORIZATION BOUNDARY

Successful rollback readiness does not authorize production deployment.

Production deployment remains a separate authorization decision.

Rollback documentation must not be interpreted as:

- Project Owner production approval;
- release authorization;
- architecture expansion authority;
- governance authority;
- certification authority;
- publication authority;
- registry authority;
- verification authority.

------------------------------------------------------------------------

# DOCUMENT RELATIONSHIPS

This document operates alongside:

- OPERATIONAL_GUIDANCE_ARCHITECTURE.md
- OPERATIONAL_GUIDANCE_IMPLEMENTATION_PLAN.md
- OPERATIONAL_GUIDANCE_RECOVERY_RUNBOOK.md
- OPERATIONAL_GUIDANCE_SUPPORT_OWNERSHIP.md
- OPERATIONAL_GUIDANCE_KNOWN_LIMITATIONS.md
- ENGINEERING_RULES.md
- MASTER_STATE.md
- CURRENT_FOCUS.md

Where conflict exists, higher-order constitutional, governance, certification,
publication, registry, verification, and Snowflake doctrine remains
authoritative.

------------------------------------------------------------------------

# FINAL ROLLBACK DOCTRINE

Rollback restores application behavior.

It does not rewrite authoritative truth.

Rollback must preserve authentication.

Rollback must preserve organization isolation.

Rollback must preserve fail-closed behavior.

Rollback must preserve Human Governance Authority.

Snowflake remains the source of truth.

Human governance authority remains supreme.

END OF FILE