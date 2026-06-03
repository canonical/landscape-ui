import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import { getAlertStatus } from "@/features/alert-notifications";
import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import { ALERT_STATUSES } from "../../constants";
import {
  getFeatures,
  hasRegularUpgrades,
  hasSecurityUpgrades,
} from "../../helpers";
import type { StatusItem, StatusSeverity } from "./types";

// Upgrade alerts are surfaced in the dedicated "Upgrades" column, so they are
// excluded from the status indicators.
const UPGRADE_ALERT_TYPES = ["PackageUpgradesAlert", "SecurityUpgradesAlert"];

// The severity of a status is derived from the colour of its icon so that the
// pill tint always matches what the user sees (red/amber/blue).
const DANGER_ICONS = new Set([
  "disconnect-color",
  "power-off-color",
  "canvas-color",
  "package-reporter-alert",
  "security-upgrades",
]);

const WARNING_ICONS = new Set([
  "package-profiles-alert",
  "computer-esm-disabled-alert-color",
  "contract-expiration-alert",
  "regular-upgrades",
]);

const getSeverityFromIcon = (icon: string): StatusSeverity => {
  if (DANGER_ICONS.has(icon)) {
    return "danger";
  }

  if (WARNING_ICONS.has(icon)) {
    return "warning";
  }

  return "info";
};

const SEVERITY_RANK: Record<StatusSeverity, number> = {
  danger: 0,
  warning: 1,
  info: 2,
  positive: 3,
  neutral: 4,
};

export const getInstanceStatuses = (
  instance: InstanceWithoutRelation,
): StatusItem[] => {
  if (instance.archived) {
    return [
      { key: "archived", label: "Archived", icon: "archive", severity: "neutral" },
    ];
  }

  const alerts = (instance.alerts ?? []).filter(
    ({ type }) => !UPGRADE_ALERT_TYPES.includes(type),
  );

  if (0 === alerts.length) {
    return [
      {
        key: "online",
        label:
          ALERT_STATUSES.Online.alternateLabel ?? ALERT_STATUSES.Online.label,
        icon: ALERT_STATUSES.Online.icon.color,
        severity: "info",
      },
    ];
  }

  return alerts
    .map(({ type, summary }) => {
      const icon = getAlertStatus(type).icon.color;
      return { key: type, label: summary, icon, severity: getSeverityFromIcon(icon) };
    })
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
};

interface VisibleStatuses {
  visible: StatusItem[];
  hidden: StatusItem[];
}

// All danger statuses stay visible; if there are none, the single most severe
// status is shown so the cell is never reduced to a bare counter. Everything
// else collapses behind the expander.
export const splitStatuses = (statuses: StatusItem[]): VisibleStatuses => {
  const dangerStatuses = statuses.filter(({ severity }) => "danger" === severity);
  const visible = dangerStatuses.length ? dangerStatuses : statuses.slice(0, 1);
  const hidden = statuses.filter((status) => !visible.includes(status));

  return { visible, hidden };
};

// Meaningful, colour-coded icons (defined in styles/partials/icons.scss)
// replace the colour-only dots so the upgrade type is recognisable from the
// glyph as well as the colour.
const SECURITY_UPGRADE_ICON = "security-error--negative";
const REGULAR_UPGRADE_ICON = "security-warning--caution";
const UP_TO_DATE_ICON = "security-tick--positive";

interface UpgradeAmounts {
  regular: string | false;
  security: string | false;
}

const getUpgradesFromAlerts = (alerts: Instance["alerts"]): UpgradeAmounts => ({
  regular: hasRegularUpgrades(alerts)
    ? ALERT_STATUSES.PackageUpgradesAlert.label
    : false,
  security: hasSecurityUpgrades(alerts)
    ? ALERT_STATUSES.SecurityUpgradesAlert.label
    : false,
});

const getUpgradesFromUpgrades = (
  upgrades: Instance["upgrades"],
): UpgradeAmounts => {
  if (!upgrades) {
    return { regular: false, security: false };
  }

  return {
    regular: upgrades.regular
      ? pluralize(upgrades.regular, ["regular upgrade"], "exact")
      : false,
    security: upgrades.security
      ? pluralize(upgrades.security, ["security upgrade"], "exact")
      : false,
  };
};

// Upgrades get the same labelled-pill treatment as statuses so severity is
// communicated by text and tint rather than colour alone. Returns an empty
// list when the instance has no packages feature (the cell then shows "---").
export const getUpgradeStatuses = (instance: Instance): StatusItem[] => {
  if (!getFeatures(instance).packages) {
    return [];
  }

  const { regular, security } = DETAILED_UPGRADES_VIEW_ENABLED
    ? getUpgradesFromUpgrades(instance.upgrades)
    : getUpgradesFromAlerts(instance.alerts);

  const statuses: StatusItem[] = [];

  if (security) {
    statuses.push({
      key: "security",
      label: security,
      icon: SECURITY_UPGRADE_ICON,
      severity: "danger",
    });
  }

  if (regular) {
    statuses.push({
      key: "regular",
      label: regular,
      icon: REGULAR_UPGRADE_ICON,
      severity: "warning",
    });
  }

  if (0 === statuses.length) {
    statuses.push({
      key: "up-to-date",
      label:
        ALERT_STATUSES.UpToDate.alternateLabel ?? ALERT_STATUSES.UpToDate.label,
      icon: UP_TO_DATE_ICON,
      severity: "positive",
    });
  }

  return statuses;
};

// Tags carry no severity, so they render as neutral pills badged with the tag
// glyph — the same chip family as statuses and upgrades.
export const getTagStatuses = (tags: string[]): StatusItem[] =>
  tags.map((tag) => ({
    key: tag,
    label: tag,
    icon: "tag",
    severity: "neutral",
  }));
