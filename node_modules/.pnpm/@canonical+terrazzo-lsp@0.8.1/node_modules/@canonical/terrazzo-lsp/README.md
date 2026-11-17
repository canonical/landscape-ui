# @canonical/terrazzo-lsp

Language server providing CSS custom property intelligence for design token workflows. Reads `tokens.json` build artifacts and provides editor features for CSS and SCSS files.

## Features

| Feature | Description |
|---------|-------------|
| Completions | Context-aware suggestions for `var(--...)` references, prioritised by type assignability, semantic tier, and provenance. |
| Hover | Token metadata including resolved value, colour swatch, alias chain, tier badge, selector context, and source location. |
| Diagnostics | Type mismatch detection, missing/stale fallback warnings, unreachable token analysis, primitive usage warnings, and more. |
| Go to Definition | Jump from a `var()` reference to the token declaration. |
| Rename | Rename a CSS custom property across all files in the import graph. |
| Document Colours | Inline colour swatches and colour picker for token-backed colour values. |
| Semantic Tokens | Syntax highlighting distinguishing artifact tokens, local properties, and external references. |
| Workspace Symbols | Search tokens across the workspace by name or type. |

## Editor Setup

**VS Code** (recommended):

```bash
npm install -D @canonical/design-tokens
npx @canonical/terrazzo-lsp-extension
```

The extension auto-detects `bun` first and falls back to `node >= 22`.

## CLI

```bash
npx terrazzo-lsp --stdio                # Start LSP server on stdio
npx terrazzo-lsp --stdio --allow-degraded  # Start with reduced capabilities when config is missing
npx terrazzo-lsp check [globs]          # Run diagnostics on CSS files
npx terrazzo-lsp status                 # Show config and artifact status
npx terrazzo-lsp inspect <var>          # Inspect a CSS custom property
npx terrazzo-lsp resolve <spec>         # Resolve an import specifier
npx terrazzo-lsp graph <file>           # Show import graph from a file
```

## Diagnostics Reference

