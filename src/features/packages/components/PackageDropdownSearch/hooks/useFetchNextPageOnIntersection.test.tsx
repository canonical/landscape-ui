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
  let restoreIntersectionObserver: () => void;

  beforeEach(() => {
    requestedOffsets = [];

    server.use(
      http.post<never, SearchPackagesRequest, SearchPackagesResponse>(
        `${API_URL}packages\\:search`,
        async ({ request }) => {
          const { offset = 0, limit = QUERY_LIMIT } = await request.json();
          requestedOffsets.push(offset);

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

    expect(requestedOffsets).toEqual([0, 10, 20, 30]);
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
});
