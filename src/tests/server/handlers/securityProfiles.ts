import { API_URL } from "@/constants";
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
];
