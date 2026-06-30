import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";
import type { FC } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useUsers from "./useUsers";

/**
 * Regression test for the `query: queryParams?.query || undefined` guard in
 * `useUsers.getUsersQuery`. When a consumer passes an empty `query` string the
 * request MUST NOT forward a `query` search param. If the guard were changed to
 * `?? undefined`, the empty string would leak into the request and this test
 * would fail.
 */

const EmptyQueryConsumer: FC = () => {
  const { getUsersQuery } = useUsers();
  getUsersQuery({ computer_id: 1, query: "" });
  return null;
};

describe("useUsers request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}users`, ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({
          results: [],
          count: 0,
          next: null,
          previous: null,
        });
      }),
    );
  });

  it("omits the query param when an empty query is provided", async () => {
    renderWithProviders(<EmptyQueryConsumer />);

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("query")).toBe(false);
  });
});
