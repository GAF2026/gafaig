-- ============================================================
-- 30_DEMO_DATA_SEEDING.sql
--
-- Purpose:
--   Seed a clean GAFAIG verification workflow demo dataset.
--
-- Demo entities:
--   - OpenAI — ChatGPT Platform
--   - University of Oxford — AI Governance & Ethics
--   - United Nations — AI Advisory Body
--
-- Safe to rerun:
--   - Cleans and recreates only CASE-1001 .. CASE-1003
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- 0) Deterministic IDs
-- ------------------------------------------------------------
SET PID_OPENAI  = '11111111-1111-1111-1111-111111111111';
SET PID_OXFORD  = '22222222-2222-2222-2222-222222222222';
SET PID_UNAIAB  = '33333333-3333-3333-3333-333333333333';

SET CASE_OPENAI = 'CASE-1001';
SET CASE_OXFORD = 'CASE-1002';
SET CASE_UNAIAB = 'CASE-1003';

-- ------------------------------------------------------------
-- 1) Clean prior demo rows for these demo case IDs only
-- ------------------------------------------------------------
DELETE FROM GAFAIG_DB.CORE.VERIFICATION_EVENTS
WHERE CASE_ID IN ($CASE_OPENAI, $CASE_OXFORD, $CASE_UNAIAB);

DELETE FROM GAFAIG_DB.CORE.VERIFICATION_ASSIGNMENTS
WHERE CASE_ID IN ($CASE_OPENAI, $CASE_OXFORD, $CASE_UNAIAB);

DELETE FROM GAFAIG_DB.CORE.VERIFICATION_FINDING_EVIDENCE
WHERE CASE_ID IN ($CASE_OPENAI, $CASE_OXFORD, $CASE_UNAIAB);

DELETE FROM GAFAIG_DB.CORE.VERIFICATION_FINDINGS
WHERE CASE_ID IN ($CASE_OPENAI, $CASE_OXFORD, $CASE_UNAIAB);

DELETE FROM GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
WHERE CASE_ID IN ($CASE_OPENAI, $CASE_OXFORD, $CASE_UNAIAB);

DELETE FROM GAFAIG_DB.CORE.VERIFICATION_DECISIONS
WHERE CASE_ID IN ($CASE_OPENAI, $CASE_OXFORD, $CASE_UNAIAB);

DELETE FROM GAFAIG_DB.CORE.VERIFICATION_CASES
WHERE CASE_ID IN ($CASE_OPENAI, $CASE_OXFORD, $CASE_UNAIAB);

-- ------------------------------------------------------------
-- 2) Upsert demo participants
-- ------------------------------------------------------------
MERGE INTO GAFAIG_DB.CORE.PARTICIPANTS t
USING (
  SELECT
    $PID_OPENAI  AS PARTICIPANT_ID,
    'company'    AS PARTICIPANT_TYPE,
    NULL         AS JURISDICTION_LEVEL,
    'OpenAI — ChatGPT Platform' AS NAME,
    'United States' AS COUNTRY,
    'https://openai.com' AS WEBSITE,
    'openai-chatgpt' AS PROFILE_SLUG,
    'governance-partner' AS DESIGNATION_LEVEL,
    'verified' AS VERIFICATION_STATUS,
    'AI technology provider participating in GAFAIG Human Governance verification.' AS PUBLIC_SUMMARY,
    NULL AS LOGO_URL
  UNION ALL
  SELECT
    $PID_OXFORD,
    'university',
    NULL,
    'University of Oxford — AI Governance & Ethics',
    'United Kingdom',
    'https://www.ox.ac.uk',
    'oxford-ai-governance',
    'participant',
    'in_review',
    'Academic institution undergoing Human Governance verification for research governance and oversight.',
    NULL
  UNION ALL
  SELECT
    $PID_UNAIAB,
    'government',
    'international',
    'United Nations — AI Advisory Body',
    'International',
    'https://www.un.org',
    'un-ai-advisory-body',
    'observer',
    'needs_more_info',
    'Intergovernmental advisory body under review for governance transparency and evidence requirements.',
    NULL
) s
ON t.PROFILE_SLUG = s.PROFILE_SLUG
WHEN MATCHED THEN UPDATE SET
  t.PARTICIPANT_ID      = s.PARTICIPANT_ID,
  t.PARTICIPANT_TYPE    = s.PARTICIPANT_TYPE,
  t.JURISDICTION_LEVEL  = s.JURISDICTION_LEVEL,
  t.NAME                = s.NAME,
  t.COUNTRY             = s.COUNTRY,
  t.WEBSITE             = s.WEBSITE,
  t.DESIGNATION_LEVEL   = s.DESIGNATION_LEVEL,
  t.VERIFICATION_STATUS = s.VERIFICATION_STATUS,
  t.PUBLIC_SUMMARY      = s.PUBLIC_SUMMARY,
  t.LOGO_URL            = s.LOGO_URL,
  t.UPDATED_AT          = CURRENT_TIMESTAMP()
