export const getIconRootPath = (rootPath: string | undefined): string => {
  const normalizedRootPath = rootPath?.replace(/^\/+|\/+$/g, "");

  return normalizedRootPath ? `/${normalizedRootPath}/icons` : "/icons";
};
