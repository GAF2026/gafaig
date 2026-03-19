-- ============================================================
-- GAFAIG - Governance Scoring (Enterprise v1.0)
-- Deterministic, auditable, Snowflake-native scoring engine
--
-- Canonical rules:
--  - Org-wide oversight certification (entire organization)
--  - No AI system risk categorization required
--  - AI inventory remains private
--  - Public registry exposes only oversight status/tier/band
--  - Deterministic scoring + snapshots + renewal triggers
--
-- Requires/assumes:
--   DATABASE: GAFAIG_DB
--   SCHEMA:   CORE
--
-- IMPORTANT:
--   This file resets canonical scoring metadata and snapshot objects
--   only. It does NOT seed cases/evidence/findings/events.
-- ============================================================

USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- 0) CANONICAL RESET
-- ------------------------------------------------------------

DROP VIEW IF EXISTS CORE.V_PUBLIC_OVERSIGHT_SIGNAL;
DROP VIEW IF EXISTS CORE.V_CASE_RENEWAL_STATUS;
DROP VIEW IF EXISTS CORE.V_CASE_TIER_BAND;
DROP VIEW IF EXISTS CORE.V_CASE_SCORE_ENTERPRISE;
DROP VIEW IF EXISTS CORE.V_CASE_OPERATIONAL_SCORE;
DROP VIEW IF EXISTS CORE.V_CONTROL_SCORE_COMPONENTS;
DROP VIEW IF EXISTS CORE.V_CONTROL_EVIDENCE_FRESHNESS;
DROP VIEW IF EXISTS CORE.V_FINDING_EVIDENCE_IDS;
DROP VIEW IF EXISTS CORE.V_FINDING_NORMALIZED;

DROP PROCEDURE IF EXISTS CORE.SP_SCORE_CASE_ENTERPRISE(VARCHAR);

DROP TABLE IF EXISTS CORE.CASE_SCORE_SNAPSHOTS_V2;
DROP TABLE IF EXISTS CORE.SCORE_BANDS;
DROP TABLE IF EXISTS CORE.SEVERITY_WEIGHTS;
DROP TABLE IF EXISTS CORE.CONTROL_WEIGHTS;
DROP TABLE IF EXISTS CORE.CONTROL_CATALOG;
DROP TABLE IF EXISTS CORE.SCORING_MODEL_VERSIONS;

-- ------------------------------------------------------------
-- 1) MODEL VERSION
-- ------------------------------------------------------------

CREATE TABLE CORE.SCORING_MODEL_VERSIONS (
  MODEL_VERSION         VARCHAR PRIMARY KEY,
  MODEL_NAME            VARCHAR,
  IS_ACTIVE             BOOLEAN,
  EFFECTIVE_FROM        TIMESTAMP_NTZ,
  NOTES                 VARCHAR,
  CREATED_AT            TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

INSERT INTO CORE.SCORING_MODEL_VERSIONS (
  MODEL_VERSION,
  MODEL_NAME,
  IS_ACTIVE,
  EFFECTIVE_FROM,
  NOTES
)
SELECT
  'v1.0-enterprise',
  'GAFAIG Enterprise Governance Scoring',
  TRUE,
  CURRENT_TIMESTAMP(),
  'Org-wide, process-based human oversight scoring. No risk-tier inventory required. Deterministic Snowflake-native.';

-- ------------------------------------------------------------
-- 2) CONTROL CATALOG
-- ------------------------------------------------------------

