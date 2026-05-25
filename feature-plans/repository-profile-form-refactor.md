# Feature Plan: `repository-profile-form-refactor`

## 1. Feature Overview

- **Objective:** Refactor `RepositoryProfileForm` to replace the current 3-tab layout (Details, Pockets, APT Sources) with 3 vertically-stacked sections (DETAILS, SOURCES, ASSOCIATION). The SOURCES section renders associated APT sources in a table and allows creating/editing sources via a nested sub-panel overlay that opens on top of the main form.
- **Location:** `src/features/repository-profiles/`
- **APT Sources API:** Uses `GET /repository/apt-source` (v2) for display. Sources are created/associated inline via the v2 profile PUT (`add_apt_sources`). Editing an existing source uses DELETE + POST (delete the old record, create the replacement via `add_apt_sources` on the next profile save).
- **Source types:** Only deb-line sources (`apt_line` + optional `gpg_key`). HTTPS and S3 are not in scope.
- **Source deletion behaviour:** Clicking delete on an existing source row tracks the ID in `removedSourceIds`. Pending (not-yet-saved) sources are removed from local state. Changes are persisted when the parent profile form is submitted.

---

## 2. API Design

### Endpoints Used

| Method   | Endpoint                      | Purpose                                             | API Version |
| -------- | ----------------------------- | --------------------------------------------------- | ----------- |
| `GET`    | `/repository/apt-source`      | List APT sources (optionally by `ids[]`)            | v2          |
| `PUT`    | `/repositoryprofiles/{name}`  | Edit profile; creates/associates sources inline     | v2          |
| `DELETE` | `/repository/apt-source/{id}` | Delete an APT source record (used during edit flow) | v2          |

### Key Backend Types

The v2 PUT profile endpoint uses `RepositoryProfileEditBody`:

```python
class GpgKeyBody(BaseModel):
    content: str          # raw GPG key material

class AptSourceBody(BaseModel):
    name: str
    line: str             # the deb line
    gpg_key: GpgKeyBody | None = None

class RepositoryProfileEditBody(BaseModel):
    title: str
    add_apt_sources: list[AptSourceBody] = []   # creates + associates new sources inline
    remove_apt_sources: list[int] = []           # disassociates existing sources by ID
    # no apt_sources: int[] field
```

**There is no PATCH endpoint for APT sources.** Editing an existing source is implemented as DELETE (the old record) + inline creation via `add_apt_sources` on the next profile PUT.

### Hook to Update

**`src/features/repository-profiles/hooks/useRepositoryProfiles.ts`** — update `EditRepositoryProfileParams` and the mutation payload:

```typescript
// Replace the current apt_sources?: number[]
interface EditRepositoryProfileParams {
  name: string;
  title?: string;
  description?: string;
  all_computers?: boolean;
  tags?: string[];
  add_apt_sources?: AptSourceBody[]; // new sources to create + associate inline
  remove_apt_sources?: number[]; // IDs of sources to disassociate
  pockets?: number[]; // kept for backward compat; backend ignores via Pydantic
}
```

Where `AptSourceBody` is a new shared type (see section 3).

### Existing Hooks Reused

- `useGetAPTSources` (v2) — list sources by IDs for display in the table
- `useRemoveAPTSource` (v2) — called immediately when a user edits an existing source (deletes the old record; the replacement is queued in `pendingNewSources` and created inline on profile save)

---

## 3. TypeScript Types

### New Types

**`src/features/apt-sources/types/AptSourceBody.d.ts`** (shared type mirroring backend)

```typescript
export interface GpgKeyBody {
  content: string; // raw GPG key material
}

export interface AptSourceBody {
  name: string;
  line: string; // the deb line (apt_line maps to this)
  gpg_key?: GpgKeyBody | null;
}
```

Export from `src/features/apt-sources/types/index.d.ts`.

**`src/features/repository-profiles/types/RepositoryProfileSourceFormValues.d.ts`**

```typescript
export interface RepositoryProfileSourceFormValues {
  name: string;
  deb_line: string; // required; maps to AptSourceBody.line on save
  gpg_key: string; // optional; maps to AptSourceBody.gpg_key.content if non-empty
}
```

### Modified Types

**`src/features/repository-profiles/hooks/useRepositoryProfiles.ts`** — `EditRepositoryProfileParams`: replace `apt_sources?: number[]` with `add_apt_sources?: AptSourceBody[]` and `remove_apt_sources?: number[]` (see section 2).

---

## 4. Component Hierarchy

### Deleted / Deprecated

