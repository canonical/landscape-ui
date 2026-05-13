// Stub — filled by Workstream A (lighthouse-a11y/specs/01-shared-config.md).
//
// Will export `{ a, aa, aaa }` audit sets keyed by WCAG-2.1 level.
// Until WS-A lands, this stub throws on access so accidental imports surface
// immediately rather than silently returning undefined audits.

module.exports = new Proxy(
  {},
  {
    get(_target, prop) {
      throw new Error(
        `.github/lighthouse/audit-sets.cjs is a foundation stub. ` +
          `Property "${String(prop)}" is unavailable until Workstream A lands. ` +
          `See lighthouse-a11y/specs/01-shared-config.md.`,
      );
    },
  },
);