CREATE TABLE CORE.CONTROL_CATALOG (
  CONTROL_ID            VARCHAR PRIMARY KEY,
  CONTROL_DOMAIN        VARCHAR,
  CONTROL_TITLE         VARCHAR,
  CONTROL_INTENT        VARCHAR,
  MIN_EVIDENCE_COUNT    NUMBER(38,0) DEFAULT 1,
  MAX_EVIDENCE_AGE_DAYS NUMBER(38,0) DEFAULT 365,
  REQUIRED              BOOLEAN DEFAULT TRUE,
  CREATED_AT            TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

CREATE TABLE CORE.CONTROL_WEIGHTS (
  MODEL_VERSION         VARCHAR,
  CONTROL_ID            VARCHAR,
  WEIGHT                NUMBER(10,4),
  PRIMARY KEY (MODEL_VERSION, CONTROL_ID)
);

INSERT INTO CORE.CONTROL_CATALOG (
  CONTROL_ID,
  CONTROL_DOMAIN,
  CONTROL_TITLE,
  CONTROL_INTENT,
  MIN_EVIDENCE_COUNT,
  MAX_EVIDENCE_AGE_DAYS,
  REQUIRED
)
SELECT * FROM VALUES
  (
    'GOV-001',
    'Oversight',
    'Human Oversight Charter & Authority',
    'A formal charter defines oversight authority, scope, decision rights, escalation, and enforcement.',
    1,
    365,
    TRUE
  ),
  (
    'GOV-002',
    'Accountability',
    'Named Responsible Owners (RACI)',
    'Clear accountability chain: accountable exec, responsible owners, consulted/informed stakeholders.',
    1,
    365,
    TRUE
  ),
  (
    'GOV-003',
    'Process',
    'Operational Oversight Workflow',
    'A repeatable oversight workflow exists: intake -> review -> decision -> logging -> follow-up.',
    2,
    180,
    TRUE
  ),
  (
    'GOV-004',
    'Evidence',
    'Evidence-Linked Decisions',
    'Oversight decisions are traceable to evidence (policies, minutes, audits, attestations, controls).',
    2,
    180,
    TRUE
  ),
  (
    'GOV-005',
    'Auditability',
    'Immutable Audit Trail',
    'Oversight artifacts are logged in an auditable record with timestamps and provenance.',
    1,
    180,
    TRUE
  ),
  (
    'GOV-006',
    'Monitoring',
    'Ongoing Monitoring & Review Cadence',
    'Defined cadence for reviews (e.g., quarterly governance review) with recorded outcomes.',
    2,
    120,
    TRUE
  ),
  (
    'GOV-007',
    'Change Mgmt',
    'Change Control for AI-impacting Systems',
    'Change management exists for AI-impacting changes; oversight is engaged for material changes.',
    1,
    180,
    TRUE
  ),
  (
    'GOV-008',
    'Incident',
    'Incident / Harm Response Process',
    'Process exists for incident capture, triage, human decisioning, corrective actions.',
    1,
    365,
    TRUE
  ),
  (
    'GOV-009',
    'Training',
    'Human Oversight Training & Competency',
    'Oversight participants have documented training/competency for governance responsibilities.',
    1,
    365,
    TRUE
  ),
  (
    'GOV-010',
    'Third Party',
    'Vendor / Platform Governance Terms',
    'Contractual or internal controls exist for third-party AI tools (usage, oversight, reporting).',
    1,
    365,
    TRUE
  ),
  (
    'GOV-011',
    'Data',
    'Data Governance Interface',
    'Oversight has a defined interface with data governance (privacy, retention, access controls).',
    1,
    365,
    TRUE
  ),
  (
    'GOV-012',
    'Transparency',
    'Internal Reporting to Leadership',
    'Oversight outputs are reported to leadership/oversight body with routine evidence of review.',
    1,
    180,
    TRUE
  );

INSERT INTO CORE.CONTROL_WEIGHTS (
  MODEL_VERSION,
  CONTROL_ID,
  WEIGHT
)
SELECT * FROM VALUES
  ('v1.0-enterprise','GOV-001',0.0900),
  ('v1.0-enterprise','GOV-002',0.0700),
  ('v1.0-enterprise','GOV-003',0.1200),
  ('v1.0-enterprise','GOV-004',0.1200),
  ('v1.0-enterprise','GOV-005',0.0900),
  ('v1.0-enterprise','GOV-006',0.1100),
  ('v1.0-enterprise','GOV-007',0.0700),
  ('v1.0-enterprise','GOV-008',0.0800),
  ('v1.0-enterprise','GOV-009',0.0600),
  ('v1.0-enterprise','GOV-010',0.0600),
  ('v1.0-enterprise','GOV-011',0.0500),
  ('v1.0-enterprise','GOV-012',0.0600);

-- ------------------------------------------------------------
-- 3) SEVERITY WEIGHTS
-- ------------------------------------------------------------

