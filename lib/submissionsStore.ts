// /lib/submissionsStore.ts

import fs from "fs/promises";
import path from "path";
import { isValidStatus, SubmissionStatus } from "./status";

export type SubmissionRecord = {
  requestId: string;
  status: SubmissionStatus;
  createdAt: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

const DATA_PATH = path.join(process.cwd(), "data", "submissions.json");

async function readJsonFileSafe<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export async function getAllSubmissions(): Promise<SubmissionRecord[]> {
  const data = await readJsonFileSafe<unknown>(DATA_PATH, []);

  if (!Array.isArray(data)) return [];

  const normalized: SubmissionRecord[] = [];

  for (const item of data) {
    if (!item || typeof item !== "object") continue;

    const obj = item as Record<string, unknown>;

    const requestId = typeof obj.requestId === "string" ? obj.requestId : "";
    const createdAt = typeof obj.createdAt === "string" ? obj.createdAt : "";
    const statusRaw = obj.status;

    if (!requestId || !createdAt || !isValidStatus(statusRaw)) continue;

    normalized.push({
      ...obj,
      requestId,
      createdAt,
      status: statusRaw,
    } as SubmissionRecord);
  }

  return normalized;
}

export type SubmissionsQuery = {
  search?: string;
  status?: SubmissionStatus | "all";
};

export async function querySubmissions(q: SubmissionsQuery): Promise<SubmissionRecord[]> {
  const all = await getAllSubmissions();

  const search = (q.search ?? "").trim().toLowerCase();
  const status = q.status ?? "all";

  let filtered = all;

  if (status !== "all") {
    filtered = filtered.filter((s) => s.status === status);
  }

  if (search) {
    filtered = filtered.filter((s) => {
      const haystack = [
        s.requestId,
        typeof s.name === "string" ? s.name : "",
        typeof s.email === "string" ? s.email : "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });
  }

  filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return filtered;
}
