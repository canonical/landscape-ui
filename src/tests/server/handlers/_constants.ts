import { HttpResponse } from "msw";

export const ENDPOINT_STATUS_API_ERROR_MESSAGE = `The endpoint status is set to "error".`;

export function createEndpointStatusError() {
  return HttpResponse.json(
    {
      error: "EndpointStatusError",
      message: ENDPOINT_STATUS_API_ERROR_MESSAGE,
    },
    { status: 500 },
  );
}

export function getEndpointStatusApiError() {
  return createEndpointStatusError();
}

export function createEndpointStatusNetworkError() {
  return HttpResponse.error();
}

export const ENDPOINT_STATUS_API_ERROR = createEndpointStatusError();
