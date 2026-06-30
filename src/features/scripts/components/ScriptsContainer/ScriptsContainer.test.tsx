import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ScriptsContainer from "./ScriptsContainer";

describe("Scripts Empty State", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("should show empty state when there are no scripts", async () => {
    setEndpointStatus("empty");

    renderWithProviders(<ScriptsContainer />);

    await expectLoadingState();

    const emptyStateTitle = screen.getByText("No scripts found");
    expect(emptyStateTitle).toBeInTheDocument();

    expect(
      screen.getByText("You haven’t added any scripts yet."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add script" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        "No scripts found according to your search parameters.",
      ),
    ).not.toBeInTheDocument();
  });

  it("should show scripts when there are scripts", async () => {
    renderWithProviders(<ScriptsContainer />);

    await expectLoadingState();

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("should show scripts when there are scripts with search", async () => {
    const searchText = scripts[0].title;
    const encodedSearchText = encodeURIComponent(searchText);

    renderWithProviders(
      <ScriptsContainer />,
      undefined,
      `/scripts?search=${encodedSearchText}`,
    );

    await expectLoadingState();

    expect(screen.getByText(searchText)).toBeInTheDocument();

    scripts
      .filter(({ title }) => !title.includes(searchText))
      .forEach((script) => {
        expect(screen.queryByText(script.title)).not.toBeInTheDocument();
      });
  });

  it("should show search-specific empty message when there are no search results", async () => {
    setEndpointStatus("empty");

    renderWithProviders(
      <ScriptsContainer />,
      undefined,
      "/scripts?search=non-existent-script",
    );

    await expectLoadingState();

    const emptyStateTitle = screen.getByText(
      "No scripts found according to your search parameters.",
    );
    expect(emptyStateTitle).toBeInTheDocument();
  });
});

describe("Scripts request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}scripts`, ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({
          results: scripts,
          count: scripts.length,
          next: null,
          previous: null,
        });
      }),
    );
  });

  it("omits search entirely when the page param is empty", async () => {
    renderWithProviders(<ScriptsContainer />, undefined, "/scripts");

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("search")).toBe(false);
  });
});
