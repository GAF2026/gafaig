import { sfQuery } from "@/lib/snowflake";

export async function getRegistryPublicList() {
  return sfQuery(`
    SELECT *
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY CERTIFIED_AT DESC
  `);
}

/* ✅ BACKWARD COMPAT FIX */

export async function getRegistryList() {
  return getRegistryPublicList();
}