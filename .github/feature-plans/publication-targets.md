# Implementation Plan: `publication-targets`

## 1. Feature Overview

- **Objective:** Add a Publication Targets page nested under the Repositories section, enabling users to list, create, edit, and delete publication targets (S3 or Swift storage destinations). Routes to `/repositories/publication-targets` using the existing `REPOSITORIES_ROUTES.publicationTargets` route.
- **Location:** `src/features/publication-targets/`

> **Note:** The `PublicationTargetsPage` component stub already exists at  
> `src/pages/dashboard/repositories/publication-targets/PublicationTargetsPage.tsx`  
> and is already wired into routing and navigation. It currently renders a copy-pasted APT sources page and must be replaced.

---

## 2. API Design

The backend is a Connect-RPC (gRPC-JSON transcoding) service. All calls go through the v2 API base URL (`VITE_API_URL` → `/api/v2/`). Endpoint paths follow the resource name pattern `publicationTargets/{id}`.

### Endpoints

Proto HTTP transcoding (`body: "publication_target"`) means POST and PATCH bodies are the `PublicationTarget` message directly — **not** nested under a wrapper key.

| Method | Path | Body | Purpose |
|---|---|---|---|
| `GET` | `publicationTargets` | — | List all publication targets |
| `POST` | `publicationTargets` | `PublicationTarget` fields (flat) | Create a new publication target |
| `GET` | `publicationTargets/{id}` | — | Get a single publication target |
| `PATCH` | `publicationTargets/{id}` | `PublicationTarget` fields + `name` (flat) | Update a publication target |
| `DELETE` | `publicationTargets/{id}` | — | Delete a publication target |

`{id}` is the UUID segment of the resource `name` (e.g. `name = "publicationTargets/uuid"` → path `publicationTargets/uuid`).

### TypeScript Interfaces (to be placed in `src/features/publication-targets/types/`)

```ts
// PublicationTarget.d.ts

export interface S3Target {
  region: string;
  bucket: string;
  endpoint?: string;
  aws_access_key_id: string;
  aws_secret_access_key: string;
  prefix?: string;
  acl?: string;
  storage_class?: string;
  encryption_method?: string;
  plus_workaround?: boolean;
  disable_multi_del?: boolean;
  force_sig_v2?: boolean;
  debug?: boolean;
}

export interface SwiftTarget {
  container: string;
  username: string;
  password: string;
  prefix?: string;
  auth_url?: string;        // not server-validated as required (proto buf validate only checks container/username/password)
  tenant?: string;
  tenant_id?: string;
  domain?: string;
  domain_id?: string;
  tenant_domain?: string;
  tenant_domain_id?: string;
}

export interface PublicationTarget {
  name: string;                      // e.g. "publicationTargets/{uuid}"
  publication_target_id: string;     // UUID
  display_name: string;
  s3?: S3Target;
  swift?: SwiftTarget;
}
```

```ts
// index.d.ts
export type { PublicationTarget, S3Target, SwiftTarget } from "./PublicationTarget";
```

### Hooks to Create (`src/features/publication-targets/hooks/`)

#### `useGetPublicationTargets` (`useGetPublicationTargets.ts`)

```ts
// Returns:
{
  publicationTargets: PublicationTarget[];
  isPublicationTargetsLoading: boolean;
}
// queryKey: ["publicationTargets"]
// queryFn: authFetch.get("publicationTargets")
// Response shape: { publication_targets: PublicationTarget[] }
```

#### `useCreatePublicationTarget` (`useCreatePublicationTarget.ts`)

```ts
// Mutation params (body sent flat — proto body: "publication_target" transcoding):
{
  display_name: string;
  s3?: S3Target;    // exactly one of s3 / swift must be set
  swift?: SwiftTarget;
}
// POST publicationTargets
// On success: invalidate ["publicationTargets"]
```

#### `useUpdatePublicationTarget` (`useUpdatePublicationTarget.ts`)

```ts
// Mutation params (body sent flat — proto body: "publication_target" transcoding):
{
  name: string;          // full resource name: "publicationTargets/{uuid}"
  display_name?: string;
  s3?: S3Target;
  swift?: SwiftTarget;
  update_mask?: string;  // optional field mask e.g. "display_name,s3"
}
// PATCH publicationTargets/{uuid}  (uuid extracted from name)
// Axios call: authFetch.patch(name, { name, display_name?, s3?, swift?, update_mask? })
// On success: invalidate ["publicationTargets"]
```

#### `useDeletePublicationTarget` (`useDeletePublicationTarget.ts`)

