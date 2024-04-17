import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { AccessGroup } from "@/types/AccessGroup";

export default [
  http.get<never, never, AccessGroup[]>(`${API_URL_OLD}GetAccessGroups`, () => {
    return HttpResponse.json(accessGroups);
  }),
];
