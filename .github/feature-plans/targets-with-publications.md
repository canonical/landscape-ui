# Feature Plan: Lazy Publications Loading (`targets-with-publications`)

> **Final** — standalone `useGetPublicationsByTarget`; server-side filter; no changes to `src/features/publications/`.

---

## 1. Feature Overview

- **Objective:** Replace the single eager "fetch all publications and client-side join" strategy with a per-target, on-demand, server-side filtered query. The publications count column stays in the list table. Publications data is fetched only when needed for a specific target.
- **Location:** `src/features/publication-targets/`

---

## 2. Root Cause

`useGetPublicationTargets` unconditionally calls the local `useGetPublications()` (which paginates through _all_ publications) and client-side joins the result into every list row. The publications payload grows linearly with account activity and is O(total publications) regardless of how many targets are displayed.

---

## 3. `src/features/publications/` — No Changes

The existing `useGetPublications` hook is designed for the Publications list page: it is URL-params-driven (consumes `usePageParams`), applies client-side search filtering, and returns paginated results. It must not be modified as part of this refactor.

Both `Publication` and `ListPublicationsResponse` are exported from `@/features/publications` and are available for the new hook to import.

---

## 4. Changes to `src/features/publication-targets/`

### 4.1 New Hook: `useGetPublicationsByTarget`

**File:** `src/features/publication-targets/api/useGetPublicationsByTarget.ts`

A standalone hook that calls the `publications` endpoint directly with a server-side `publicationTargetId` filter. It does not wrap the `publications` feature's `useGetPublications`.

```ts
// Signature
function useGetPublicationsByTarget(publicationTargetId: string | undefined): {
  publications: Publication[];
  isGettingPublications: boolean;
};
```

- **Endpoint:** `GET publications?publicationTargetId=<uuid>` (paginated, cursor-based).
- **Query key:** `["publications", { publicationTargetId }]` — distinct per target, independently cached.
- If `publicationTargetId` is `undefined`, the query is disabled (`enabled: false`); returns `{ publications: [], isGettingPublications: false }`.
- Pagination follows the same `do { … } while (pageToken)` pattern as other hooks in this feature.
- Import sources:
  - `Publication` from `@/features/publications`
  - `ListPublicationsResponse` from `@/api/generated/debArchive.schemas` (not exported by `@/features/publications`)
  - `useFetchDebArchive` from `@/hooks/useFetchDebArchive`

```ts
// Query params sent to the API
{ publicationTargetId: string, pageSize: 100, pageToken?: string }
```

### 4.2 `useGetPublicationTargets` (MODIFY)

**File:** `src/features/publication-targets/api/useGetPublicationTargets.ts`

- Remove `import useGetPublications` (local hook).
- Remove `import type { PublicationTargetWithPublications }`.
- Remove the client-side join (`targets.map(...)`).
- Return plain `PublicationTarget[]`.

```ts
// Signature after refactor
function useGetPublicationTargets(): {
  publicationTargets: PublicationTarget[];
  isGettingPublicationTargets: boolean;
};
```

### 4.3 `useRemovePublicationTarget` (MODIFY)

**File:** `src/features/publication-targets/api/useRemovePublicationTarget.ts`

The `onSuccess` handler currently only invalidates `["publication-targets"]`. Add invalidation of `["publications"]` so per-target count caches are busted when a target is deleted.

```ts
onSuccess: async () => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["publication-targets"] }),
    queryClient.invalidateQueries({ queryKey: ["publications"] }),
  ]);
};
```

### 4.4 Delete: `useGetPublications` in `publication-targets`

**File:** `src/features/publication-targets/api/useGetPublications.ts` — **delete**.

This was a copy of the global publications fetch used solely for the join. It has no remaining consumers after this refactor.

### 4.5 `src/features/publication-targets/api/index.ts`

- Remove `export { default as useGetPublications }`.
- Add `export { default as useGetPublicationsByTarget }`.

### 4.6 Component Changes

#### Updated Type Flow

```
PublicationTargetContainer          → passes PublicationTarget[]
  └─ PublicationTargetList          → accepts PublicationTarget[]
       └─ PublicationsCountCell     → calls useGetPublicationsByTarget(target.publicationTargetId)
       └─ PublicationTargetListActions → accepts PublicationTarget
            ├─ TargetDetails        → accepts PublicationTarget; calls useGetPublicationsByTarget internally
            ├─ EditTargetForm       → unchanged
            └─ RemoveTargetForm     → accepts PublicationTarget; calls useGetPublicationsByTarget internally
```

