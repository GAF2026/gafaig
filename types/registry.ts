export type RegistryRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;

  entityName: string | null;
  entityType: string | null;
  country: string | null;

  certifiedScore?: string | null;
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
  registryId: string | null;
  systemId: string | null;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  country: string | null;

  systemName: string | null;
  systemType: string | null;
  intendedUse: string | null;

  deploymentStatus: string | null;
  oversightLevel: string | null;
  riskTier: string | null;

  developerOrganization: string | null;
  trainingDataCategory: string | null;
  oversightModel: string | null;
  humanReviewRequired: boolean | null;
  evaluationProtocol: string | null;
  auditFrequency: string | null;

  decisionStatus: string | null;
  certificationStatus: string | null;
  certifiedScore: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  renewalStatus: string | null;

  verificationType: string | null;
  modelVersion: string | null;
  score: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  registryStatus: string | null;
  publicSummary: string | null;
  displayOrder: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type RegistryAiSystemsApiResponse =
  | {
      ok: true;
      rows: RegistryAiSystemRow[];
      total: number;
    }
  | { ok: false; error: string };

export type BadgeApiResponse =
  | {
      ok: true;
      registryId: string;
      entityName: string | null;
      certifiedTier: string | null;
      certifiedBand: string | null;
      certifiedAt: string | null;
      badge: {
        tier: string;
        label: string;
        imageUrl: string;
      };
      verifyUrl: string;
      registryUrl: string;
      widgetUrl: string;
      embed: {
        imageHtml: string;
        linkedImageHtml: string;
        iframeHtml: string;
      };
    }
  | {
      ok: false;
      error: string;
    };

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
        certifiedScore?: number | string | null;
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