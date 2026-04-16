import { getRegistryAiSystemsPaginated } from "./registry-ai-systems";

export async function getExplorerSystems() {
  const result = await getRegistryAiSystemsPaginated();
  return result.rows;
}

export async function getExplorerOrganizations() {
  const systems = await getExplorerSystems();
  const orgs = new Set<string>();

  systems.forEach((s) => {
    if (s.developerOrganization) {
      orgs.add(s.developerOrganization);
    }
  });

  return Array.from(orgs).sort();
}

export async function getExplorerCountries() {
  const systems = await getExplorerSystems();
  const countries = new Set<string>();

  systems.forEach((s) => {
    if (s.country) {
      countries.add(s.country);
    }
  });

  return Array.from(countries).sort();
}

/* ✅ REQUIRED EXPORT FIX */

export async function getExplorerSummary() {
  return {
    systems: await getExplorerSystems(),
    organizations: await getExplorerOrganizations(),
    countries: await getExplorerCountries(),
  };
}