#### `PublicationTargetList` (MODIFY)

- Change `PublicationTargetWithPublications` → `PublicationTarget` throughout.
- Extract a `PublicationsCountCell` named sub-component — hooks cannot be called inside `Cell` render functions.
- Publications column accessor: `(row) => row.publicationTargetId` (opaque value; count derived in cell).

```ts
interface PublicationsCountCellProps {
  publicationTargetId: string | undefined;
}
// PublicationsCountCell calls useGetPublicationsByTarget and renders:
//   isGettingPublications → <Icon name="spinner" className="u-animation--spin" aria-hidden />
//   loaded, length === 0  → <NoData />
//   loaded, length > 0    → "{n} publication(s)"
```

There is no standalone `<Spinner />` component in the project. Use the same pattern as `LoadingState`: `<Icon name="spinner" className="u-animation--spin" aria-hidden />` imported from `@canonical/react-components`.

#### `PublicationTargetListActions` (MODIFY)

- Change prop type `PublicationTargetWithPublications` → `PublicationTarget`.
- Remove debug `console.log` referencing `target.publications`.

#### `TargetDetails` (MODIFY)

- Change prop type: `target: PublicationTarget`.
- Call `useGetPublicationsByTarget(target.publicationTargetId)` in the component body.
- Replace `target.publications` with `publications` from the hook.
- Show `<LoadingState />` in the "USED IN" section while `isGettingPublications` is `true`.

```ts
interface TargetDetailsProps {
  readonly target: PublicationTarget;
}
```

#### `RemoveTargetForm` (MODIFY)

- Change prop type: `target: PublicationTarget`.
- Call `useGetPublicationsByTarget(target.publicationTargetId)` in the component body.
- Replace `target.publications` with `publications` from hook.
- Gate `hasPublications` on `!isGettingPublications && publications.length > 0`.

```ts
interface RemoveTargetFormProps {
  readonly target: PublicationTarget;
}
```

### 4.7 Types (MODIFY)

`src/features/publication-targets/types/Publication.d.ts`:

- Import `Publication` from `@/features/publications` instead of `@/api/generated/debArchive.schemas` directly.
- Delete `PublicationTargetWithPublications`.

`src/features/publication-targets/types/index.d.ts`:

- Remove `PublicationTargetWithPublications` export.

`src/features/publication-targets/index.ts`:

- Remove `PublicationTargetWithPublications` from public exports.

---

## 5. Caching Behaviour

Each unique `publicationTargetId` gets its own React Query cache entry under key `["publications", { publicationTargetId }]`.

- All visible list rows request their counts in parallel on first render.
- Opening `TargetDetails` for target A → cache hit, zero extra network requests.
- Opening `RemoveTargetForm` for the same target → cache hit.
- On target deletion, both `["publication-targets"]` and `["publications"]` are invalidated (see §4.3).

---

## 6. State & Logic

| Location                           | Before                                              | After                                                                      |
| ---------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------- |
| `PublicationTargetContainer`       | Blocks until targets + **all** publications resolve | Blocks only until targets resolve                                          |
| `PublicationTargetList` count cell | Synchronous (data in prop)                          | Per-row parallel requests; spinner icon while loading; cached on re-render |
| `TargetDetails`                    | Publications in prop, no loading                    | `<LoadingState />` while hook resolves; cache hit on 2nd open              |
| `RemoveTargetForm`                 | Publications in prop, no loading                    | Inline loading; cache hit on 2nd open                                      |

---

## 7. MSW Handlers

**File:** `src/tests/server/handlers/publications.ts`

Update the `GET publications` handler to read `publicationTargetId` from search params and return a filtered subset when present:

```
GET ${API_URL_DEBARCHIVE}v1/publications?publicationTargetId=<id>  → filtered subset
GET ${API_URL_DEBARCHIVE}v1/publications                            → all (unchanged)
```

Branch on `request.url.searchParams.get("publicationTargetId")`.

---

## 8. Testing Plan

### 8.1 Component Tests

#### `PublicationTargetList.test.tsx` (new)

- Render with plain `PublicationTarget[]` mock data.
- Assert each row's Publications cell renders a count after the filtered MSW handler resolves.
- Assert spinner icon is shown before the query resolves.

#### `RemoveTargetForm.test.tsx` (update)

- Change `target` prop: `publicationTargetsWithPublications[0]` → `publicationTargets[0]` (plain `PublicationTarget`).
- Behaviour identical — MSW serves filtered result by `publicationTargetId`.
- Verify publications table renders when MSW returns matching items; hidden otherwise.

#### `TargetDetails.test.tsx` (new)