CREATE TABLE CORE.SEVERITY_WEIGHTS (
  MODEL_VERSION         VARCHAR,
  SEVERITY              VARCHAR,
  MULTIPLIER            NUMBER(10,4),
  PRIMARY KEY (MODEL_VERSION, SEVERITY)
);

INSERT INTO CORE.SEVERITY_WEIGHTS (
  MODEL_VERSION,
  SEVERITY,
  MULTIPLIER
)
SELECT * FROM VALUES
  ('v1.0-enterprise','low',      0.2500),
  ('v1.0-enterprise','medium',   0.5000),
  ('v1.0-enterprise','high',     0.7500),
  ('v1.0-enterprise','critical', 1.0000);

-- ------------------------------------------------------------
-- 4) ENTERPRISE SCORING VIEWS
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW CORE.V_FINDING_NORMALIZED AS
SELECT
  f.ORG_ID,
  f.CASE_ID,
  f.FINDING_ID,
  f.CONTROL_ID,
  f.CONTROL_TITLE,
  LOWER(COALESCE(f.RESULT, '')) AS RESULT,
  LOWER(COALESCE(f.SEVERITY, 'medium')) AS SEVERITY,
  COALESCE(sw.MULTIPLIER, 0.5000) AS SEVERITY_MULTIPLIER,
  f.CREATED_AT,
  f.UPDATED_AT,
  CASE
    WHEN LOWER(COALESCE(f.RESULT, '')) IN ('pass','passed','ok','met') THEN 1.0000
    WHEN LOWER(COALESCE(f.RESULT, '')) IN ('partial','partially_met','needs_work') THEN 0.5000
    WHEN LOWER(COALESCE(f.RESULT, '')) IN ('fail','failed','not_met') THEN 0.0000
    WHEN LOWER(COALESCE(f.RESULT, '')) IN ('na','n/a','not_applicable') THEN NULL
    ELSE NULL
  END AS RESULT_SCORE
FROM CORE.VERIFICATION_FINDINGS f
LEFT JOIN CORE.SEVERITY_WEIGHTS sw
  ON sw.MODEL_VERSION = 'v1.0-enterprise'
 AND LOWER(sw.SEVERITY) = LOWER(COALESCE(f.SEVERITY, 'medium'));

CREATE OR REPLACE VIEW CORE.V_FINDING_EVIDENCE_IDS AS
SELECT
  f.ORG_ID,
  f.CASE_ID,
  f.FINDING_ID,
  fe.EVIDENCE_ID
FROM CORE.VERIFICATION_FINDINGS f
JOIN CORE.VERIFICATION_FINDING_EVIDENCE fe
  ON fe.FINDING_ID = f.FINDING_ID

UNION ALL

SELECT
  f.ORG_ID,
  f.CASE_ID,
  f.FINDING_ID,
  ev.VALUE::VARCHAR AS EVIDENCE_ID
FROM CORE.VERIFICATION_FINDINGS f,
LATERAL FLATTEN(INPUT => f.EVIDENCE_IDS) ev
WHERE f.EVIDENCE_IDS IS NOT NULL;

CREATE OR REPLACE VIEW CORE.V_CONTROL_EVIDENCE_FRESHNESS AS
SELECT
  f.ORG_ID,
  f.CASE_ID,
  f.CONTROL_ID,
  COUNT(DISTINCT fei.EVIDENCE_ID) AS EVIDENCE_COUNT,
  MAX(COALESCE(e.SUBMITTED_AT, e.UPDATED_AT, e.CREATED_AT)) AS LATEST_EVIDENCE_AT
