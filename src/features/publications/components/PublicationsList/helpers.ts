export const getSourceType = (source: string) => {
  if (source.startsWith("mirrors/")) {
    return "Mirror";
  }

  if (source.startsWith("locals/")) {
    return "Local repository";
  }

  return "Unknown";
};
