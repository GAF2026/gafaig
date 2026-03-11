export type RegistryRow = {
  registryId: string;
  applicationId: string;

  entityName: string;
  entityType: string | null;
  country: string | null;

  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string;

  validFrom: string | null;
  validTo: string | null;

  certifiedAt: string | null;
  lastActivityAt: string | null;
};

export type RegistryApiResponse =
  | {
      ok: true;
      rows: RegistryRow[];
      total: number;
      limit: number;
      filters?: { q: string; country: string; registryId: string };
    }
  | { ok: false; error: string };

export type RegistryAiSystemRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string | null;
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
        applicationId: string;
        entityName: string;
        entityType: string | null;
        country: string | null;
        certifiedTier: string | null;
        certifiedBand: string | null;
        decisionStatus: string;
        validFrom: string | null;
        validTo: string | null;
        certifiedAt: string | null;
        lastActivityAt: string | null;
        isCurrentlyValid?: boolean;
      };
      proof?: {
        alg: string;
        signature: string;
        message: string;
        signedAt: string;
      };
      now?: string;
    }
  | {
      ok: false;
      error: string;
      verified?: false;
      registryId?: string;
    };