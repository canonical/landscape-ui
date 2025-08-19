import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { http, HttpResponse } from "msw";

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
        throw new HttpResponse(null, { status: 500 });
      }
    }

    return HttpResponse.error();
  }),
];
