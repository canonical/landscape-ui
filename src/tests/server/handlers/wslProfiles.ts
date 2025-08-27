import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse } from "./_helpers";

export default [
  http.get(`${API_URL}child-instance-profiles`, ({ request }) => {
    const { searchParams } = new URL(request.url);
    const endpointStatus = getEndpointStatus();

    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const filteredWslProfiles = wslProfiles.filter((wslProfile) => {
      return wslProfile.title.includes(search);
    });

    if (
      !endpointStatus.path ||
      (endpointStatus.path &&
        endpointStatus.path.includes("child-instance-profiles"))
    ) {
      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      if (endpointStatus.status === "empty") {
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
        data: filteredWslProfiles,
        limit,
        offset,
      }),
    );
  }),

  http.get(`${API_URL}child-instance-profiles/:name`, ({ params }) => {
    const endpointStatus = getEndpointStatus();

    if (
      !endpointStatus.path ||
      (endpointStatus.path &&
        endpointStatus.path.includes("child-instance-profiles/:name"))
    ) {
      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      if (endpointStatus.status === "empty") {
        return HttpResponse.json(undefined);
      }
    }

    return HttpResponse.json(
      wslProfiles.find((wslProfile) => wslProfile.name === params.name),
    );
  }),
];