- Render `<TargetDetails target={publicationTargets[0]} />`.
- Assert S3 `InfoGrid` renders immediately (not gated on publications).
- Assert `<LoadingState />` shown while filtered publications query is in-flight.
- Assert `PublicationsTable` renders after MSW resolves filtered publications.

### 8.2 Hook Coverage

`useGetPublicationsByTarget` is exercised implicitly through the above component tests. No dedicated hook test file per project convention.

### 8.3 Mocking Strategy

All component tests that internally call `useGetPublicationsByTarget` should mock it via `vi.mock` at the top of each test file. This keeps tests fast and isolated — no MSW dependency for publications data in those tests.

---

## 9. Migration Checklist

> **Status:** Implementation complete — pending `pnpm build` verification and deletion of the stale `useGetPublications.ts` file (requires terminal access).

### Phase 1 — New `useGetPublicationsByTarget` hook

- [x] Add `src/features/publication-targets/api/useGetPublicationsByTarget.ts`
- [x] Update `src/features/publication-targets/api/index.ts` (add export)

### Phase 2 — Strip publications join from `useGetPublicationTargets`; fix invalidation

- [x] Update `src/features/publication-targets/api/useGetPublicationTargets.ts` (remove join, change return type)
- [x] Delete `src/features/publication-targets/api/useGetPublications.ts` (**manual step** — no consumers remain; file must be deleted from disk)
- [x] Remove its export from `src/features/publication-targets/api/index.ts`
- [x] Update `src/features/publication-targets/api/useRemovePublicationTarget.ts` (add `["publications"]` invalidation to `onSuccess`)

### Phase 3 — Component updates

- [x] Add `PublicationsCountCell` sub-component in `PublicationTargetList/` (spinner: `<Icon name="spinner" className="u-animation--spin" aria-hidden />`)
- [x] Update `src/features/publication-targets/components/PublicationTargetList/PublicationTargetList.tsx`
- [x] Update `src/features/publication-targets/components/PublicationTargetListActions/PublicationTargetListActions.tsx`
- [x] Update `src/features/publication-targets/components/TargetDetails/TargetDetails.tsx`
- [x] Update `src/features/publication-targets/components/RemoveTargetForm/RemoveTargetForm.tsx`

### Phase 4 — Type cleanup

- [x] Update `src/features/publication-targets/types/Publication.d.ts` (re-exports `Publication` from `@/features/publications`; `PublicationTargetWithPublications` deleted)
- [x] Update `src/features/publication-targets/types/index.d.ts`
- [x] Update `src/features/publication-targets/index.ts`

### Phase 5 — MSW + tests

- [x] Update `src/tests/server/handlers/publications.ts` (add `publicationTargetId` filter branch; imports `publications` from `@/tests/mocks/publication-targets`)
- [x] Update `src/features/publication-targets/components/RemoveTargetForm/RemoveTargetForm.test.tsx`
- [x] Update `src/features/publication-targets/components/TargetDetails/TargetDetails.test.tsx`
- [x] Update `src/features/publication-targets/components/PublicationTargetList/PublicationTargetList.test.tsx`
- [x] Update `src/features/publication-targets/components/PublicationTargetListActions/PublicationTargetListActions.test.tsx` (prop type change)
- [x] Update `src/features/publication-targets/components/PublicationTargetContainer/PublicationTargetContainer.test.tsx` (was also using `publicationTargetsWithPublications`)
- [x] Remove `publicationTargetsWithPublications` from `src/tests/mocks/publication-targets.ts`

---

## 10. Implementation Notes

### Type resolution

`useGetPublicationsByTarget` imports `Publication` from `../types` (the local feature types, which re-exports from `@/features/publications`). `ListPublicationsResponse` comes from `@/api/generated/debArchive.schemas` as agreed. A cast `as Publication[]` bridges the schema type (optional `publicationId`) to the stricter domain type at the API boundary.

### Import paths

All intra-feature imports of `useGetPublicationsByTarget` use relative paths (e.g. `../../api/useGetPublicationsByTarget`), not the `@/features/publication-targets/api/...` deep-import form, to comply with the ESLint import restriction rule.

### Remaining manual step

Delete `src/features/publication-targets/api/useGetPublications.ts`. It has no remaining importers after this refactor. Run `pnpm build` after deletion to confirm clean compilation.

### Pre-existing errors (out of scope)

`PublicationsTable.test.tsx` and `NewPublicationTargetForm/AddPublicationTargetForm.tsx` contain pre-existing type errors unrelated to this refactor. They should be tracked separately.
