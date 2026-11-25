import AppErrorBoundary from "@/components/layout/AppErrorBoundary/AppErrorBoundary";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
import { instances } from "@/tests/mocks/instance";
import SecurityIssuesPanel from "@/pages/dashboard/instances/[single]/tabs/security-issues";
import { usns } from "@/tests/mocks/usn";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import server from "@/tests/server";

const props = {
  instance: instances[0],
};

describe("SecurityIssuesPanel", () => {
  it("should render list", async () => {
    renderWithProviders(<SecurityIssuesPanel {...props} />);

    await expectLoadingState();

    await waitFor(() => {
      usns.slice(0, DEFAULT_PAGE_SIZE).forEach((item) => {
        expect(
          screen.getByRole("link", {
            name: item.usn,
          }),
        ).toBeInTheDocument();
      });
    });
  });

  it("shows the empty state when the instance has no security issues", async () => {
    setEndpointStatus({ status: "empty", path: "usns" });

    renderWithProviders(<SecurityIssuesPanel {...props} />);

    expect(
      await screen.findByText("No security issues found"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("shows the empty table message, not the empty state, for a search that matches nothing", async () => {
    renderWithProviders(
      <SecurityIssuesPanel {...props} />,
      undefined,
      "/instances/1?search=no-such-usn",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByText(
        'No security issues found with the search "no-such-usn"',
      ),
    ).toBeInTheDocument();
  });

  it("keeps the search while the security issues load", async () => {
    setEndpointStatus({ status: "loading", path: "usns" });

    renderWithProviders(
      <SecurityIssuesPanel {...props} />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("fails into the error boundary when the security issues fail to load", async () => {
    setEndpointStatus({ status: "error", path: "usns" });

    renderWithProviders(
      <AppErrorBoundary>
        <SecurityIssuesPanel {...props} />
      </AppErrorBoundary>,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Something went wrong",
    );
    expect(
      screen.queryByText("No security issues found"),
    ).not.toBeInTheDocument();
  });
});

describe("Usns request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}usns`, ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({
          results: usns,
          count: usns.length,
          next: null,
          previous: null,
        });
      }),
    );
  });

  it("omits search entirely when the search param is empty", async () => {
    renderWithProviders(<SecurityIssuesPanel {...props} />);

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("search")).toBe(false);
  });
});