| Component                              | Reason                                            |
| -------------------------------------- | ------------------------------------------------- |
| `RepositoryProfileFormTabs`            | Tabs layout removed                               |
| `RepositoryProfileFormPocketsPanel`    | Pockets out of scope                              |
| `RepositoryProfileFormAptSourcesPanel` | Replaced by `RepositoryProfileFormSourcesSection` |

> These components should remain in the codebase but stop being rendered by `RepositoryProfileForm`. A follow-up cleanup PR can delete them once this refactor is stable.

### New Components

```
src/features/repository-profiles/components/
  RepositoryProfileFormSourcesSection/
    RepositoryProfileFormSourcesSection.tsx      # Sources table + "Add source" button
    RepositoryProfileFormSourcesSection.test.tsx
    index.ts

  RepositoryProfileSourceForm/
    RepositoryProfileSourceForm.tsx              # Add/Edit source sub-panel form
    RepositoryProfileSourceForm.test.tsx
    constants.ts                                 # INITIAL_VALUES
    helpers.ts                                   # getValidationSchema()
    types.d.ts                                   # re-export RepositoryProfileSourceFormValues
    index.ts

  RepositoryProfileSourceFormOverlay/
    RepositoryProfileSourceFormOverlay.tsx       # Overlay wrapper (absolute positioning)
    index.ts
```

### Modified Components

- **`RepositoryProfileForm/RepositoryProfileForm.tsx`** — orchestrates the new layout, manages `sourceFormState` local state, conditionally renders the overlay
- **`RepositoryProfileForm/constants.ts`** — update `INITIAL_VALUES` (remove `pockets`)
- **`RepositoryProfileForm/helpers.ts`** — update `getValidationSchema` (remove `pockets`)

---

## 5. Detailed Component Specifications

### 5.1 `RepositoryProfileForm` (Modified)

**Layout (vertical sections, no tabs):**

```
<Form>
  <h4>Details</h4>
  <RepositoryProfileFormDetailsPanel ... />   {/* existing — remove AssociationBlock from it */}

  <h4>Sources</h4>
  <RepositoryProfileFormSourcesSection
    formik={formik}
    profileAptSourceIds={formik.values.apt_sources}
  />

  <h4>Association</h4>
  <AssociationBlock formik={formik} />          {/* existing, unchanged */}

  <SidePanelFormButtons ... />

  {/* Overlay — rendered on top when sourceFormState is non-null */}
  {sourceFormState && (
    <RepositoryProfileSourceFormOverlay
      state={sourceFormState}
      onClose={() => setSourceFormState(null)}
      onSourceAdded={(id) => {
        formik.setFieldValue("apt_sources", [...formik.values.apt_sources, id]);
        setSourceFormState(null);
      }}
      onSourceEdited={() => setSourceFormState(null)}
    />
  )}
</Form>
```

**Local state:**

```typescript
// tracks sources queued for creation when the profile is saved
const [pendingNewSources, setPendingNewSources] = useState<AptSourceBody[]>([]);
// tracks IDs of associated sources the user has removed from the table
const [removedSourceIds, setRemovedSourceIds] = useState<number[]>([]);
// controls visibility of the "Add source" overlay
const [showSourceOverlay, setShowSourceOverlay] = useState(false);
```

**Removed from this component:**

- `getDistributionsQuery` and `getAPTSourcesQuery` calls
- `currentTab` / `setCurrentTab` state
- `RepositoryProfileFormTabs` render
- Tab-based conditional rendering

**Updated in `handleSubmit`:**

```typescript
// Replace apt_sources: values.apt_sources with:
add_apt_sources: pendingNewSources,
remove_apt_sources: removedSourceIds,
```

**Unchanged in this component:**

- `action: "add" | "edit"` props
- `createRepositoryProfileQuery` / `editRepositoryProfileQuery` mutations
- `getAccessGroupQuery` call (still needed for Details panel)
- `useEffect` for setting edit-mode values (remove `pockets` from `formik.setValues`)

---

### 5.2 `RepositoryProfileFormSourcesSection`

**Props:**

```typescript
interface RepositoryProfileFormSourcesSectionProps {
  readonly formik: FormikContextType<RepositoryProfileFormValues>;
  readonly profileAptSourceIds: number[];
  readonly onAddSource: () => void;
  readonly onEditSource: (source: APTSource) => void;
  readonly onRemoveSource: (id: number) => void;
}
```

**Props:**

