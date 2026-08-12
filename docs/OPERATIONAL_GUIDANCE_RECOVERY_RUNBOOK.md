# OPERATIONAL_GUIDANCE_RECOVERY_RUNBOOK.md

Last Updated: 2026-08-11

# PURPOSE

This document defines the canonical operational recovery procedures for the
GAFAIG Operational Guidance implementation.

It establishes how operators identify, contain, diagnose, recover from, and
verify Operational Guidance failures without changing constitutional,
governance, certification, publication, registry, verification, or workflow
authority.

Snowflake remains the source of truth.

Human governance authority remains supreme.

Operational Guidance remains advisory, read-only, deterministic, and
non-authoritative.

------------------------------------------------------------------------

# STATUS

This is an operational recovery and production-readiness document.

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

This runbook applies to the implemented Operational Guidance runtime,
including:

- Repository Context Guidance
- Next Action Guidance
- Blocking Guidance
- Waiting-On Guidance
- Composite Guidance
- Operational Summary Guidance
- Applicant Guidance API routes
- Applicant Guidance workspace presentation
- Guidance execution telemetry

This runbook covers application-layer recovery only.

Snowflake platform recovery, infrastructure recovery, deployment rollback,
network recovery, and external provider recovery remain governed by their
respective operational procedures.

------------------------------------------------------------------------

# CORE RECOVERY PRINCIPLE

Operational Guidance must fail closed.

When authoritative context cannot be resolved, the system must not infer,
invent, or manufacture missing operational state.

Recovery must restore access to authoritative inputs or restore deterministic
Guidance execution.

Recovery must never fabricate guidance merely to return an AVAILABLE result.

------------------------------------------------------------------------

# AUTHORITY BOUNDARY DURING RECOVERY

Recovery procedures may:

- inspect runtime health;
- inspect structured Guidance telemetry;
- inspect correlation identifiers;
- verify authenticated applicant access;
- verify organization scope enforcement;
- verify registered Guidance engines;
- restart the application runtime;
- restore a previously known-good application deployment;
- re-run approved type checks and smoke tests;
- re-run targeted authenticated runtime tests;
- verify Snowflake read connectivity.

Recovery procedures may not:

- manually alter Guidance results;
- manually override Guidance engine decisions;
- change workflow state to clear an error;
- create repository relationships to make Guidance succeed;
- clear blocking conditions without authoritative state;
- clear waiting conditions without authoritative state;
- reassign workflow ownership automatically;
- publish records;
- certify records;
- modify registry state;
- modify verification state;
- create governance conclusions.

------------------------------------------------------------------------

# PRIMARY FAILURE STATES

Operational Guidance recovery recognizes the following primary runtime states:

AVAILABLE

The requested Guidance result resolved successfully.

READY

The requested deterministic Guidance condition is ready.

BLOCKED

Authoritative state indicates blocking conditions.

WAITING

Authoritative state indicates a waiting dependency.

INCOMPLETE

Some authoritative Guidance context is available, but one or more required
conditions remain unresolved.

UNRESOLVED

The engine cannot produce an authoritative deterministic conclusion from the
available inputs.

NOT_VISIBLE

The requested case or context is not visible within the authenticated
organization or participant scope.

UNAUTHORIZED

Required authentication or participant authorization is missing.

INCONSISTENT

Authoritative source data is contradictory or otherwise cannot be safely
resolved.

STALE

Required source information is outside an accepted freshness boundary.

UNAVAILABLE

A required engine or authoritative dependency is unavailable.

ERROR

Guidance execution failed unexpectedly and returned a fail-closed result.

------------------------------------------------------------------------

# RECOVERY PRIORITY

Recovery priority is:

1. Preserve authority boundaries.
2. Preserve organization scope.
3. Preserve fail-closed behavior.
4. Preserve authoritative Snowflake state.
5. Restore deterministic Guidance execution.
6. Verify runtime behavior.
7. Resume normal participant access.

Availability must never be restored by weakening authentication, organization
scope, or authority boundaries.

------------------------------------------------------------------------

# INITIAL TRIAGE

When an Operational Guidance issue is reported:

1. Record the time of the incident.
2. Record the affected Guidance route or workspace.
3. Record the Guidance status returned.
4. Capture the Guidance correlationId where available.
5. Determine whether the issue affects:
   - one case;
   - one organization;
   - one Guidance engine;
   - all Guidance engines;
   - all applicant Guidance routes.
6. Inspect Operational Guidance structured telemetry using the correlationId.
7. Determine whether the failure originated from:
   - authentication;
   - organization scope;
   - Repository Context;
   - Next Action;
   - Blocking;
   - Waiting-On;
   - Composite Guidance;
   - Operational Summary;
   - Snowflake connectivity;
   - engine registration;
   - application runtime.

Do not modify authoritative records during triage.

------------------------------------------------------------------------

# TELEMETRY TRIAGE

Operational Guidance emits structured server-side telemetry with:

- component
- event
- level
- correlationId
- engineName
- engineVersion
- status
- startedAt
- completedAt
- durationMs
- failureCode when available
- retryable when available
- hasCaseScope