WHEN NOT MATCHED THEN INSERT (
  PARTICIPANT_ID,
  PARTICIPANT_TYPE,
  JURISDICTION_LEVEL,
  NAME,
  COUNTRY,
  WEBSITE,
  PROFILE_SLUG,
  DESIGNATION_LEVEL,
  VERIFICATION_STATUS,
  PUBLIC_SUMMARY,
  LOGO_URL,
  CREATED_AT,
  UPDATED_AT
) VALUES (
  s.PARTICIPANT_ID,
  s.PARTICIPANT_TYPE,
  s.JURISDICTION_LEVEL,
  s.NAME,
  s.COUNTRY,
  s.WEBSITE,
  s.PROFILE_SLUG,
  s.DESIGNATION_LEVEL,
  s.VERIFICATION_STATUS,
  s.PUBLIC_SUMMARY,
  s.LOGO_URL,
  CURRENT_TIMESTAMP(),
  CURRENT_TIMESTAMP()
);

-- ------------------------------------------------------------
-- 3) Verification cases
-- ------------------------------------------------------------
INSERT INTO GAFAIG_DB.CORE.VERIFICATION_CASES (
  CASE_ID,
  PARTICIPANT_ID,
  ENTITY_NAME,
  VERIFICATION_TYPE,
  STANDARD_CODE,
  STANDARD_VERSION,
  STATUS,
  PRIORITY,
  SUBMITTED_AT,
  CREATED_AT,
  UPDATED_AT
)
VALUES
  ($CASE_OPENAI, $PID_OPENAI, 'OpenAI — ChatGPT Platform', 'participant', 'HG', 'v1.0', 'approved', 'high',
   DATEADD(day, -7, CURRENT_TIMESTAMP()), DATEADD(day, -7, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),
  ($CASE_OXFORD, $PID_OXFORD, 'University of Oxford — AI Governance & Ethics', 'participant', 'HG', 'v1.0', 'in_review', 'normal',
   DATEADD(day, -3, CURRENT_TIMESTAMP()), DATEADD(day, -3, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),
  ($CASE_UNAIAB, $PID_UNAIAB, 'United Nations — AI Advisory Body', 'participant', 'HG', 'v1.0', 'needs_more_info', 'normal',
   DATEADD(day, -2, CURRENT_TIMESTAMP()), DATEADD(day, -2, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP());

-- ------------------------------------------------------------
-- 4) Assignments
-- ------------------------------------------------------------
INSERT INTO GAFAIG_DB.CORE.VERIFICATION_ASSIGNMENTS (
  ASSIGNMENT_ID,
  CASE_ID,
  ASSIGNED_TO,
  ROLE,
  ASSIGNED_AT,
  CREATED_AT
)
VALUES
  ('ASN-1001-LEAD', $CASE_OPENAI, 'lead.reviewer@gafaig.com', 'lead', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('ASN-1002-REV1', $CASE_OXFORD, 'reviewer1@gafaig.com', 'reviewer', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('ASN-1003-REV1', $CASE_UNAIAB, 'reviewer1@gafaig.com', 'reviewer', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- ------------------------------------------------------------
-- 5) Evidence
-- ------------------------------------------------------------
INSERT INTO GAFAIG_DB.CORE.VERIFICATION_EVIDENCE (
  EVIDENCE_ID,
  CASE_ID,
  EVIDENCE_TYPE,
  TITLE,
  DESCRIPTION,
  SOURCE_URL,
  STORAGE_REF,
  SUBMITTED_BY,
  SUBMITTED_AT,
  CREATED_AT,
  UPDATED_AT
)
VALUES
  ('EVD-1001-POLICY', $CASE_OPENAI, 'policy', 'Human Governance Policy v1.0',
   'Governance charter covering oversight roles, escalation, auditability, and approvals.',
   'https://example.com/openai/hg-policy', NULL,
   'admin@gafaig.com', DATEADD(day, -7, CURRENT_TIMESTAMP()), DATEADD(day, -7, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),

  ('EVD-1001-IR', $CASE_OPENAI, 'report', 'Incident Response & Reporting Playbook',
   'Defines incident triage, severity, response SLAs, reporting, and postmortems.',
   'https://example.com/openai/incident-playbook', NULL,
   'admin@gafaig.com', DATEADD(day, -7, CURRENT_TIMESTAMP()), DATEADD(day, -7, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),

  ('EVD-1002-COMMITTEE', $CASE_OXFORD, 'policy', 'Research Oversight Committee Charter',
   'Committee charter with membership, meeting cadence, and approval thresholds.',
   'https://example.com/oxford/committee-charter', NULL,
   'admin@gafaig.com', DATEADD(day, -3, CURRENT_TIMESTAMP()), DATEADD(day, -3, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),

  ('EVD-1003-TERMS', $CASE_UNAIAB, 'link', 'UN AI Advisory Body Terms of Reference',
   'Public terms of reference for advisory scope, membership, and transparency commitments.',
   'https://example.com/un/ai-advisory-tor', NULL,
   'admin@gafaig.com', DATEADD(day, -2, CURRENT_TIMESTAMP()), DATEADD(day, -2, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP());

-- ------------------------------------------------------------
-- 6) Findings
-- ------------------------------------------------------------
INSERT INTO GAFAIG_DB.CORE.VERIFICATION_FINDINGS (
  FINDING_ID,
  CASE_ID,
  CONTROL_ID,
  CONTROL_TITLE,
  RESULT,
  RATIONALE,
  SEVERITY,
  CREATED_AT,
  UPDATED_AT
)
VALUES
  ('FND-1001-11', $CASE_OPENAI, 'HG-1.1', 'Human Oversight Policy Exists', 'pass',
   'Policy defines accountable roles, escalation, and approval controls.', 'low',
   DATEADD(day, -6, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),
  ('FND-1001-12', $CASE_OPENAI, 'HG-1.2', 'Escalation Path Exists', 'pass',
   'Escalation documented with on-call escalation and executive override.', 'low',
   DATEADD(day, -6, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),
  ('FND-1001-23', $CASE_OPENAI, 'HG-2.3', 'Incident Reporting Process', 'pass',
   'Playbook includes classification, reporting timelines, and review cycle.', 'low',
   DATEADD(day, -6, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),

  ('FND-1002-11', $CASE_OXFORD, 'HG-1.1', 'Oversight Committee Defined', 'pass',
   'Committee charter present with membership and charter scope.', 'low',
   DATEADD(day, -2, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),
  ('FND-1002-12', $CASE_OXFORD, 'HG-1.2', 'Escalation Path Documented', 'partial',
   'Escalation exists, but lacks clear decision deadlines and escalation triggers.', 'medium',
   DATEADD(day, -2, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),
  ('FND-1002-21', $CASE_OXFORD, 'HG-2.1', 'Model Risk Assessment Process', 'needs_more_info',
   'Need evidence of repeatable risk review for research deployments.', 'high',
   DATEADD(day, -2, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),

  ('FND-1003-11', $CASE_UNAIAB, 'HG-1.1', 'Transparency Requirements', 'pass',
   'Terms of reference provides baseline transparency commitments.', 'medium',
   DATEADD(day, -1, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),
  ('FND-1003-22', $CASE_UNAIAB, 'HG-2.2', 'Audit Trail Evidence', 'fail',
   'No audit-trail artifacts provided for decisions and approvals.', 'high',
   DATEADD(day, -1, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP()),
  ('FND-1003-24', $CASE_UNAIAB, 'HG-2.4', 'Third-Party Oversight', 'needs_more_info',
   'Need evidence of vendor governance and dependency review process.', 'high',
   DATEADD(day, -1, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP());

-- ------------------------------------------------------------
-- 7) Events
-- ------------------------------------------------------------
INSERT INTO GAFAIG_DB.CORE.VERIFICATION_EVENTS (
  EVENT_ID,
  CASE_ID,
  EVENT_TYPE,
  ACTOR,
  DETAILS,
  CREATED_AT
)
SELECT
  'EVT-1001-SUB',
  $CASE_OPENAI,
  'submitted',
  'admin@gafaig.com',
  PARSE_JSON('{"note":"Submission received","standard":"HG v1.0"}'),
  DATEADD(day, -7, CURRENT_TIMESTAMP())

UNION ALL SELECT
  'EVT-1001-APR',
  $CASE_OPENAI,
  'decision',
  'lead.reviewer@gafaig.com',
  PARSE_JSON('{"decision":"approved","summary":"Meets HG baseline requirements","conditions":"Annual renewal + incident reporting"}'),
  DATEADD(day, -5, CURRENT_TIMESTAMP())

UNION ALL SELECT
  'EVT-1002-SUB',
  $CASE_OXFORD,
  'submitted',
  'admin@gafaig.com',
  PARSE_JSON('{"note":"Submission received","standard":"HG v1.0"}'),
  DATEADD(day, -3, CURRENT_TIMESTAMP())

UNION ALL SELECT
  'EVT-1002-REV',
  $CASE_OXFORD,
  'status_changed',
  'reviewer1@gafaig.com',
  PARSE_JSON('{"from":"received","to":"in_review","note":"Initial review started"}'),
  DATEADD(day, -2, CURRENT_TIMESTAMP())

UNION ALL SELECT
  'EVT-1003-SUB',
  $CASE_UNAIAB,
  'submitted',
  'admin@gafaig.com',
  PARSE_JSON('{"note":"Submission received","standard":"HG v1.0"}'),
  DATEADD(day, -2, CURRENT_TIMESTAMP())

UNION ALL SELECT
  'EVT-1003-NMI',
  $CASE_UNAIAB,
  'status_changed',
  'reviewer1@gafaig.com',
  PARSE_JSON('{"from":"received","to":"needs_more_info","note":"Requesting audit trail + vendor oversight evidence"}'),
  DATEADD(day, -1, CURRENT_TIMESTAMP());

-- ------------------------------------------------------------
-- 8) Quick verification
-- ------------------------------------------------------------
SELECT CASE_ID, ENTITY_NAME, STATUS, STANDARD_CODE, STANDARD_VERSION, UPDATED_AT
FROM GAFAIG_DB.CORE.VERIFICATION_CASES
WHERE CASE_ID IN ($CASE_OPENAI, $CASE_OXFORD, $CASE_UNAIAB)
ORDER BY CASE_ID;

SELECT EVENT_ID, CASE_ID, EVENT_TYPE, ACTOR, CREATED_AT
FROM GAFAIG_DB.CORE.VERIFICATION_EVENTS
WHERE CASE_ID IN ($CASE_OPENAI, $CASE_OXFORD, $CASE_UNAIAB)
ORDER BY CREATED_AT;