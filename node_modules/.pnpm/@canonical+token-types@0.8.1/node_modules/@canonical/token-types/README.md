# @canonical/token-types

Shared TypeScript types for Canonical design token tooling. This package defines the JSON contract between the Terrazzo CSS plugin (producer) and the LSP (consumer) — the `tokens.json` artifact format.

## Installation

```bash
bun add -d @canonical/token-types
```

## Usage

Import types for working with the `tokens.json` artifact:

```ts
import type { Artifact, ArtifactToken, ArtifactEnvelope } from "@canonical/token-types";

function loadTokens(json: ArtifactEnvelope): Artifact {
  if ("tokens" in json) return json.tokens; // wrapped envelope
  return json;                               // flat artifact
}
```

Use the runtime guard to narrow DTCG type strings:

```ts
import { isKnownDtcgTokenType } from "@canonical/token-types";

if (isKnownDtcgTokenType(token.type)) {
  // token.type is narrowed to KnownDtcgTokenType
}
```

## Exports

### Types

| Type | Description |
|------|-------------|
| `Artifact` | The complete artifact: CSS variable name to token metadata. |
| `ArtifactToken` | A single token entry combining metadata, resolved values, source location, derivation, and registration fields. |
| `ArtifactTokenInit` | Input contract for constructing a DTCG-sourced artifact token. |
| `DerivedArtifactTokenInit` | Input contract for constructing a derived or plugin-generated token. |
| `ArtifactEnvelope` | Union of flat `Artifact` and `WrappedArtifactEnvelope` — the plugin may emit either. |
| `WrappedArtifactEnvelope` | Artifact payload with `version`, `generator`, and `tokens` fields. |
| `ArtifactDeclaration` | A declaration site (selector, file, line, enclosing at-rules). |
| `ArtifactAtRule` | An at-rule context (name + prelude). |
| `DtcgTokenType` | DTCG `$type` values — known literals with a string escape hatch for forward compatibility. |
| `KnownDtcgTokenType` | The known DTCG type literals (`color`, `dimension`, `number`, etc.). |
| `TokenTier` | Tier classification: `"primitive"`, `"semantic"`, or `"derived"`. |
| `ArtifactTier` | Tier strings carried by artifacts — known tiers plus a string escape hatch. |
| `DerivationKind` | Derivation formula kinds (`"hover"`, `"active"`, `"disabled"`, `"delta"`, etc.). |

### Runtime

| Export | Description |
|--------|-------------|
| `KNOWN_DTCG_TOKEN_TYPES` | `const` array of all recognised DTCG type literals. |
| `isKnownDtcgTokenType(value)` | Type guard narrowing a string to `KnownDtcgTokenType`. |

## Development

```bash
bun run build     # Compile (tsc)
bun run test      # Run type-level tests
bun run check     # Type check
```
