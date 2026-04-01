type VerifyApiResponse = {
  ok: boolean;
  verified: boolean;
  registryId: string;
  record?: {
    entityName?: string;
    decisionStatus?: string;
    certifiedTier?: string;
    certifiedBand?: string;
    validTo?: string;
  };
  proof?: {
    alg?: string;
    kid?: string;
    signature?: string;
    signedAt?: string;
    verificationKeyUrl?: string;
    message?: Record<string, unknown>;
    messageString?: string;
  };
};

export default function RegistryVerificationPanel({
  registryId,
  entityName,
  verifyData,
}: {
  registryId: string;
  entityName?: string;
  verifyData?: VerifyApiResponse | null;
}) {
  if (!verifyData || !verifyData.proof) {
    return (
      <div className="rounded-xl border p-4 text-sm">
        Verification unavailable
      </div>
    );
  }

  const { proof } = verifyData;

  return (
    <div className="rounded-xl border p-4 text-sm space-y-3">
      <div>
        <strong>Algorithm:</strong> {proof.alg}
      </div>

      <div>
        <strong>Key ID:</strong> {proof.kid}
      </div>

      <div>
        <strong>Signature:</strong>
        <div className="break-all text-xs mt-1">{proof.signature}</div>
      </div>

      <div>
        <strong>Verification Key:</strong>
        <div className="break-all text-xs mt-1">
          {proof.verificationKeyUrl}
        </div>
      </div>

      <div>
        <strong>Signed Message:</strong>
        <pre className="text-xs mt-1 overflow-x-auto">
          {proof.messageString}
        </pre>
      </div>
    </div>
  );
}