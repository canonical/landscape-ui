export const maybeRemoveTrailingSlash = (path: string) => {
  return path.length > 1 ? path.replace(/\/$/, "") : path;
};
