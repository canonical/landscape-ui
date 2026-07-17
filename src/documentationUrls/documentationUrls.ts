/**
 * Central registry for external documentation URLs that are referenced in more than one component.
 *
 * Rule:
 * - If a URL is used in TWO or more places → add it here and import from this file.
 * - If a URL is used in ONE place only → keep it in that component's local `constants.ts`.
 *
 * This makes future URL updates a single-line change regardless of how many components use the link.
 */

export const MANAGING_COMPUTERS_DOCUMENTATION_URL =
  "https://ubuntu.com/landscape/docs/managing-computers";

export const ADMINISTRATORS_DOCUMENTATION_URL =
  "https://ubuntu.com/landscape/docs/administrators";