```typescript
interface RepositoryProfileFormSourcesSectionProps {
  readonly profileAptSourceIds: number[]; // from formik.values.apt_sources (edit mode)
  readonly pendingNewSources: AptSourceBody[]; // queued sources not yet persisted
  readonly onAddSource: (source: AptSourceBody) => void;
  readonly onRemoveExistingSource: (id: number) => void;
  readonly onRemovePendingSource: (name: string) => void;
  readonly onShowAddOverlay: () => void;
}
```

**Behaviour:**

- Calls `useGetAPTSources({ ids: profileAptSourceIds })` (skips when empty)
- Renders a table with two groups of rows: **existing** sources (fetched by ID) and **pending** sources (`pendingNewSources` shown with a visual indicator like a "pending" badge)
- Columns: **Source Name**, **Deb line** (truncated), **Actions**
- **Actions column**: Edit button (pencil icon) + Delete button (trash icon)
  - Edit existing source: calls `onEditSource(source)` → opens overlay in edit mode
  - Edit pending source: calls `onEditPendingSource(source.name)` → opens overlay in edit mode (no DELETE call needed; just replace in local state)
  - Delete existing source: calls `onRemoveExistingSource(source.id)`
  - Delete pending source: calls `onRemovePendingSource(source.name)`
- "Add source" button → calls `onShowAddOverlay()`
- Empty state: "No sources added yet." with "Add source" CTA

**Handlers in `RepositoryProfileForm`:**

```typescript
const handleAddSource = (source: AptSourceBody) => {
  setPendingNewSources((prev) => [...prev, source]);
  setShowSourceOverlay(false);
};

const handleRemoveExistingSource = (id: number) => {
  setRemovedSourceIds((prev) => [...prev, id]);
  formik.setFieldValue(
    "apt_sources",
    formik.values.apt_sources.filter((sourceId) => sourceId !== id),
  );
};

const handleRemovePendingSource = (name: string) => {
  setPendingNewSources((prev) => prev.filter((s) => s.name !== name));
};
```

> **Overlay notes (`RepositoryProfileSourceFormOverlay`):** Absolutely-positioned over `.p-panel__content`. Header: `"Add/Edit repository profile / Add/Edit Source"` (adjusts based on `action`). Contains `<RepositoryProfileSourceForm>` and a back/close button. Does **not** call `setSidePanelContent` — local DOM overlay only.

---

### 5.3 `RepositoryProfileSourceForm`

**Props:**

```typescript
type RepositoryProfileSourceFormProps =
  | {
      action: "add";
      onSuccess: (source: AptSourceBody) => void;
      onCancel: () => void;
    }
  | {
      action: "edit";
      source: APTSource;
      onSuccess: (replacement: AptSourceBody) => void;
      onCancel: () => void;
    };
```

In edit mode the `source` prop pre-fills the form fields. The source name field is disabled (names are immutable). On submit, `useRemoveAPTSource` is called immediately to delete the old record, then `onSuccess(replacement)` is called to queue the new body.

> The form handles both **add** and **edit** actions. In both cases no API call is made when the sub-form is submitted — the result is an `AptSourceBody` that is queued in local state. For **edit**, the old APT source is deleted immediately via `useRemoveAPTSource` when the user confirms; the replacement is queued in `pendingNewSources` and created inline when the parent profile form is saved.

**Fields:**

| Field       | Component             | Required |
| ----------- | --------------------- | -------- |
| Source name | `<Input type="text">` | Yes      |
| Deb line    | `<Input type="text">` | Yes      |
| GPG key     | `<Input type="text">` | No       |

> No `type` selector or edit mode in this iteration. The form always produces an `AptSourceBody` (`{ name, line, gpg_key? }`).

> No `access_group` field. On submit, calls `onSuccess({ name, line, gpg_key })` — no API call. The `AptSourceBody` object is accumulated in local state and sent to the backend only when the parent profile form is saved. No `try/catch` needed in this form.

**`constants.ts`:**

```typescript
export const INITIAL_VALUES: RepositoryProfileSourceFormValues = {
  name: "",
  deb_line: "",
  gpg_key: "",
};
```

**`helpers.ts` — `getValidationSchema()`:**

```typescript
Yup.object().shape({
  name: Yup.string()
    .required("This field is required.")
    .matches(
      /^[a-z0-9][a-z0-9+.-]*$/,
      "Name must start with alphanumeric and contain only lowercase letters, numbers, -, or +.",
    ),
  deb_line: Yup.string().required("This field is required."),
  gpg_key: Yup.string(),
});
```

---

## 6. Testing Plan

### 6.1 Unit Tests

