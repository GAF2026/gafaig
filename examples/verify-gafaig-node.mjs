import { createPublicKey, verify } from "node:crypto";

const REGISTRY_ID = process.argv[2] || "GAFAIG-28dedd000ca5410c86e3a6633cd6639a";
const BASE_URL = process.env.GAFAIG_BASE_URL || "https://www.gafaig.com";

async function fetchJson(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const text = await response.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Expected JSON from ${url}, received:\n${text}`);
  }

  if (!response.ok) {
    throw new Error(
      `Request failed for ${url}: ${response.status} ${response.statusText}\n${JSON.stringify(
        json,
        null,
        2
      )}`
    );
  }

  return json;
}

function normalizePem(value) {
  return String(value || "").replace(/\\n/g, "\n").trim();
}

function canonicalize(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalize(item)).join(",")}]`;
  }

  const entries = Object.entries(value).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries
    .map(([key, val]) => `${JSON.stringify(key)}:${canonicalize(val)}`)
    .join(",")}}`;
}

async function main() {
  const verifyUrl = `${BASE_URL}/api/verify/${encodeURIComponent(REGISTRY_ID)}`;
  const verifyPayload = await fetchJson(verifyUrl);

  if (!verifyPayload.ok || !verifyPayload.verified) {
    throw new Error(
      `GAFAIG verification endpoint did not return a verified record.\n${JSON.stringify(
        verifyPayload,
        null,
        2
      )}`
    );
  }

  const proof = verifyPayload.proof || {};
  const verificationKeyUrl = proof.verificationKeyUrl;
  if (!verificationKeyUrl) {
    throw new Error("Verification payload did not include proof.verificationKeyUrl");
  }

  const publicKeyPayload = await fetchJson(verificationKeyUrl);
  if (!publicKeyPayload.ok || !publicKeyPayload.publicKeyPem) {
    throw new Error(
      `Public key endpoint did not return a usable key.\n${JSON.stringify(
        publicKeyPayload,
        null,
        2
      )}`
    );
  }

  const publicKeyPem = normalizePem(publicKeyPayload.publicKeyPem);
  const publicKey = createPublicKey(publicKeyPem);

  const messageObject = proof.message;
  if (!messageObject) {
    throw new Error("Verification payload did not include proof.message");
  }

  const messageString =
    typeof messageObject === "string"
      ? messageObject
      : canonicalize(messageObject);

  const signature = proof.signature;
  if (!signature) {
    throw new Error("Verification payload did not include proof.signature");
  }

  const isValid = verify(
    null,
    Buffer.from(messageString, "utf8"),
    publicKey,
    Buffer.from(signature, "base64")
  );

  console.log(JSON.stringify(
    {
      ok: true,
      registryId: verifyPayload.registryId,
      verifiedByEndpoint: verifyPayload.verified,
      localSignatureValid: isValid,
      algorithm: proof.alg,
      keyIdFromProof: proof.kid,
      keyIdFromPublicKey: publicKeyPayload.kid,
      verificationKeyUrl,
      entityName: verifyPayload.record?.entityName || null,
      decisionStatus: verifyPayload.record?.decisionStatus || null,
      certifiedTier: verifyPayload.record?.certifiedTier || null,
      certifiedBand: verifyPayload.record?.certifiedBand || null,
      validTo: verifyPayload.record?.validTo || null,
    },
    null,
    2
  ));

  if (!isValid) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});