import { API_URL } from "@/constants";
import { securityProfiles } from "@/tests/mocks/securityProfiles";
import { http, HttpResponse } from "msw";

export default [
  http.get(`${API_URL}security-profiles`, ({ request }) => {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const statuses = searchParams.get("statuses") || ["active", "archived"];
    const passRateFrom = parseFloat(searchParams.get("passRateFrom") || "0");
    const passRateTo = parseFloat(searchParams.get("passRateTo") || "1");

    const filteredProfiles = securityProfiles.filter((securityProfile) => {
      const passRate =
        securityProfile.last_run_results.passing /
        securityProfile.associated_instances;

      return (
        securityProfile.name.startsWith(search) &&
        statuses.includes(securityProfile.status) &&
        passRate >= passRateFrom &&
        passRate <= passRateTo
      );
    });

    return HttpResponse.json({
      results: filteredProfiles.slice(offset, offset + limit),
      count: filteredProfiles.length,
    });
  }),
];
