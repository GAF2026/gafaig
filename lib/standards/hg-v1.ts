// lib/standards/hg-v1.ts

export type GovernanceEvidenceType =
  | "Policy"
  | "OrgChart"
  | "BoardMinutes"
  | "AuditReport"
  | "TechnicalDesign"
  | "IncidentReport"
  | "RegulatoryFiling"
  | "PublicDisclosure"
  | "InterviewAttestation"
  | "ThirdPartyCertification"
  | "Other";

export type RequirementLevel = "MUST" | "SHOULD" | "MAY";

export type StandardRequirement = {
  id: string; // e.g., HG-1.0-REQ-01
  level: RequirementLevel;
  title: string;
  statement: string;
  rationale: string;
  minimumEvidence: GovernanceEvidenceType[];
  evaluation: {
    passCriteria: string[];
    failCriteria: string[];
  };
};

export type StandardSection = {
  id: string;
  title: string;
  body: string[];
  requirements?: StandardRequirement[];
};

export type GovernanceStandard = {
  standardId: string; // GAFAIG-HG-1.0
  name: string;
  version: string; // 1.0
  status: "Active" | "Draft" | "Deprecated";
  publishedDateISO: string; // YYYY-MM-DD
  scope: string[];
  appliesTo: string[];
  definitions: { term: string; definition: string }[];
  governanceClassification: {
    code: string; // HG / HAG / AHG / AG / UG / NG
    name: string;
    description: string;
  }[];
  sections: StandardSection[];
};

