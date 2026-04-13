import { API_URL, API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { publications } from "@/tests/mocks/publications";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse, isAction } from "./_helpers";

export default [
  http.get(`${API_URL}publications`, ({ request }) => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "publications")
    ) {
      throw new HttpResponse(null, { status: 500 });
    }

    if (
      endpointStatus.status === "empty" &&
      (!endpointStatus.path || endpointStatus.path === "publications")
    ) {
      return HttpResponse.json({
        results: [],
        count: 0,
        next: null,
        previous: null,
      });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? undefined;
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    return HttpResponse.json(
      generatePaginatedResponse({
        data: publications,
        limit,
        offset,
        search,
        searchFields: ["name", "source", "publication_target"],
      }),
    );
  }),

  http.post(`${API_URL}publications`, async () => {
    return HttpResponse.json(publications[0], { status: 201 });
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemovePublication")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path ||
        endpointStatus.path.includes("RemovePublication"))
    ) {
      return HttpResponse.json(
        { message: "Failed to remove publication" },
        { status: 500 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RepublishPublication")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path ||
        endpointStatus.path.includes("RepublishPublication"))
    ) {
      return HttpResponse.json(
        { message: "Failed to republish publication" },
        { status: 500 },
      );
    }

    return HttpResponse.json({}, { status: 202 });
  }),
];
