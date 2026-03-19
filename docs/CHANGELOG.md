# GAFAIG — CHANGELOG

---

## 2026-03-19

### AI Systems Registry (MAJOR PLATFORM EXPANSION)
- Implemented full **AI Systems Registry layer**.
- Introduced canonical Snowflake view:
  - V_REGISTRY_AI_SYSTEMS_PUBLIC
- Established architecture:
  - REGISTRY_AI_SYSTEMS → VERIFICATION_CASES → REGISTRY_ENTITIES → V_REGISTRY_PUBLIC
- Enforced alignment with registry pipeline:
  - systems must link to CASE_ID and REGISTRY_ID
- Eliminated orphan system architecture risk.

---

### Next.js Registry UI (AI Systems)
- Implemented new public routes:
  - /registry/ai-systems
  - /registry/ai-systems/[registryId]
- Built full UI pages:
  - AI systems list page
  - AI system detail page
- Connected UI to Snowflake via query registry.
- Implemented structured display:
  - system metadata
  - entity metadata
  - certification data
  - governance attributes

---

### Query Registry Layer (CRITICAL ARCHITECTURE)
- Enforced canonical query pattern:
  - lib/queries/
- Implemented:
  - getRegistryAiSystems()
  - getRegistryAiSystemBySystemId()
- Removed all inline SQL from UI.
- Established query layer as:
  - required data access abstraction
  - protection against SQL drift
  - stabilizer for AI-assisted development

---

### Next.js Routing Fix (CRITICAL)
- Resolved dynamic route conflict:
  - [registryId] vs [systemId]
- Standardized slug naming:
  - all AI system routes now use [registryId]
- Eliminated Next.js runtime error:
  - "You cannot use different slug names for the same dynamic path"
- Restored stable dev server startup.

---

### Snowflake View Architecture (CRITICAL FIX)
- Refactored:
  - 21_VIEWS_PUBLIC_REGISTRY.sql
  - 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
- Enforced **View Purity Rule**:
  - view files now contain ONLY:
    - CREATE VIEW
    - GRANTS
- Removed:
  - test queries
  - embedded logic
  - non-deterministic elements

---

### Registry View Alignment
- Standardized public registry layer:
  - V_REGISTRY_PUBLIC (canonical)
  - V_PUBLIC_REGISTRY (UI-facing)
  - V_REGISTRY_EXPORT_V1
- Ensured:
  - all views derive from V_REGISTRY_LATEST_APPROVED
- Eliminated dependency on:
  - REGISTRY_ENTITIES for canonical registry layer

---

### SQL Pipeline Cleanup (MAJOR STABILITY IMPROVEMENT)
- Reorganized SQL files into structured directories:

sql/
  active/
  archive/
    legacy_pipeline/
    diagnostics/
    scratch/

- Categorized all SQL files:
  - active (canonical pipeline)
  - legacy (archived)
  - diagnostics
- Removed redundant / duplicate worksheet files.
- Eliminated multiple overlapping pipeline generations.

---

### Snowflake Environment Stabilization
- Executed full canonical rebuild sequence.
- Verified successful execution of:
  - core setup
  - verification schema
  - scoring engine
  - registry pipeline
  - AI systems layer
- Confirmed:
  - zero errors across execution chain.

---

### Demo Data Alignment Improvements
- Identified and corrected improper demo data patterns.
- Reinforced rule:
  - no direct inserts into registry surfaces
- Ensured demo pipeline aligns with:
  - CASE → SNAPSHOT → REGISTRY
- Improved integrity of:
  - registry counts
  - AI systems display
  - frontend consistency

---

### Documentation Synchronization (FULL SYSTEM ALIGNMENT)
Updated all canonical documents:

- MASTER_STATE.md
  - added AI systems registry layer
  - added query registry architecture
- CURRENT_FOCUS.md
  - added AI systems registry objective
  - updated development phase
- ENGINEERING_RULES.md
  - added:
    - query registry rule
    - view purity rule
    - AI systems alignment rule
- PROJECT_INDEX.md
  - added:
    - AI systems routes
    - query layer mapping
    - SQL directory structure

Established complete documentation alignment across:

Snowflake → Query Layer → API → UI

---

### Platform Status (Post-Update)
GAFAIG now includes:

- deterministic enterprise scoring engine
- snapshot-based registry pipeline
- canonical public registry views
- AI systems registry layer
- query registry abstraction (mandatory)
- fully wired Next.js registry UI
- stable Snowflake execution environment

---

## 2026-03-17

### Architecture (CRITICAL MILESTONE)
- Established canonical GAFAIG architecture as case-first deterministic governance engine.
- Confirmed execution flow:

CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → SNAPSHOT → REGISTRY

- Eliminated ambiguity between application-driven vs case-driven workflows.
- Defined applications as intake-only.

---

### Enterprise Governance Scoring Engine (v1.0)
- Implemented canonical scoring engine.
- Replaced legacy scoring models.
- Introduced control-based scoring system.
- Implemented deterministic scoring views and procedure.

---

### Snapshot Architecture (v2)
- Introduced CASE_SCORE_SNAPSHOTS_V2.
- Implemented deterministic snapshot persistence.
- Made snapshots mandatory for registry publication.

---

### Verification Workflow Stabilization
- Standardized verification tables.
- Confirmed case-first workflow.
- Maintained dual evidence mapping tables.

---

### ID Normalization Fix
- Fixed scoring failures caused by:
  - casing mismatches
  - trailing spaces
- Implemented:
  - TRIM()
  - UPPER()

---

### Registry Architecture Clarification
- Defined snapshot-driven registry pipeline.
- Eliminated manual registry inserts.
- Confirmed SP_PUBLISH_CASE_TO_REGISTRY_V3 as only publish method.

---

### Demo Data Issue Identified
- Diagnosed orphan AI system records.
- Root cause:
  - direct inserts into REGISTRY_AI_SYSTEMS
- Established correct pipeline-driven data flow.

---

### Canonical Enterprise Test Case
- Created CASE-ENT-0001.
- Used for:
  - scoring validation
  - snapshot validation
  - registry validation

---

### Documentation Overhaul
- Updated all core docs:
  - MASTER_STATE.md
  - CURRENT_FOCUS.md
  - ENGINEERING_RULES.md
  - PROJECT_INDEX.md
- Established documentation as source of truth.

---

### Engineering Rules Strengthened
- Enforced:
  - case-first architecture
  - enterprise scoring only
  - snapshot-driven registry
- Prohibited:
  - legacy scoring
  - direct registry writes

---

### Platform Status
- deterministic scoring engine complete
- verification workflow stabilized
- snapshot registry pipeline operational
- public registry views implemented

---

## 2026-03-16

### Platform
- Implemented Snowflake Query Registry abstraction.
- Introduced lib/queries layer.
- Eliminated duplicated SQL.

---

### Registry Routes
Stabilized:

/registry/ai-systems  
/registry/ai-systems/[registryId]

---

### Query Layer
Created:

- getRegistryAiSystems()
- getRegistryAiSystemByRegistryId()

---

### Build Stability
- Fixed Next.js module issues.
- Verified build success.

---

### Snowflake Integration
- Verified JWT authentication.
- Confirmed GAFAIG_APP_ROLE connectivity.

---

## 2026-02-23

- Fixed Snowflake environment variables.
- Stabilized admin applications page.
- Began documentation consolidation.

---

## 2026-02-20 to 2026-02-22

- Refined evidence workflow.
- Debugged verification APIs.
- Updated scoring SQL.
- Stabilized verification pipeline.