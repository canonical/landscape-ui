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
