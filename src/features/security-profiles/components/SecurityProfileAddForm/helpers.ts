export const phrase = (strings: string[] = []) => {
  return `${strings.slice(0, -1).join(", ")}${strings.length > 2 ? "," : ""}${strings.length > 1 ? " and " : ""}${strings.slice(-1)}`;
};
