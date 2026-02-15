// app/api/admin/_lib/storage.ts
import fs from "fs/promises";
import path from "path";

type AnyJson = any;

function abs(p: string) {
  // Always resolve from the project root
  return path.join(process.cwd(), p);
}

// These paths match your diagnostics output earlier:
export const APPLICATIONS_PATH = abs("app/data/applications.json");
export const RENEWALS_PATH = abs("app/data/renewals.json");

export async function readJSON(filePath: string): Promise<AnyJson> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function writeJSON(filePath: string, data: AnyJson): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, json, "utf8");
}
