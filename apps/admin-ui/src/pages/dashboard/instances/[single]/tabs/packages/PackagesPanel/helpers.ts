export const getEmptyMessage = (filter: string, packageSearch: string) => {
  let message: string;

  if (filter === "") {
    message = "No packages found";
  } else if (filter === "upgrade") {
    message = "No available upgrades found";
  } else if (filter === "security") {
    message = "No available security upgrades found";
  } else if (filter === "installed") {
    message = "No installed packages found";
  } else {
    message = "No held packages found";
  }

  message = packageSearch
    ? `${message} with the search "${packageSearch}"`
    : message;

  return `${message}.`;
};
