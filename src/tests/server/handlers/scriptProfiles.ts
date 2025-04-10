import { API_URL } from "@/constants";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { http, HttpResponse } from "msw";

export default [
  http.get(`${API_URL}script-profiles`, ({ request }) => {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const filteredProfiles = scriptProfiles.filter((profile) => {
      return profile.title.includes(search);
    });

    return HttpResponse.json({
      results: filteredProfiles.slice(offset, offset + limit),
      count: filteredProfiles.length,
    });
  }),
];
