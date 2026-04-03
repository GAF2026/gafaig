export type RegistryRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;

  entityName: string | null;
  entityType: string | null;
  country: string | null;

  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;

  validFrom: string | null;
  validTo: string | null;

  certifiedAt: string | null;
};

export type RegistryApiResponse =
  | {
      ok: true;
      rows: RegistryRow[];
      total: number;
      limit: number;
      filters?: {
        q?: string;
        country?: string;
        registryId?: string;
        caseId?: string;
        applicationId?: string;
      };
    }
  | { ok: false; error: string };

export type RegistryAiSystemRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string | null;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
  ENTITY_NAME: string | null;

  SYSTEM_NAME: string | null;
  SYSTEM_TYPE: string | null;
  INTENDED_USE: string | null;

  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;

  DEVELOPER_ORGANIZATION: string | null;
  TRAINING_DATA_CATEGORY: string | null;
  OVERSIGHT_MODEL: string | null;
  HUMAN_REVIEW_REQUIRED: boolean | null;
  EVALUATION_PROTOCOL: string | null;
  AUDIT_FREQUENCY: string | null;

  DECISION_STATUS: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  GOVERNANCE_MATURITY_SCORE: number | null;
  CONTROLS_PCT: number | null;
  COVERAGE_PCT: number | null;
  FRESHNESS_PCT: number | null;
  SUMMARY_PCT: number | null;
  LAST_ACTIVITY_AT: string | null;

  PUBLIC_SUMMARY: string | null;
  DISPLAY_ORDER: number | null;
};

export type RegistryAiSystemsApiResponse =
  | {
      ok: true;
      rows: RegistryAiSystemRow[];
      total: number;
    }
  | { ok: false; error: string };

export type VerifyApiResponse =
  | {
      ok: true;
      registryId: string;
      verified: boolean;
      record?: {
        registryId: string;
        applicationId: string | null;
        caseId: string | null;
        entityName: string | null;
        entityType: string | null;
        country: string | null;
        certificationStatus: string | null;
        certifiedTier: string | null;
        certifiedBand: string | null;
        decisionStatus: string | null;
        validFrom: string | null;
        validTo: string | null;
        certifiedAt: string | null;
      };
      proof?: {
        alg: string;
        kid?: string;
        signature: string;
        signedAt: string;
        verificationKeyUrl?: string;
        message?: Record<string, unknown>;
        messageString?: string;
      };
    }
  | {
      ok: false;
      error: string;
      verified?: false;
      registryId?: string;
    };