# Repository Profiles — Test Coverage Follow-ups

Outstanding test coverage tasks deferred from the initial high-priority pass.
Pick them up in any order; each item is self-contained.

---

## High Priority — Broken test

### `RepositoryProfileList` — "clicking a profile title opens the profile details side panel"

**File:** `src/features/repository-profiles/components/RepositoryProfileList/RepositoryProfileList.test.tsx`

**Root cause:** Clicking a profile title mounts `RepositoryProfileDetails`, which renders `AssociatedCountCell`. That cell calls `useGetProfileInstancesCount`, which fires `GET computers?query=profile:repository:<id>`. The MSW `computers` handler in `src/tests/server/handlers/instance.ts` does not recognise this query string and throws an unhandled-request error, causing the test to fail.

**Fix required (handler change):**

In `src/tests/server/handlers/instance.ts`, extend the `GET computers` handler to accept a `query` param containing `"profile:repository:"` and return a normal paginated response, e.g.:

```ts
if (query?.includes("profile:repository:")) {
  return HttpResponse.json(generatePaginatedResponse([]));
}
```

**Test to add/fix** (already exists in the file):

```tsx
it("clicking a profile title opens the profile details side panel", async () => {
  const user = userEvent.setup();
  renderWithProviders(
    <RepositoryProfileList repositoryProfiles={repositoryProfiles} />,
  );

  await user.click(
    screen.getByRole("button", { name: repositoryProfiles[0].title }),
  );

  expect(
    await screen.findByRole("heading", { name: repositoryProfiles[0].title }),
  ).toBeInTheDocument();
});
```

---

## Medium Priority

### `RepositoryProfileList` — `AssociatedCountCell` resolves count

**File:** `src/features/repository-profiles/components/RepositoryProfileList/RepositoryProfileList.test.tsx`

**Depends on:** `computers` handler fix above.

**Test to add:**

Assert that after the `useGetProfileInstancesCount` query resolves, each row shows the correct `applied_count` number in the Associated column. Currently `applied_count` from the mock data is rendered synchronously; verify the hook-resolved count also renders (or supersedes) it.

---

### `RepositoryProfileListActions` — remove modal closes after confirmation

**File:** `src/features/repository-profiles/components/RepositoryProfileListActions/RepositoryProfileListActions.test.tsx`

**Test to add** (extend existing `openRemoveModal` helper):

```tsx
it("closes the remove modal after successful confirmation", async () => {
  renderWithProviders(
    <RepositoryProfileListActions profile={repositoryProfiles[0]} />,
  );
  await openRemoveModal(user);

  await user.type(screen.getByRole("textbox"), repositoryProfiles[0].name);
  await user.click(screen.getByRole("button", { name: /Remove/i }));

  await waitFor(() =>
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
  );
});
```

---

### `RepositoryProfileForm` — edit mutation diff logic

**File:** `src/features/repository-profiles/components/RepositoryProfileForm/RepositoryProfileForm.test.tsx`

**What to test:** When editing a profile and removing an existing apt source, `editRepositoryProfileQuery` is called with the removed source's id in `remove_apt_sources` and the value absent from `add_apt_sources`. Mirror the inverse for new (id=0) sources appearing in `add_apt_sources`.

**Approach:** Use `vi.spyOn` or wrap the MSW PUT handler to capture the request body, then assert its shape.

---

## Low Priority — Accessibility

All items below add `aria-*` assertions to existing test files; no new files are needed.

### `RepositoryProfileList` — column cell aria-labels

**File:** `src/features/repository-profiles/components/RepositoryProfileList/RepositoryProfileList.test.tsx`

Assert that the title link/button, access group cell, and associated count cell carry accessible labels that screen readers can announce clearly.

---

### `RepositoryProfileListActions` — keyboard navigation of actions menu

**File:** `src/features/repository-profiles/components/RepositoryProfileListActions/RepositoryProfileListActions.test.tsx`

Assert that the actions toggle button has an `aria-label` (e.g. `"Actions for <profile name>"`), and that `{Tab}` + `{Enter}` opens the menu without a mouse click.

---

### `RepositoryProfileDetails` — aria-label on Remove button

**File:** `src/features/repository-profiles/components/RepositoryProfileDetails/RepositoryProfileDetails.test.tsx`

Assert that the Remove button carries an accessible label (e.g. `"Remove <profile title>"`), not just the generic text "Remove".

---

### `RepositoryProfileForm` — form field labels and required indicators

**File:** `src/features/repository-profiles/components/RepositoryProfileForm/RepositoryProfileForm.test.tsx`

Assert that the submit button's accessible name matches the `CTA_INFO` label for both add and edit actions, and that required fields expose `aria-required="true"`.

---

## Low Priority — Detail panel coverage

### `RepositoryProfileFormDetailsPanel` — access group Select options

**File:** `src/features/repository-profiles/components/RepositoryProfileFormDetailsPanel/RepositoryProfileFormDetailsPanel.test.tsx`

Assert that each item in the `accessGroups` prop appears as a labelled `<option>` inside the access group `<Select>`.

---

### `RepositoryProfileFormDetailsPanel` — formik validation error for title

**File:** `src/features/repository-profiles/components/RepositoryProfileFormDetailsPanel/RepositoryProfileFormDetailsPanel.test.tsx`

Pass a formik context with `errors.title = "Required"` and `touched.title = true`, then assert the error text is rendered below the title input.

---

## Low Priority — Orphaned components

These components have no known production imports. Investigate before adding tests; if they are still in use, add tests; if not, open a separate cleanup PR to delete them.

| Component                              | File                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------- |
| `RepositoryProfileFormAptSourcesPanel` | `src/features/repository-profiles/components/RepositoryProfileFormAptSourcesPanel/` |
| `RepositoryProfileFormTabs`            | `src/features/repository-profiles/components/RepositoryProfileFormTabs/`            |

Note: `RepositoryProfileFormAptSourcesPanel` has a `apt_sources: [2]` type mismatch (`number[]` vs `APTSource[]`) that must be resolved before meaningful tests can be written.
