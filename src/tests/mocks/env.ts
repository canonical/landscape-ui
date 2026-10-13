import type { EnvContextState } from "@/context/env";

// Resolved deployment modes for `useEnv`. Vitest inherits `VITE_SELF_HOSTED_ENV`
// from the shell and the env files (CI sets it to `true`), so a test whose
// subject depends on the mode mocks the hook instead of trusting `GET about`.

export const saasEnv: EnvContextState = {
  envLoading: false,
  isSaas: true,
  isSelfHosted: false,
  packageVersion: "0.0.0-dev",
  revision: "dev-rev",
  displayDisaStigBanner: false,
};

export const selfHostedEnv: EnvContextState = {
  ...saasEnv,
  isSaas: false,
  isSelfHosted: true,
};

/**
 * A `useEnv` for a SaaS deployment, where super admin mode exists:
 * `vi.mock("@/hooks/useEnv", () => import("@/tests/mocks/env"))`.
 */
export default (): EnvContextState => saasEnv;