FROM CORE.VERIFICATION_FINDINGS f
LEFT JOIN CORE.V_FINDING_EVIDENCE_IDS fei
  ON fei.FINDING_ID = f.FINDING_ID
LEFT JOIN CORE.VERIFICATION_EVIDENCE e
  ON e.EVIDENCE_ID = fei.EVIDENCE_ID
GROUP BY
  f.ORG_ID,
  f.CASE_ID,
  f.CONTROL_ID;

CREATE OR REPLACE VIEW CORE.V_CONTROL_SCORE_COMPONENTS AS
WITH base AS (
  SELECT
    fn.ORG_ID,
    fn.CASE_ID,
    fn.CONTROL_ID,
    AVG(fn.RESULT_SCORE) AS AVG_RESULT_SCORE,
    AVG(CASE WHEN fn.RESULT_SCORE = 0 THEN fn.SEVERITY_MULTIPLIER ELSE 0 END) AS AVG_FAIL_SEVERITY
  FROM CORE.V_FINDING_NORMALIZED fn
  WHERE fn.RESULT_SCORE IS NOT NULL
  GROUP BY
    fn.ORG_ID,
    fn.CASE_ID,
    fn.CONTROL_ID
),
ev AS (
  SELECT
    cef.ORG_ID,
    cef.CASE_ID,
    cef.CONTROL_ID,
    cef.EVIDENCE_COUNT,
    cef.LATEST_EVIDENCE_AT
  FROM CORE.V_CONTROL_EVIDENCE_FRESHNESS cef
),
c AS (
  SELECT DISTINCT
    ORG_ID,
    CASE_ID,
    CONTROL_ID
  FROM CORE.VERIFICATION_FINDINGS
)
SELECT
  c.ORG_ID,
  c.CASE_ID,
  c.CONTROL_ID,
  cc.CONTROL_DOMAIN,
  cc.CONTROL_TITLE,
  cc.REQUIRED,
  cw.WEIGHT AS CONTROL_WEIGHT,

  GREATEST(
    0.0000,
    COALESCE(b.AVG_RESULT_SCORE, 0.0000) - (COALESCE(b.AVG_FAIL_SEVERITY, 0.0000) * 0.3500)
  ) AS QUALITY_SCORE,

  COALESCE(ev.EVIDENCE_COUNT, 0) AS EVIDENCE_COUNT,
  cc.MIN_EVIDENCE_COUNT,

  LEAST(
    1.0000,
    COALESCE(ev.EVIDENCE_COUNT, 0) / NULLIF(cc.MIN_EVIDENCE_COUNT, 0)
  ) AS COVERAGE_SCORE,

  ev.LATEST_EVIDENCE_AT,
  cc.MAX_EVIDENCE_AGE_DAYS,

  CASE
    WHEN ev.LATEST_EVIDENCE_AT IS NULL THEN 0.0000
    WHEN DATEDIFF('day', ev.LATEST_EVIDENCE_AT, CURRENT_TIMESTAMP()) <= cc.MAX_EVIDENCE_AGE_DAYS THEN 1.0000
    ELSE GREATEST(
      0.0000,
      1.0000 - (
        (DATEDIFF('day', ev.LATEST_EVIDENCE_AT, CURRENT_TIMESTAMP()) - cc.MAX_EVIDENCE_AGE_DAYS)
        / NULLIF(cc.MAX_EVIDENCE_AGE_DAYS, 0)
      )
    )
  END AS FRESHNESS_SCORE,

  (
    0.6000 * GREATEST(
      0.0000,
      COALESCE(b.AVG_RESULT_SCORE, 0.0000) - (COALESCE(b.AVG_FAIL_SEVERITY, 0.0000) * 0.3500)
    )
    + 0.2500 * LEAST(
      1.0000,
      COALESCE(ev.EVIDENCE_COUNT, 0) / NULLIF(cc.MIN_EVIDENCE_COUNT, 0)
    )
    + 0.1500 * (
      CASE
        WHEN ev.LATEST_EVIDENCE_AT IS NULL THEN 0.0000
        WHEN DATEDIFF('day', ev.LATEST_EVIDENCE_AT, CURRENT_TIMESTAMP()) <= cc.MAX_EVIDENCE_AGE_DAYS THEN 1.0000
        ELSE GREATEST(
          0.0000,
          1.0000 - (
            (DATEDIFF('day', ev.LATEST_EVIDENCE_AT, CURRENT_TIMESTAMP()) - cc.MAX_EVIDENCE_AGE_DAYS)
            / NULLIF(cc.MAX_EVIDENCE_AGE_DAYS, 0)
          )
        )
      END
    )
  ) AS CONTROL_SCORE
