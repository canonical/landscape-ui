export const redirectToExternalUrl = (
  url: string,
  options?: { replace: boolean },
) => {
  if (options?.replace) {
    window.location.replace(url);
  } else {
    window.location.assign(url);
  }
};
