// Curated Lighthouse a11y audit sets, keyed by WCAG-2.1 conformance level.
//
// Each level exports `{ defaultMinScore, assertions }` consumed by
// `lighthouserc.base.cjs:createBaseConfig`. Assertion values follow
// Lighthouse CI shape: `["error" | "warn", { minScore: 1 }]`.
//
// Inline WCAG references are informational — Lighthouse audits don't map
// 1:1 to WCAG success criteria, but the mapping below reflects the closest
// criterion each audit helps cover.

const levelA = {
  "image-alt": ["error", { minScore: 1 }], // 1.1.1 Non-text Content
  "document-title": ["error", { minScore: 1 }], // 2.4.2 Page Titled
  "html-has-lang": ["error", { minScore: 1 }], // 3.1.1 Language of Page
  "link-name": ["error", { minScore: 1 }], // 2.4.4 / 4.1.2
  "button-name": ["error", { minScore: 1 }], // 4.1.2 Name, Role, Value
  "valid-lang": ["error", { minScore: 1 }], // 3.1.2 Language of Parts
  "meta-viewport": ["warn", { minScore: 1 }], // 1.4.4 Resize Text (warn-level)
};

const levelAA = {
  ...levelA,
  "color-contrast": ["error", { minScore: 1 }], // 1.4.3 Contrast (Minimum)
  label: ["error", { minScore: 1 }], // 1.3.1 / 4.1.2
  "aria-allowed-attr": ["error", { minScore: 1 }], // 4.1.2
  "aria-required-attr": ["error", { minScore: 1 }], // 4.1.2
  "aria-roles": ["error", { minScore: 1 }], // 4.1.2
  "aria-valid-attr": ["error", { minScore: 1 }], // 4.1.2
  "aria-valid-attr-value": ["error", { minScore: 1 }], // 4.1.2
  "aria-hidden-body": ["error", { minScore: 1 }], // 4.1.2
  "aria-hidden-focus": ["error", { minScore: 1 }], // 4.1.2
  tabindex: ["error", { minScore: 1 }], // 2.4.3 Focus Order
  "frame-title": ["error", { minScore: 1 }], // 2.4.1 / 4.1.2
  bypass: ["error", { minScore: 1 }], // 2.4.1 Bypass Blocks
  "definition-list": ["error", { minScore: 1 }], // 1.3.1 Info and Relationships
  dlitem: ["error", { minScore: 1 }], // 1.3.1
  "duplicate-id-aria": ["error", { minScore: 1 }], // 4.1.1
  "form-field-multiple-labels": ["warn", { minScore: 1 }], // 3.3.2 (warn)
  list: ["error", { minScore: 1 }], // 1.3.1
  listitem: ["error", { minScore: 1 }], // 1.3.1
};

const levelAAA = {
  ...levelAA,
  // AAA audits are still maturing in Lighthouse — keep them all `warn`.
  "target-size": ["warn", { minScore: 1 }], // 2.5.5 Target Size
  "focus-traps": ["warn", { minScore: 1 }], // 2.1.2 No Keyboard Trap
  "focusable-controls": ["warn", { minScore: 1 }], // 2.1.1 Keyboard
  "interactive-element-affordance": ["warn", { minScore: 1 }],
  "heading-order": ["warn", { minScore: 1 }], // 1.3.1 / 2.4.6
  "skip-link": ["warn", { minScore: 1 }], // 2.4.1 Bypass Blocks
  "use-landmarks": ["warn", { minScore: 1 }], // 1.3.1
};

module.exports = {
  a: { defaultMinScore: 0.85, assertions: levelA },
  aa: { defaultMinScore: 0.9, assertions: levelAA },
  aaa: { defaultMinScore: 0.95, assertions: levelAAA },
};
