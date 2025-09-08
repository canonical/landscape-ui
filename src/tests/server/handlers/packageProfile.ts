import { API_URL, API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { http, HttpResponse } from "msw";
import { ENDPOINT_STATUS_API_ERROR } from "./_constants";
import { isAction } from "./_helpers";

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
    const endpointStatus = getEndpointStatus();

    if (
      !endpointStatus.path ||
      (endpointStatus.path &&
        endpointStatus.path.includes("packageprofiles/:profileName"))
    ) {
      if (endpointStatus.status === "error") {
        throw ENDPOINT_STATUS_API_ERROR;
      }
    }

    return HttpResponse.error();
  }),

  http.post(`${API_URL}packageprofiles`, () => {
    const endpointStatus = getEndpointStatus();

    if (
      !endpointStatus.path ||
      (endpointStatus.path && endpointStatus.path.includes("packageprofiles"))
    ) {
      if (endpointStatus.status === "error") {
        throw ENDPOINT_STATUS_API_ERROR;
      }
    }

    return HttpResponse.json();
  }),

  http.post(`${API_URL}packageprofiles/:profileName/constraints`, () => {
    const endpointStatus = getEndpointStatus();

    if (
      !endpointStatus.path ||
      (endpointStatus.path &&
        endpointStatus.path.includes(
          "packageprofiles/:profileName/constraints",
        ))
    ) {
      if (endpointStatus.status === "error") {
        throw ENDPOINT_STATUS_API_ERROR;
      }
    }

    return HttpResponse.json();
  }),

  http.delete(`${API_URL}packageprofiles/:profileName/constraints`, () => {
    const endpointStatus = getEndpointStatus();

    if (
      !endpointStatus.path ||
      (endpointStatus.path &&
        endpointStatus.path.includes(
          "packageprofiles/:profileName/constraints",
        ))
    ) {
      if (endpointStatus.status === "error") {
        throw ENDPOINT_STATUS_API_ERROR;
      }
    }

    return HttpResponse.json();
  }),

  http.put(
    `${API_URL}packageprofiles/:profileName/constraints/:constraintId`,
    () => {
      const endpointStatus = getEndpointStatus();

      if (
        !endpointStatus.path ||
        (endpointStatus.path &&
          endpointStatus.path.includes(
            "packageprofiles/:profileName/constraints/:constraintId",
          ))
      ) {
        if (endpointStatus.status === "error") {
          throw ENDPOINT_STATUS_API_ERROR;
        }
      }

      return HttpResponse.json();
    },
  ),

  http.get(API_URL_OLD, ({ request }) => {
    const endpointStatus = getEndpointStatus();

    if (!endpointStatus.path && endpointStatus.status === "error") {
      throw ENDPOINT_STATUS_API_ERROR;
    }

    if (!isAction(request, "RemovePackageProfile")) {
      return;
    }

    return HttpResponse.json();
  }),
];
