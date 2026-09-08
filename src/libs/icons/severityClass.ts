import type { IconSeverity } from "./types";
import classes from "./severity.module.scss";

const SEVERITY_CLASS: Record<IconSeverity, string | undefined> = {
  danger: classes.danger,
  warning: classes.warning,
  positive: classes.positive,
  info: classes.info,
  neutral: classes.neutral,
};

export const severityClass = (
  severity: IconSeverity | undefined,
): string | undefined => {
  if (!severity) {
    return undefined;
  }

  return SEVERITY_CLASS[severity];
};