```ts
// Mutation params:
{ name: string }  // full resource name: "publicationTargets/{uuid}"
// DELETE publicationTargets/{uuid}  (Axios: authFetch.delete(name))
// On success: invalidate ["publicationTargets"]
```

#### `useGetPublications` (`useGetPublications.ts`)

```ts
// Used by RemovePublicationTargetModal to display which publications reference a target.
// Returns:
{
  publications: Publication[];
  isPublicationsLoading: boolean;
}
// queryKey: ["publications"]
// queryFn: authFetch.get("publications")
// Response shape: { publications: Publication[] }
// Filter client-side: publications.filter(p => p.publication_target === target.name)
```

All hooks use `useFetch` (v2 API). The hook index at `src/features/publication-targets/hooks/index.ts` re-exports all hooks.

### Pagination Strategy

Follow the mirrors pattern: **fetch all items in a single request** (no offset/cursor pagination). The `ListPublicationTargetsRequest` proto supports `page_size` / `page_token` but publication targets are a small, bounded dataset. Do not wire up `usePageParams` for this feature.

---

## 3. Component Hierarchy

```
src/features/publication-targets/
├── hooks/
│   ├── index.ts
│   ├── useGetPublicationTargets.ts
│   ├── useGetPublications.ts                    # Used by RemovePublicationTargetModal; may be replaced by a shared publications hook later
│   ├── useCreatePublicationTarget.ts
│   ├── useUpdatePublicationTarget.ts
│   └── useDeletePublicationTarget.ts
├── components/
│   ├── PublicationTargetList/
│   │   └── PublicationTargetList.tsx            # ResponsiveTable; columns: display_name, type, publications count, actions
│   ├── PublicationTargetListActions/
│   │   └── PublicationTargetListActions.tsx     # ContextualMenu (3-dot) — items: View details, Edit, Remove
│   ├── PublicationTargetDetailsModal/
│   │   └── PublicationTargetDetailsModal.tsx    # Read-only modal showing all fields for a target (S3 or Swift)
│   ├── RemovePublicationTargetModal/
│   │   └── RemovePublicationTargetModal.tsx     # Confirmation modal: "Remove [name]" + publications currently using target
│   ├── NewPublicationTargetForm/
│   │   ├── NewPublicationTargetForm.tsx         # Formik form; target type selector (S3/Swift/file system) switches sub-fields
│   │   ├── S3Fields.tsx                         # Input group for S3Target fields
│   │   ├── SwiftFields.tsx                      # Input group for SwiftTarget fields
│   │   └── constants.ts                         # INITIAL_VALUES, VALIDATION_SCHEMA
│   ├── EditPublicationTargetForm/
│   │   ├── EditPublicationTargetForm.tsx        # Same sub-field layout; target type shown read-only (locked after creation)
│   │   └── constants.ts                         # VALIDATION_SCHEMA for edit
│   └── PublicationTargetAddButton/
│       └── PublicationTargetAddButton.tsx       # Button that opens side panel with NewPublicationTargetForm
├── types/
│   ├── PublicationTarget.d.ts
│   ├── FormTypes.d.ts                           # NewPublicationTargetFormValues, EditPublicationTargetFormValues
│   └── index.d.ts
├── constants.ts                                 # TARGET_TYPE_OPTIONS, TARGET_TYPE_LABELS
└── index.ts                                     # Public barrel exports
```

### Table Columns

| Column | Source | Notes |
|---|---|---|
| Name | `display_name` | Plain text |
| Type | derived from presence of `s3` / `swift` key | Rendered via `TARGET_TYPE_LABELS` — `"S3"`, `"Swift"`, or `"File system"` |
| Publications | count of `publications` whose `publication_target === target.name` | e.g. `"2 publications"`; data from `useGetPublications` |
| Actions | `PublicationTargetListActions` | `ContextualMenu` from `@canonical/react-components` — 3-dot trigger |

> **Note:** `"File system"` is a future type. The current proto only defines `s3` and `swift` in the `target` oneof. Add a `filesystem` placeholder to `TARGET_TYPE_OPTIONS` but do not render `FileSystemFields` until the proto is extended.

### Actions Menu Items

- **View details** — opens `PublicationTargetDetailsModal` (full field dump, read-only)
- **Edit** — opens side panel with `EditPublicationTargetForm` (pre-populated; target type shown as `<Select disabled>`, not interactive)
- **Remove** — opens `RemovePublicationTargetModal`

### `RemovePublicationTargetModal` Behaviour

