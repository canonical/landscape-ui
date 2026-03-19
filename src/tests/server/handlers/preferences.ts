import { API_URL } from "@/constants";
import { http, HttpResponse } from "msw";

export default [
  http.patch(`${API_URL}preferences`, () => {
    return HttpResponse.json();
  }),
];
