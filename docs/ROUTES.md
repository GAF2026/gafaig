# GAFAIG — Routes & APIs

Last updated: 2026-02-23

## Public pages
- / (homepage)
- /mission
- /framework
- /registry
- /policy
- /standards
- /participate
- /contact
- /thanks

## Admin pages
- /admin/login
  - “Enable demo access” sets admin cookie/session for local testing.
- /admin/applications
  - Admin → Applications list (Snowflake view)
- /admin/verification/[caseId]/evidence
  - Evidence list for case (demo/local data) and entry point for summary generation

## Admin APIs
### /api/admin/submissions (GET)
Purpose:
- Returns paginated admin submissions from Snowflake view `GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS`

Query params (typical):
- page
- pageSize
- status
- search
- (type optional)

### /api/admin/verification/[caseId]/summaries
GET:
- Fetch summaries for evidence linked to the case/org via Snowflake VERIFICATION_EVIDENCE
POST:
- mode: "all" | "missing"
- optional evidenceIds: string[]
Auth:
- Requires admin cookie/session (demo access)

## Notes
- Any route returning 401 likely means you didn’t enable demo access first.
- Any route returning empty rows with a warning about VERIFICATION_EVIDENCE likely means the linkage isn’t written to Snowflake yet.