Telemetry intentionally does not require logging:

- case identifiers;
- organization names;
- applicant email addresses;
- repository payload contents;
- evidence contents;
- source record contents.

Use correlationId as the primary execution-tracing identifier.

------------------------------------------------------------------------

# AUTHENTICATION FAILURE RECOVERY

Symptoms may include:

- HTTP 401;
- UNAUTHORIZED Guidance status;
- AUTHENTICATION_REQUIRED failure.

Recovery procedure:

1. Confirm the applicant login route is available.
2. Confirm the signed `gafaig_session` cookie is issued after successful login.
3. Confirm the session has not expired.
4. Confirm the production runtime has the required session secret.
5. Confirm production does not depend on legacy/demo authentication.
6. Re-authenticate using the approved applicant login path.
7. Re-run the affected Guidance request.

Do not bypass authentication to restore service.

------------------------------------------------------------------------

# ORGANIZATION-SCOPE FAILURE RECOVERY

A request for a case outside the authenticated organization must remain denied.

Expected fail-closed behavior may include:

- NOT_VISIBLE;
- CASE_SCOPE_INVALID;
- UNRESOLVED parent Guidance result;
- HTTP 403, 404, or fail-closed dependent response according to route semantics.

If a legitimate same-organization case is unexpectedly denied:

1. Verify the authenticated organization scope.
2. Verify the requested case identifier.
3. Verify the authoritative workflow row exists in Snowflake.
4. Verify the workflow record identifies the correct organization.
5. Verify repository records belong to the same authorized scope.
6. Re-run the request.

Never broaden applicant scope as a recovery shortcut.

------------------------------------------------------------------------

# REPOSITORY CONTEXT FAILURE RECOVERY

Repository Context is foundational to downstream Guidance engines.

If Repository Context is:

UNAVAILABLE:
- verify Snowflake connectivity;
- verify required environment configuration;
- verify the configured Snowflake role retains read access;
- verify the referenced authoritative view/table remains available.

NOT_VISIBLE:
- verify case and organization scope.

INCONSISTENT:
- inspect authoritative source rows;
- do not choose one conflicting row arbitrarily;
- preserve fail-closed behavior until authoritative data is corrected.

INCOMPLETE:
- inspect unresolved conditions;
- determine whether the unresolved condition is an intentional known limitation.

------------------------------------------------------------------------

# RELATIONSHIP CONTEXT RECOVERY

Canonical repository relationship runtime context may remain UNRESOLVED when no
authoritative relationship source exists.

The system must not infer relationships from:

- shared case identifiers;
- shared organization identifiers;
- temporal proximity;
- repository co-occurrence;
- naming similarity.

An unresolved relationship context is not itself an application failure when
the architecture explicitly requires authoritative relationships.

Do not fabricate relationship records during recovery.

------------------------------------------------------------------------

# GUIDANCE ENGINE UNAVAILABLE

Symptoms may include:

- UNAVAILABLE;
- DEPENDENCY_FAILURE;
- telemetry event `guidance.engine.unavailable`.

Recovery procedure:

1. Verify the engine is registered in the canonical Operational Guidance
   registry.
2. Verify the expected engine name.
3. Verify the engine export path.
4. Run:

   npm run typecheck

5. Run:

   npm run guidance:smoke

6. Restart the application runtime if necessary.
7. Re-run a targeted authenticated Guidance request.

Do not dynamically substitute an unauthorized engine.

------------------------------------------------------------------------

# GUIDANCE ENGINE ERROR

When an engine returns ERROR:

1. Capture the correlationId.
2. Inspect the structured telemetry event.
3. Identify the failing engine.
4. Verify dependencies.
5. Reproduce using a targeted test where possible.
6. Run typecheck.
7. Run the Guidance smoke suite.
8. Correct the implementation through the normal engineering process.
9. Re-run the targeted runtime request.

The engine must remain fail closed while the error exists.

------------------------------------------------------------------------

# SLOW GUIDANCE EXECUTION

The configured Guidance slow-execution threshold is controlled by:

GAFAIG_GUIDANCE_SLOW_THRESHOLD_MS

A slow execution event does not authorize changing deterministic behavior.

When repeated slow execution occurs:

1. Identify the affected engine.
2. Review durationMs across correlated requests.
3. Determine whether latency originates from:
   - Snowflake connection creation;
   - Snowflake query execution;
   - application runtime;
   - downstream deterministic engine composition.
4. Optimize only without changing authority or deterministic result rules.
5. Re-run targeted runtime tests.

------------------------------------------------------------------------

# SNOWFLAKE CONNECTIVITY RECOVERY

Operational Guidance reads authoritative Snowflake state.

If Snowflake is unavailable:

1. Preserve fail-closed Guidance results.
2. Verify required Snowflake environment variables.
3. Verify key-pair authentication.
4. Verify the configured warehouse.
5. Verify the configured database and schema.
6. Verify the configured read role.
7. Verify network connectivity.
8. Verify a targeted read-only Snowflake query.
9. Re-run the Guidance request.

