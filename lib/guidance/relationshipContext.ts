import type { GuidanceRelationshipContext } from "./repositoryContextTypes";

export function loadGuidanceRelationshipContext():
  GuidanceRelationshipContext {
  return {
    availability: "UNRESOLVED",
    relationships: [],
    unresolvedConditions: [
      "Canonical repository relationship runtime source is unavailable.",
      "Relationships were not inferred from shared case or organization identifiers.",
    ],
  };
}
