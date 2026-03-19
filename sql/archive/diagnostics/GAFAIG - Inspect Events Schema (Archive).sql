-- ============================================================
-- GAFAIG — Inspect Events Schema
-- Purpose:
--   Identify the exact writable schema of CORE.EVENTS
--   No writes
--   No deletes
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Exact EVENTS column list
-- ============================================================

DESC TABLE CORE.EVENTS;

-- ============================================================
-- 2) Full DDL
-- ============================================================

SELECT GET_DDL('TABLE', 'CORE.EVENTS');

-- ============================================================
-- 3) Sample rows
-- ============================================================

SELECT *
FROM CORE.EVENTS
LIMIT 20;

-- ============================================================
-- 4) Object confirmation
-- ============================================================

SHOW OBJECTS LIKE 'EVENTS' IN SCHEMA CORE;