Operational Guidance recovery must not require write privileges.

------------------------------------------------------------------------

# APPLICATION RUNTIME RECOVERY

If the Guidance runtime is unhealthy but authoritative data remains intact:

1. Stop the affected application runtime.
2. Verify the current source state.
3. Run:

   npm run typecheck

4. Run:

   npm run guidance:smoke

5. Restart:

   npm run dev

   for local development, or restore/redeploy the approved production build.

6. Authenticate using the signed applicant session.
7. Execute a known valid organization-scoped Guidance request.
8. Verify structured telemetry.
9. Verify an unauthenticated request fails closed.
10. Verify a cross-organization request fails closed.

------------------------------------------------------------------------

# TARGETED POST-RECOVERY VALIDATION

After recovery, verify at minimum:

1. Signed applicant authentication succeeds.
2. Unauthenticated Guidance access fails.
3. Same-organization Guidance access succeeds.
4. Cross-organization Guidance access fails closed.
5. Repository Context executes.
6. Next Action executes.
7. Blocking executes.
8. Waiting-On executes.
9. Composite Guidance executes.
10. Operational Summary executes.
11. Structured telemetry is emitted.
12. Correlation IDs are preserved across the Guidance execution chain.
13. No workflow mutation occurs.
14. No repository mutation occurs.
15. No governance authority is created.
16. No certification authority is created.
17. No publication authority is created.
18. No registry authority is created.
19. No verification authority is created.

------------------------------------------------------------------------

# STANDARD VALIDATION COMMANDS

TypeScript validation:

npm run typecheck

Operational Guidance smoke test:

npm run guidance:smoke

Local development runtime:

npm run dev

These commands are targeted recovery verification tools.

Recovery should not recursively execute unrelated previously certified
dependency chains unless a specific dependency failure requires it.

------------------------------------------------------------------------

# ROLLBACK PRINCIPLE

If a newly deployed Operational Guidance implementation causes a production
failure and a known-good prior application version exists, rollback to the
known-good application version may be used.

Rollback must not roll back authoritative Snowflake governance state merely to
restore application behavior.

Because Operational Guidance is read-only, application rollback should remain
separate from authoritative state rollback.

------------------------------------------------------------------------

# INCIDENT ESCALATION CONDITIONS

Escalation is required when:

- organization isolation may have failed;
- authentication may have been bypassed;
- Guidance appears to have mutated authoritative state;
- Guidance appears to have created governance conclusions;
- Guidance exposes unauthorized repository content;
- repeated ERROR events affect multiple engines;
- Snowflake authoritative data appears inconsistent;
- recovery would require changing constitutional or governance authority;
- recovery would require unapproved write access.

------------------------------------------------------------------------

# RECOVERY SUCCESS CRITERIA

Operational Guidance recovery is complete only when:

- authentication behaves as designed;
- organization scope is preserved;
- required engines execute deterministically;
- fail-closed behavior remains intact;
- structured telemetry is available;
- targeted validation passes;
- no unauthorized state mutation occurred;
- no authority boundary was expanded;
- participant-facing Guidance is restored where authoritative context permits.

------------------------------------------------------------------------

# PROHIBITED RECOVERY ACTIONS

Do not:

- disable organization scope checks;
- bypass signed-session authentication;
- convert UNRESOLVED into AVAILABLE manually;
- hide ERROR states by hardcoding successful results;
- infer repository relationships;
- fabricate repository records;
- alter Snowflake authoritative records merely to satisfy Guidance;
- grant write authority to the Guidance runtime;
- automatically resolve blockers;
- automatically resolve waiting states;
- automatically reassign owners;
- automatically advance workflow;
- certify automatically;
- publish automatically;
- modify registry state automatically.

------------------------------------------------------------------------

# KNOWN CURRENT RECOVERY CHARACTERISTICS

Operational Guidance currently relies on application-level structured
telemetry.

A dedicated external observability or alerting provider is not established by
this runbook.

Canonical repository relationship runtime context may remain unresolved where
no authoritative relationship source exists.

These conditions must remain visible rather than being inferred away.

------------------------------------------------------------------------

# DOCUMENT RELATIONSHIPS

This runbook operates alongside:

- OPERATIONAL_GUIDANCE_ARCHITECTURE.md
- OPERATIONAL_GUIDANCE_IMPLEMENTATION_PLAN.md
- OPERATIONAL_WORKFLOW_ARCHITECTURE.md
- OPERATIONAL_WORKFLOW_STATE_MACHINE.md
- CASE_WORKSPACE_ARCHITECTURE.md
- ENGINEERING_RULES.md

Where conflict exists, higher-order constitutional, governance, certification,
publication, registry, verification, and Snowflake doctrine remains
authoritative.

------------------------------------------------------------------------

# FINAL RECOVERY DOCTRINE

Operational Guidance recovery restores deterministic advisory visibility.

It does not manufacture authoritative state.

Snowflake remains the source of truth.

Human governance authority remains supreme.

END OF FILE