import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";

export default [
  http.get(`${API_URL}about`, () => {
    return HttpResponse.json({
      self_hosted: false,
      package_version: "0.0.0-dev",
      revision: "dev-rev",
      display_disa_stig_banner: false,
    });
  }),
];
