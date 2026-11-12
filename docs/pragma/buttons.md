# Pragma Button Integration Conventions

This document defines how Landscape migrates buttons from `@canonical/react-components` and Vanilla `p-button*` classes to Pragma (`@canonical/react-ds-global`). Follow these rules so feature-by-feature and shared-component migrations apply one consistent contract.

## Foundation Prerequisites

### Root surface and density classes

`index.html` declares `<body class="app comfortable">`. Pragma requires one context class (`app` | `site` | `docs`) and one density class (`comfortable` | `dense`) on the document root so `--density-*` tokens resolve across authenticated views, auth/error views, and `document.body` portals:

- **Application comfortable (default):** `32px` control height (`8 × 4px` baseline units), `16px` inline padding (`8px` start padding with a leading icon).
- **Dense regions:** `24px` control height (`6 × 4px` baseline units). Apply `className="dense"` on the containing region (or control) instead of passing a `dense` prop.

### Temporary CSS cascade and package shims

`src/styles/partials/pragma-cascade-shims.scss` carries two temporary rule groups required while Vanilla Framework coexists unlayered alongside `@canonical/react-ds-global@0.44.1`:

1. **Unlayered Vanilla `button` reset (`revert-layer`):** Vanilla styles bare `button` elements unlayered (`_base_button.scss`, `_base_reset.scss`), which outranks `@layer ds.components.global`. `button:where(.ds.button)` reverts those declarations at `(0, 0, 1)` base specificity so consumer CSS module classes `(0, 1, 0)` and `.p-segmented-control__button` `(0, 2, 0)` still compose without `!important`. Remove once Vanilla is layered via `@canonical/styles-vanilla-adapter`.
2. **Upstream `@canonical/react-ds-global` 0.44.1 `Button` fixes:**
   - Applies `font-size: var(--button-font-size)` (`14px`) on non-link `.ds.button` controls (`Button/styles.css` defines `--font-size` without applying `font-size`).
   - Sizes icon-only buttons (`:has(> .icon):not(:has(> .label))`) to a centered `--density-line-height-effective` square (`32×32px` comfortable, `24×24px` dense) instead of collapsing vertically and keeping asymmetric `8px 16px` inline padding.
   - Overrides `.ds.button.loading > .label` from `visibility: hidden` to `opacity: 0; visibility: visible` so buttons retain their accessible name in browsers while `loading` is `true`.

## Appearance and Variant Mapping

Pragma `Button` defaults `importance` to `"primary"` (solid high-contrast fill), whereas legacy `@canonical/react-components` `Button` defaulted `appearance` to `""` (outlined neutral). **Always pass `importance="secondary"` explicitly** when replacing a default legacy `<Button>`.

