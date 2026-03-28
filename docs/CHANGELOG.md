CHANGELOG.md
# GAFAIG — CHANGELOG

---

## 2026-03-28

### Certification Wiring — Completed
- Completed end-to-end certification wiring across Snowflake, API, and UI.
- Confirmed public registry records now surface certified fields correctly.
- Verified working public record routes:
  - `/registry/[registryId]`
  - `/organizations/[registryId]`
- Confirmed deterministic certified outputs now render publicly:
  - `CERTIFIED_SCORE`
  - `CERTIFIED_TIER`
  - `CERTIFIED_BAND`
  - `CERTIFIED_AT`
  - `DECISION_STATUS`
  - `CERTIFICATION_STATUS`
  - `VALID_FROM`
  - `VALID_TO`
  - `LAST_ACTIVITY_AT`

### Snowflake Publish Chain
- Verified `SP_PUBLISH_CASE_TO_REGISTRY_V3` is a wrapper over `SP_PUBLISH_CASE_TO_REGISTRY_V4`.
- Confirmed the real publish logic remains in `SP_PUBLISH_CASE_TO_REGISTRY_V4`.
- Confirmed `SP_PUBLISH_CASE_TO_REGISTRY_V4` already includes AI-system registry-ID alignment for existing case-linked AI systems.
- Determined no core publish procedure rewrite was required at this stage.

### Registry + Organization Production Validation
- Deployed and validated production behavior on `www.gafaig.com`.
- Confirmed public registry detail page renders certification summary, governance outcome, and verification surface.
- Confirmed public organization detail page resolves the same registry identity and displays certification metadata consistently.

### AI Systems Visibility
- Confirmed `CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC` is populated and working.
- Confirmed public AI-system data already exists for multiple registry IDs.
- Identified that the temporary “0 systems” issue on a given organization page was caused by data alignment, not UI or API defects.
- Verified organization page system counts and system cards render correctly once a matching AI-system row exists for the target registry ID.

### Scratchpad / Validation Work
- Used `Untitled.sql` as a temporary operational scratchpad to:
  - inspect DDL for publish procedures
  - inspect DDL for `REGISTRY_AI_SYSTEMS`
  - validate certified public registry fields
  - validate AI-system public view rows
  - test one-off AI-system linkage to a known certified registry record
- Determined that the scratchpad work did not require mandatory changes to canonical core Snowflake definition files.

### New Snowflake Operator Script
- Added a recommended non-core helper script:
  - `GAFAIG - Certification Wiring Validation + AI Systems Demo Link.sql`
- Purpose of the helper script:
  - preserve validation queries
  - preserve procedure/view inspection commands
  - preserve demo AI-system linkage workflow
  - provide a repeatable operator validation sequence without modifying core architecture

### Next.js / TypeScript Stabilization
- Fixed multiple server-route compatibility issues related to the Snowflake helper layer.
- Removed incorrect callable usage of `snowflakeCtx()`.
- Standardized those usages to `snowflakeCtx`.
- Fixed debug/API imports to use canonical `sfQuery`.
- Resolved Snowflake bind typing issues in `lib/snowflake.ts` by normalizing bind inputs before execution.
- Restored successful production build and successful deployment to Vercel.

### Architecture Confirmation
- Confirmed certification wiring is now complete and production-valid.
- Confirmed there is no remaining required core SQL patch before lifecycle work.
- Confirmed next recommended platform phase is:
  - **Lifecycle wiring**
- Clarified that future AI-system work should focus on upstream intake / authoring workflow, not certification wiring.

---

## CURRENT SYSTEM STATUS

### Locked / Working
- verification workflow
- deterministic scoring engine
- registry snapshot system
- public registry surface
- certification wiring
- registry detail page
- organization detail page
- AI systems public view
- publish wrapper/procedure chain
- production deployment on Vercel

### Current Gap Categories
- lifecycle (`VALID_TO`, renewal / expiry transitions)
- upstream AI-system intake / authoring automation
- optional operator-script consolidation

---

## NEXT PHASE
- Start lifecycle wiring.