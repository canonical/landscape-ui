import { API_URL, API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";
import { isAction, shouldApplyEndpointStatus } from "./_helpers";

export default [
  http.get(`${API_URL}packageprofiles`, ({ request }) => {
    const { searchParams } = new URL(request.url);

    const profileNames = searchParams.get("names")?.split(",");

    return HttpResponse.json({
      result: packageProfiles.filter((packageProfile) =>
        profileNames ? profileNames.includes(packageProfile.name) : true,
      ),
    });
  }),

  http.get(
    `${API_URL}packageprofiles/:profileName/constraints`,
    ({ params, request }) => {
      const { searchParams } = new URL(request.url);

      const search = searchParams.get("search");
      const limit = parseInt(searchParams.get("limit") || "20");
      const offset = parseInt(searchParams.get("offset") || "0");

      const constraints =
        packageProfiles
          .find(({ name }) => name === params.profileName)
          ?.constraints.filter(
            (constraint) => !search || constraint.package.includes(search),
          ) ?? [];

      return HttpResponse.json({
        results: constraints.slice(offset, offset + limit),
        count: constraints.length,
      });
    },
  ),

  http.put(`${API_URL}packageprofiles/:profileName`, () => {
    if (shouldApplyEndpointStatus("packageprofiles/:profileName")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.error();
  }),

  http.post(`${API_URL}packageprofiles`, () => {
    if (shouldApplyEndpointStatus("packageprofiles")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json();
  }),

  http.post(`${API_URL}packageprofiles/:profileName/constraints`, () => {
    if (shouldApplyEndpointStatus("packageprofiles/:profileName/constraints")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json();
  }),

  http.delete(`${API_URL}packageprofiles/:profileName/constraints`, () => {
    if (shouldApplyEndpointStatus("packageprofiles/:profileName/constraints")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json();
  }),

  http.put(
    `${API_URL}packageprofiles/:profileName/constraints/:constraintId`,
    () => {
      if (
        shouldApplyEndpointStatus(
          "packageprofiles/:profileName/constraints/:constraintId",
        )
      ) {
        const { status } = getEndpointStatus();
        if (status === "error") {
          throw createEndpointStatusError();
        }
      }

      return HttpResponse.json();
    },
  ),

  http.get(API_URL_OLD, ({ request }) => {
    if (shouldApplyEndpointStatus()) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    if (!isAction(request, "RemovePackageProfile")) {
      return;
    }

    return HttpResponse.json();
  }),
];
