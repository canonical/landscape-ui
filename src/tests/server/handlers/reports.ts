import { API_URL } from "@/constants";
import type { ComplianceReport } from "@/features/reports";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import { createEndpointStatusNetworkError } from "./_constants";
import { shouldApplyEndpointStatus } from "./_helpers";

const OTHER_INSTANCE_ID = 11;

export const complianceReport: ComplianceReport = {
  generated_at: "2026-06-11T10:38:00Z",
  total: 12,
  securely_patched: {
    count: 7,
    computer_ids: [1, 2, 3, 4, 5, 6, OTHER_INSTANCE_ID],
  },
  not_securely_patched: { count: 5, computer_ids: [7, 8, 9, 10, 16] },
  covered_by_upgrade_profiles: { count: 1, computer_ids: [1] },
  contacted_recently: { count: 0, computer_ids: [] },
  usn_fixed_in: [
    { days: 2, count: 4, computer_ids: [1, 2, 3, 4] },
    { days: 14, count: 6, computer_ids: [1, 2, 3, 4, 5, 6] },
    { days: 30, count: 8, computer_ids: [1, 2, 3, 4, 5, 6, 7, 8] },
    { days: 60, count: 8, computer_ids: [1, 2, 3, 4, 5, 6, 7, 8] },
  ],
  usn_pending_over_60_days: { count: 5, computer_ids: [7, 8, 9, 10, 16] },
};

// A report for a selection the server accounted for but with nothing to show,
// so the "empty" endpoint status can be simulated for this endpoint too.
const emptyBucket = { count: 0, computer_ids: [] };
const emptyUsnFixedInBuckets = [
  { days: 2, ...emptyBucket },
  { days: 14, ...emptyBucket },
  { days: 30, ...emptyBucket },
  { days: 60, ...emptyBucket },
];
export const emptyComplianceReport: ComplianceReport = {
  generated_at: complianceReport.generated_at,
  total: 0,
  securely_patched: emptyBucket,
  not_securely_patched: emptyBucket,
  covered_by_upgrade_profiles: emptyBucket,
  contacted_recently: emptyBucket,
  usn_fixed_in: emptyUsnFixedInBuckets,
  usn_pending_over_60_days: emptyBucket,
};

export default [
  http.get(`${API_URL}computers/compliance-report`, () => {
    if (shouldApplyEndpointStatus("computers/compliance-report")) {
      const { status } = getEndpointStatus("computers/compliance-report");

      if (status === "error") {
        throw createEndpointStatusNetworkError();
      }

      if (status === "empty") {
        return HttpResponse.json(emptyComplianceReport);
      }
    }

    return HttpResponse.json(complianceReport);
  }),
];