The LSP emits 14 diagnostic codes. CSS diagnostics run on every CSS/SCSS file in the workspace. DTCG diagnostics run once when loading `tokens.json` artifacts and validate conformance to the [DTCG 2025.10](https://tr.designtokens.org/format/) specification. Every diagnostic can be configured to `"error"`, `"warning"`, `"info"`, or `"off"` in `terrazzo-lsp.config.json`.

| Code | Config Key | Default | Description |
|------|------------|---------|-------------|
| `css/unknown-var` | `unknownProperties` | off | A `var()` reference does not match any known custom property. |
| `css/missing-fallback` | `missingFallback` | warning | A `var()` reference to a non-artifact property has no fallback value and no `@property` registration. Skipped for artifact tokens since they are guaranteed to be defined. |
| `css/stale-fallback` | `staleFallback` | warning | The fallback literal in a `var()` does not match the token's current resolved value. |
| `css/type-mismatch` | `typeMismatch` | error | A token's DTCG type is incompatible with the CSS property (e.g. colour token in `padding`). |
| `css/type-uncertain` | `typeUncertain` | info | A typed token appears in a shorthand or context where multiple value types are acceptable. |
| `css/unreachable-token` | `unreachableToken` | warning | The token's artifact output file is not reachable through the `@import` graph or global stylesheets. |
| `css/primitive-token` | `primitiveToken` | warning | Direct usage of a primitive-tier token where a semantic alias should be preferred. |
| `css/scoped-usage` | `scopedDeclaration` | warning | A token declared under a specific selector scope is used in a broader scope. |
| `css/no-color-scheme` | `lightDarkNoScheme` | info | A `light-dark()` value is used without a `color-scheme` declaration on the selector or an ancestor. |
| `dtcg/broken-alias` | `brokenAlias` | error | An alias reference in the artifact points to a token ID that does not exist. |
| `dtcg/schema-violation` | `schemaViolation` | error | A token's value is invalid for its declared `$type` (e.g. `$type: color` with a non-colour value). |
| `dtcg/circular-alias` | `circularAlias` | error | The alias chain forms a cycle — a token ID appears more than once in the resolution path. |
| `dtcg/missing-type` | `inferredType` | info | A token has no explicit `$type` and its type is ambiguous. |
| `dtcg/draft-syntax` | `draftFormat` | info | A token uses pre-standardisation draft field syntax (`value`/`type` without `$` prefix). |

### CSS diagnostics example

The example below triggers every CSS diagnostic in one file:

```css
/* Assume the following tokens exist in the artifact:
 *   --color-fg           : oklch(17.2% 0 0)        tier: semantic, type: color
 *   --spacing-sm         : 0.5rem                   tier: semantic, type: dimension
 *   --color-palette-blue : oklch(50% 0.15 250)      tier: primitive, type: color
 *   --button-pad         : 0.75rem                  tier: semantic, scoped to .button
 *   --unreachable-token  : 1rem                     (in a file not imported by this sheet)
 */

/* css/unknown-var — off by default, enable via config */
.unknown   { margin: var(--does-not-exist); }

/* css/missing-fallback — no fallback for a non-artifact property */
.missing   { padding: var(--local-pad); }

/* css/stale-fallback — resolved value is 0.5rem, not 16px */
.stale     { gap: var(--spacing-sm, 16px); }

/* css/type-mismatch — colour token in a length context */
.type-err  { width: var(--color-fg); }

/* css/type-uncertain — dimension in a shorthand accepting many types */
.type-warn { background: var(--spacing-sm); }

/* css/unreachable-token — output file not in @import graph */
.unreach   { margin: var(--unreachable-token); }

/* css/primitive-token — prefer semantic alias */
.primitive { color: var(--color-palette-blue); }

/* css/scoped-usage — --button-pad is scoped to .button */
.card      { padding: var(--button-pad); }

/* css/no-color-scheme — light-dark() without color-scheme */
.no-scheme { color: light-dark(black, white); }
```

### DTCG diagnostics example

DTCG diagnostics surface problems in the token definitions themselves. These appear on the `tokens.json` artifact entry, not in CSS files:

```jsonc
{
  // dtcg/broken-alias — alias target does not exist
  "color.ghost":   { "aliasChain": ["color.nonexistent"], "type": "color" },

  // dtcg/schema-violation — "not-a-colour" is not a valid CSS colour
  "color.invalid": { "valueLight": "not-a-colour", "type": "color" },

  // dtcg/circular-alias — loop-a → loop-b → loop-a
  "color.loop-a":  { "aliasChain": ["color.loop-b", "color.loop-a"], "type": "color" },

  // dtcg/missing-type — no $type field, type is ambiguous
  "spacing.bare":  { "valueLight": "4px", "type": null },

  // dtcg/draft-syntax — uses pre-standard value/type without $ prefix
  "color.legacy":  { "type": "color", "extensions": { "com.terrazzo.draft-syntax": true } }
}
```

### Suppression syntax

Diagnostics can be suppressed inline with comments:

```css
/* Disable all checks for a region: */
/* terrazzo-lsp-disable */
.suppressed { width: var(--color-fg); }
/* terrazzo-lsp-enable */

/* Disable a specific code for the next line: */
/* terrazzo-lsp-disable css/primitive-token */
.selective { color: var(--color-palette-blue); }
/* terrazzo-lsp-enable css/primitive-token */
```

## Configuration

Create a `terrazzo-lsp.config.json` in your workspace root:

```json
{
  "artifacts": ["@canonical/design-tokens/dist/tokens.json"],
  "globalStylesheets": [".storybook/styles.css"]
}
```

If no config file is present, the output panel logs every candidate path it
tried, prints a ready-to-copy starter config, and then exits. For temporary
degraded startup, pass `--allow-degraded`.

```json
{ "artifacts": ["@canonical/design-tokens/dist/tokens.json"] }
```

### Full configuration reference

```json
{
  "artifacts": [],
  "distDir": "dist",
  "scanGlobs": ["src/**/*.css", "src/**/*.scss"],
  "globalStylesheets": null,
  "diagnostics": {
    "unknownProperties": "off",
    "missingFallback": "warning",
    "staleFallback": "warning",
    "typeMismatch": "error",
    "typeUncertain": "info",
    "unreachableToken": "warning",
    "primitiveToken": "warning",
    "scopedDeclaration": "warning",
    "lightDarkNoScheme": "info",
    "brokenAlias": "error",
    "schemaViolation": "error",
    "circularAlias": "error",
    "inferredType": "info",
    "draftFormat": "info",
    "ignoreGlobs": []
  },
  "hover": {
    "showColourSwatches": true,
    "showSelectorContext": true,
    "showProvenanceBadge": true,
    "showAliasChain": true,
    "showSourceLocation": true,
    "showNavigationTier": true,
    "showSpecReferences": true
  },
  "inlayHints": {
    "enabled": false,
    "showColourSwatches": true
  },
  "logLevel": "info"
}
```

| Key | Description |
|-----|-------------|
| `artifacts` | Paths to `tokens.json` build artifacts. Bare specifiers resolve through `node_modules/`. Relative paths must start with `./` or `../`. |
| `distDir` | Directory containing `*.css.map` files for source-mapping. |
| `scanGlobs` | Glob patterns for CSS/SCSS files to scan for diagnostics. |
| `globalStylesheets` | CSS files implicitly reachable from every document. `null` means auto-derive from the artifact. |
| `diagnostics` | Per-diagnostic severity overrides. Values: `"error"`, `"warning"`, `"info"`, `"off"`. |
| `diagnostics.ignoreGlobs` | Glob patterns for files excluded from diagnostics. |
| `hover` | Toggle individual sections of the hover popup. |
| `inlayHints` | Inlay hint display (disabled by default). |
| `logLevel` | Server log verbosity: `"off"`, `"error"`, `"warn"`, `"info"`, `"debug"`. |

### VS Code extension settings

| Setting | Default | Description |
|---------|---------|-------------|
| `terrazzo-lsp.serverPath` | `""` | Path to `dist/esm/cli.js`. If empty, uses the bundled server. |
| `terrazzo-lsp.runtime` | `""` | Runtime override. Empty = auto-detect (`bun` preferred, `node >= 22` fallback). |
| `terrazzo-lsp.trace.server` | `"off"` | `"off"` shows startup summary only. `"verbose"` adds per-request traces to the output channel. |

## Development

### Architecture

The LSP server is organised into four main layers:

| Layer | Path | Responsibility |
|-------|------|----------------|
| **Protocol** | `protocol/` | JSON-RPC message parsing, config loading, request/response matching |
| **Runtime** | `runtime/` | Server lifecycle, document management, import graph building, worker dispatch |
| **Graph** | `graph/` | Token graph data structure, artifact loading, reachability cache |
| **Providers** | `providers/` | All LSP features: completions, hover, diagnostics, rename, etc. |

**Diagnostics pipeline:**

```
CSS diagnostics:  orchestrateDiagnostics → per-rule check modules → makeDiagnostic
DTCG diagnostics: produceArtifactDiagnostics → per-rule check modules → makeDiagnostic
```

Each diagnostic rule lives in its own file (`diagnostics/checkMissingFallback.ts`, `artifactDiagnostics/checkBrokenAlias.ts`, etc.) with a co-located `.tests.ts` file. The orchestrator loops over usages (CSS) or tokens (DTCG) and delegates to each check function.

```bash
bun run build      # Compile LSP server (tsc)
bun run test       # Run tests
bun run check      # Lint + type check
```
