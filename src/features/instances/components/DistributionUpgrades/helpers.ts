export const formatDistributionTitle = (
  name: string | null | undefined,
  version: string | null | undefined,
  fallback: string,
) => {
  if (!name && !version) {
    return fallback;
  }

  if (name && version && !name.includes(version)) {
    return `${name} (${version})`;
  }

  return name ?? version ?? fallback;
};
