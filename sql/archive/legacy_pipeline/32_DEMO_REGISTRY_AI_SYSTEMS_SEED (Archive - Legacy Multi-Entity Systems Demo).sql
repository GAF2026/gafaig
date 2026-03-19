-- 32_DEMO_REGISTRY_AI_SYSTEMS_SEED.sql
-- Purpose:
-- Seed demo registry entities, applications, decisions, and public AI systems.

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- Registry entities
MERGE INTO GAFAIG_DB.CORE.REGISTRY_ENTITIES t
USING (
    SELECT * FROM VALUES
    ('GAFAIG-00000003','APP-DEMO-3001','ETH Zurich AI Center','Research Institute','Switzerland','active'),
    ('GAFAIG-00000004','APP-DEMO-3002','Vector Institute','AI Research Lab','Canada','active'),
    ('GAFAIG-00000005','APP-DEMO-3003','Mila AI Institute','AI Research Lab','Canada','active'),
    ('GAFAIG-00000006','APP-DEMO-3004','Singapore AI Governance Lab','Public Sector Organization','Singapore','active'),
    ('GAFAIG-00000007','APP-DEMO-3005','DeepMind Safety Research','Technology Company','United Kingdom','active'),
    ('GAFAIG-00000008','APP-DEMO-3006','Allen Institute for AI','Research Institute','United States','active'),
    ('GAFAIG-00000009','APP-DEMO-3007','Tsinghua AI Research Center','University','China','active'),
    ('GAFAIG-00000010','APP-DEMO-3008','Australian Responsible AI Lab','Research Institute','Australia','active')
) s (REGISTRY_ID, APPLICATION_ID, ENTITY_NAME, ENTITY_TYPE, COUNTRY, STATUS)
ON t.REGISTRY_ID = s.REGISTRY_ID
WHEN MATCHED THEN UPDATE SET
    t.APPLICATION_ID = s.APPLICATION_ID,
    t.ENTITY_NAME = s.ENTITY_NAME,
    t.ENTITY_TYPE = s.ENTITY_TYPE,
    t.COUNTRY = s.COUNTRY,
    t.STATUS = s.STATUS,
    t.UPDATED_AT = CURRENT_TIMESTAMP()
WHEN NOT MATCHED THEN INSERT
    (REGISTRY_ID, APPLICATION_ID, ENTITY_NAME, ENTITY_TYPE, COUNTRY, STATUS, CREATED_AT, UPDATED_AT)
VALUES
    (s.REGISTRY_ID, s.APPLICATION_ID, s.ENTITY_NAME, s.ENTITY_TYPE, s.COUNTRY, s.STATUS, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Applications
MERGE INTO GAFAIG_DB.CORE.APPLICATIONS t
USING (
    SELECT * FROM VALUES
    ('REQ-DEMO-3001','application','approved','ETH Zurich AI Center','demo+eth@gafaig.org','APP-DEMO-3001','Research Institute','Switzerland'),
    ('REQ-DEMO-3002','application','approved','Vector Institute','demo+vector@gafaig.org','APP-DEMO-3002','AI Research Lab','Canada'),
    ('REQ-DEMO-3003','application','approved','Mila AI Institute','demo+mila@gafaig.org','APP-DEMO-3003','AI Research Lab','Canada'),
    ('REQ-DEMO-3004','application','approved','Singapore AI Governance Lab','demo+singapore@gafaig.org','APP-DEMO-3004','Public Sector Organization','Singapore'),
    ('REQ-DEMO-3005','application','approved','DeepMind Safety Research','demo+deepmind@gafaig.org','APP-DEMO-3005','Technology Company','United Kingdom'),
    ('REQ-DEMO-3006','application','approved','Allen Institute for AI','demo+allen@gafaig.org','APP-DEMO-3006','Research Institute','United States'),
    ('REQ-DEMO-3007','application','approved','Tsinghua AI Research Center','demo+tsinghua@gafaig.org','APP-DEMO-3007','University','China'),
    ('REQ-DEMO-3008','application','approved','Australian Responsible AI Lab','demo+australia@gafaig.org','APP-DEMO-3008','Research Institute','Australia')
) s (REQUEST_ID, TYPE, STATUS, ORG_NAME, EMAIL, APPLICATION_ID, ORG_TYPE, COUNTRY)
ON t.APPLICATION_ID = s.APPLICATION_ID
WHEN MATCHED THEN UPDATE SET
    t.REQUEST_ID = s.REQUEST_ID,
    t.TYPE = s.TYPE,
    t.STATUS = s.STATUS,
    t.ORG_NAME = s.ORG_NAME,
    t.EMAIL = s.EMAIL,
    t.ORG_TYPE = s.ORG_TYPE,
    t.COUNTRY = s.COUNTRY,
    t.UPDATED_AT = CURRENT_TIMESTAMP()
WHEN NOT MATCHED THEN INSERT
    (REQUEST_ID, TYPE, STATUS, ORG_NAME, EMAIL, CREATED_AT, UPDATED_AT, APPLICATION_ID, ORG_TYPE, COUNTRY)
VALUES
    (s.REQUEST_ID, s.TYPE, s.STATUS, s.ORG_NAME, s.EMAIL, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), s.APPLICATION_ID, s.ORG_TYPE, s.COUNTRY);

