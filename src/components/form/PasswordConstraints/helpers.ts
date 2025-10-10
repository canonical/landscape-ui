export const getIconName = (
  passed: boolean,
  hasError: boolean,
  touched: boolean,
): "success" | "error" | "information--muted" => {
  if (passed) {
    return "success";
  }
  if (hasError && touched) {
    return "error";
  }

  return "information--muted";
};
