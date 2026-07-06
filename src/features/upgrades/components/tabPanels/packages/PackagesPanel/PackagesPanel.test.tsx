import type { ComponentProps, FC } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { screen } from "@testing-library/react";
import { API_URL } from "@/constants";
import { usePackages } from "@/features/packages";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { instances } from "@/tests/mocks/instance";
import { packages } from "@/tests/mocks/packages";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import PackagesPanel from "./PackagesPanel";

const excludedPackages = instances.map(({ id }) => ({
  id,
  exclude_packages: [],
}));
const onExcludedPackagesChange = vi.fn();

const props: ComponentProps<typeof PackagesPanel> = {
  excludedPackages,
  instances,
  onExcludedPackagesChange,
};

describe("PackagesPanel", () => {
  it("should render packages panel", async () => {
    const { container } = renderWithProviders(<PackagesPanel {...props} />);

    await expectLoadingState();

    expect(container).toHaveTexts(["Package name", "Affected instances"]);

    expect(screen.getByText(/Showing \d of \d+ packages/i)).toBeInTheDocument();
  });
});

describe("usePackages request params", () => {
  let capturedUrl: URL | undefined;

  // Minimal consumer that drives usePackages with empty filters, since
  // PackagesPanel always sends a non-empty `query`.
  const EmptyFiltersConsumer: FC = () => {
    const { getPackagesQuery } = usePackages();
    getPackagesQuery({ query: "", search: "", names: [] });
    return null;
  };

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(`${API_URL}packages`, ({ request }) => {
        capturedUrl = new URL(request.url);
        return HttpResponse.json({
          results: packages,
          count: packages.length,
          next: null,
          previous: null,
        });
      }),
    );
  });

  it("omits query, search and names when they are empty", async () => {
    renderWithProviders(<EmptyFiltersConsumer />, undefined, "/packages");

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("query")).toBe(false);
    expect(capturedUrl?.searchParams.has("search")).toBe(false);
    expect(capturedUrl?.searchParams.has("names")).toBe(false);
  });
});
