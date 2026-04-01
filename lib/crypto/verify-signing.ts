import { createPrivateKey, createPublicKey, sign, verify } from "crypto";

export const GAFAIG_VERIFY_ALG = "Ed25519";

function normalizePem(value: string) {
  return value.replace(/\\n/g, "\n").trim();
}

export function getSigningKeyId() {
  return process.env.GAFAIG_SIGNING_KEY_ID || "gafaig-ed25519-2026-01";
}

export function getPrivateKeyPem() {
  const value = process.env.GAFAIG_SIGNING_PRIVATE_KEY_PEM;
  if (!value) {
    throw new Error("Missing GAFAIG_SIGNING_PRIVATE_KEY_PEM");
  }
  return normalizePem(value);
}

export function getPublicKeyPem() {
  const explicit = process.env.GAFAIG_SIGNING_PUBLIC_KEY_PEM;
  if (explicit) {
    return normalizePem(explicit);
  }

  const privateKey = createPrivateKey(getPrivateKeyPem());
  const publicKey = createPublicKey(privateKey);
  return publicKey.export({ type: "spki", format: "pem" }).toString();
}

export function signMessage(message: string) {
  const privateKey = createPrivateKey(getPrivateKeyPem());
  const signature = sign(null, Buffer.from(message, "utf8"), privateKey);
  return signature.toString("base64");
}

export function verifyMessageSignature(message: string, signatureB64: string) {
  const publicKey = createPublicKey(getPublicKeyPem());
  return verify(
    null,
    Buffer.from(message, "utf8"),
    publicKey,
    Buffer.from(signatureB64, "base64")
  );
  }