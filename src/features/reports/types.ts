export interface ReportBucket {
  count: number;
  // The V2 computers/report endpoint always returns the ids per bucket (an
  // empty array when the count is zero), so this is required, not optional.
  computer_ids: number[];
}

export type UsnFixedInDays = "2" | "14" | "30" | "60";

export interface ComplianceReport {
  generated_at: string;
  total: number;
  securely_patched: ReportBucket;
  not_securely_patched: ReportBucket;
  covered_by_upgrade_profiles: ReportBucket;
  contacted_recently: ReportBucket;
  usn_fixed_in: Record<UsnFixedInDays, ReportBucket>;
  usn_pending_over_60_days: ReportBucket;
}
