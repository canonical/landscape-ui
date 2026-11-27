import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it.each(["archived", "redacted"] as const)(
    "keeps filters available when only %s scripts exist",
    async (status) => {
      const script = { ...scripts[0], status: status.toUpperCase() };
      server.use(
        http.get(`${API_URL}scripts`, ({ request }) => {
          const type = new URL(request.url).searchParams.get("script_type");
          const results = type === "v2" || type === status ? [script] : [];
          return HttpResponse.json({ results, count: results.length });
        }),
      );

      renderWithProviders(<ScriptsContainer />);

      expect(await screen.findByRole("searchbox")).toBeInTheDocument();
      expect(
        await screen.findByText("No Active scripts found."),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("You haven’t added any scripts yet."),
      ).not.toBeInTheDocument();
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Status" }));
      await user.click(
        screen.getByRole("button", {
          name: status === "archived" ? "Archived" : "Redacted",
        }),
      );
      await waitFor(() => {
        expect(
          screen.getByRole("button", {
            name: `Show details of script ${script.title}`,
          }),
        ).toBeInTheDocument();
      });
    },
  );

  it("keeps both archived and redacted scripts accessible when no active scripts exist", async () => {
    const archived = { ...scripts[0], status: "ARCHIVED" };
    const redacted = { ...scripts[1], status: "REDACTED" };
    const inactiveScripts = [archived, redacted];
    server.use(
      http.get(`${API_URL}scripts`, ({ request }) => {
        const params = new URL(request.url).searchParams;
        const type = params.get("script_type");
        const matchingScripts = inactiveScripts.filter(
          (script) => type === "v2" || script.status.toLowerCase() === type,
        );
        const limit = Number(params.get("limit"));
        return HttpResponse.json({
          results: matchingScripts.slice(0, limit),
          count: matchingScripts.length,
        });
      }),
    );

    renderWithProviders(<ScriptsContainer />);

    expect(
      await screen.findByText("No Active scripts found."),
    ).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(screen.getByRole("button", { name: "Archived" }));
    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: `Show details of script ${archived.title}`,
        }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", {
        name: `Show details of script ${redacted.title}`,
      }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Status" }));
    await user.click(screen.getByRole("button", { name: "Redacted" }));
    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: `Show details of script ${redacted.title}`,
        }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", {
        name: `Show details of script ${archived.title}`,
      }),
    ).not.toBeInTheDocument();
  });

  it("does not show the onboarding empty state if the all-status query fails", async () => {
    server.use(
      http.get(`${API_URL}scripts`, ({ request }) => {
        const type = new URL(request.url).searchParams.get("script_type");
        return type === "v2"
          ? HttpResponse.json({}, { status: 500 })
          : HttpResponse.json({ results: [], count: 0 });
      }),
    );

    renderWithProviders(<ScriptsContainer />);
    await expectLoadingState();

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.queryByText("No scripts found")).not.toBeInTheDocument();
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

  it.each([
    ["archived", "Archived"],
    ["redacted", "Redacted"],
    ["all", ""],
  ])(
    "shows an empty message for the %s status without a search",
    async (status, label) => {
      setEndpointStatus("empty");

      renderWithProviders(
        <ScriptsContainer />,
        undefined,
        `/scripts?status=${status}`,
      );

      await expectLoadingState();

      expect(
        screen.getByText(`No ${label ? `${label} ` : ""}scripts found.`),
      ).toBeInTheDocument();
    },
  );

  it("shows a search message when searching with a status filter", async () => {
    setEndpointStatus("empty");
    renderWithProviders(
      <ScriptsContainer />,
      undefined,
      "/scripts?status=archived&search=missing",
    );
    await expectLoadingState();

    expect(
      screen.getByText("No scripts found according to your search parameters."),
    ).toBeInTheDocument();
  });
});

describe("Scripts request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}scripts`, ({ request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get("script_type") === "active") {
          capturedUrl = url;
        }
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

describe("All-status scripts count", () => {
  it.each([
    ["/scripts", "active"],
    ["/scripts?search=missing", "active"],
    ["/scripts?status=archived", "archived"],
    ["/scripts?status=all", "v2"],
  ])("does not make a separate count request for %s", async (path, type) => {
    const requests: URL[] = [];
    server.use(
      http.get(`${API_URL}scripts`, ({ request }) => {
        requests.push(new URL(request.url));
        return HttpResponse.json({ results: scripts, count: scripts.length });
      }),
    );

    renderWithProviders(<ScriptsContainer />, undefined, path);

    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(requests).toHaveLength(1);
    expect(requests[0]?.searchParams.get("script_type")).toBe(type);
    expect(requests[0]?.searchParams.get("limit")).not.toBe("0");
  });

  it("requests only the all-status count when no active scripts exist", async () => {
    const requests: URL[] = [];
    server.use(
      http.get(`${API_URL}scripts`, ({ request }) => {
        const url = new URL(request.url);
        requests.push(url);
        return HttpResponse.json({
          results: [],
          count: url.searchParams.get("script_type") === "v2" ? 1 : 0,
        });
      }),
    );

    renderWithProviders(<ScriptsContainer />);

    expect(
      await screen.findByText("No Active scripts found."),
    ).toBeInTheDocument();
    expect(requests).toHaveLength(2);
    expect(requests[0]?.searchParams.get("script_type")).toBe("active");
    expect(requests[1]?.searchParams.get("script_type")).toBe("v2");
    expect(requests[1]?.searchParams.get("limit")).toBe("0");
    expect(requests[1]?.searchParams.get("offset")).toBe("0");
  });
});