-- Decisions
MERGE INTO GAFAIG_DB.CORE.DECISIONS t
USING (
    SELECT * FROM VALUES
    ('DEC-APP-DEMO-3001','APP-DEMO-3001','approved','Tier 2','B'),
    ('DEC-APP-DEMO-3002','APP-DEMO-3002','approved','Tier 2','B'),
    ('DEC-APP-DEMO-3003','APP-DEMO-3003','approved','Tier 2','B'),
    ('DEC-APP-DEMO-3004','APP-DEMO-3004','approved','Tier 2','B'),
    ('DEC-APP-DEMO-3005','APP-DEMO-3005','approved','Tier 2','B'),
    ('DEC-APP-DEMO-3006','APP-DEMO-3006','approved','Tier 2','B'),
    ('DEC-APP-DEMO-3007','APP-DEMO-3007','approved','Tier 2','B'),
    ('DEC-APP-DEMO-3008','APP-DEMO-3008','approved','Tier 2','B')
) s (DECISION_ID, APPLICATION_ID, DECISION_STATUS, CERTIFICATION_TIER, CERTIFICATION_BAND)
ON t.DECISION_ID = s.DECISION_ID
WHEN MATCHED THEN UPDATE SET
    t.APPLICATION_ID = s.APPLICATION_ID,
    t.DECISION_STATUS = s.DECISION_STATUS,
    t.CERTIFICATION_TIER = s.CERTIFICATION_TIER,
    t.CERTIFICATION_BAND = s.CERTIFICATION_BAND
WHEN NOT MATCHED THEN INSERT
    (DECISION_ID, APPLICATION_ID, SNAPSHOT_ID, DECISION_STATUS, CERTIFICATION_TIER, CERTIFICATION_BAND, VALID_FROM, VALID_TO, DECISION_NOTES, CREATED_AT)
VALUES
    (s.DECISION_ID, s.APPLICATION_ID, NULL, s.DECISION_STATUS, s.CERTIFICATION_TIER, s.CERTIFICATION_BAND, CURRENT_TIMESTAMP(), DATEADD(year, 1, CURRENT_TIMESTAMP()), 'Demo certification seed', CURRENT_TIMESTAMP());

