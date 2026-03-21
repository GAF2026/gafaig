export type GafaigIdKind =
  | "CASE"
  | "REGISTRY"
  | "AISYS"
  | "APPLICATION"
  | "PARTICIPANT";

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

function normalizeWidth(width: number): number {
  if (!Number.isFinite(width) || width < 1) {
    throw new Error("Invalid GAFAIG ID width");
  }

  return Math.floor(width);
}

function padSequence(value: number, width: number) {
  return String(value).padStart(width, "0");
}

export function normalizeId(value: string | null | undefined): string {
  return String(value ?? "").trim().toUpperCase();
}

export function idsEqual(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  return normalizeId(a) === normalizeId(b);
}

export function createGafaigId({
  kind,
  sequence,
  width = DEFAULT_WIDTH,
}: CreateGafaigIdOptions): string {
  const normalized = normalizeSequence(sequence);
  const safeWidth = normalizeWidth(width);
  const padded = padSequence(normalized, safeWidth);

  switch (kind) {
    case "CASE":
      return `CASE-${padded}`;
    case "REGISTRY":
      return `GAFAIG-${padded}`;
    case "AISYS":
      return `AISYS-${padded}`;
    case "APPLICATION":
      return `APP-${padded}`;
    case "PARTICIPANT":
      return `PART-${padded}`;
    default: {
      const exhaustiveCheck: never = kind;
      throw new Error(`Unsupported GAFAIG ID kind: ${exhaustiveCheck}`);
    }
  }
}

export function isGafaigCaseId(value: string): boolean {
  return /^CASE-\d{8}$/.test(normalizeId(value));
}

export function isGafaigRegistryId(value: string): boolean {
  return /^GAFAIG-\d{8}$/.test(normalizeId(value));
}

export function isGafaigAiSystemId(value: string): boolean {
  return /^AISYS-\d{8}$/.test(normalizeId(value));
}

export function isGafaigApplicationId(value: string): boolean {
  return /^APP-\d{8}$/.test(normalizeId(value));
}

export function isGafaigParticipantId(value: string): boolean {
  return /^PART-\d{8}$/.test(normalizeId(value));
}