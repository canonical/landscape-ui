import { HttpResponse } from "msw";

export const ENDPOINT_STATUS_API_ERROR_MESSAGE = `The endpoint status is set to "error".`;
export const ENDPOINT_STATUS_API_ERROR = HttpResponse.json(
  {
    error: "EndpointStatusError",
    message: ENDPOINT_STATUS_API_ERROR_MESSAGE,
  },
  { status: 500 },
);
