import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";

export default [
  http.get(`${API_URL_OLD}CreateUpgradeProfile`, (req) => {
    return HttpResponse.json(req.params);
  }),
  http.get(`${API_URL_OLD}EditUpgradeProfile`, (req) => {
    return HttpResponse.json(req.params);
  }),
];
