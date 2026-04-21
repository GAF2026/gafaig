export type RegistryRow = {
  registryId: string;
  registrySnapshotId?: string | null;
  applicationId: string | null;
  caseId: string | null;

  entityName: string | null;
  entityType: string | null;
  country: string | null;

  certificationStatus: string | null;
  certifiedAt: string | null;

  validFrom: string | null;
  validTo: string | null;

  lifecycleStatus?: string | null;
  renewalStatus?: string | null;
  publishedAt?: string | null;
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
  entityType: string | null;
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

  certificationStatus: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  lifecycleStatus: string | null;
  renewalStatus: string | null;

  publicSummary: string | null;
  displayOrder: number | null;
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
      certificationStatus: string | null;
      certifiedAt: string | null;
      badge: {
        status: string;
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
        registrySnapshotId?: string | null;
        applicationId: string | null;
        caseId: string | null;
        entityName: string | null;
        entityType: string | null;
        country: string | null;
        certificationStatus: string | null;
        certifiedAt: string | null;
        validFrom: string | null;
        validTo: string | null;
        lifecycleStatus: string | null;
        renewalStatus: string | null;
        publishedAt: string | null;
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