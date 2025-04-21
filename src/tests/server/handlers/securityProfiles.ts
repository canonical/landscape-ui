import { API_URL } from "@/constants";
import type {
  AddSecurityProfileParams,
  SecurityProfile,
} from "@/features/security-profiles";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse } from "./_helpers";
import { getEndpointStatus } from "@/tests/controllers/controller";

export default [
  http.get(`${API_URL}security-profiles`, ({ request }) => {
    const { searchParams } = new URL(request.url);

    const statusesParam = searchParams.get("statuses") ?? "[]";

    const search = searchParams.get("search") || "";
    const statuses =
      statusesParam == "[]"
        ? ["active", "archived", "over-limit"]
        : statusesParam.split(",");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const passRateFrom = parseFloat(searchParams.get("passRateFrom") || "0");
    const passRateTo = parseFloat(searchParams.get("passRateTo") || "100");

    const filteredProfiles = securityProfiles.filter((securityProfile) => {
      const totalInstances = securityProfile.associated_instances;
      const passed = securityProfile.last_run_results.passing ?? 0;

      const rawPassRate =
        totalInstances > 0 ? (passed / totalInstances) * 100 : 0;
      const passRate = Math.round(rawPassRate);

      return (
        securityProfile.name.startsWith(search) &&
        statuses.includes(securityProfile.status) &&
        passRate >= passRateFrom &&
        passRate <= passRateTo
      );
    });

    return HttpResponse.json(
      generatePaginatedResponse({
        data: filteredProfiles,
        offset,
        limit,
        search,
        searchFields: ["name"],
      }),
    );
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
          timestamp: "",
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
        associated_instances: 0,
        restart_deliver_delay_window: 0,
        restart_deliver_delay: 0,
      });
    },
  ),

  http.post(`${API_URL}security-profiles/:id\\:execute`, async () => {
    const endpointStatus = getEndpointStatus();
    if (endpointStatus.status === "error") {
      return HttpResponse.json(
        {
          error: "InternalServerError",
          message: "Error response",
        },
        {
          status: 500,
        },
      );
    }
    return HttpResponse.json();
  }),
];