#### `RepositoryProfileForm.test.tsx` (Modified)

- **Remove** tests for tab switching, pocket tab content, APT sources tab content
- **Add:**
  - Renders Details, Sources, and Association sections (no tabs present)
  - Title field is required in add mode
  - `pockets` field is not present in submitted payload
  - Clicking "Add source" renders the source overlay
  - Clicking edit on a source row renders the overlay with pre-filled values
  - Clicking delete on a source row removes it from the sources table
  - On successful add-source, the new source ID is reflected in the sources table

#### `RepositoryProfileFormSourcesSection.test.tsx` (New)

- Renders empty state when no sources are associated
- Renders table rows for each pre-loaded APT source (Source name + type columns)
- "Add source" button calls `onAddSource`
- Edit button on a row calls `onEditSource` with the correct `APTSource` object
- Delete button on a row calls `onRemoveSource` with the correct source ID

#### `RepositoryProfileSourceForm.test.tsx` (New)

- Renders source name and deb_line fields
- Shows required validation errors for empty name and deb_line on submit
- Calls `onSuccess` with correct `AptSourceBody` after valid submit (name, line, gpg_key)
- Does **not** call any API on submit (deferred creation)
- Calls `onCancel` when cancel button is clicked

### 6.2 MSW Handlers

**Existing handlers to confirm present:**

- `GET /repository/apt-source` — should already exist in apt-sources handlers
- `PUT /repositoryprofiles/:name` — should already exist in repository-profiles handlers; verify it handles `add_apt_sources`/`remove_apt_sources` in the mock response

No new handlers required for this iteration (PATCH endpoint does not exist yet).

### 6.3 Mock Data

**`src/tests/mocks/aptSources.ts`** (verify or extend):

- At least 2-3 mock `APTSource` objects with `id`, `name`, `line`, `access_group`, `gpg_key`, `profiles[]`
- Ensure IDs match the `apt_sources` arrays in `src/tests/mocks/repositoryProfiles.ts`

---

## 7. Implementation Order

1. **`AptSourceBody` type** — add to `src/features/apt-sources/types/`; export from types index
2. **Update `EditRepositoryProfileParams`** — replace `apt_sources` with `add_apt_sources`/`remove_apt_sources` in `useRepositoryProfiles.ts`
3. **`RepositoryProfileSourceForm`** — new form component + constants + helpers + types (add-only, no API call on submit)
4. **`RepositoryProfileSourceFormOverlay`** — overlay wrapper (add-only header)
5. **`RepositoryProfileFormSourcesSection`** — sources table (existing + pending rows, delete only)
6. **`RepositoryProfileForm` modifications** — remove tabs/pockets, wire up 3 sections, local state for pending/removed sources
7. **`RepositoryProfileFormDetailsPanel`** — remove `<AssociationBlock>` (moved to main form)
8. **`RepositoryProfileForm/constants.ts` + `helpers.ts`** — remove `pockets` from `INITIAL_VALUES` and validation schema
9. **Tests** — update `RepositoryProfileForm.test.tsx`; add new test files

---

## 8. Resolved Decisions

| #   | Question                  | Resolution                                                                                                                                                                                    |
| --- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Pockets removal           | Confirmed. Remove pockets from form; keep components in codebase for future cleanup PR.                                                                                                       |
| 2   | Access group per source   | No per-source access group. Field omitted from source form entirely.                                                                                                                          |
| 3   | Delete behaviour          | Disassociation only — matches previous behaviour. APT source record is not deleted via API.                                                                                                   |
| 4   | Edit source flow          | No PATCH endpoint. Edit = DELETE old APT source record immediately + queue replacement `AptSourceBody` in `pendingNewSources`; created inline on profile save.                                |
| 5   | HTTPS / S3 source types   | **Out of scope and not documented.** Only deb-line sources are supported.                                                                                                                     |
| 6   | AssociationBlock location | Move out of `RepositoryProfileFormDetailsPanel`; render as a separate `<h4>Association</h4>` section directly in `RepositoryProfileForm`. Modify DetailsPanel to remove `<AssociationBlock>`. |
| 7   | GPG key field             | Free-text `<Input type="text">` (not a `<Select>`). No API call needed.                                                                                                                       |
| 8   | Type selector             | Removed. Only deb-line sources are supported. No `<Select>` type field is needed.                                                                                                             |
| 9   | Pockets in submit payload | Keep `pockets: []` in the submitted payload for backward compatibility. Remove only from the form UI and `INITIAL_VALUES`.                                                                    |
