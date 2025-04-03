import { API_URL } from "@/constants";
import type {
  AddSecurityProfileParams,
  SecurityProfile,
} from "@/features/security-profiles";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { http, HttpResponse } from "msw";

export default [
  http.get(`${API_URL}security-profiles`, ({ request }) => {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "active";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const filteredProfiles = securityProfiles.filter((securityProfile) => {
      return (
        securityProfile.name.startsWith(search) &&
        securityProfile.status === status
      );
    });

    return HttpResponse.json({
      results: filteredProfiles.slice(offset, offset + limit),
      count: filteredProfiles.length,
    });
  }),

  http.post<never, AddSecurityProfileParams, SecurityProfile>(
    `${API_URL}security-profiles`,
    async ({ request }) => {
      const {
        benchmark,
        mode,
        title,
        start_date,
        access_group = "global",
        all_computers = false,
        tags = [],
      } = await request.json();

      return HttpResponse.json<SecurityProfile>({
        access_group,
        account_id: 0,
        all_computers,
        benchmark,
        creation_time: "",
        id: 0,
        last_run_results: {
          failing: 0,
          in_progress: 0,
          passing: 0,
          report_uri: null,
        },
        mode,
        modification_time: "",
        name: "",
        next_run_time: start_date,
        retention_period: 0,
        schedule: "",
        status: "active",
        tags,
        tailoring_file_uri: null,
        title,
      });
    },
  ),
];
