# PUBLIC_PAGE_TEMPLATE_MAP.md
Last Updated: 2026-04-22

## PURPOSE

This document assigns every GAFAIG public-facing page to a canonical page template.

It removes ambiguity by ensuring:
- Every page has a defined structure type
- Pages are only compared to valid peers
- Layout reviews follow the correct standard
- No cross-template drift occurs

This document works together with:
- PAGE_LAYOUT_SYSTEM.md (visual shell + template rules)

---

# CORE RULE

Every public page MUST be assigned to exactly ONE template.

Pages must ONLY be evaluated against:
1. The global visual shell (PAGE_LAYOUT_SYSTEM.md)
2. Their assigned template (this document)

---

# TEMPLATE DEFINITIONS

## TEMPLATE 1 — INFORMATIONAL

Purpose:
Explain concepts, systems, or mission.

Characteristics:
- Narrative-driven
- Structured sections
- Concept cards and bullets
- Minimal data density

---

## TEMPLATE 2 — INDEX / LIST

Purpose:
Display collections of records or aggregated data.

Characteristics:
- Filters and controls
- Summary stats (optional)
- Lists or grids of items
- Structured scanning layout

---

## TEMPLATE 3 — DETAIL / RECORD

Purpose:
Display a single record or entity.

Characteristics:
- Entity-level hero
- Structured data presentation
- Field/value layouts
- Verification and trust panels

---

## TEMPLATE 4 — POLICY / DOCUMENT

Purpose:
Present structured documentation or governance text.

Characteristics:
- Text-heavy
- Sectioned content
- Minimal visual density
- Formal structure

---

# PAGE ASSIGNMENTS

## INFORMATIONAL PAGES

These pages must follow the INFORMATIONAL template.

- /
- /mission
- /framework
- /developers

Rules:
- Must prioritize narrative clarity
- Must not introduce registry-style layouts
- Must not include dense record grids

---

## INDEX / LIST PAGES

These pages must follow the INDEX / LIST template.

- /registry
- /explorer
- /explorer/countries
- /explorer/organizations
- /explorer/systems

Rules:
- Must prioritize scanability
- Must support structured listing of records
- Must not include long narrative sections

---

## DETAIL / RECORD PAGES

These pages must follow the DETAIL / RECORD template.

- /registry/[registryId]
- /verify/[registryId]
- /registry/ai-systems/[systemId]

Rules:
- Must present structured entity data
- Must include verification or trust elements where applicable
- Must not use informational narrative layouts

---

## POLICY / DOCUMENT PAGES

These pages must follow the POLICY / DOCUMENT template.

- /policy/*
- /standards/*
- /governance/*
- /docs/*

Rules:
- Must prioritize structured readability
- Must not include registry-style layouts
- Must minimize visual noise

---

# WHAT IS NOT ALLOWED

- Assigning a page to multiple templates
- Mixing templates within a single page
- Comparing pages across different templates
- Changing a page’s template without updating this file
- Using one page as a visual reference for a different template type

---

# REVIEW RULES

When reviewing any page:

1. Identify the page’s template (from this file)
2. Validate global visual shell compliance
3. Validate composition against the template
4. Ignore pages from other templates during comparison

---

# CHANGE MANAGEMENT

If a new public page is created:

1. It MUST be added to this file
2. It MUST be assigned a template
3. It MUST follow PAGE_LAYOUT_SYSTEM.md

If a page’s purpose changes:

1. Update its template assignment here
2. Then update the page to match the new template

---

# OBJECTIVE

This mapping ensures:

- No ambiguity in layout decisions
- No cross-page comparison errors
- Clean separation between page types
- Scalable system for future pages

---

# FINAL PRINCIPLE

A page is correct when:

- It follows the global visual shell
- It matches its assigned template
- Its content supports its purpose

Not when it visually matches another page.