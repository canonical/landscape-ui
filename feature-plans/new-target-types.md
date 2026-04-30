# Feature Plan: new-target-types

## 1. Feature Overview

- **Objective:** Extend the publication targets UI to support Swift (OpenStack) and Filesystem target types alongside the existing S3 type. Users will select a target type in the Add form, see type-specific fields indented below the selector, and the Edit/Details views will render the appropriate fields for each type.
- **Location:** `src/features/publication-targets/`

---

## 2. API Design

All endpoints are already defined in the proto and reflected in `@canonical/landscape-openapi`. No new hooks are needed — only type extensions.

### Endpoints (no change)

| Method   | URL                          | Usage                  |
| -------- | ---------------------------- | ---------------------- |
| `POST`   | `/v1/publicationTargets`     | Create any target type |
| `PATCH`  | `/v1/publicationTargets/:id` | Edit any target type   |
| `GET`    | `/v1/publicationTargets`     | List all targets       |
| `DELETE` | `/v1/publicationTargets/:id` | Remove a target        |

### Hook Signature Changes

#### `useCreatePublicationTarget` (`src/features/publication-targets/api/useCreatePublicationTarget.ts`)

Extend `CreatePublicationTargetParams` to include `filesystem`:

```typescript
import type { FilesystemTarget } from "@canonical/landscape-openapi";

interface CreatePublicationTargetParams {
  displayName: string;
  s3?: Partial<S3Target>;
  swift?: Partial<SwiftTarget>;
  filesystem?: Partial<FilesystemTarget>;
}
```

#### `useEditPublicationTarget` (`src/features/publication-targets/api/useEditPublicationTarget.ts`)

Extend `EditPublicationTargetParams` identically:

```typescript
interface EditPublicationTargetParams {
  name?: string;
  displayName: string;
  s3?: Partial<S3Target>;
  swift?: Partial<SwiftTarget>;
  filesystem?: Partial<FilesystemTarget>;
}
```

### Type Definitions to Add

Create `src/features/publication-targets/types/index.ts` additions (or update the existing re-export in `index.ts`):

```typescript
// Add to the re-export block in src/features/publication-targets/index.ts
export type {
  FilesystemTarget,
  FilesystemTargetLinkMethod,
} from "@canonical/landscape-openapi";
export { FilesystemTargetLinkMethod } from "@canonical/landscape-openapi";
```

---

## 3. Component Hierarchy

### New shared sub-components

Extract type-specific field groups into a shared folder, reused by both the Add and Edit forms:

```
src/features/publication-targets/components/TargetTypeFields/
  S3Fields.tsx             # All S3 inputs (required + optional, no type logic)
  SwiftFields.tsx          # All Swift inputs (required + optional)
  FilesystemFields.tsx     # Path input + LinkMethod select
  index.ts
```

Each `*Fields` component receives the Formik `form` instance (typed appropriately) and renders inputs inside a styled indent wrapper (see §4).

### Modified components

#### `AddPublicationTargetForm/AddPublicationTargetForm.tsx`

- Add a `Select` for `targetType` at the top of the form (values: `"s3" | "swift" | "filesystem"`)
- Render the matching `*Fields` sub-component conditionally below the selector
- Reset type-specific fields when `targetType` changes (use `formik.setValues`)
- Only the active type's fields are submitted (other type objects omitted from payload)

#### `EditTargetForm/EditTargetForm.tsx`

- Detect the active type by checking `target.s3 ?? target.swift ?? target.filesystem`
- Display the type as a `ReadOnlyField` (type cannot change on edit)
- Render the matching `*Fields` sub-component pre-populated with existing values
- **INPUT_ONLY fields** (`awsAccessKeyId`, `awsSecretAccessKey` for S3; `username`, `password` for Swift): include in the form but **do not pre-populate** — leave blank so the user must re-enter credentials explicitly. Add helper text (e.g. "Leave blank to keep current value") via the `Input` `help` prop. On submit, omit blank INPUT_ONLY credential fields from the PATCH payload so existing stored values are preserved unless the user enters replacements.

#### `TargetDetails/TargetDetails.tsx`

