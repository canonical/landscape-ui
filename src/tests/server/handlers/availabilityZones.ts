import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";

export default [
  http.get(`${API_URL}computers/availability-zones`, () => {
    return HttpResponse.json({
      values: [
        {
          id: "1",
          name: "us-west-1",
        },
        {
          id: "2",
          name: "us-west-2",
        },
      ],
    });
  }),
];