FROM c
LEFT JOIN CORE.CONTROL_CATALOG cc
  ON cc.CONTROL_ID = c.CONTROL_ID
LEFT JOIN CORE.CONTROL_WEIGHTS cw
  ON cw.MODEL_VERSION = 'v1.0-enterprise'
 AND cw.CONTROL_ID = c.CONTROL_ID
LEFT JOIN base b
  ON b.ORG_ID = c.ORG_ID
 AND b.CASE_ID = c.CASE_ID
 AND b.CONTROL_ID = c.CONTROL_ID
LEFT JOIN ev
  ON ev.ORG_ID = c.ORG_ID
 AND ev.CASE_ID = c.CASE_ID
 AND ev.CONTROL_ID = c.CONTROL_ID;

CREATE OR REPLACE VIEW CORE.V_CASE_OPERATIONAL_SCORE AS
SELECT
  CASE_ID,
  ORG_ID,
  COUNT(*) AS EVENTS_90D,
  CASE
    WHEN COUNT(*) = 0 THEN 0.0000
    WHEN COUNT(*) = 1 THEN 0.5000
    ELSE 1.0000
  END AS OPERATIONAL_SCORE
FROM CORE.VERIFICATION_EVENTS
WHERE CREATED_AT >= DATEADD('day', -90, CURRENT_TIMESTAMP())
GROUP BY
  CASE_ID,
  ORG_ID;

CREATE OR REPLACE VIEW CORE.V_CASE_SCORE_ENTERPRISE AS
WITH w AS (
  SELECT
    ORG_ID,
    CASE_ID,
    SUM(COALESCE(CONTROL_WEIGHT, 0)) AS W_SUM,
    SUM(COALESCE(CONTROL_WEIGHT, 0) * COALESCE(CONTROL_SCORE, 0)) AS W_CONTROL,
    SUM(COALESCE(CONTROL_WEIGHT, 0) * COALESCE(COVERAGE_SCORE, 0)) AS W_COV,
    SUM(COALESCE(CONTROL_WEIGHT, 0) * COALESCE(FRESHNESS_SCORE, 0)) AS W_FRESH
  FROM CORE.V_CONTROL_SCORE_COMPONENTS
  GROUP BY
    ORG_ID,
    CASE_ID
),
op AS (
  SELECT
    CASE_ID,
    ORG_ID,
    OPERATIONAL_SCORE,
    EVENTS_90D
  FROM CORE.V_CASE_OPERATIONAL_SCORE
)
SELECT
  w.ORG_ID,
  w.CASE_ID,
  'v1.0-enterprise' AS MODEL_VERSION,
  ROUND(100 * (w.W_CONTROL / NULLIF(w.W_SUM, 0)), 6) AS SUBSCORE_CONTROLS,
  ROUND(100 * (w.W_COV / NULLIF(w.W_SUM, 0)), 6) AS SUBSCORE_COVERAGE,
  ROUND(100 * (w.W_FRESH / NULLIF(w.W_SUM, 0)), 6) AS SUBSCORE_FRESHNESS,
  ROUND(100 * COALESCE(op.OPERATIONAL_SCORE, 0), 6) AS SUBSCORE_OPERATIONAL,
  ROUND(
    100 * (
      0.6500 * (w.W_CONTROL / NULLIF(w.W_SUM, 0))
      + 0.1500 * (w.W_COV / NULLIF(w.W_SUM, 0))
      + 0.1000 * (w.W_FRESH / NULLIF(w.W_SUM, 0))
      + 0.1000 * COALESCE(op.OPERATIONAL_SCORE, 0)
    ),
    6
  ) AS SCORE,
  COALESCE(op.EVENTS_90D, 0) AS EVENTS_90D,
  CURRENT_TIMESTAMP() AS SCORED_AT
