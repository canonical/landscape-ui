export const getStatus = (status: string) => {
  switch (status) {
    case "active":
      return true;
    case "inactive":
      return false;
    default:
      return undefined;
  }
};
