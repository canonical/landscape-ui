export function getEnvironmentName(): string {
  const envFromCLI = process.env.TEST_ENV; // or some environment detection
  return envFromCLI || "standalone";
}

type FeatureName = "featureX" | "featureY" | "featureZ";

export function isFeatureEnabled(featureName: FeatureName): boolean {
  const env = getEnvironmentName();

  if (featureName === "featureX") {
    return env === "standalone";
  }

  return false;
}
