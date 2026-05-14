import { HttpResponse } from "msw";

export const ENDPOINT_STATUS_API_ERROR_MESSAGE = `The endpoint status is set to "error".`;

const DEFAULT_ERROR_STATUS = 500;

/**
 * @deprecated Use {@link createEndpointStatusError} instead.
 * Keeping for backward compatibility during migration.
 */
export const getEndpointStatusApiError = () =>
  HttpResponse.json(
    {
      error: "EndpointStatusError",
      message: ENDPOINT_STATUS_API_ERROR_MESSAGE,
    },
    { status: DEFAULT_ERROR_STATUS },
  );

/**
 * Creates a fresh JSON-body error response for endpoint-status-driven error
 * simulation. Use this where tests assert on the parsed error body (e.g.
 * package-profiles, ubuntu-pro, activities list).
 *
 * Prefer this over the static `ENDPOINT_STATUS_API_ERROR` constant because
 * response objects should not be shared across handler invocations.
 */
export const createEndpointStatusError = (status = DEFAULT_ERROR_STATUS) =>
  HttpResponse.json(
    {
      error: "EndpointStatusError",
      message: ENDPOINT_STATUS_API_ERROR_MESSAGE,
    },
    { status },
  );

/**
 * Creates a fresh null-body error response for endpoint-status-driven error
 * simulation. Use this where the handler originally used
 * `throw new HttpResponse(null, { status: 500 })`.
 */
export const createEndpointStatusNetworkError = (
  status = DEFAULT_ERROR_STATUS,
) => new HttpResponse(null, { status });

export const ENDPOINT_STATUS_API_ERROR = getEndpointStatusApiError();
