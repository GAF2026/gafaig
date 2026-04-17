# PAGE_LAYOUT_SYSTEM.md
Last Updated: 2026-04-17
## PURPOSE
This document defines the canonical public page layout system for GAFAIG. Its purpose is to eliminate layout drift across pages, ensure visual consistency across all public surfaces, provide a single source of truth for page structure, spacing, and components, and guarantee that all public-facing pages feel like one unified system. This is a non-optional standard. All public pages MUST follow this layout system.
## CORE PRINCIPLE
All public-facing pages must use the same layout contract as the public trust surface pages (Registry / Explorer / Verify). No page is allowed to introduce new layout containers, different spacing systems, different hero formats, or different button treatments.
## CANONICAL PAGE CONTAINER
All public pages MUST use:
<main className="mx-auto max-w-[1180px] px-6 py-10"><div className="space-y-8">
Rules: max-w-[1180px] is the fixed width across ALL public pages. px-6 is the standard horizontal padding. py-10 is the standard vertical padding. space-y-8 controls vertical rhythm between ALL sections. No deviations allowed.
## HERO SYSTEM (MANDATORY)
All public pages MUST use PublicPageHero. Hero structure includes eyebrow (uppercase, small tracking), title (primary headline), description (core explanation), optional secondary description, and actions (buttons). Rules: no custom hero implementations, no inline hero styling, no alternate hero components, must match Registry / Explorer hero behavior.
## SECTION SYSTEM
All major content sections MUST use: <section className="rounded-3xl border border-black/10 bg-white p-8">. Rules: always use rounded-3xl, border-black/10, bg-white, and p-8. No alternative card styles for primary sections. Section spacing is controlled only by space-y-8 from the parent.
## SUBSECTION / CARD SYSTEM
Secondary cards use: rounded-2xl border border-black/10 bg-black/[0.02] p-5. Bullet cards use: flex gap-3 rounded-2xl border border-black/10 bg-white p-4. Pillar cards use: rounded-3xl border border-black/10 bg-white p-6. Rules: do not invent new card styles, reuse only these patterns, maintain consistent radius hierarchy where sections are 3xl and cards are 2xl.
## TYPOGRAPHY SYSTEM
Section headings: text-[26px] font-semibold tracking-tight text-black. Large section titles: text-[32px] md:text-[38px] font-semibold tracking-tight. Body text: text-[15px] leading-7 text-black/75. Supporting text: text-[14px] text-black/70. Rules: do not introduce arbitrary font sizes, do not mix inconsistent line heights, maintain readable line length using max-w constraints when needed.
## BUTTON SYSTEM
All buttons MUST use PublicButtonLink. Variants include primary, secondary, and ghost. Rules: no raw button or anchor styling for primary CTAs, no custom button classes, must match Registry / Explorer pill style.
## GRID SYSTEM
Standard grids include: grid gap-4 md:grid-cols-2, grid gap-4 md:grid-cols-3, grid gap-4 md:grid-cols-4, grid gap-4 md:grid-cols-5. Rules: always use gap-4, avoid arbitrary grid spacing, maintain consistent responsive breakpoints.
## SPACING SYSTEM
Vertical rhythm is controlled only by space-y-8. Internal spacing may use mt-4, mt-5, mt-6, mt-7, mt-8 for hierarchy only. Rules: do not stack random margin classes, do not override global spacing rhythm, sections must feel evenly spaced across all pages.
## COLOR SYSTEM
Base colors: bg-white for backgrounds, bg-black/[0.02] for subtle backgrounds, border-black/10 for borders, text-black for primary text, text-black/70–75 for secondary text. Rules: no arbitrary color additions, no inconsistent gray tones, no deviation from trust-neutral palette.
## LAYOUT DRIFT PREVENTION RULES
No new layout patterns unless added to this document first. No page-specific styling systems. Hero must always be PublicPageHero with no exceptions. All sections must follow the section shell. Registry and Explorer are the source of truth. All pages must visually match them.
## CURRENT CANONICAL PAGES (REFERENCE)
The following pages define the correct layout: /registry, /registry/[registryId], /explorer, /explorer/systems, /verify/[registryId]. All other pages must match these.
## UPDATED TO ALIGN (2026-04-17)
The following pages were brought into compliance: / (Home), /mission, /framework. These now follow PublicPageHero, the 1180px container, the standard section system, and the standard spacing rhythm.
## ENFORCEMENT
Any future page that does not follow this system must be rewritten or rejected before deployment. This document is the single source of truth for layout across GAFAIG.