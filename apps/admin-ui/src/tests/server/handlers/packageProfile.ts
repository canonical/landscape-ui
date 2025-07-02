import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { packageProfiles } from "@/tests/mocks/package-profiles";

export default [
  http.get(
    `${API_URL}packageprofiles/:profileName/constraints`,
    ({ params, request }) => {
      const searchParams = new URL(request.url).searchParams;

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
];
