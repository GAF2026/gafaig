# GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
Last Updated: 2026-04-14

============================================================
PURPOSE
============================================================

This document defines the COMPLETE and CANONICAL set of Snowflake SQL files used in GAFAIG.

It identifies:
- Source-of-truth schema files
- Core pipeline tables
- Views used by the application
- Stored procedures driving system behavior
- Demo seed files

ONLY these files should be used for development and execution.

============================================================
CANONICAL PRINCIPLE
============================================================

Snowflake is the source of truth.

ALL:
- Scoring
- Certification
- Decisions
- Registry state

Must originate from Snowflake.

No logic is allowed in:
- API
- UI
- Query layer

============================================================
FOUNDATION (FULL REBUILD)
============================================================

01_REBUILD_ENVIRONMENT_CANONICAL.sql

Purpose:
- Defines the base system schema
- Rebuilds entire verification pipeline

Creates:
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.VERIFICATION_FINDING_EVIDENCE
- CORE.VERIFICATION_EVENTS
- CORE.CASE_SCORE_SNAPSHOTS
- CORE.DECISIONS
- CORE.REGISTRY_SNAPSHOTS

This is the TRUE canonical base layer.

============================================================
APPLICATION INGESTION
============================================================

11_TABLES_APPLICATIONS.sql

Creates:
- CORE.APPLICATIONS

Purpose:
- Stores incoming applications
- Provides APPLICATION_ID for pipeline linkage

============================================================
AI SYSTEM REGISTRY
============================================================

14_TABLES_REGISTRY_AI_SYSTEMS.sql

Creates:
- CORE.REGISTRY_AI_SYSTEMS

Purpose:
- Stores AI system metadata
- Links systems to CASE_ID and REGISTRY_ID

------------------------------------------------------------

22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

Creates:
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Purpose:
- Public-facing AI system registry view
- Joins systems to V_REGISTRY_PUBLIC

============================================================
REGISTRY SNAPSHOT SYSTEM
============================================================

GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql

Creates:
- CORE.REGISTRY_SNAPSHOTS (append-only)

Also defines:
- CORE.V_REGISTRY_LATEST_APPROVED

Purpose:
- Stores immutable registry history
- Provides latest approved snapshot per case

Key Fields:
- REGISTRY_ID
- CASE_ID
- SCORE / TIER / BAND
- CERTIFIED_* fields
- DECISION_STATUS
- PUBLISHED_AT

============================================================
PUBLIC REGISTRY VIEWS
============================================================

21_VIEWS_PUBLIC_REGISTRY.sql

Creates:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_LATEST_APPROVED (if included)

Purpose:
- Final public data contract
- Enriched with:
  - DECISIONS
  - APPLICATIONS

This is the ONLY allowed source for:
- API responses
- UI rendering

============================================================
SCORING SYSTEM
============================================================

CORE.SP_SCORE_CASE_ENTERPRISE

Purpose:
- Executes deterministic scoring

Writes to:
- CORE.CASE_SCORE_SNAPSHOTS_V2

Uses:
- CORE.V_CASE_SCORE_ENTERPRISE
- CORE.V_CASE_TIER_BAND

Outputs:
- SCORE
- SUBSCORES
- TIER
- BAND

============================================================
PUBLISH SYSTEM
============================================================

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Purpose:
- Publishes approved case to registry

Steps:
1. Validates case approval
2. Reads score from V_GOVERNANCE_SCORE_CASE
3. Generates or reuses REGISTRY_ID
4. Inserts append-only snapshot
5. Aligns REGISTRY_AI_SYSTEMS

Writes to:
- CORE.REGISTRY_SNAPSHOTS

============================================================
CASE CREATION
============================================================

23_SP_CREATE_CASE_FROM_APPLICATION.sql

Creates:
- CORE.SP_CREATE_CASE_FROM_APPLICATION

Purpose:
- Converts APPLICATION → CASE
- Generates deterministic CASE_ID
- Inserts initial event

============================================================
DECISION SYSTEM
============================================================

17_TABLES_DECISIONS.sql

Creates:
- CORE.DECISIONS

Purpose:
- Stores certification decisions
- Defines:
  - DECISION_STATUS
  - CERTIFICATION_TIER
  - CERTIFICATION_BAND
  - VALID_FROM / VALID_TO

============================================================
CASE DETAIL VIEW (ADMIN)
============================================================

20_VIEWS_VERIFICATION_CASE_DETAIL.sql

Creates:
- CORE.V_VERIFICATION_CASE_DETAIL

Purpose:
- Unified case detail surface
- Used for admin/debugging

============================================================
DEMO DATA SYSTEM
============================================================

PRIMARY FILE (ACTIVE):
- GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql

Purpose:
- Seeds full pipeline:
  CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → PUBLISH

------------------------------------------------------------

SUPPORTING FILE:
- GAFAIG - CANONICAL DEMO DATASET.sql

Purpose:
- Adds:
  - Entities
  - AI system linkage

------------------------------------------------------------

RESULTING DATA:
- 6 registry records
- 2 certified
- 4 approved-only

============================================================
CRITICAL VIEWS (USED BY APP)
============================================================

- CORE.V_REGISTRY_PUBLIC → PRIMARY CONTRACT
- CORE.V_REGISTRY_LATEST_APPROVED → snapshot resolution
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC → systems explorer

============================================================
DEPRECATED / DO NOT USE
============================================================

Any:
- Archived SQL files
- Duplicate schema files
- Legacy scoring procedures
- Non-canonical views

============================================================
RUN ORDER (REFERENCE)
============================================================

1. 01_REBUILD_ENVIRONMENT_CANONICAL.sql
2. 11_TABLES_APPLICATIONS.sql
3. 14_TABLES_REGISTRY_AI_SYSTEMS.sql
4. 17_TABLES_DECISIONS.sql
5. GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql
6. 21_VIEWS_PUBLIC_REGISTRY.sql
7. 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
8. 23_SP_CREATE_CASE_FROM_APPLICATION.sql
9. SP_SCORE_CASE_ENTERPRISE
10. SP_PUBLISH_CASE_TO_REGISTRY_V3
11. GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql

============================================================
SYSTEM STATUS
============================================================

Snowflake:
- ✅ Fully operational
- ✅ Canonical
- ✅ Deterministic

All pipeline stages:
- Working end-to-end

============================================================
END
============================================================