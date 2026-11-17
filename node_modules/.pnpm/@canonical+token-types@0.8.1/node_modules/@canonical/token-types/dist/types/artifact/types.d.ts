/**
 * Canonical artifact types — the JSON contract between the Terrazzo CSS plugin
 * (producer) and the LSP (consumer).
 *
 * This is the single source of truth. Both `@canonical/terrazzo-plugin-css` and
 * `@canonical/terrazzo-lsp` import from this package.
 */
/** Canonical tier literals emitted by Canonical token producers. */
export type KnownTokenTier = "primitive" | "semantic" | "derived";
/** Tier classification for Canonical-produced tokens. */
export type TokenTier = KnownTokenTier;
/**
 * Tier strings carried by artifacts.
 *
 * Consumers should distinguish known tiers, but must tolerate non-Canonical
 * tier strings from other producers.
 */
export type ArtifactTier = KnownTokenTier | (string & {});
/** Shared list of known DTCG token type literals recognised by Canonical tooling. */
export declare const KNOWN_DTCG_TOKEN_TYPES: readonly ["color", "dimension", "number", "typography", "fontFamily", "fontWeight", "fontStyle", "figureStyle", "textDecoration", "letterCase", "fontPosition", "duration", "cubicBezier", "gradient", "border", "shadow", "transition", "strokeStyle"];
/** Known DTCG token type literals recognised by Canonical tooling. */
export type KnownDtcgTokenType = (typeof KNOWN_DTCG_TOKEN_TYPES)[number];
/**
 * DTCG $type values used by the Canonical token system.
 *
 * The `(string & {})` arm preserves backward compatibility — callers may
 * pass arbitrary strings without a type error, but autocomplete still
 * suggests the known literals.
 */
export type DtcgTokenType = KnownDtcgTokenType | (string & {});
/** Runtime guard for narrowing unknown strings to the shared known DTCG set. */
export declare function isKnownDtcgTokenType(value: string | null | undefined): value is KnownDtcgTokenType;
/** Canonical derivation literals emitted by Canonical token producers. */
export type KnownDerivationKind = "hover" | "active" | "disabled" | "delta" | "channel-modifier" | "channel-surface";
/** Derivation formula kind for Canonical-produced derived tokens. */
export type DerivationKind = KnownDerivationKind;
/**
 * Derivation strings carried by artifacts.
 *
 * Consumers should recognise known derivations, but must tolerate
 * non-Canonical derivation strings from other producers.
 */
