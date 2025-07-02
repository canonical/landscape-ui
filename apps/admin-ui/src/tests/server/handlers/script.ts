import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import {
  detailedScriptsData,
  scripts,
  scriptVersion,
  scriptVersionsWithPagination,
} from "@/tests/mocks/script";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { http, HttpResponse } from "msw";

export default [
  http.get(`${API_URL}scripts`, async ({ request }) => {
    const { status } = getEndpointStatus();
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || 20;
    const offset = Number(url.searchParams.get("offset")) || 0;
    const search = url.searchParams.get("search") || "";

    return HttpResponse.json(
      generatePaginatedResponse({
        data: status === "empty" ? [] : scripts,
        limit: limit,
        offset: offset,
        search: search,
        searchFields: ["title"],
      }),
    );
  }),

  http.get(`${API_URL}scripts/:id/script-profiles`, async () => {
    return HttpResponse.json({ script_profiles: scriptProfiles });
  }),

  http.get(`${API_URL}scripts/:id`, async ({ params }) => {
    const id = Number(params.id);
    const scriptDetails = detailedScriptsData.find(
      (script) => script.id === id,
    );

    return HttpResponse.json(scriptDetails);
  }),

  http.get(`${API_URL}scripts/:id/versions/:versionId`, async () => {
    return HttpResponse.json(scriptVersion);
  }),

  http.get(`${API_URL}scripts-attachment/:id`, async () => {
    return HttpResponse.json("attachment");
  }),

  http.get(`${API_URL}scripts/:id/versions`, async ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit")) || 20;
    const offset = Number(url.searchParams.get("offset")) || 0;

    return HttpResponse.json(
      generatePaginatedResponse({
        data: scriptVersionsWithPagination,
        limit: limit,
        offset: offset,
        search: "",
        searchFields: ["title"],
      }),
    );
  }),
];
