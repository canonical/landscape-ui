/**
 * Central registry for external documentation URLs that are referenced in more than one component.
 *
 * Rule:
 * - If a URL is used in TWO or more places → add it here and import from this file.
 * - If a URL is used in ONE place only → keep it in that component's local `constants.ts`.
 * - Always build documentation URLs using the basepath from `EXTERNAL_PATHS.documentation` in `@/libs/routes/external`. This makes domain updates easier.
 *
 * This makes future URL updates a single-line change regardless of how many components use the link.
 */

import { EXTERNAL_PATHS } from "@/libs/routes/external";

export const MANAGING_COMPUTERS_DOCUMENTATION_URL = `${EXTERNAL_PATHS.documentation}/managing-computers`;

export const ADMINISTRATORS_DOCUMENTATION_URL = `${EXTERNAL_PATHS.documentation}/administrators`;
