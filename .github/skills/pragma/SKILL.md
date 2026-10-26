---
name: pragma
description: Use the Pragma design system (Canonical's successor to vanilla-framework and @canonical/react-components) in landscape-ui. Apply when migrating UI to Pragma components or forms, choosing or looking up a design-system component, token, modifier, or code standard, or auditing design-system coverage.
---

# Pragma in landscape-ui

Pragma ships more than npm packages: a knowledge graph of every block (component, pattern,
layout), tier, modifier family, and code standard, served by the `pragma` CLI
(`@canonical/pragma-cli`, a pinned devDependency) and its MCP server. It also ships upstream
workflow skills. This skill wires those into this repository. It does not restate them.

Read `docs/FRONTEND.md` § "Pragma design system" first. It records what is already in place
(styles, fonts, icons, Vitest inlining) and outranks generic upstream advice.

## Adoption status

- **A1 (styles, fonts, icons):** done. Do not redo it. One gap: confirm the root context and
  density classes (for example `app comfortable`) before you rely on density-sized components.
- **A2 (presentational components):** in progress. This is the default track for UI work now.
- **A3 (forms):** scheduled for last. Existing forms stay on Formik until then. Use A3 only when
  you are asked to migrate forms.

## Query the graph, never memory

Prefer the `pragma` MCP tools (registered in `.mcp.json`). Fall back to
the CLI with `pnpm exec pragma …` if they are unavailable. Both read the same graph offline.

| Question                                   | MCP tool                           | CLI                                               |
| ------------------------------------------ | ---------------------------------- | ------------------------------------------------- |
| What blocks exist?                         | `block_list`                       | `pnpm exec pragma block list`                     |
| A block's anatomy, modifiers, properties   | `block_lookup`                     | `pnpm exec pragma block lookup Button`            |
| Modifier props and values                  | `modifier_list`, `modifier_lookup` | `pnpm exec pragma modifier list`                  |
| Coding standards for the change            | `standard_list`, `standard_lookup` | `pnpm exec pragma standard list --category react` |
| Which component library implements a block | `implementation_list`              | `pnpm exec pragma implementation list`            |
| Anything else                              | `capabilities`, `graph_query`      | `pnpm exec pragma capabilities`                   |

`pragma.config.ts` sets the default tier to `apps_landscape`, so reads answer from `global`,
`apps`, and Landscape-specific blocks. When a lookup returns the same name in several tiers,
those are different blocks. Read every `- Tier:` line and pick the one whose package the app
actually depends on.

The graph also documents blocks that `@canonical/react-ds-global` has not shipped yet, such as
Table. If the import does not exist, stop and report the gap. Leave the existing markup in place,
and never hand-roll a lookalike.

## Load the upstream workflow skill for the task

Pragma's workflow skills are maintained upstream and versioned with the CLI. Load the matching one
live with the MCP `skill_lookup` tool or `pnpm exec pragma skill lookup <name>`, then follow it
with the Landscape overrides below. Do not copy its text into this repository.

| Task                                                        | Upstream skill                                                              |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| Swap one component type (buttons, badges, cards…) to Pragma | `adoption-a2-components`                                                    |
| Migrate a form to the Pragma form system                    | `adoption-a3-forms`                                                         |
| Check or finish the styles/fonts/icons foundation           | `adoption-a1-styles`                                                        |
| Audit design-system coverage or consistency                 | `design-auditor`                                                            |
| A Landscape need that no block covers                       | `specify-component` (spec only; the component lands upstream in pragma-web) |

## Landscape overrides

- **Package manager.** Use `pnpm` with exact versions, never `bun` or `npm`. Keep all
  `@canonical/*` Pragma packages on the same version line.
- **Packages.** Import non-form components from `@canonical/react-ds-global` and form components
  from `@canonical/react-ds-global-form`. Most Landscape-tier blocks (`apps_landscape`) are
  documented specs that have no shipped implementation yet. Their package by convention is
  `@canonical/react-ds-app-landscape`, which is not installed and exports very little so far.
  Treat these blocks as design specs for the app's own components. Before suggesting the
  package, check its exports. Adding it is a dependency decision, so raise it with the user. If
  you add it, also add it to `test.server.deps.inline` in `vitest.config.ts`.
- **Inventory.** The legacy surface is `@canonical/react-components` imports plus Vanilla `p-*`
  classes under `src/`. Inventory both, grouped by component type.
- **One component type per PR.** Each PR also needs a changeset (`pnpm changeset`).
- **Lock finished migrations.** When a PR removes the last `@canonical/react-components` import of
  a component, add the component to `PRAGMA_MIGRATED_COMPONENTS` in `eslint.config.mjs`. Lint then
  rejects any new legacy import of it (see "Pragma migration guardrail" in `docs/FRONTEND.md`).
  Never import a listed component from the legacy package. Likewise, if Pragma ships a component,
  use it rather than recreating it with Vanilla `p-*` classes or custom classes.
- **Forms (A3).** Forms are a work in progress. They use Formik today and move to the Pragma form
  system (built on react-hook-form) during A3. When A3 starts, follow `adoption-a3-forms`. Until
  then, keep each existing form consistent with the library it already uses.
- **Placement.** Follow `docs/FRONTEND.md`. Shared wrappers go in `src/components/ui/`, and
  feature-specific usage stays in its feature. `pragma create component` emits Pragma's own
  package layout, so run it only with `--dry-run` as a reference. Never write its output into
  `src/` unchanged.
- **Icons.** Pragma icons are served at root-absolute `/icons`. Keep the default `rootPath`, and
  do not prepend `VITE_ROOT_PATH`.
- **Accessibility warnings are failures.** Fix every dev-console warning from a swapped
  component. Never silence one.

## Verify

Run `pnpm vitest` for touched areas, then `pnpm run lint` and `pnpm exec tsc`. Visually
check swapped components in `pnpm dev`, and confirm there are no Pragma console warnings. Follow
`docs/verification/index.md` for completion criteria.

Report broken skill guidance or graph gaps at https://github.com/canonical/pragma-core/issues.