- Title: `Remove [display_name]`
- Body: `"This publication target is currently being used by the following publications:"` followed by an inline list of publication names (filtered from `useGetPublications` by `publication_target === target.name`). If no publications use the target, show a simple confirmation with no list.
- Confirm button calls `useDeletePublicationTarget`, then closes the modal.
- Use the existing modal pattern from `src/components/ui/` (check for a shared `ConfirmationModal` or `Modal` wrapper before creating a new one).

### Page Entry Point

`src/pages/dashboard/repositories/publication-targets/PublicationTargetsPage.tsx`  
(already exists; **replace its current body** with the proper implementation using feature components)

- Uses `useGetPublicationTargets()` for data.
- Renders `PageMain > PageHeader > PageContent`.
- `PageHeader` has title `"Publication targets"` and an `Add publication target` button.
- Shows `LoadingState` while loading, `EmptyState` when no items, otherwise `PublicationTargetList`.
- Side panel opened via `useSidePanel()` renders `NewPublicationTargetForm` (lazy-loaded).
- `PublicationTargetDetailsModal` and `RemovePublicationTargetModal` are rendered inline in the page, each controlled by local `useState<PublicationTarget | null>` (one state variable per modal).

---

## 4. State & Logic

### Forms

All forms use Formik + Yup. Define in each form's `constants.ts`:

#### `NewPublicationTargetForm` — `INITIAL_VALUES`

```ts
{
  display_name: "",
  target_type: "s3" as "s3" | "swift" | "filesystem",  // selector drives which sub-fields render; filesystem is a placeholder
  s3: {
    region: "",
    bucket: "",
    endpoint: "",
    aws_access_key_id: "",
    aws_secret_access_key: "",
    prefix: "",
    acl: "",
    storage_class: "",
    encryption_method: "",
    plus_workaround: false,
    disable_multi_del: false,
    force_sig_v2: false,
    debug: false,
  },
  swift: {
    container: "",
    username: "",
    password: "",
    prefix: "",
    auth_url: "",
    tenant: "",
    tenant_id: "",
    domain: "",
    domain_id: "",
    tenant_domain: "",
    tenant_domain_id: "",
  },
}
```

#### `NewPublicationTargetForm` — `VALIDATION_SCHEMA` (Yup)

```ts
// display_name: required string
// When target_type === "s3":  s3.region required, s3.bucket required, s3.aws_access_key_id required, s3.aws_secret_access_key required
//   (mirrors proto buf validate: region/bucket/aws_access_key_id/aws_secret_access_key)
// When target_type === "swift": swift.container required, swift.username required, swift.password required
//   (auth_url is NOT proto-validated as required — omit from required rules)
// Use Yup.when() for conditional validation
```

#### `EditPublicationTargetForm` — `INITIAL_VALUES`

Pre-populated from the selected `PublicationTarget` object. The `target_type` is derived from whether `s3` or `swift` field is present and rendered as a **`<Select disabled>`** — changing target type after creation is not supported.

### Global Context

No new context needed. Default: **No**.

### Side Panel

Use `useSidePanel()` to open `NewPublicationTargetForm` and `EditPublicationTargetForm` in the application's existing side panel. Close via `closeSidePanel()` on successful mutation.

---

## 5. Testing Plan

### Unit Tests (`*.test.tsx` alongside source)

| File | What to test |
|---|---|
| `hooks/useGetPublicationTargets.test.ts` | Returns `publicationTargets` array and `isPublicationTargetsLoading`; handles empty list |
| `hooks/useGetPublications.test.ts` | Returns `publications` array; client-side filter by `publication_target` name works |
| `hooks/useCreatePublicationTarget.test.ts` | Calls `POST publicationTargets`; invalidates query key on success |
| `hooks/useUpdatePublicationTarget.test.ts` | Calls `PATCH publicationTargets/{name}`; invalidates query key on success |
| `hooks/useDeletePublicationTarget.test.ts` | Calls `DELETE publicationTargets/{name}`; invalidates query key on success |
| `components/PublicationTargetList/PublicationTargetList.test.tsx` | Renders correct columns (name, type label, publications count); opens 3-dot menu |
| `components/PublicationTargetListActions/PublicationTargetListActions.test.tsx` | View details / Edit / Remove items each fire the correct callback |
| `components/PublicationTargetDetailsModal/PublicationTargetDetailsModal.test.tsx` | Renders all fields for an S3 target; renders all fields for a Swift target |
| `components/RemovePublicationTargetModal/RemovePublicationTargetModal.test.tsx` | Shows publication list when target is in use; shows plain confirm when unused; calls delete on confirm |
| `components/NewPublicationTargetForm/NewPublicationTargetForm.test.tsx` | Shows S3 fields by default; switches to Swift fields; validates required proto fields; submits correctly |
| `components/EditPublicationTargetForm/EditPublicationTargetForm.test.tsx` | Pre-populates from existing target; target type selector is disabled; submits PATCH on save |
| `PublicationTargetsPage.test.tsx` | Loading state; empty state; list rendered; add button opens side panel; details modal opens; remove modal opens |

