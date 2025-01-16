export const boolToLabel = (value: boolean) => (value ? "Yes" : "No");

export const getFormattedDateTime = (date: string) => {
  return new Date(date).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const getTableSortOrder = (sort: string | null) => {
  switch (sort) {
    case "asc":
      return "ascending";
    case "desc":
      return "descending";
    default:
      return "none";
  }
};
