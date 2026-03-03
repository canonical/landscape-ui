export interface DistributionUpgradeTarget {
  computer_id: number;
  computer_title: string;
  current_release_name: string | null;
  current_release_version: string | null;
  target_release_code_name: string | null;
  target_release_name: string | null;
  target_release_version: string | null;
  reason_code: string | null;
  reason_detail: string | null;
}
