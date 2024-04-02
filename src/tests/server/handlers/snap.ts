import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { snaps } from "@/tests/mocks/snap";

export default [
  // @ts-ignore-next-line
  http.get(`${API_URL}computers/:computerId/snaps/available`, () => {
    return HttpResponse.json(snaps);
  }),
];
