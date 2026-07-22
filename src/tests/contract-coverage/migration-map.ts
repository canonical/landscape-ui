/**
 * Hand-maintained equivalence table between backend generations.
 *
 * Route ids must use the canonical form produced by the connectors:
 *   v1: "GET /api/?action=<ActionName>"
 *   v2: "<METHOD> /api/v2/<path with {param} placeholders>"
 *   go: "<METHOD> /debarchive/v1beta1/<path with {param} placeholders>"
 *
 * Leave a layer undefined when the operation does not (yet) exist there.
 * The aggregator validates every id against the declared route universe and
 * warns on typos, and reports observed traffic per layer for each entry —
 * i.e. live migration progress measured from test traffic.
 */
export interface MigrationMapEntry {
  /** Human-readable operation name. */
  name: string;
  v1?: string;
  v2?: string;
  go?: string;
  notes?: string;
}

export const MIGRATION_MAP: MigrationMapEntry[] = [
  {
    name: "Administrators — list",
    v1: "GET /api/?action=GetAdministrators",
    notes:
      "Still v1-only in useAdministrators.ts; no v2/go equivalent declared yet.",
  },
  {
    name: "Administrators — update",
    v2: "PUT /api/v2/administrators/{id}",
    notes: "Already migrated to v2 (useAdministrators.ts); v1 had no editor.",
  },
  {
    name: "Repository mirror — sync",
    v1: "GET /api/?action=SyncMirrorPocket",
    go: "POST /debarchive/v1beta1/mirrors/{mirror}:sync",
    notes:
      "Approximate equivalence: legacy sync is pocket-level, debarchive sync is mirror-level.",
  },
];
