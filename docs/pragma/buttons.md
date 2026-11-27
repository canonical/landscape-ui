# Pragma Button Integration Conventions

This document defines how Landscape migrates buttons from `@canonical/react-components` and Vanilla `p-button*` classes to Pragma (`@canonical/react-ds-global`). Follow these rules so feature-by-feature and shared-component migrations apply one consistent contract.

## Foundation Prerequisites

### Root surface and density classes

`index.html` declares `<html lang="en" class="app comfortable light">` (via `@canonical/styles-vanilla-adapter`), and the pre-paint theme script together with `ThemeProvider` (`src/context/theme.tsx`) keeps `light`/`dark` on `<html>` in sync with `body.is-dark`. Pragma requires one context class (`app` | `site` | `docs`) and one density class (`comfortable` | `dense`) on the document root so `--density-*` tokens resolve across authenticated views, auth/error views, and `document.body` portals:

- **Application comfortable (default):** `32px` control height (`8 × 4px` baseline units), `16px` inline padding (`8px` start padding with a leading icon).
- **Dense regions:** `24px` control height (`6 × 4px` baseline units). Apply `className="dense"` on the containing region (or control) instead of passing a `dense` prop.

### Cascade isolation and temporary package shims

`@canonical/styles-vanilla-adapter` layers all Vanilla-era styles in `@layer vanilla` and isolates every `.ds` element through `@layer boundary`, so no Vanilla `button` `revert-layer` shims are required. Keep Vanilla classes (`p-*`, `u-*`, `l-*`, `is-*`) off Pragma `<Button>` elements, and place any CSS module rule targeting a Pragma `<Button>` inside a top-level `@layer app { ... }` block (see [FRONTEND.md](../FRONTEND.md#vanilla-and-pragma-cascade-layers)).

`src/styles/pragma-button-shims.css` (imported in `src/main.tsx` inside `@layer app` using zero-specificity `:where(...)` selectors) carries temporary bugfix shims for `@canonical/react-ds-global@0.47.0` `Button`. Remove each shim once its tracking PR ships:

1. **Button typography sizing (`canonical/pragma-web#1659`):** `Button/styles.css` evaluates `--button-font-size` on `:root` (`16px`) and never applies `font-size`, so buttons under `<html class="app">` inherit `16px` instead of `14px`. The shim resolves `--typography-text-primary-font-size` directly on `.ds.button` controls, matching the `14px` Vanilla text size from the adapter.
2. **Outlined secondary destructive icon colour (`canonical/pragma-web#1659`):** Enabled `secondary` `destructive` buttons should use `--color-icon` on the leading icon so it matches the neutral label colour in light and dark themes.
3. **Disabled and loading borderless buttons (`canonical/pragma-web#1439`):** `:disabled` and `.loading` in `0.47.0` ignore `--modifier-outline`, adding a visible border to disabled/loading `tertiary` (and loading `primary`) buttons. The shim mixes the border colour with `calc(var(--modifier-outline, 0) * 100%)`.
4. **Loading accessible name (`canonical/pragma-web#1439`):** Overrides `.ds.button.loading > .label` from `visibility: hidden` to `opacity: 0; visibility: visible` so buttons retain their accessible name while `loading` is `true`. Note: once `#1439` releases, loading-only buttons also change from native `disabled` to focusable `aria-disabled="true"`, so loading-state tests should be updated when removing this shim.
5. **Icon-only square sizing (`canonical/pragma-web#1387`):** Sizes icon-only buttons (`:has(> .icon):not(:has(> .label))`) to a centered `--density-line-height-effective` square (`32x32px` comfortable, `24x24px` dense) instead of collapsing vertically with asymmetric `8px 16px` inline padding. Remove once icon-only controls switch to Pragma `IconButton`.

Additional tracked upstream items that do **not** require a Landscape shim:

- **Leading icon/text optical alignment (`canonical/pragma-web#1455`):** Minor ~1.1px visual offset on leading icons; improves automatically on a future Pragma upgrade.
- **Link-button underline polish:** Upstream design is still exploring underline weight and offset for `Button variant="link"`; keep default Pragma styling.

## What to Migrate Now vs Defer

With the shims above in place, feature migration PRs can migrate:

- Standard labeled buttons (`primary`, `secondary`, `tertiary`, `constructive`, `destructive`, `caution`) with or without leading icons.
- Loading `ActionButton` controls (`Button` with `loading={...}`).
- Link-styled in-place actions (`appearance="link"` -> `Button variant="link"`).
- Standalone `ConfirmationButton` controls outside `ResponsiveButtons` (Pragma `Button` opening a sibling `ConfirmationModal`).
- Icon-only buttons (`importance="tertiary"`, `icon="..."`, explicit `aria-label`, no children), knowing they will swap to `IconButton` once `canonical/pragma-web#1387` ships.

Leave the following out of feature button PRs:

- **Menu triggers and table filters (`ContextualMenu`, `ActionsMenu`, `TableFilter*`, `ResponsiveTableFilters`, `InstancesPageActions`):** Blocked on `canonical/pragma-web#1209`; migrate in the dedicated menu/filter tickets.
- **`ResponsiveButtons` action bars:** `ResponsiveButtons` inspects legacy `hasIcon` and `confirmationModalProps` when collapsing into a legacy `ContextualMenu`; migrate alongside action menus.
- **Button-styled navigation links (`<Link className="p-button...">` / `<a className="p-button...">`):** Keep as Vanilla `.p-button` links until upstream provides button-styled link support.
- **Side navigation rows (`.p-side-navigation`):** Migrate with Pragma `SideNavigation`.
- **Shared `SidePanelFormButtons`:** Migrate in a single dedicated PR rather than inside a single feature ticket.
- **Lint guardrail (`eslint.config.mjs`):** Add `Button`, `ActionButton`, and `ConfirmationButton` to `PRAGMA_MIGRATED_COMPONENTS` only in the final cleanup once zero legacy imports remain.

## Appearance and Variant Mapping

Pragma `Button` defaults `importance` to `"primary"` (solid high-contrast fill), whereas legacy `@canonical/react-components` `Button` defaulted `appearance` to `""` (outlined neutral). **Always pass `importance="secondary"` explicitly** when replacing a default legacy `<Button>`.

| Legacy usage                                                             | Pragma equivalent                                           | When to use                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<Button>` (`appearance=""` / `undefined` / `"secondary"`), `.p-button`  | `<Button importance="secondary">`                           | Supporting actions, toolbar actions, segmented controls, and secondary actions paired with a primary CTA.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `<Button appearance="positive">` / `.p-button--positive` (additive CTA)  | `<Button importance="primary" anticipation="constructive">` | Primary CTAs that create or add a resource ("Add …", "Create …", "Register …", "Attach …", "Generate …") or preserve an explicit `"positive"` shared prop contract.                                                                                                                                                                                                                                                                                                                                         |
| `<Button appearance="positive">` / `.p-button--positive` (neutral CTA)   | `<Button importance="primary">`                             | Primary progression, form submission, or recovery actions ("Sign in", "Save changes", "Apply", "Verify", "Continue", "Try again").                                                                                                                                                                                                                                                                                                                                                                          |
| `<Button appearance="negative">` / `.p-button--negative` (final confirm) | `<Button importance="primary" anticipation="destructive">`  | Primary destructive confirmation in a modal or destructive form submission (`submitButtonAppearance="negative"`).                                                                                                                                                                                                                                                                                                                                                                                           |
| `<Button>` with `--negative` icon + `u-text--negative` (action bar)      | `<Button importance="secondary">`                           | Destructive triggers inside grouped action bars ("Remove", "Detach", "Archive", "Delete", "Cancel") that open a confirmation modal use neutral `importance="secondary"` (no `anticipation="destructive"`) for visual consistency. Drop manual `--negative` icons and `u-text--negative` spans; keep semantic icons such as `icon="delete"`. Reserve `anticipation="destructive"` for final destructive confirmations (`importance="primary" anticipation="destructive"`) or explicit negative form actions. |
| `<Button appearance="base">` with destructive intent                     | `<Button importance="tertiary" anticipation="destructive">` | Low-emphasis inline or row-level destructive triggers paired with other controls.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `<Button appearance="base">` / `.p-button--base`                         | `<Button importance="tertiary">`                            | Low-emphasis actions such as "Cancel", "Back", panel/modal "Close" buttons, pagination chevrons, and subtle icon-only controls.                                                                                                                                                                                                                                                                                                                                                                             |
| `<Button appearance="link">`                                             | `<Button variant="link">`                                   | In-place UI/state actions styled as inline text links ("Show more", "Select all …", opening a side panel from a cell, notification inline actions). **Never** use for URL navigation.                                                                                                                                                                                                                                                                                                                       |
| `<Button appearance="brand">`                                            | `<Button importance="primary">`                             | Editorial `brand` appearance is not used in Landscape; map to `importance="primary"` if encountered.                                                                                                                                                                                                                                                                                                                                                                                                        |

Keep at most one `importance="primary"` button (with or without `anticipation`) visible per viewport/surface; pair it with `secondary` or `tertiary` actions.

## Icons and Icon-Only Buttons

- **Leading icons:** Pass `icon="<IconName>"` (`import type { IconName } from "@canonical/ds-assets"`). Remove `hasIcon` and child `<Icon>` / `<i className="p-icon--...">` elements.
- **Automatic contrast (`currentColor`):** Do not pass legacy `light` props or theme-specific icon variants; `.ds.button > .icon` resolves contrast automatically across `primary`/`secondary`/`tertiary`, `anticipation`, and light/dark modes.
- **No trailing icon slot:** Pragma `Button` only supports a leading icon. Trailing chevrons belong to menu/disclosure triggers (`ContextualMenu` / `DropdownButton`), not `Button`.
- **Icon-only buttons:** Omit `children` (do not put `<span className="u-off-screen">` inside `children`, which activates `.label` and adds an `8px` gap) and **always** pass an explicit `aria-label` or `aria-labelledby`:
  ```tsx
  <Button
    type="button"
    importance="tertiary"
    icon="close"
    aria-label="Close"
    onClick={onClose}
  />
  ```
  `title` alone does not satisfy Pragma's accessibility contract and triggers a dev-console warning. Pair icon-only buttons with a `Tooltip` when the icon's action is not self-evident from immediate chrome (such as a standard header close button).

## Action Buttons, Loading, and Disabled States

### `ActionButton` → `Button` with `loading`

Import `Button` from `@canonical/react-ds-global` instead of `ActionButton`:

```tsx
<Button
  type="submit"
  importance="primary"
  loading={isSubmitting}
  disabled={!isValid}
>
  Save changes
</Button>
```

Key behavioral differences from legacy `ActionButton`:

- **Native `disabled` and `aria-busy`:** When `loading` is `true`, Pragma `Button` sets `aria-busy="true"` and `disabled={true}` (`disabled || loading`) while keeping enabled surface/text colors so the button reads as busy rather than unavailable.
- **Synchronous state:** Pragma `Button` has no `400ms` `LOADER_MIN_DURATION` delay and no inline `width`/`height` style locking; `.label` stays in the DOM beneath the overlaid `Spinner` to preserve intrinsic width.
- **No `success` prop:** Pragma `Button` omits `ActionButton`'s `2000ms` `success` tick. Use `useNotify()` for async mutations, or explicit temporary icon/label state for local actions (for example `icon={copied ? "success" : "copy"}` with `{copied ? "Copied" : "Copy"}`, as in `FallbackComponent`).

### `disabled` behavior and tooltips

- **Native HTML `disabled`:** Legacy `@canonical/react-components` `Button` rendered `aria-disabled="true"` + `.is-disabled` and intercepted `onClick`. Pragma `Button` sets native HTML `disabled`, which blocks click activation natively and removes the control from the keyboard Tab order.
- **Disabled buttons with `Tooltip`:** When disabling a button, explain why with a `Tooltip` (or nearby validation feedback). Both legacy `Tooltip` and Pragma `TooltipEngine` / `withTooltip` attach pointer listeners to an outer wrapper `<span>`, so hover tooltips continue to open over natively `disabled` Pragma buttons. Because native `<button disabled>` cannot receive Tab focus, do not rely on a tooltip alone as the only keyboard-accessible explanation for form validation state.

## Navigation Links vs Buttons

- **Simple page or external navigation:** Use Pragma `Link` (`<Link as={RouterLink} to="...">` or `<Link href="...">`) or React Router `<Link>` / native `<a>`. Preserve semantic link behavior (`role="link"`, `href`, `target="_blank"`, middle-click / Cmd+click, copy URL). Never replace a navigation link with `<Button variant="link">` or `<Button onClick={() => navigate(...)}>`. See `OidcAuthPage` and `UbuntuOneAuthPage` for the `<Link as={RouterLink}>` pattern.
- **Button-styled CTA links (upstream gap):** `@canonical/react-ds-global@0.47.0` `Button` renders `<button>` only (no polymorphic `as` prop yet), and `ds:global.component.button_link` was rejected upstream pending unified button/button-link affordance design. For the few empty-state, error-page, or header CTAs that must navigate while wearing button chrome (`PageNotFound`, `EnvError`, `SingleInstanceEmptyState`, `AlertNotificationsPage`, `LicensesPage`), keep `<Link>` / `<a>` with existing `.p-button` / `.p-button--positive` classes until upstream ships polymorphic `Button` link support. Never hand-roll `<a className="ds button ...">`.

## Layout, Spacing, Sizing, and Coupled Patterns

- **Explicit `type` attribute:** Native `<button>` defaults to `type="submit"` inside `<form>`. Always set `type="button"` on non-submitting `Button` instances, and `type="submit"` only on form submit controls.
- **Button group spacing (`gap`):** Vanilla `.p-button` carried `margin: 0 1rem 1.2rem 0`. Pragma `.ds.button` has `margin: 0` (`display: inline-flex`). Drop `inline`, `u-no-margin--bottom`, and `u-no-margin--right` when migrating a button, and ensure parent button rows, modal footers, and action bars define explicit flex `gap` (such as `gap: var(--dimension-200)` or `$sph--large`).
- **Dropping `dense` and `small`:** Pragma `Button` has no `dense` or `small` props; its default label already uses the `14px` secondary text tier. Use ancestor `className="dense"` when `24px` compact height is needed.
- **Grouped action bars (replacing `.p-segmented-control`):** Do not pass Vanilla `p-segmented-control__button` classes onto Pragma `<Button>` elements (`@canonical/styles-vanilla-adapter`'s boundary reverts Vanilla classes inside `.ds` islands and forbids `p-*` classes on `.ds` roots, and segmented control is not the right pattern for grouped action buttons). Wrap grouped side-panel and detail-view action rows in `<ActionBar>` from `@/components/ui` (a transitional flex wrapper with `gap: var(--dimension-100)` and `margin-bottom: var(--dimension-200)` while Pragma's `ActionBar` (`ds:apps.pattern.action_bar`) is under design; see `PublicationDetails`). Use neutral `importance="secondary"` for destructive triggers inside the action bar that open a confirmation modal rather than `anticipation="destructive"`.
- **`ConfirmationButton`, side navigation, and menu triggers:**
  - **`ConfirmationButton` (no Pragma component; migrate directly):** Pragma does not ship a `ConfirmationButton` (and `withModal` only supports close-only footers). Replace `<ConfirmationButton>` during feature migrations with a Pragma `<Button onClick={openModal}>` plus a sibling `ConfirmationModal` (later Pragma `Modal`). In `ResponsiveButtons`, a `<Button onClick={openModal}>` with its modal rendered alongside `<ResponsiveButtons>` collapses cleanly without relying on `confirmationModalProps`.
  - **Side navigation items (`.p-side-navigation`):** Pragma ships `SideNavigation` in `@canonical/react-ds-app`, where expandable and action rows are internal nav-row elements (`ItemButton`) rather than global `Button` controls. Do not replace `.p-side-navigation` items (`NavigationExpandableParent`, `UserInfo`, `LogoutButton`) with Pragma `<Button>` + `!important` overrides; either migrate them with `SideNavigation` or use native `<button type="button">` if needed to clear the last legacy `Button` / `ActionButton` imports.
  - **Menu and filter triggers (`ActionsMenu`, `ResponsiveButtons`, `TableFilter*`, `ResponsiveTableFilters`):** Triggers are rendered inside legacy `ContextualMenu` today (not imported as standalone `Button`s). In `0.47.0`, `ContextualMenu` renders an unstyled `<button class="trigger">` and `Popover` renders `<details>`/`<summary>` only. Once `canonical/pragma-web#1209` lands (React 19 ref support on `Button`, styled `Button` triggers via `triggerProps` on both `Popover` and `ContextualMenu`, and `ContextualMenu` items opening anchored `Popover` dialogs), standalone filter dropdowns (`TableFilter*`) move to `Popover`, action menus (`ActionsMenu`, `ResponsiveButtons`) move to `ContextualMenu`, and collapsed filter menus (`ResponsiveTableFilters`) compose both.

## Testing Conventions

- Query buttons by accessible role and name: `screen.getByRole("button", { name: ... })`.
- Assert disabled state with `expect(button).toBeDisabled()` / `expect(button).toBeEnabled()`, not `toHaveAttribute("aria-disabled", "true")` or `toHaveClass("is-disabled")`.
- Assert loading state with `expect(button).toHaveAttribute("aria-busy", "true")` and `expect(button).toBeDisabled()`.
- Assert icons with `expect(button).toHaveIcon("<name>")` (`src/tests/matcher.ts` supports both legacy Vanilla `<i>` icons and Pragma SVG `<use>` sprites).
- Treat any Pragma dev-console accessibility warning (`console.warn`) as a test failure.

## Representative Reference Implementations

- Neutral primary submit + `loading` / `disabled`: `src/features/auth/components/LoginForm/LoginForm.tsx`
- Constructive primary CTA with leading icon: `src/features/local-repositories/components/AddLocalRepositoryButton/AddLocalRepositoryButton.tsx`
- Primary + tertiary + temporary copy feedback: `src/components/layout/AppErrorBoundary/FallbackComponent.tsx`
- Grouped `<ActionBar>` with neutral secondary actions (including modal-opening `Remove` with `icon="delete"`) + loading/disabled inside `Tooltip`: `src/features/publications/components/PublicationDetails/PublicationDetails.tsx`, `src/components/ui/ActionBar/ActionBar.tsx`
- Icon-only `tertiary` buttons (`aria-label` + `disabled`): `src/components/layout/SidePanel/Header.tsx`, `src/context/sidePanel.tsx`, `src/components/layout/TablePagination/components/ModalTablePagination/ModalTablePagination.tsx`
- Inline link-styled action (`variant="link"`): `src/components/layout/SelectAllButton/SelectAllButton.tsx`
- Polymorphic router navigation link (`<Link as={RouterLink}>`): `src/pages/auth/handle/oidc/OidcAuthPage/OidcAuthPage.tsx`, `src/pages/auth/handle/ubuntu-one/UbuntuOneAuthPage/UbuntuOneAuthPage.tsx`
