import { expect } from "vitest";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import type { HttpHandler } from "msw";
import { http, HttpResponse } from "msw";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { API_URL, COMMON_NUMBERS } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";

export const expectLoadingState = async (): Promise<void> => {
  const loadingSpinner = await screen.findByRole("status");
  expect(loadingSpinner).toHaveTextContent("Loading...");
  await waitForElementToBeRemoved(loadingSpinner);
};

export const expectErrorNotification = async (): Promise<void> => {
  const errorNotificationCount = (await screen.findAllByText(/error/i)).length;
  expect(errorNotificationCount).toBeGreaterThanOrEqual(COMMON_NUMBERS.ONE);
};

const originalMatchMedia = window.matchMedia;

const mockMatchMedia = (
  queries: { query: string; matches: boolean }[],
): void => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (q: string) => {
      const match = queries.find((m) => m.query === q);
      return {
        matches: match ? match.matches : false,
        media: q,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    },
  });
};

export const setScreenSize = (size: "small" | "large"): void => {
  if (size === "small") {
    mockMatchMedia([{ query: "(min-width: 620px)", matches: false }]);
  } else {
    mockMatchMedia([{ query: "(min-width: 620px)", matches: true }]);
  }
};

export function resetScreenSize(): void {
  window.matchMedia = originalMatchMedia;
}

interface GenerateGetListEndpointParams<T> {
  readonly path: string;
  readonly response: T[];
}

export function generateGetListEndpoint<T>({
  path,
  response,
}: GenerateGetListEndpointParams<T>): HttpHandler {
  return http.get<never, never, ApiPaginatedResponse<T>>(
    `${API_URL}${path}`,
    () => {
      const endpointStatus = getEndpointStatus();

      if (
        !endpointStatus.path ||
        (endpointStatus.path && endpointStatus.path !== path)
      ) {
        if (endpointStatus.status === "error") {
          throw new HttpResponse(null, { status: 500 });
        }

        if (endpointStatus.status === "empty") {
          return HttpResponse.json({
            results: [],
            count: 0,
            next: null,
            previous: null,
          });
        }
      }

      return HttpResponse.json({
        results: response,
        count: response.length,
        next: null,
        previous: null,
      });
    },
  );
}
