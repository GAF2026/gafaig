type GafaigIdKind = "CASE" | "REGISTRY" | "AISYS";

type CreateGafaigIdOptions = {
  kind: GafaigIdKind;
  sequence: number | string;
  width?: number;
};

const DEFAULT_WIDTH = 8;

function normalizeSequence(sequence: number | string): number {
  const value =
    typeof sequence === "string" ? Number.parseInt(sequence, 10) : sequence;

  if (!Number.isFinite(value) || value < 0) {
    throw new Error("Invalid GAFAIG ID sequence");
  }

  return Math.floor(value);
}

function padSequence(value: number, width: number) {
  return String(value).padStart(width, "0");
}

export function createGafaigId({
  kind,
  sequence,
  width = DEFAULT_WIDTH,
}: CreateGafaigIdOptions): string {
  const normalized = normalizeSequence(sequence);
  const padded = padSequence(normalized, width);

  switch (kind) {
    case "CASE":
      return `CASE-${padded}`;
    case "REGISTRY":
      return `GAFAIG-${padded}`;
    case "AISYS":
      return `AISYS-${padded}`;
    default: {
      const exhaustiveCheck: never = kind;
      throw new Error(`Unsupported GAFAIG ID kind: ${exhaustiveCheck}`);
    }
  }
}

export function isGafaigCaseId(value: string): boolean {
  return /^CASE-\d{8}$/.test(String(value || "").trim());
}

export function isGafaigRegistryId(value: string): boolean {
  return /^GAFAIG-\d{8}$/.test(String(value || "").trim());
}

export function isGafaigAiSystemId(value: string): boolean {
  return /^AISYS-\d{8}$/.test(String(value || "").trim());
}