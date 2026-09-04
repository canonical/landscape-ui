export interface ReportBucket {
  count: number;
  // The V2 computers/compliance-report endpoint always returns the ids per bucket (an
  // empty array when the count is zero), so this is required, not optional.
  computer_ids: number[];
}

export type UsnFixedInBucket = ReportBucket & {
  days: number;
};

export interface ComplianceReport {
  generated_at: string;
  total: number;
  securely_patched: ReportBucket;
  not_securely_patched: ReportBucket;
  covered_by_upgrade_profiles: ReportBucket;
  contacted_recently: ReportBucket;
  usn_fixed_in: UsnFixedInBucket[];
  usn_pending_over_60_days: ReportBucket;
}