- Add `swiftFields` and `filesystemFields` blocks analogous to `s3Fields`
- Render the relevant block inside the existing `InfoGrid`

### Unchanged components

- `PublicationTargetContainer`, `PublicationTargetAddButton`, `PublicationTargetList`, `PublicationsTable`, `RemoveTargetForm` — no changes required

---

## 4. State & Logic

### `AddPublicationTargetForm/constants.ts`

#### `TargetType` union (new)

```typescript
export type TargetType = "s3" | "swift" | "filesystem";
```

#### Expanded `AddPublicationTargetFormValues`

```typescript
export interface AddPublicationTargetFormValues {
  // Common
  displayName: string;
  targetType: TargetType;

  // S3
  region: string;
  bucket: string;
  endpoint: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  prefix: string;
  acl: string;
  storageClass: string;
  encryptionMethod: string;
  plusWorkaround: boolean;
  disableMultiDel: boolean;
  forceSigV2: boolean;

  // Swift
  container: string;
  swiftUsername: string;
  swiftPassword: string;
  swiftPrefix: string;
  authUrl: string;
  tenant: string;
  tenantId: string;
  domain: string;
  domainId: string;
  tenantDomain: string;
  tenantDomainId: string;

  // Filesystem
  path: string;
  linkMethod: FilesystemTargetLinkMethod | "";
}
```

> Note: Swift credential fields use `swiftUsername`/`swiftPassword` to avoid collision with any future shared field; map to `username`/`password` in the submit payload.

#### Updated `INITIAL_VALUES`

All string fields default to `""`, all booleans to `false`, `targetType` defaults to `"s3"`, `linkMethod` defaults to `""` (rendered as unset in the select).

#### Validation schema — type-conditional rules

Use `Yup.object().shape` with `when` conditions:

```typescript
// Sketch only — no executable code
displayName: Yup.string().required("This field is required"),
targetType: Yup.string().oneOf(["s3", "swift", "filesystem"]).required(),

// S3 required fields: region, bucket, awsAccessKeyId, awsSecretAccessKey
//   each uses .when("targetType", { is: "s3", then: (s) => s.required(...) })

// Swift required fields: container, swiftUsername, swiftPassword, authUrl
//   each uses .when("targetType", { is: "swift", then: (s) => s.required(...) })

// Filesystem required fields: path
//   uses .when("targetType", { is: "filesystem", then: (s) => s.required(...) })
```

### Indent wrapper

Vanilla Framework does not have a built-in left-border indent component. Use a minimal SCSS module:

```
src/features/publication-targets/components/TargetTypeFields/TargetTypeFields.module.scss
```

```scss
// Suggested rule only
.typeFieldsIndent {
  border-left: 3px solid var(--vf-color-border-default, #cdcdcd);
  padding-left: 1rem;
  margin-top: 0.5rem;
}
```

Apply as `<div className={styles.typeFieldsIndent}>` wrapping each `*Fields` component inside the form.

### Global Context

No new context needed.

---

## 5. Testing Plan

### MSW Handler updates (`src/tests/server/handlers/publicationTargets.ts`)

- **PATCH handler**: extend the merge logic to include `filesystem`:
  ```typescript
  ...(body.filesystem ? { filesystem: { ...existing.filesystem, ...body.filesystem } } : {}),
  ```
- No other handler changes needed — the POST handler already spreads `body` generically.

### Mock data (`src/tests/mocks/publicationTargets.ts`)

Add a Filesystem mock entry:

```typescript
{
  name: "publicationTargets/dddddddd-0000-0000-0000-000000000004",
  publicationTargetId: "dddddddd-0000-0000-0000-000000000004",
  displayName: "local-fs-archive",
  filesystem: {
    path: "/srv/landscape/archives",
    linkMethod: "HARDLINK",
  },
}
```

The existing Swift mock (`cccccccc...`) already covers the Swift type.

### Unit/integration tests

#### `AddPublicationTargetForm.test.tsx`

Key scenarios to cover:

