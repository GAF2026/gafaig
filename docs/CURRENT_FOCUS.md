# CURRENT_FOCUS.md
# GAFAIG — Global Authority for AI Governance
# Current Focus (Execution Lock)
# Last Updated: 2026-04-12

## PRIMARY OBJECTIVE

Fix the canonical demo certification workflow inside:

GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql

This is the ONLY active engineering task.

---

## PROBLEM STATEMENT

The canonical seed file executes, but the workflow layer is incomplete:

- VERIFICATION_FINDINGS = 0
- VERIFICATION_EVIDENCE = 0
- VERIFICATION_FINDING_EVIDENCE = 0
- VERIFICATION_EVENTS = populated

This indicates failure in deterministic workflow reconstruction:

FINDINGS → EVIDENCE → FINDING_EVIDENCE

The issue is not UI, not API, not registry views, and not explorer pages.

The issue is strictly within the canonical seed file SQL patterns.

---

## SCOPE (STRICTLY LIMITED)

Modify ONLY:

GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql

Focus ONLY on:

- INSERT patterns for findings
- INSERT patterns for evidence
- INSERT patterns for finding-evidence links
- Deterministic VALUES + alias structures
- Correct CROSS JOIN usage
- Proper column alignment

Do NOT modify:

- UI (any page)
- API routes
- Explorer pages
- Registry pages
- Public views
- Schema definitions
- Scoring logic (until workflow is fixed)

---

## REQUIRED OUTCOME

After running the canonical seed file in a fresh Snowflake worksheet:

VERIFICATION_FINDINGS = 25  
VERIFICATION_EVIDENCE = 25  
VERIFICATION_FINDING_EVIDENCE = 25  
VERIFICATION_EVENTS = 10  

All counts must be scoped to:

CASE-0001  
CASE-0002  
CASE-0003  
CASE-0004  
CASE-0005  

---

## EXECUTION RULES

- Use deterministic INSERT ... SELECT patterns
- Use inline VALUES blocks with explicit column aliases
- Avoid malformed WITH clause usage
- Avoid temp table dependency
- Ensure all ID generation is deterministic
- Ensure cleanup logic matches real table schema

---

## DEBUGGING SEQUENCE (MANDATORY)

1. Run canonical seed file
2. Check counts for workflow tables
3. Inspect inserted rows (not just counts)
4. Fix SQL patterns if counts are incorrect
5. Re-run seed file
6. Repeat until counts match expected values

Do NOT:
- jump to scoring
- modify views
- modify UI

---

## NEXT STEP (AFTER SUCCESS)

Once workflow counts are correct:

1. Re-enable scoring calls:
   CALL CORE.SP_SCORE_CASE_ENTERPRISE(...)
2. Validate CASE_SCORE_SNAPSHOTS_V2
3. Validate V_CASE_SCORE_ENTERPRISE
4. Validate V_REGISTRY_PUBLIC
5. Confirm Explorer and Registry surfaces reflect correct data

---

## SUCCESS STATE DEFINITION

The system is considered stable when:

- Canonical seed file runs cleanly
- Workflow tables are fully populated
- Scoring executes without errors
- Registry surfaces reflect correct certification state
- No UI or API modifications were required to achieve correctness

---

## FINAL RULE

Do not expand scope.

Do not introduce new files.

Do not re-architect.

Fix the workflow layer inside the canonical seed file only.

---

## END OF FILE