FROM w
LEFT JOIN op
  ON op.ORG_ID = w.ORG_ID
 AND op.CASE_ID = w.CASE_ID;

-- ------------------------------------------------------------
-- 5) TIER / BAND MAPPING
-- ------------------------------------------------------------

CREATE TABLE CORE.SCORE_BANDS (
  MODEL_VERSION         VARCHAR,
  MIN_SCORE             NUMBER(10,4),
  MAX_SCORE             NUMBER(10,4),
  TIER                  VARCHAR,
  BAND                  VARCHAR,
  PRIMARY KEY (MODEL_VERSION, MIN_SCORE, MAX_SCORE)
);

INSERT INTO CORE.SCORE_BANDS (
  MODEL_VERSION,
  MIN_SCORE,
  MAX_SCORE,
  TIER,
  BAND
)
SELECT * FROM VALUES
  ('v1.0-enterprise', 90.0000, 100.0000, 'Enterprise Assurance', 'A'),
  ('v1.0-enterprise', 80.0000,  89.9999, 'Standard Assurance',   'B'),
  ('v1.0-enterprise', 70.0000,  79.9999, 'Baseline Assurance',   'C'),
  ('v1.0-enterprise',  0.0000,  69.9999, 'Not Certified',        'D');

CREATE OR REPLACE VIEW CORE.V_CASE_TIER_BAND AS
SELECT
  cs.ORG_ID,
  cs.CASE_ID,
  cs.MODEL_VERSION,
  cs.SCORE,
  sb.TIER,
  sb.BAND
FROM CORE.V_CASE_SCORE_ENTERPRISE cs
LEFT JOIN CORE.SCORE_BANDS sb
  ON sb.MODEL_VERSION = cs.MODEL_VERSION
 AND cs.SCORE BETWEEN sb.MIN_SCORE AND sb.MAX_SCORE;

-- ------------------------------------------------------------
-- 6) RENEWAL STATUS
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW CORE.V_CASE_RENEWAL_STATUS AS
WITH s AS (
  SELECT
    cs.ORG_ID,
    cs.CASE_ID,
    cs.MODEL_VERSION,
    cs.SCORE,
    cs.SUBSCORE_FRESHNESS,
    cs.SUBSCORE_OPERATIONAL,
    cs.EVENTS_90D,
    cs.SCORED_AT
  FROM CORE.V_CASE_SCORE_ENTERPRISE cs
),
tb AS (
  SELECT
    ORG_ID,
    CASE_ID,
    TIER,
    BAND
  FROM CORE.V_CASE_TIER_BAND
)
SELECT
  s.ORG_ID,
  s.CASE_ID,
  s.MODEL_VERSION,
  s.SCORE,
  tb.TIER,
  tb.BAND,
  s.SUBSCORE_FRESHNESS,
  s.SUBSCORE_OPERATIONAL,
  s.EVENTS_90D,
  CASE
    WHEN tb.TIER = 'Not Certified' THEN 'not_certified'
    WHEN s.SUBSCORE_FRESHNESS < 70 THEN 'needs_renewal'
    WHEN s.EVENTS_90D = 0 THEN 'needs_renewal'
    ELSE 'active'
  END AS RENEWAL_STATUS,
  s.SCORED_AT
