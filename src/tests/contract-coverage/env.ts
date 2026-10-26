/**
 * Opt-in switch for the MSW contract-coverage recorder. `pnpm coverage:full`
 * sets it; ordinary `vitest` / `pnpm coverage` runs skip the recorder so they
 * don't pay for cloning, redacting and logging every mocked response.
 */
export const CONTRACT_COVERAGE_ENV = "MSW_CONTRACT_COVERAGE";

export const isContractCoverageEnabled = (): boolean =>
  process.env[CONTRACT_COVERAGE_ENV] === "true";
