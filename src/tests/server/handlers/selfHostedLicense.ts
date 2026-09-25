import { API_URL } from "@/constants";
import {
  regeneratedSelfHostedLicense,
  selfHostedLicense,
} from "@/tests/mocks/selfHostedLicense";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";
import { shouldApplyEndpointStatus } from "./_helpers";

const SELF_HOSTED_LICENSE_PATH = "self-hosted/license-url";

export default [
  http.get(`${API_URL}${SELF_HOSTED_LICENSE_PATH}`, () => {
    if (shouldApplyEndpointStatus(SELF_HOSTED_LICENSE_PATH)) {
      const { status, response } = getEndpointStatus(SELF_HOSTED_LICENSE_PATH);

      if (status === "error") {
        const { error, message } =
          (response as
            | {
                error?: string;
                message?: string;
              }
            | undefined) ?? {};

        return createEndpointStatusError({ error, message });
      }
    }

    return HttpResponse.json(selfHostedLicense);
  }),
  http.post(`${API_URL}self-hosted/license-url:regenerate`, () =>
    HttpResponse.json(regeneratedSelfHostedLicense),
  ),
];
