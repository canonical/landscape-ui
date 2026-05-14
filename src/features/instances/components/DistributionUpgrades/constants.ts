export const INELIGIBLE_REASON_TITLES: Record<string, string> = {
  client_upgrade_required: "Client update required",
  policy_disabled: "Policy is preventing distribution upgrades",
  lts_only_no_lts_target: "Policy is preventing distribution upgrades",
  no_meta_release: "No upgrade available",
  no_upgrade_target: "No upgrade available",
  unsupported_release: "Unsupported distribution",
  no_distribution: "Unknown distribution",
};

export const ORDERED_REASONS = [
  "Client update required",
  "Policy is preventing distribution upgrades",
  "No upgrade available",
  "Unsupported distribution",
  "Unknown distribution",
];