-- Public registry AI systems
MERGE INTO GAFAIG_DB.CORE.REGISTRY_AI_SYSTEMS t
USING (
    SELECT * FROM VALUES
    ('SYS-DEMO-3001','GAFAIG-00000003','APP-DEMO-3001',NULL,'Autonomous Mobility Safety Model','Computer Vision','Transportation safety monitoring and autonomous mobility risk detection','Pilot','Human-in-the-loop','High','ETH Zurich AI Center','Mixed sources','Human-in-the-loop',TRUE,'External technical evaluation','Quarterly','Computer vision system designed to monitor autonomous mobility environments and identify safety risks before deployment escalation.',TRUE,10),
    ('SYS-DEMO-3002','GAFAIG-00000004','APP-DEMO-3002',NULL,'Clinical Triage Assist','Decision Support','Clinical support for early triage recommendations in healthcare settings','Limited Production','Human-in-the-loop','High','Vector Institute','Licensed datasets','Human-in-the-loop',TRUE,'Benchmark evaluation and expert review','Quarterly','Clinical decision-support system that assists healthcare staff with early triage prioritization under human supervision.',TRUE,20),
    ('SYS-DEMO-3003','GAFAIG-00000005','APP-DEMO-3003',NULL,'Climate Forecast Optimizer','Predictive Model','Climate forecasting and environmental scenario analysis','Production','Human-on-the-loop','Medium','Mila AI Institute','Public research data','Human-on-the-loop',FALSE,'Academic peer review and benchmark testing','Annual','Predictive environmental model used for climate scenario forecasting and resilience planning support.',TRUE,30),
    ('SYS-DEMO-3004','GAFAIG-00000006','APP-DEMO-3004',NULL,'Public Service Policy Simulator','Simulation Model','Scenario modeling for public-sector policy planning and governance review','Pilot','External review board','Medium','Singapore AI Governance Lab','Government and synthetic data','External review board',TRUE,'Policy review and scenario testing','Annual','Policy simulation platform for public-service planning, governance testing, and scenario comparison.',TRUE,40),
    ('SYS-DEMO-3005','GAFAIG-00000007','APP-DEMO-3005',NULL,'Reinforcement Oversight Monitor','LLM','Oversight and anomaly review for advanced reinforcement learning operations','Research','Human-on-the-loop','High','DeepMind Safety Research','Mixed sources','Human-on-the-loop',TRUE,'Red-team testing and internal safety review','Continuous monitoring','Oversight-focused model for monitoring advanced reinforcement learning behavior and surfacing potential safety anomalies.',TRUE,50),
    ('SYS-DEMO-3006','GAFAIG-00000008','APP-DEMO-3006',NULL,'Scholarly Knowledge Engine','Knowledge System','Research discovery, document synthesis, and scholarly knowledge retrieval','Production','Human-on-the-loop','Medium','Allen Institute for AI','Licensed and public datasets','Human-on-the-loop',FALSE,'Third-party evaluation','Annual','Knowledge system for research retrieval and synthesis across large scholarly and scientific corpora.',TRUE,60),
    ('SYS-DEMO-3007','GAFAIG-00000009','APP-DEMO-3007',NULL,'Advanced Manufacturing Vision System','Computer Vision','Industrial inspection and quality monitoring in manufacturing environments','Limited Production','Human-in-the-loop','Medium','Tsinghua AI Research Center','Proprietary industrial data','Human-in-the-loop',TRUE,'Industrial validation and benchmark testing','Quarterly','Industrial computer vision platform for detecting manufacturing anomalies and improving quality-control workflows.',TRUE,70),
    ('SYS-DEMO-3008','GAFAIG-00000010','APP-DEMO-3008',NULL,'Critical Infrastructure Risk Monitor','Risk Analytics','Monitoring and escalation support for infrastructure resilience and operational risk','Pilot','Human-in-the-loop','High','Australian Responsible AI Lab','Mixed sources','Human-in-the-loop',TRUE,'External audit and scenario review','Quarterly','Risk analytics system designed to monitor critical infrastructure conditions and support human escalation decisions.',TRUE,80)
) s (
    SYSTEM_ID, REGISTRY_ID, APPLICATION_ID, CASE_ID, SYSTEM_NAME, SYSTEM_TYPE, INTENDED_USE,
    DEPLOYMENT_STATUS, OVERSIGHT_LEVEL, RISK_TIER, DEVELOPER_ORGANIZATION,
    TRAINING_DATA_CATEGORY, OVERSIGHT_MODEL, HUMAN_REVIEW_REQUIRED,
    EVALUATION_PROTOCOL, AUDIT_FREQUENCY, PUBLIC_SUMMARY, IS_PUBLIC, DISPLAY_ORDER
)
ON t.SYSTEM_ID = s.SYSTEM_ID
WHEN MATCHED THEN UPDATE SET
    t.REGISTRY_ID = s.REGISTRY_ID,
    t.APPLICATION_ID = s.APPLICATION_ID,
    t.CASE_ID = s.CASE_ID,
    t.SYSTEM_NAME = s.SYSTEM_NAME,
    t.SYSTEM_TYPE = s.SYSTEM_TYPE,
    t.INTENDED_USE = s.INTENDED_USE,
    t.DEPLOYMENT_STATUS = s.DEPLOYMENT_STATUS,
    t.OVERSIGHT_LEVEL = s.OVERSIGHT_LEVEL,
    t.RISK_TIER = s.RISK_TIER,
    t.DEVELOPER_ORGANIZATION = s.DEVELOPER_ORGANIZATION,
    t.TRAINING_DATA_CATEGORY = s.TRAINING_DATA_CATEGORY,
    t.OVERSIGHT_MODEL = s.OVERSIGHT_MODEL,
    t.HUMAN_REVIEW_REQUIRED = s.HUMAN_REVIEW_REQUIRED,
    t.EVALUATION_PROTOCOL = s.EVALUATION_PROTOCOL,
    t.AUDIT_FREQUENCY = s.AUDIT_FREQUENCY,
    t.PUBLIC_SUMMARY = s.PUBLIC_SUMMARY,
    t.IS_PUBLIC = s.IS_PUBLIC,
    t.DISPLAY_ORDER = s.DISPLAY_ORDER,
    t.UPDATED_AT = CURRENT_TIMESTAMP()