| Legacy usage                                                             | Pragma equivalent                                            | When to use                                                                                                                                                                                            |
| ------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<Button>` (`appearance=""` / `undefined` / `"secondary"`), `.p-button`  | `<Button importance="secondary">`                            | Supporting actions, toolbar actions, segmented controls, and secondary actions paired with a primary CTA.                                                                                              |
| `<Button appearance="positive">` / `.p-button--positive` (additive CTA)  | `<Button importance="primary" anticipation="constructive">`  | Primary CTAs that create or add a resource ("Add …", "Create …", "Register …", "Attach …", "Generate …") or preserve an explicit `"positive"` shared prop contract.                                    |
| `<Button appearance="positive">` / `.p-button--positive` (neutral CTA)   | `<Button importance="primary">`                              | Primary progression, form submission, or recovery actions ("Sign in", "Save changes", "Apply", "Verify", "Continue", "Try again").                                                                     |
| `<Button appearance="negative">` / `.p-button--negative` (final confirm) | `<Button importance="primary" anticipation="destructive">`   | Primary destructive confirmation in a modal or destructive form submission (`submitButtonAppearance="negative"`).                                                                                      |
| `<Button>` with `--negative` icon + `u-text--negative` (toolbar/header)  | `<Button importance="secondary" anticipation="destructive">` | Destructive triggers in page/panel headers or segmented controls ("Remove", "Detach", "Archive", "Delete") that open a confirmation flow. Drop manual `--negative` icons and `u-text--negative` spans. |
| `<Button appearance="base">` with destructive intent                     | `<Button importance="tertiary" anticipation="destructive">`  | Low-emphasis inline or row-level destructive triggers paired with other controls.                                                                                                                      |
| `<Button appearance="base">` / `.p-button--base`                         | `<Button importance="tertiary">`                             | Low-emphasis actions such as "Cancel", "Back", panel/modal "Close" buttons, pagination chevrons, and subtle icon-only controls.                                                                        |
| `<Button appearance="link">`                                             | `<Button variant="link">`                                    | In-place UI/state actions styled as inline text links ("Show more", "Select all …", opening a side panel from a cell, notification inline actions). **Never** use for URL navigation.                  |
| `<Button appearance="brand">`                                            | `<Button importance="primary">`                              | Editorial `brand` appearance is not used in Landscape; map to `importance="primary"` if encountered.                                                                                                   |

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
- **Button-styled CTA links (upstream gap):** `@canonical/react-ds-global@0.44.1` `Button` renders `<button>` only (no polymorphic `as` prop yet), and `ds:global.component.button_link` was rejected upstream pending unified button/button-link affordance design. For the few empty-state, error-page, or header CTAs that must navigate while wearing button chrome (`PageNotFound`, `EnvError`, `SingleInstanceEmptyState`, `AlertNotificationsPage`, `LicensesPage`), keep `<Link>` / `<a>` with existing `.p-button` / `.p-button--positive` classes until upstream ships polymorphic `Button` link support. Never hand-roll `<a className="ds button ...">`.

## Layout, Spacing, Sizing, and Coupled Patterns

- **Explicit `type` attribute:** Native `<button>` defaults to `type="submit"` inside `<form>`. Always set `type="button"` on non-submitting `Button` instances, and `type="submit"` only on form submit controls.
- **Button group spacing (`gap`):** Vanilla `.p-button` carried `margin: 0 1rem 1.2rem 0`. Pragma `.ds.button` has `margin: 0` (`display: inline-flex`). Drop `inline`, `u-no-margin--bottom`, and `u-no-margin--right` when migrating a button, and ensure parent button rows, modal footers, and action bars define explicit flex `gap` (such as `gap: var(--dimension-200)` or `$sph--large`).
- **Dropping `dense` and `small`:** Pragma `Button` has no `dense` or `small` props; its default label already uses the `14px` secondary text tier. Use ancestor `className="dense"` when `24px` compact height is needed.
- **Segmented controls (`.p-segmented-control`):** Migrated Pragma `<Button importance="secondary" className="p-segmented-control__button">` controls compose with `.p-segmented-control__list` during incremental migration (see `PublicationDetails`).
- **Coupled components deferred to their own migrations:**
  - **`ConfirmationButton`:** Keep on `@canonical/react-components` until `ConfirmationModal` and `ResponsiveButtons` migrate, because `ResponsiveButtons` inspects `confirmationModalProps` when collapsing overflow actions.
  - **Menu triggers (`ActionsMenu`, `ResponsiveButtons`, `TableFilter*`):** Migrate with Pragma `ContextualMenu` so trigger refs, `aria-expanded` styling, and keyboard focus return move together.
  - **Side navigation items (`.p-side-navigation`):** Keep sidebar accordion/action buttons on their current markup until side navigation migrates rather than overriding `.ds.button` with `!important`.

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
- Secondary + destructive secondary + loading/disabled inside `Tooltip` + segmented control: `src/features/publications/components/PublicationDetails/PublicationDetails.tsx`
- Icon-only `tertiary` buttons (`aria-label` + `disabled`): `src/components/layout/SidePanel/Header.tsx`, `src/context/sidePanel.tsx`, `src/components/layout/TablePagination/components/ModalTablePagination/ModalTablePagination.tsx`
- Inline link-styled action (`variant="link"`): `src/components/layout/SelectAllButton/SelectAllButton.tsx`
- Polymorphic router navigation link (`<Link as={RouterLink}>`): `src/pages/auth/handle/oidc/OidcAuthPage/OidcAuthPage.tsx`, `src/pages/auth/handle/ubuntu-one/UbuntuOneAuthPage/UbuntuOneAuthPage.tsx`
