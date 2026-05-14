export interface DistributionUpgradeTarget {
  computer_id: number;
  computer_title: string;
  current_release: {
    name: string;
    version: string;
  } | null;
  target_release: {
    code_name: string;
    name: string;
    version: string;
  } | null;
  reason: {
    code: string;
    detail: string;
  } | null;
}
