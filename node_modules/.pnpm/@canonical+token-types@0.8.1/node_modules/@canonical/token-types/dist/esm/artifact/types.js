/**
 * Canonical artifact types — the JSON contract between the Terrazzo CSS plugin
 * (producer) and the LSP (consumer).
 *
 * This is the single source of truth. Both `@canonical/terrazzo-plugin-css` and
 * `@canonical/terrazzo-lsp` import from this package.
 */
/** Shared list of known DTCG token type literals recognised by Canonical tooling. */
export const KNOWN_DTCG_TOKEN_TYPES = [
    "color",
    "dimension",
    "number",
    "typography",
    "fontFamily",
    "fontWeight",
    "fontStyle",
    "figureStyle",
    "textDecoration",
    "letterCase",
    "fontPosition",
    "duration",
    "cubicBezier",
    "gradient",
    "border",
    "shadow",
    "transition",
    "strokeStyle",
];
/** Runtime guard for narrowing unknown strings to the shared known DTCG set. */
export function isKnownDtcgTokenType(value) {
    return (typeof value === "string" &&
        KNOWN_DTCG_TOKEN_TYPES.includes(value));
}
//# sourceMappingURL=types.js.map