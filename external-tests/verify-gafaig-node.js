const crypto = require("crypto");

const REGISTRY_ID = process.argv[2] || "GAFAIG-00000001";
const BASE_URL = process.argv[3] || "https://www.gafaig.com";

async function main() {
  const verifyUrl = `${BASE_URL}/api/verify/${REGISTRY_ID}`;
  const payload = await fetch(verifyUrl).then((r) => r.json());

  if (!payload.ok || !payload.verified) {
    throw new Error("Verification endpoint did not return ok=true and verified=true");
  }

  const proof = payload.proof;
  if (!proof?.messageString || !proof?.signature || !proof?.verificationKeyUrl) {
    throw new Error("Missing proof.messageString, proof.signature, or proof.verificationKeyUrl");
  }

  const keyPayload = await fetch(proof.verificationKeyUrl).then((r) => r.json());
  const publicKeyPem =
    keyPayload.publicKeyPem ||
    keyPayload.public_key_pem ||
    keyPayload.pem ||
    keyPayload.publicKey ||
    keyPayload.public_key ||
    keyPayload.key;

  if (!publicKeyPem) {
    throw new Error("Public key PEM not found in key endpoint response");
  }

  const publicKey = crypto.createPublicKey(publicKeyPem);
  const signature = Buffer.from(proof.signature, "base64");
  const message = Buffer.from(proof.messageString, "utf8");

  const valid = crypto.verify(null, message, publicKey, signature);

  console.log({
    registryId: payload.registryId,
    verifiedByApi: payload.verified,
    signatureValidExternally: valid,
    keyId: proof.kid,
    signedAt: proof.signedAt,
  });

  if (!valid) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("External verification failed:", err.message);
  process.exit(1);
});