WHEN NOT MATCHED THEN INSERT (
    SYSTEM_ID, REGISTRY_ID, APPLICATION_ID, CASE_ID, SYSTEM_NAME, SYSTEM_TYPE, INTENDED_USE,
    DEPLOYMENT_STATUS, OVERSIGHT_LEVEL, RISK_TIER, DEVELOPER_ORGANIZATION,
    TRAINING_DATA_CATEGORY, OVERSIGHT_MODEL, HUMAN_REVIEW_REQUIRED,
    EVALUATION_PROTOCOL, AUDIT_FREQUENCY, PUBLIC_SUMMARY, IS_PUBLIC, DISPLAY_ORDER,
    CREATED_AT, UPDATED_AT
) VALUES (
    s.SYSTEM_ID, s.REGISTRY_ID, s.APPLICATION_ID, s.CASE_ID, s.SYSTEM_NAME, s.SYSTEM_TYPE, s.INTENDED_USE,
    s.DEPLOYMENT_STATUS, s.OVERSIGHT_LEVEL, s.RISK_TIER, s.DEVELOPER_ORGANIZATION,
    s.TRAINING_DATA_CATEGORY, s.OVERSIGHT_MODEL, s.HUMAN_REVIEW_REQUIRED,
    s.EVALUATION_PROTOCOL, s.AUDIT_FREQUENCY, s.PUBLIC_SUMMARY, s.IS_PUBLIC, s.DISPLAY_ORDER,
    CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
);

SELECT SYSTEM_ID, SYSTEM_NAME, REGISTRY_ID, APPLICATION_ID
FROM GAFAIG_DB.CORE.REGISTRY_AI_SYSTEMS
WHERE APPLICATION_ID LIKE 'APP-DEMO-300%'
ORDER BY SYSTEM_ID;