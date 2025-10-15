import { API_URL } from "@/constants";
import { http, HttpResponse } from "msw";

export default [
  http.get(`${API_URL}computers/availability-zones`, () => {
    return HttpResponse.json({
      values: ["us-west-1", "us-west-2"],
    });
  }),
];
