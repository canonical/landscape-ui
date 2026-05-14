import { API_URL } from "@/constants";
import type { Activity } from "@/features/activities";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { http, HttpResponse } from "msw";
import {
  createEndpointStatusError,
  createEndpointStatusNetworkError,
} from "./_constants";
import {
  generatePaginatedResponse,
  shouldApplyEndpointStatus,
} from "./_helpers";

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

    if (shouldApplyEndpointStatus("script-profiles")) {
      const { status: endpointStatusValue } = getEndpointStatus();

      if (endpointStatusValue === "error") {
        throw createEndpointStatusNetworkError();
      }

      if (endpointStatusValue === "empty") {
        return HttpResponse.json({
          results: [],
          count: 0,
          next: null,
          previous: null,
        });
      }
    }

    return HttpResponse.json(
      generatePaginatedResponse({
        data: filteredProfiles,
        limit,
        offset,
      }),
    );
  }),

  http.get<{ profileId: string }>(
    `${API_URL}script-profiles/:profileId`,
    ({ params }) => {
      if (shouldApplyEndpointStatus("script-profiles/:profileId")) {
        const { status } = getEndpointStatus();

        if (status === "error") {
          throw createEndpointStatusError();
        }

        if (status === "empty") {
          return HttpResponse.json(undefined);
        }
      }

      return HttpResponse.json(
        scriptProfiles.find(
          (scriptProfile) => scriptProfile.id === parseInt(params.profileId),
        ),
      );
    },
  ),

  http.get(`${API_URL}script-profiles/:profileId/activities`, ({ request }) => {
    const { searchParams } = new URL(request.url);

    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (shouldApplyEndpointStatus("script-profiles/:profileId/activities")) {
      const { status } = getEndpointStatus();

      if (status === "error") {
        throw createEndpointStatusNetworkError();
      }

      if (status === "empty") {
        return HttpResponse.json({
          results: [],
          count: 0,
          next: null,
          previous: null,
        });
      }
    }

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

    return HttpResponse.json(
      generatePaginatedResponse({
        data: activities,
        limit,
        offset,
      }),
    );
  }),

  http.get(`${API_URL}script-profile-limits`, () => {
    return HttpResponse.json({
      max_num_computers: 5000,
      max_num_profiles: 10,
      min_interval: 30,
    });
  }),
];
