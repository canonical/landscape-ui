import { API_URL } from "@/constants";
import type { ComplianceReport } from "@/features/reports";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import { createEndpointStatusNetworkError } from "./_constants";
import { shouldApplyEndpointStatus } from "./_helpers";

export const complianceReport: ComplianceReport = {
  generated_at: "2026-06-11T10:38:00Z",
  total: 11,
  securely_patched: { count: 6, computer_ids: [1, 2, 3, 4, 5, 6] },
  not_securely_patched: { count: 5, computer_ids: [7, 8, 9, 10, 16] },
  covered_by_upgrade_profiles: { count: 1, computer_ids: [1] },
  contacted_recently: { count: 0, computer_ids: [] },
  usn_fixed_in: {
    "2": { count: 4, computer_ids: [1, 2, 3, 4] },
    "14": { count: 6, computer_ids: [1, 2, 3, 4, 5, 6] },
    "30": { count: 8, computer_ids: [1, 2, 3, 4, 5, 6, 7, 8] },
    "60": { count: 8, computer_ids: [1, 2, 3, 4, 5, 6, 7, 8] },
  },
  usn_pending_over_60_days: { count: 5, computer_ids: [7, 8, 9, 10, 16] },
};

// A report for a selection the server accounted for but with nothing to show,
// so the "empty" endpoint status can be simulated for this endpoint too.
const emptyBucket = { count: 0, computer_ids: [] };
export const emptyComplianceReport: ComplianceReport = {
  generated_at: complianceReport.generated_at,
  total: 0,
  securely_patched: emptyBucket,
  not_securely_patched: emptyBucket,
  covered_by_upgrade_profiles: emptyBucket,
  contacted_recently: emptyBucket,
  usn_fixed_in: {
    "2": emptyBucket,
    "14": emptyBucket,
    "30": emptyBucket,
    "60": emptyBucket,
  },
  usn_pending_over_60_days: emptyBucket,
};

export default [
  http.get(`${API_URL}computers/report`, () => {
    if (shouldApplyEndpointStatus("computers/report")) {
      const { status } = getEndpointStatus("computers/report");

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
