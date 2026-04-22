# PUBLIC_PAGE_AUDIT.md
Last Updated: 2026-04-22

## PURPOSE

This document is the canonical audit log for all GAFAIG public-facing pages.

It tracks:
- Visual alignment status
- Template compliance
- Layout drift
- Data consistency issues
- Completed fixes
- Outstanding issues

This document works together with:
- PAGE_LAYOUT_SYSTEM.md (visual shell rules)
- PUBLIC_PAGE_TEMPLATE_MAP.md (template assignments)

---

# CORE RULE

A page is considered "ALIGNED" only if:

1. It follows the global visual shell
2. It matches its assigned template
3. It does not introduce layout drift
4. It renders correct and complete data

---

# STATUS DEFINITIONS

ALIGNED  
Page fully complies with shell + template + data requirements

PARTIAL  
Page follows shell but has composition or data issues

MISALIGNED  
Page violates layout system or template rules

BROKEN  
Page has functional or data errors

---

# INFORMATIONAL PAGES

## /

Status: ALIGNED  
Template: INFORMATIONAL  

Notes:
- Serves as primary visual reference for informational pages
- Hero, spacing, and typography are canonical

---

## /mission

Status: ALIGNED  
Template: INFORMATIONAL  

Notes:
- Matches home page structure and rhythm

---

## /framework

Status: PARTIAL  
Template: INFORMATIONAL  

Issues:
- Content previously drifted toward internal workflow language
- Section emphasis inconsistent with certification-first framing

Required Fix:
- Remove internal-only concepts (e.g., "approved")
- Maintain layout shell
- Improve narrative clarity

---

## /developers

Status: PARTIAL  
Template: INFORMATIONAL  

Issues:
- Needs alignment with informational narrative structure
- Verify consistent hero usage and section rhythm

---

# INDEX / LIST PAGES

## /registry

Status: PARTIAL  
Template: INDEX / LIST  

Issues:
- Filter and data contract mismatches previously observed
- Option sets (organizations, tiers, bands) inconsistent across API/types/UI

Required Fix:
- Ensure filter contract matches query layer
- Ensure layout remains list-first, not narrative

---

## /explorer

Status: PARTIAL  
Template: INDEX / LIST  

Issues:
- Stats contract drift (missing fields like systems, certifiedRecords)
- Layout inconsistencies during prior edits

Required Fix:
- Normalize ExplorerStats contract
- Ensure metrics render consistently

---

## /explorer/countries

Status: ALIGNED  
Template: INDEX / LIST  

Notes:
- Layout corrected to match canonical shell
- Data rendering stable

---

## /explorer/organizations

Status: PARTIAL  
Template: INDEX / LIST  

Issues:
- Field mismatch (entityName vs organizationName)
- Type contract inconsistency

Required Fix:
- Align type definitions with query output

---

## /explorer/systems

Status: PARTIAL  
Template: INDEX / LIST  

Issues:
- Data loss occurred during layout edits
- Missing certified tier/band at one stage

Required Fix:
- Lock data contract first, then layout
- Prevent future regression

---

# DETAIL / RECORD PAGES

## /registry/[registryId]

Status: PARTIAL  
Template: DETAIL / RECORD  

Issues:
- Layout drift (header, card alignment, spacing)
- Inconsistent typography vs system
- Section grouping issues

Required Fix:
- Enforce section shell strictly
- Restore canonical typography scale

---

## /verify/[registryId]

Status: PARTIAL  
Template: DETAIL / RECORD  

Issues:
- API contract mismatch (missing columns)
- Verify route querying non-existent fields
- Dependency on incorrect Snowflake view fields

Required Fix:
- Align verify API with Snowflake schema
- Ensure required fields exist or are sourced correctly
- Prevent over-strict page validation causing 404

---

## /registry/ai-systems/[systemId]

Status: PARTIAL  
Template: DETAIL / RECORD  

Issues:
- Type mismatch (boolean vs string values)
- Data normalization inconsistencies

Required Fix:
- Normalize field types
- Ensure consistent rendering logic

---

# POLICY / DOCUMENT PAGES

## /policy/*
## /standards/*
## /governance/*
## /docs/*

Status: NOT FULLY AUDITED  
Template: POLICY / DOCUMENT  

Required Action:
- Confirm shell compliance
- Confirm typography consistency
- Confirm structured layout usage

---

# SYSTEM-WIDE ISSUES

## 1. Layout Drift Cause

Root Issue:
- Mixing layout shell changes with content changes

Fix:
- Enforce rule: Shell first → Template second → Content last

---

## 2. Data Contract Drift

Root Issue:
- Snowflake → API → Types → UI not synchronized

Examples:
- certifiedScore mismatch
- certificationStatus vs decisionStatus
- ExplorerStats missing fields

Fix:
- Define canonical data contracts
- Enforce alignment across all layers

---

## 3. Page Comparison Errors

Root Issue:
- Comparing pages across different templates

Fix:
- Only compare pages within the same template
- Use PUBLIC_PAGE_TEMPLATE_MAP.md as authority

---

# AUDIT WORKFLOW

When fixing any page:

Step 1 — Validate Shell  
- Container  
- Hero  
- Section shell  
- Card system  
- Typography  
- Spacing  

Step 2 — Validate Template  
- Correct template assignment  
- Correct composition  

Step 3 — Validate Data  
- API contract  
- Type definitions  
- Rendering logic  

Step 4 — Validate Content  
- Messaging clarity  
- No internal-only concepts  

---

# CHANGE LOG

2026-04-22
- Introduced full public page audit system
- Identified layout vs content vs data conflicts
- Established canonical alignment criteria

---

# OBJECTIVE

This audit system ensures:

- Continuous visual consistency
- Controlled page evolution
- Elimination of layout regressions
- Clear tracking of system health

---

# FINAL PRINCIPLE

A page is not correct because it looks right.

A page is correct because:
- It follows the system
- It matches its template
- Its data is accurate
- Its purpose is clear