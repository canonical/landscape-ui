import { API_URL } from "@/constants";
import type { Activity } from "@/features/activities";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { http, HttpResponse } from "msw";

export default [
  http.get(`${API_URL}script-profiles`, ({ request }) => {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("archived") || "active";

    const filteredProfiles = scriptProfiles.filter((profile) => {
      return (
        profile.title.includes(search) &&
        (status == "all" ||
          (profile.archived ? status == "archived" : status == "active"))
      );
    });

    return HttpResponse.json({
      results: filteredProfiles.slice(offset, offset + limit),
      count: filteredProfiles.length,
    });
  }),

  http.get(`${API_URL}script-profiles/:profileId/activities`, ({ request }) => {
    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const activities: Activity[] = [
      {
        activity_status: "succeeded",
        completion_time: null,
        computer_id: 0,
        creation_time: "",
        creator: {
          email: "",
          id: 0,
          name: "",
        },
        deliver_delay_window: 0,
        id: 0,
        parent_id: null,
        result_code: null,
        result_text: null,
        summary: "",
        type: "",
      },
    ];

    return HttpResponse.json({
      results: activities.slice(offset, offset + limit),
      count: activities.length,
    });
  }),

  http.get(`${API_URL}script-profile-limits`, () => {
    return HttpResponse.json({
      max_num_computers: 5000,
      max_num_profiles: 10,
      min_interval: 30,
    });
  }),
];