export const GAFAIG_HG_V1: GovernanceStandard = {
  standardId: "GAFAIG-HG-1.0",
  name: "GAFAIG Human Governance Standard",
  version: "1.0",
  status: "Active",
  publishedDateISO: "2026-02-07",
  scope: [
    "Define and assess the presence of accountable, human-centered governance over AI systems and AI-mediated decision processes.",
    "Provide a minimum global baseline for human accountability, escalation, transparency, and override mechanisms.",
    "Enable consistent classification across organizations, companies, jurisdictions, and AI-operated entities.",
  ],
  appliesTo: [
    "Organizations operating AI systems that materially affect people, safety, rights, access, or public outcomes",
    "Companies offering AI products/services with decisioning or automated enforcement",
    "Public-sector jurisdictions deploying AI for policy, eligibility, enforcement, or administration",
    "Any entity claiming GAFAIG participation or displaying GAFAIG governance status or badges",
  ],
  definitions: [
    {
      term: "Human Governance",
      definition:
        "A governance condition where identifiable humans hold decision authority, accountability, and oversight over AI systems, including the ability to intervene, override, and remediate harms.",
    },
    {
      term: "AI Self-Governance",
      definition:
        "A governance condition where AI systems generate, enforce, or modify governing rules/policies without accountable human decision authority and without meaningful human override.",
    },
    {
      term: "Material Impact",
      definition:
        "An effect on individuals or society that may alter rights, access, safety, finances, health, legal status, or significant opportunities.",
    },
    {
      term: "Accountable Human",
      definition:
        "A named individual (or clearly defined role) who can be held responsible for outcomes, who can approve changes, and who has authority to pause/override AI operation.",
    },
    {
      term: "Override",
      definition:
        "A documented, tested mechanism enabling humans to stop, suspend, roll back, or constrain AI behaviors within acceptable time bounds.",
    },
    {
      term: "Audit Trail",
      definition:
        "Tamper-evident logs and records that allow reconstruction of AI decisions, configurations, data lineage, access, and change history.",
    },
  ],
  governanceClassification: [
    {
      code: "HG",
      name: "Fully Human Governed",
      description:
        "Humans clearly define policy and hold final authority; AI is used only as a tool with strict oversight and meaningful override.",
    },
    {
      code: "HAG",
      name: "Human-AI Assisted Governance",
      description:
        "Humans remain final decision-makers, but AI assists in analysis/recommendation; review and override are consistently applied.",
    },
    {
      code: "AHG",
      name: "AI-Driven with Human Oversight",
      description:
        "AI drives operations and decisions, but accountable humans provide continuous monitoring, auditability, and rapid intervention capability.",
    },
    {
      code: "AG",
      name: "AI Autonomous Governance",
      description:
        "AI operates governance or policy enforcement with minimal or non-meaningful human oversight and/or no effective override.",
    },
    {
      code: "UG",
      name: "Unverified Governance",
      description:
        "Insufficient evidence to determine governance type; entity has not provided required documentation or signals are conflicting.",
    },
    {
      code: "NG",
      name: "No Discernible Human Governance",
      description:
        "No credible evidence of accountable human authority, escalation, or override over AI-mediated decisions and operations.",
    },
  ],
  sections: [
    {
      id: "HG-1.0-SEC-01",
      title: "Purpose",
      body: [
        "This standard defines the minimum requirements for Human Governance over AI systems and AI-mediated decision processes.",
        "It enables GAFAIG to classify entities and publish governance statuses that are evidence-based, repeatable, and auditable.",
      ],
    },
    {
      id: "HG-1.0-SEC-02",
      title: "Principles",
      body: [
        "Accountability: A named human (or role) must be responsible for AI outcomes.",
        "Transparency: Decisions, audits, and controls must be explainable and reviewable.",
        "Participation: Material-impact systems must support stakeholder feedback and challenge.",
        "Safety & Rights: Systems must be designed to protect rights and reduce harm.",
        "Enforceability: Requirements must be testable, not purely aspirational.",
      ],
    },
    {
      id: "HG-1.0-SEC-03",
      title: "Minimum Requirements",
      body: [
        "Requirements below are the minimum baseline for an entity to be considered governed by humans (HG/HAG/AHG).",
        "Failure of any MUST requirement forces a classification of UG or NG depending on evidence and severity.",
      ],
      requirements: [
        {
          id: "HG-1.0-REQ-01",
          level: "MUST",
          title: "Named accountable human authority",
          statement:
            "The entity MUST designate an accountable human (or defined role) with authority over AI system deployment, changes, and emergency shutdown.",
          rationale:
            "Without identifiable human authority, accountability collapses and governance becomes nominal or automated.",
          minimumEvidence: ["Policy", "OrgChart", "PublicDisclosure", "InterviewAttestation"],
          evaluation: {
            passCriteria: [
              "A named person or formally defined role exists with decision authority",
              "Authority includes approve/deny, pause/shutdown, and remediation powers",
              "Escalation path is documented and known internally",
            ],
            failCriteria: [
              "No named human or role exists",
              "Authority exists only on paper with no operational control",
              "Escalations route back to automated systems only",
            ],
          },
        },
        {
          id: "HG-1.0-REQ-02",
          level: "MUST",
          title: "Documented override and incident response",
          statement:
            "The entity MUST maintain an override mechanism and an incident response procedure for AI-related harms, including defined time-to-intervention targets.",
          rationale:
            "Real governance requires the ability to intervene rapidly when harm emerges.",
          minimumEvidence: ["Policy", "TechnicalDesign", "IncidentReport", "AuditReport"],
          evaluation: {
            passCriteria: [
              "Override exists and is documented",
              "Override is tested (tabletop or live) at least annually",
              "Incident response includes notification, containment, and remediation steps",
            ],
            failCriteria: [
              "No override exists",
              "Override exists but is not accessible in practice",
              "No incident response procedures for AI failures or harms",
            ],
          },
        },
        {
          id: "HG-1.0-REQ-03",
          level: "MUST",
          title: "Auditability and decision traceability",
          statement:
            "The entity MUST maintain audit trails sufficient to reconstruct AI decisions, configuration changes, access events, and data lineage for material-impact systems.",
          rationale:
            "Without traceability, review and accountability cannot be credibly enforced.",
          minimumEvidence: ["AuditReport", "TechnicalDesign", "IncidentReport"],
          evaluation: {
            passCriteria: [
              "Decision logs exist for material-impact outcomes",
              "Change logs exist for models/config/policies",
              "Access logs exist for privileged actions",
            ],
            failCriteria: [
              "Logs are missing, incomplete, or non-retained",
              "Logs cannot be linked to outcomes or versions",
              "No control over privileged access",
            ],
          },
        },
        {
          id: "HG-1.0-REQ-04",
          level: "SHOULD",
          title: "Independent oversight",
          statement:
            "The entity SHOULD implement independent oversight for material-impact systems (e.g., board committee, external audit, or qualified third-party review).",
          rationale:
            "Independent oversight reduces conflicts of interest and strengthens legitimacy.",
          minimumEvidence: ["BoardMinutes", "AuditReport", "ThirdPartyCertification"],
          evaluation: {
            passCriteria: [
              "Oversight body exists and meets regularly",
              "Oversight can block deployments and require remediation",
            ],
            failCriteria: [
              "Oversight is purely advisory with no power",
              "No evidence oversight reviews AI risks",
            ],
          },
        },
        {
          id: "HG-1.0-REQ-05",
          level: "SHOULD",
          title: "Public accountability interface",
          statement:
            "The entity SHOULD provide a public mechanism for reporting harms, contesting decisions, and requesting review for material-impact decisions.",
          rationale:
            "Human governance must be reachable by affected people, not just internal staff.",
          minimumEvidence: ["PublicDisclosure", "Policy"],
          evaluation: {
            passCriteria: [
              "Public reporting channel exists",
              "Clear response timelines and escalation steps exist",
            ],
            failCriteria: [
              "No public-facing path exists",
              "Requests route to automated systems only",
            ],
          },
        },
      ],
    },
    {
      id: "HG-1.0-SEC-04",
      title: "Classification Rules",
      body: [
        "GAFAIG assigns a governance classification (HG/HAG/AHG/AG/UG/NG) based on evidence and requirement performance.",
        "Default is UG when evidence is insufficient. NG applies when evidence indicates a lack of accountable human governance.",
        "AG applies when AI materially governs policy/enforcement without meaningful human override or accountability.",
      ],
    },
    {
      id: "HG-1.0-SEC-05",
      title: "Conformance and Publication",
      body: [
        "Entities may claim conformance only if they meet all MUST requirements and provide evidence sufficient for GAFAIG review.",
        "GAFAIG may publish: governance classification, confidence score, verification date, and standard version assessed.",
        "GAFAIG may revoke or downgrade status if evidence expires, systems change, or audits reveal nonconformance.",
      ],
    },
    {
      id: "HG-1.0-SEC-06",
      title: "Versioning and Continuous Improvement",
      body: [
        "This is version 1.0 of the GAFAIG Human Governance Standard.",
        "GAFAIG will revise the standard as AI capabilities, regulatory expectations, and governance practices evolve.",
        "Each assessment records the standard version used to preserve historical comparability.",
      ],
    },
  ],
};