- Renders a type selector with options "S3", "Swift", "Filesystem"
- Default selection is S3; S3 fields are visible
- Switching to Swift: S3 fields disappear, Swift fields appear (container, username, password, authUrl visible)
- Switching to Filesystem: Swift fields disappear, path and linkMethod fields appear
- S3 required-field validation fires only when `targetType === "s3"`
- Swift required-field validation fires only when `targetType === "swift"`
- Filesystem required-field validation fires only when `targetType === "filesystem"`
- Successful S3 submit calls `mutateAsync` with correct `s3` payload and no `swift`/`filesystem` keys
- Successful Swift submit calls `mutateAsync` with correct `swift` payload
- Successful Filesystem submit calls `mutateAsync` with correct `filesystem` payload (including `linkMethod`)

#### `EditTargetForm.test.tsx`

Key additions (existing S3 tests remain unchanged):

- Swift target: type field rendered as read-only "Swift"
- Swift target: container, authUrl pre-populated; username/password fields present but empty
- Filesystem target: type field rendered as read-only "Filesystem"; path pre-populated
- Filesystem target: linkMethod select pre-populated from mock

#### `TargetDetails.test.tsx`

- Swift target: "Container", "Auth URL", "Tenant" info grid items present
- Filesystem target: "Path", "Link Method" info grid items present

---

## 6. File Change Summary

| File                                                                                                | Action                                                                       |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/features/publication-targets/api/useCreatePublicationTarget.ts`                                | Add `filesystem` to params interface                                         |
| `src/features/publication-targets/api/useEditPublicationTarget.ts`                                  | Add `filesystem` to params interface                                         |
| `src/features/publication-targets/index.ts`                                                         | Re-export `FilesystemTarget`, `FilesystemTargetLinkMethod`                   |
| `src/features/publication-targets/components/AddPublicationTargetForm/constants.ts`                 | Expand `AddPublicationTargetFormValues` + `INITIAL_VALUES`; add `TargetType` |
| `src/features/publication-targets/components/AddPublicationTargetForm/AddPublicationTargetForm.tsx` | Add type selector + conditional field sections                               |
| `src/features/publication-targets/components/EditTargetForm/EditTargetForm.tsx`                     | Detect type, render per-type fields section                                  |
| `src/features/publication-targets/components/TargetDetails/TargetDetails.tsx`                       | Add Swift and Filesystem info blocks                                         |
| `src/features/publication-targets/components/TargetTypeFields/S3Fields.tsx`                         | **New** — extracted S3 field group                                           |
| `src/features/publication-targets/components/TargetTypeFields/SwiftFields.tsx`                      | **New** — Swift field group                                                  |
| `src/features/publication-targets/components/TargetTypeFields/FilesystemFields.tsx`                 | **New** — Filesystem field group                                             |
| `src/features/publication-targets/components/TargetTypeFields/TargetTypeFields.module.scss`         | **New** — indent border style                                                |
| `src/features/publication-targets/components/TargetTypeFields/index.ts`                             | **New** — barrel export                                                      |
| `src/tests/mocks/publicationTargets.ts`                                                             | Add Filesystem mock entry                                                    |
| `src/tests/server/handlers/publicationTargets.ts`                                                   | Extend PATCH merge for `filesystem`                                          |

---

## 7. Open Questions / Deferred Items

1. **INPUT_ONLY on Edit (credentials):** `awsSecretAccessKey`, `awsAccessKeyId` (S3) and `username`, `password` (Swift) are `INPUT_ONLY` — the server never returns them. The edit form should therefore show these fields blank with helper text such as "Enter a new value to update", and blank values are already omitted from the PATCH payload so the server keeps the existing secret. The remaining open question is backend PATCH semantics for any future explicit "clear/reset secret" behavior, since omission currently means "leave unchanged".

2. **`plusWorkaround` and `debug` (S3):** These S3 boolean fields exist in the proto but are absent from the current Add form. They can be added alongside the other optional booleans with no architectural impact — include or defer per team preference.

3. **Type switching on Edit:** The current plan renders type as `ReadOnlyField`. If the team later wants to allow changing target type on edit, that would require a re-design of the Edit form and is out of scope here.