export type ArtifactDerivationKind = KnownDerivationKind | (string & {});
/** An at-rule context surrounding a declaration (e.g. `@layer ds.modifiers`). */
export interface ArtifactAtRule {
    /** At-rule name (e.g. "layer", "media"). */
    name: string;
    /** At-rule prelude (e.g. "ds.modifiers", "(prefers-color-scheme: dark)"). */
    prelude: string;
}
/** A declaration site for an artifact token. */
export interface ArtifactDeclaration {
    /** CSS selector (e.g. ":root", ".warning", "*"). */
    selector: string;
    /** CSS output file (e.g. "modifiers.theme.css"). */
    file: string;
    /** 0-indexed line number in the CSS output file. */
    line: number;
    /** Enclosing at-rules, innermost-first (e.g. `@layer`, `@media`). */
    atRules?: ArtifactAtRule[];
}
/** Shared artifact metadata fields carried across producer and consumer layers. */
export interface ArtifactMetadataFields {
    /** DTCG token ID from source, or `null` for derived tokens. */
    id: string | null;
    /** DTCG $type. */
    type: DtcgTokenType;
    /** Token tier classification. */
    tier: ArtifactTier;
    /** DTCG $description. */
    description?: string;
    /** Full alias resolution chain (token IDs). */
    aliasChain?: string[];
    /** DTCG $extensions passthrough. */
    extensions?: Record<string, unknown>;
}
/** Shared resolved value fields carried in artifacts. */
export interface ArtifactResolvedValueFields {
    /** Resolved CSS value (mode-invariant tokens). */
    value?: string;
    /** Light-mode resolved CSS value. */
    valueLight?: string;
    /** Dark-mode resolved CSS value. */
    valueDark?: string;
    /** `true` when valueLight !== valueDark. */
    isPaired: boolean;
}
/** Shared source-location fields carried in artifacts. */
export interface ArtifactSourceFields {
    /** DTCG source file path (relative). */
    sourceFile?: string;
    /** Line number in the DTCG source file. */
    sourceLine?: number;
    /** CSS output file containing this token's declaration. */
    cssOutputFile: string;
    /** 0-indexed line number in the CSS output file (legacy, prefer `declarations`). */
    cssOutputLine?: number;
    /** Declaration sites: where this token is provided in the CSS output. */
    declarations?: ArtifactDeclaration[];
}
/** Shared derived-token fields carried in artifacts. */
export interface ArtifactDerivationFields {
    /** CSS var name of the source token (derived tier). */
    derivedFrom?: string;
    /** Formula kind (derived tier). */
    derivation?: ArtifactDerivationKind;
}
/** Shared CSS `@property` registration fields carried in artifacts. */
export interface ArtifactRegistrationFields {
    /** `true` when the token has a CSS `@property` registration. */
    registered?: boolean;
    /** `@property` syntax (e.g. `"<color>"`). */
    syntax?: string | null;
    /** `@property` inherits flag. */
    inherits?: boolean | null;
    /** `@property` initial-value. */
    initialValue?: string | null;
}
/** A single token entry in the artifact JSON. */
export interface ArtifactToken extends ArtifactMetadataFields, ArtifactResolvedValueFields, ArtifactSourceFields, ArtifactDerivationFields, ArtifactRegistrationFields {
    /** CSS custom property name as emitted. */
    cssVar: string;
}
/** Input contract for constructing a DTCG-sourced artifact token. */
export interface ArtifactTokenInit {
    /** CSS custom property name as emitted. */
    cssVar: string;
    /** DTCG token ID from source. */
    id: string;
    /** DTCG $type. */
    type: DtcgTokenType;
    /** Token tier classification. */
    tier: TokenTier;
    /** CSS output file containing this token's declaration. */
    cssOutputFile: string;
    /** DTCG $description. */
    description?: string;
    /** Declaration sites emitted in CSS output. */
    declarations?: ArtifactDeclaration[];
    /** Full alias resolution chain (token IDs). */
    aliasChain?: string[];
    /** Light-mode resolved CSS value. */
    valueLight?: string;
    /** Dark-mode resolved CSS value. */
    valueDark?: string;
    /** DTCG source file path (relative). */
    sourceFile?: string;
    /** Line number in the DTCG source file. */
    sourceLine?: number;
}
/** Input contract for constructing a derived or plugin-generated artifact token. */
export interface DerivedArtifactTokenInit {
    /** CSS custom property name as emitted. */
    cssVar: string;
    /** DTCG $type. */
    type: DtcgTokenType;
    /** Token tier classification. */
    tier: TokenTier;
    /** CSS output file containing this token's declaration. */
    cssOutputFile: string;
    /** CSS var name of the source token. */
    derivedFrom: string;
    /** Formula kind for the derived token. */
    derivation: DerivationKind;
    /** DTCG $description. */
    description?: string;
    /** Declaration sites emitted in CSS output. */
    declarations?: ArtifactDeclaration[];
    /** Light-mode resolved CSS value. */
    valueLight?: string;
    /** Dark-mode resolved CSS value. */
    valueDark?: string;
}
/** The complete artifact: CSS variable name → token metadata. */
export type Artifact = Record<string, ArtifactToken>;
/** Wrapped artifact payload with metadata envelope. */
export interface WrappedArtifactEnvelope {
    version: string;
    generator: string;
    tokens: Artifact;
}
/**
 * Wrapped artifact format (supports legacy/spec envelope).
 * The plugin may emit either flat or wrapped.
 */
export type ArtifactEnvelope = Artifact | WrappedArtifactEnvelope;
//# sourceMappingURL=types.d.ts.map