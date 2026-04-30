# Feature Plan: `publication-links-per-target`

## 1. Feature Overview

- **Objective:** In `PublicationsTable` (rendered inside `PublicationTargetContainer` on the publication-targets page), each publication's label cell should link to `/repositories/publications` and automatically open the `PublicationDetails` side panel for that publication.
- **Reference pattern:** `PackageProfilesPage` + `PackageProfileDetailsSidePanel` (`src/pages/dashboard/profiles/package-profiles/`).

---

## 2. URL Pattern

```
/repositories/publications?sidePath=view&profile=<publication-name>
```

`sidePath` and `profile` already exist in `PageParams`. No changes to `types.d.ts` or `constants.ts`.

---

## 3. Changes

### 3a. `PublicationsTable` — label cell → cross-page `<Link>`

**File:** `src/features/publication-targets/components/PublicationsTable/PublicationsTable.tsx`

Replace the plain `{ accessor: "label" }` shorthand with a `Cell` renderer using a React Router `<Link>` to `ROUTES.repositories.publications({ sidePath: ["view"], profile: row.original.name })`. Link text: `row.original.label ?? row.original.name`.

### 3b. `PublicationsList` — `setSidePanelContent` → URL params

**File:** `src/features/publications/components/PublicationsList/PublicationsList.tsx`

Replace `openPublicationDetails` with `createPageParamsSetter({ sidePath: ["view"], profile: row.original.name })`. Remove: `useSidePanel`, `PublicationDetails` import, `useCallback`.

### 3c. `PublicationsListActions` — "View details" action → URL params

**File:** `src/features/publications/components/PublicationsListActions/PublicationsListActions.tsx`

Replace `handlePublicationDetails` with `createPageParamsSetter({ sidePath: ["view"], profile: publication.name })`. Remove: `useSidePanel`, `PublicationDetails` import.

### 3d. `PublicationsPage` — add `<SidePanel>` driven by `sidePath`

**File:** `src/pages/dashboard/repositories/publications/PublicationsPage.tsx`

Add `<SidePanel isOpen={!!sidePath.length} onClose={createPageParamsSetter({ sidePath: [], profile: "" })}>` with `lastSidePathSegment === "view"` rendering `<PublicationDetailsSidePanel />` (lazy). Add `useSetDynamicFilterValidation("sidePath", ["view"])`.

### 3e. `PublicationDetailsSidePanel` — URL-aware wrapper _(new)_

**File:** `src/features/publications/components/PublicationDetailsSidePanel/PublicationDetailsSidePanel.tsx`

Calls `useGetPagePublication()`. Renders `<SidePanel.LoadingState />` while loading, `<PublicationDetails publication={publication} />` when loaded. If `publication` is undefined after loading, render an appropriate empty/error state.

Export from `src/features/publications/index.ts`.

---

## 4. New API Hook

**File:** `src/features/publications/api/useGetPagePublication.ts`

```ts
export default function useGetPagePublication(): {
  publication: Publication | undefined;
  isGettingPublication: boolean;
};
// const { profile: publicationName } = usePageParams();
// return useGetPublication({ publicationName });
```

---

## 5. Testing

### `PublicationsTable.test.tsx`

- Assert each label cell renders an `<a>` whose `href` contains `sidePath=view&profile=<name>`.

### `PublicationsList.test.tsx`

- Replace assertions on `setSidePanelContent`. Assert clicking a name sets URL to `?sidePath=view&profile=<name>`.

### `PublicationsListActions.test.tsx`

- Update `"opens details side panel from menu"` — assert clicking "View details" sets URL to `?sidePath=view&profile=<name>` instead of asserting a panel heading appears.

### `PublicationsPage.test.tsx`

- Panel renders when URL has `?sidePath=view&profile=<name>`.
- Panel is closed by default (no `sidePath`).
- Closing calls `createPageParamsSetter` clearing both params.

### `PublicationDetailsSidePanel.test.tsx`

- Renders `PublicationDetails` when publication is loaded.
- Renders loading state while `isGettingPublication` is true.

No new MSW handlers needed.

---

## 6. Files Summary

| File                                                                                               | Change                                           |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `src/features/publication-targets/components/PublicationsTable/PublicationsTable.tsx`              | Label column → `<Link>` Cell renderer            |
| `src/features/publications/components/PublicationsList/PublicationsList.tsx`                       | `setSidePanelContent` → `createPageParamsSetter` |
| `src/features/publications/components/PublicationsListActions/PublicationsListActions.tsx`         | `setSidePanelContent` → `createPageParamsSetter` |
| `src/features/publications/api/useGetPagePublication.ts`                                           | **New**                                          |
| `src/features/publications/components/PublicationDetailsSidePanel/PublicationDetailsSidePanel.tsx` | **New**                                          |
| `src/features/publications/index.ts`                                                               | Export `PublicationDetailsSidePanel`             |
| `src/pages/dashboard/repositories/publications/PublicationsPage.tsx`                               | Add `<SidePanel>` with `sidePath` routing        |
