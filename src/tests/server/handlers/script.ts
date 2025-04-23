import { API_URL } from "@/constants";
import {
  scriptDetails,
  scripts,
  scriptVersion,
  scriptVersions,
} from "@/tests/mocks/script";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { http, HttpResponse } from "msw";

export default [
  http.get(`${API_URL}scripts`, async () => {
    return HttpResponse.json(
      generatePaginatedResponse({
        data: scripts,
        limit: 10,
        offset: 0,
        search: "",
        searchFields: ["title"],
      }),
    );
  }),

  http.get(`${API_URL}scripts/:id/script-profiles`, async () => {
    return HttpResponse.json({ script_profiles: scriptProfiles });
  }),

  http.get(`${API_URL}scripts/:id`, async () => {
    return HttpResponse.json(scriptDetails);
  }),

  http.get(`${API_URL}scripts/:id/versions/:versionId`, async () => {
    return HttpResponse.json(scriptVersion);
  }),

  http.get(`${API_URL}scripts-attachment/:id`, async () => {
    return HttpResponse.json("attachment");
  }),

  http.get(`${API_URL}scripts/:id/versions`, async () => {
    return HttpResponse.json({ script_versions: scriptVersions });
  }),
];