FROM s
LEFT JOIN tb
  ON tb.ORG_ID = s.ORG_ID
 AND tb.CASE_ID = s.CASE_ID;

-- ------------------------------------------------------------
-- 7) SNAPSHOTS
-- ------------------------------------------------------------

CREATE TABLE CORE.CASE_SCORE_SNAPSHOTS_V2 (
  SNAPSHOT_ID           VARCHAR,
  ORG_ID                VARCHAR,
  CASE_ID               VARCHAR,
  MODEL_VERSION         VARCHAR,
  SCORE                 NUMBER(10,6),
  SUBSCORE_CONTROLS     NUMBER(10,6),
  SUBSCORE_COVERAGE     NUMBER(10,6),
  SUBSCORE_FRESHNESS    NUMBER(10,6),
  SUBSCORE_OPERATIONAL  NUMBER(10,6),
  TIER                  VARCHAR,
  BAND                  VARCHAR,
  RENEWAL_STATUS        VARCHAR,
  EVENTS_90D            NUMBER(38,0),
  SCORED_AT             TIMESTAMP_NTZ,
  CREATED_AT            TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

CREATE OR REPLACE PROCEDURE CORE.SP_SCORE_CASE_ENTERPRISE(P_CASE_ID VARCHAR)
RETURNS VARIANT
LANGUAGE SQL
EXECUTE AS OWNER
AS
$$
DECLARE
  V_CASE_ID VARCHAR DEFAULT TRIM(P_CASE_ID);
BEGIN
  INSERT INTO CORE.CASE_SCORE_SNAPSHOTS_V2 (
    SNAPSHOT_ID,
    ORG_ID,
    CASE_ID,
    MODEL_VERSION,
    SCORE,
    SUBSCORE_CONTROLS,
    SUBSCORE_COVERAGE,
    SUBSCORE_FRESHNESS,
    SUBSCORE_OPERATIONAL,
    TIER,
    BAND,
    RENEWAL_STATUS,
    EVENTS_90D,
    SCORED_AT
  )
  SELECT
    SHA2(
      TO_VARCHAR(cs.CASE_ID) || '|' || TO_VARCHAR(cs.SCORED_AT) || '|' || cs.MODEL_VERSION,
      256
    ) AS SNAPSHOT_ID,
    cs.ORG_ID,
    cs.CASE_ID,
    cs.MODEL_VERSION,
    cs.SCORE,
    cs.SUBSCORE_CONTROLS,
    cs.SUBSCORE_COVERAGE,
    cs.SUBSCORE_FRESHNESS,
    cs.SUBSCORE_OPERATIONAL,
    tb.TIER,
    tb.BAND,
    rs.RENEWAL_STATUS,
    cs.EVENTS_90D,
    cs.SCORED_AT
  FROM CORE.V_CASE_SCORE_ENTERPRISE cs
  LEFT JOIN CORE.V_CASE_TIER_BAND tb
    ON tb.ORG_ID = cs.ORG_ID
   AND tb.CASE_ID = cs.CASE_ID
  LEFT JOIN CORE.V_CASE_RENEWAL_STATUS rs
    ON rs.ORG_ID = cs.ORG_ID
   AND rs.CASE_ID = cs.CASE_ID
  WHERE TRIM(cs.CASE_ID) = :V_CASE_ID;

  RETURN OBJECT_CONSTRUCT(
    'ok', TRUE,
    'caseId', V_CASE_ID
  );
END;
$$;

-- ------------------------------------------------------------
-- 8) PUBLIC-SAFE VIEW
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW CORE.V_PUBLIC_OVERSIGHT_SIGNAL AS
SELECT
  ORG_ID,
  CASE_ID,
  MODEL_VERSION,
  SCORE,
  TIER,
  BAND,
  RENEWAL_STATUS,
  SCORED_AT
FROM CORE.V_CASE_RENEWAL_STATUS;

-- ============================================================
-- END: GAFAIG Enterprise Governance Scoring v1.0
-- ============================================================