const crypto = require("crypto");

const REGISTRY_ID = process.argv[2] || "GAFAIG-00000001";
const BASE_URL = process.argv[3] || "https://www.gafaig.com";

async function main() {
  const verifyUrl = `${BASE_URL}/api/verify/${REGISTRY_ID}`;
  const payload = await fetch(verifyUrl).then((r) => r.json());

  if (!payload.ok || !payload.verified) {
    throw new Error("Verification endpoint not valid");
  }

  const proof = payload.proof;

  const keyPayload = await fetch(proof.verificationKeyUrl).then((r) => r.json());

  const publicKeyPem =
    keyPayload.publicKeyPem ||
    keyPayload.public_key_pem ||
    keyPayload.pem ||
    keyPayload.publicKey ||
    keyPayload.public_key ||
    keyPayload.key;

  const publicKey = crypto.createPublicKey(publicKeyPem);

  // ✅ ORIGINAL (should PASS)
  const originalValid = crypto.verify(
    null,
    Buffer.from(proof.messageString, "utf8"),
    publicKey,
    Buffer.from(proof.signature, "base64")
  );

  // ❌ TAMPER: flip one character
  const tampered =
    proof.messageString.slice(0, -1) +
    (proof.messageString.slice(-1) === "}" ? "]" : "}");

  const tamperedValid = crypto.verify(
    null,
    Buffer.from(tampered, "utf8"),
    publicKey,
    Buffer.from(proof.signature, "base64")
  );

  console.log({
    registryId: payload.registryId,
    originalValid,
    tamperedValid,
  });

  if (originalValid !== true || tamperedValid !== false) {
    throw new Error("Tamper test FAILED");
  }

  console.log("Tamper test PASSED");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});