### MSW Handlers (`src/tests/mocks/`)

Create `publicationTargets.ts` and `publications.ts` (if not already present) and register them in the handler index:

```ts
// GET /api/v2/publicationTargets
http.get(`${API_URL}publicationTargets`, () =>
  HttpResponse.json({
    publication_targets: [
      {
        name: "publicationTargets/00000000-0000-0000-0000-000000000001",
        publication_target_id: "00000000-0000-0000-0000-000000000001",
        display_name: "My S3 Bucket",
        s3: {
          region: "us-east-1",
          bucket: "my-bucket",
          aws_access_key_id: "AKIA...",
          aws_secret_access_key: "secret",
        },
      },
    ],
  }),
);

// POST /api/v2/publicationTargets
http.post(`${API_URL}publicationTargets`, () =>
  HttpResponse.json({ name: "publicationTargets/new-uuid", publication_target_id: "new-uuid", display_name: "New Target" }, { status: 201 }),
);

// PATCH /api/v2/publicationTargets/:id  (body is flat PublicationTarget fields)
http.patch(`${API_URL}publicationTargets/:id`, () =>
  HttpResponse.json({ name: "publicationTargets/some-uuid", publication_target_id: "some-uuid", display_name: "Updated Target" }),
);

// DELETE /api/v2/publicationTargets/:id  (:id is the UUID, matching resource name "publicationTargets/{id}")
http.delete(`${API_URL}publicationTargets/:id`, () =>
  new HttpResponse(null, { status: 200 }),
);

// GET /api/v2/publications  (used by RemovePublicationTargetModal)
http.get(`${API_URL}publications`, () =>
  HttpResponse.json({
    publications: [
      {
        name: "publications/00000000-0000-0000-0000-000000000010",
        publication_id: "00000000-0000-0000-0000-000000000010",
        display_name: "My Publication",
        publication_target: "publicationTargets/00000000-0000-0000-0000-000000000001",
        mirror: "mirrors/some-mirror",
      },
    ],
  }),
);
```

---

## 6. Routing & Navigation (Already Wired)

The following are already in place and **must not be changed**:

- Route path: `REPOSITORIES_PATHS.publicationTargets = "publication-targets"` in `src/libs/routes/repositories.ts`
- Route entry: `REPOSITORIES_ROUTES.publicationTargets` (same file)
- Lazy page load: `PublicationTargetsPage` in `src/routes/elements.tsx` (line 95–96)
- Dashboard route: `src/routes/DashboardRoutes.tsx` (lines 102–103)
- Navigation link: `src/templates/dashboard/Navigation/constants.ts` (line 30)

---

## 7. `constants.ts` Reference

```ts
export const TARGET_TYPE_OPTIONS = [
  { label: "S3", value: "s3" },
  { label: "Swift", value: "swift" },
  { label: "File system", value: "filesystem" }, // placeholder — not yet in proto
] as const;

export const TARGET_TYPE_LABELS: Record<string, string> = {
  s3: "S3",
  swift: "Swift",
  filesystem: "File system",
};
```

---

## 8. Implementation Order

1. Define types in `src/features/publication-targets/types/`
2. Implement `useGetPublicationTargets` + `useGetPublications` hooks
3. Implement remaining mutation hooks (`useCreatePublicationTarget`, `useUpdatePublicationTarget`, `useDeletePublicationTarget`)
4. Implement `PublicationTargetList` + `PublicationTargetListActions` (3-dot `ContextualMenu`)
5. Implement `PublicationTargetDetailsModal`
6. Implement `RemovePublicationTargetModal`
7. Implement `NewPublicationTargetForm` (with `S3Fields`, `SwiftFields`, `constants.ts`)
8. Implement `EditPublicationTargetForm` (locked target type)
9. Implement `PublicationTargetAddButton`
10. Create `src/features/publication-targets/index.ts` barrel
11. Replace body of `PublicationTargetsPage.tsx`
12. Add MSW handlers + write unit tests
