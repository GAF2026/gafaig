# PAGE_LAYOUT_SYSTEM.md
Last Updated: 2026-04-22

## PURPOSE

This document defines the canonical layout system for all GAFAIG public-facing pages.

The goal is to ensure:
- Complete visual alignment across the website
- Consistent user experience
- Controlled flexibility for different page types
- Zero layout drift over time

---

# CORE PRINCIPLE

All public pages must follow a two-level system:

1. Global Visual Shell (MANDATORY)
2. Page Composition Templates (CONTROLLED FLEXIBILITY)

---

# LEVEL 1 — GLOBAL VISUAL SHELL (NON-NEGOTIABLE)

All public pages MUST use the exact same visual foundation.

## Page Container

All pages must begin with:

<main className="mx-auto max-w-[1180px] px-6 py-10">
  <div className="space-y-8">

---

## Hero Component

ALL public pages must use:

PublicPageHero

Never:
- custom hero implementations
- inline hero sections
- alternate typography structures

---

## Section Shell

All major sections MUST use:

<section className="rounded-3xl border border-black/10 bg-white p-8">

Rules:
- No alternate section styles
- No custom padding systems
- No different border radius
- No color variations

---

## Card System

Primary Cards (Section-Level)
rounded-3xl border border-black/10 bg-white p-8

Secondary Cards (Content Blocks)
rounded-2xl border border-black/10 bg-black/[0.02] p-5

Bullet / Inline Cards
rounded-2xl border border-black/10 bg-white p-4

No deviations allowed.

---

## Typography System

Headings:
- H1 → Hero only
- H2 → text-[26px] font-semibold tracking-tight
- H3 → text-[18px] font-semibold tracking-tight

Body:
- Primary → text-[15px] leading-7 text-black/75
- Secondary → text-[14px] leading-7 text-black/70

No custom font sizes or tracking values.

---

## Buttons

ALL buttons must use:

PublicButtonLink

No custom buttons allowed.

---

## Spacing Rhythm

- Page spacing → space-y-8
- Section spacing → mt-4, mt-6, mt-8
- Grid spacing → gap-4

No custom spacing systems.

---

# LEVEL 2 — PAGE COMPOSITION TEMPLATES

Pages may vary in structure ONLY through approved templates.

---

## TEMPLATE 1 — INFORMATIONAL PAGES

Used for:
- /
- /mission
- /framework
- /developers

Structure:
1. Hero
2. Narrative section
3. Supporting sections (cards, bullets, grids)
4. Optional system/framework sections
5. Optional CTA section

Allowed:
- Paragraph blocks
- Bullet cards
- Concept cards
- Structured narrative sections

Not Allowed:
- Dense data tables
- Registry-style record layouts
- Mixing layouts from other templates

---

## TEMPLATE 2 — INDEX / LIST PAGES

Used for:
- /registry
- /explorer
- /explorer/countries
- /explorer/organizations
- /explorer/systems

Structure:
1. Hero
2. Filters / controls (optional)
3. Summary stats (optional)
4. List or grid of records

Allowed:
- Row-based lists
- Card grids
- Filters
- Metrics

Not Allowed:
- Long narrative storytelling sections
- Detail page layouts

---

## TEMPLATE 3 — DETAIL / RECORD PAGES

Used for:
- /registry/[registryId]
- /verify/[registryId]
- /registry/ai-systems/[systemId]

Structure:
1. Hero (entity-level)
2. Summary panel
3. Structured data sections
4. Verification / trust sections

Allowed:
- Field/value layouts
- Data grids
- Status panels
- Verification blocks

Not Allowed:
- Long narrative storytelling
- Informational page structures

---

## TEMPLATE 4 — POLICY / DOCUMENT PAGES

Used for:
- policy pages
- standards
- governance documentation

Structure:
1. Hero
2. Structured text sections
3. Headings and subheadings

Allowed:
- Text blocks
- Structured sections
- Minimal card usage

---

# CRITICAL RULE

All public pages MUST share the same visual shell.
Pages may vary in composition ONLY within their assigned template.

---

# WHAT IS NOT ALLOWED

- Creating new layout patterns
- Mixing multiple templates on one page
- Custom hero implementations
- Custom section styles
- Custom typography systems
- Page-specific spacing systems
- Visual approximation of other pages

---

# SOURCE OF TRUTH

Visual alignment must be based on:

1. This document (PRIMARY)
2. Canonical components (PublicPageHero, PublicButtonLink)
3. Approved template structure

NOT:
- screenshots
- individual page appearance
- subjective comparison

---

# REVIEW ORDER (MANDATORY)

When evaluating any page:

1. Does it follow the global visual shell?
2. Is it using the correct page template?
3. Does its composition match that template?
4. Does the content fit the purpose?

If step 1 fails → layout is invalid
If step 2 fails → structure is invalid
If step 3 fails → composition is invalid

---

# CANONICALIZATION RULE

All future changes must follow:

- Shell first
- Template second
- Content last

Never mix these layers.

---

# OBJECTIVE

This system ensures:
- 100% visual consistency across GAFAIG
- flexibility for different page types
- elimination of layout drift
- scalable design for future pages

---

# FINAL PRINCIPLE

GAFAIG is not a collection of pages.

It is a system of public trust surfaces:
- structured
- consistent
- deterministic
- non-arbitrary