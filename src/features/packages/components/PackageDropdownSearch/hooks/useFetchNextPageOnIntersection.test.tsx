import { API_URL } from "@/constants";
import type {
  SearchPackagesRequest,
  SearchPackagesResponse,
} from "@/features/packages";
import { useSearchPackages } from "@/features/packages";
import { mockIntersectionObserver } from "@/tests/helpers";
import { packages } from "@/tests/mocks/packages";
import { renderHookWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { act, renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { QUERY_LIMIT } from "../constants";
import { useFetchNextPageOnIntersection } from "./useFetchNextPageOnIntersection";

const TOTAL_VERSIONS = 35;
const EXPECTED_OFFSETS = Array.from(
  { length: Math.ceil(TOTAL_VERSIONS / QUERY_LIMIT) },
  (_, page) => page * QUERY_LIMIT,
);
// Long enough for a retry loop to send another request.
const SETTLE_DELAY_MS = 100;

const renderInfiniteSearch = () => {
  const { result } = renderHook(
    () => {
      const queryResult = useSearchPackages({
        computer_query: "id:1",
        names: "libthai0",
        limit: QUERY_LIMIT,
      });

      const footerRef = useFetchNextPageOnIntersection(queryResult);

      return { queryResult, footerRef };
    },
    { wrapper: renderHookWithProviders() },
  );

  // Mount the footer that the observer watches.
  act(() => {
    result.current.footerRef(document.createElement("div"));
  });

  return result;
};

describe("useFetchNextPageOnIntersection", () => {
  let requestedOffsets: number[];
  let failingOffset: number | undefined;
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    requestedOffsets = [];
    failingOffset = undefined;

    server.use(
      http.post<never, SearchPackagesRequest, SearchPackagesResponse>(
        `${API_URL}packages\\:search`,
        async ({ request }) => {
          const { offset = 0, limit = QUERY_LIMIT } = await request.json();
          requestedOffsets.push(offset);

          if (offset === failingOffset) {
            return HttpResponse.error();
          }

          const pageSize = Math.max(
            Math.min(limit, TOTAL_VERSIONS - offset),
            0,
          );

          return HttpResponse.json<SearchPackagesResponse>({
            packages: Array.from({ length: pageSize }, (_, index) => ({
              ...packages[0],
              id: 1000 + offset + index,
              version: `1.${String(offset + index).padStart(3, "0")}`,
            })),
            count: TOTAL_VERSIONS,
            next: null,
            prev: null,
          });
        },
      ),
    );
  });

  afterEach(() => {
    restoreIntersectionObserver();
  });

  it("keeps fetching pages while the footer stays visible", async () => {
    restoreIntersectionObserver = mockIntersectionObserver({
      isIntersecting: true,
    });

    const result = renderInfiniteSearch();

    await waitFor(() => {
      expect(result.current.queryResult.hasNextPage).toBe(false);
    });

    expect(requestedOffsets).toEqual(EXPECTED_OFFSETS);
    expect(
      result.current.queryResult.data?.pages.flatMap(
        (page) => page.data.packages,
      ),
    ).toHaveLength(TOTAL_VERSIONS);
  });

  it("doesn't fetch the next page while the footer is not visible", async () => {
    restoreIntersectionObserver = mockIntersectionObserver({
      isIntersecting: false,
    });

    const result = renderInfiniteSearch();

    await waitFor(() => {
      expect(result.current.queryResult.isSuccess).toBe(true);
    });

    expect(result.current.queryResult.hasNextPage).toBe(true);
    expect(result.current.queryResult.isFetchingNextPage).toBe(false);
    expect(requestedOffsets).toEqual([0]);
  });

  it("doesn't retry a failed page while the footer stays visible", async () => {
    restoreIntersectionObserver = mockIntersectionObserver({
      isIntersecting: true,
    });
    failingOffset = QUERY_LIMIT;

    const result = renderInfiniteSearch();

    await waitFor(() => {
      expect(result.current.queryResult.isFetchNextPageError).toBe(true);
    });

    await act(
      () => new Promise((resolve) => setTimeout(resolve, SETTLE_DELAY_MS)),
    );

    expect(requestedOffsets).toEqual([0, QUERY_LIMIT]);
  });

  it("retries a failed page when the footer comes back into view", async () => {
    restoreIntersectionObserver = mockIntersectionObserver({
      isIntersecting: true,
    });
    failingOffset = QUERY_LIMIT;

    const result = renderInfiniteSearch();

    await waitFor(() => {
      expect(result.current.queryResult.isFetchNextPageError).toBe(true);
    });

    failingOffset = undefined;

    // Remount the footer so the observer reports a new intersection.
    act(() => {
      result.current.footerRef(null);
    });
    act(() => {
      result.current.footerRef(document.createElement("div"));
    });

    await waitFor(() => {
      expect(result.current.queryResult.hasNextPage).toBe(false);
    });

    // The failed page is requested again, then loading continues.
    expect(requestedOffsets).toEqual([
      ...EXPECTED_OFFSETS.slice(0, 2),
      ...EXPECTED_OFFSETS.slice(1),
    ]);
  });
});
