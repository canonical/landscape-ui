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
  let capturedBody: Record<string, unknown> | undefined;

  const EmptyFiltersConsumer: FC = () => {
    const { getPackageUpgradesQuery } = usePackages();
    getPackageUpgradesQuery({ computer_query: "", text: "", names: [] });
    return null;
  };

  beforeEach(() => {
    capturedBody = undefined;
    setEndpointStatus("default");

    server.use(
      http.post(`${API_URL}packages:search-upgrades`, async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({
          packages,
          count: packages.length,
          next: null,
          prev: null,
        });
      }),
    );
  });

  it("handles empty computer_query, text and names", async () => {
    renderWithProviders(<EmptyFiltersConsumer />, undefined, "/packages");

    await vi.waitFor(() => {
      expect(capturedBody).toBeDefined();
    });

    expect(capturedBody?.computer_query).toBe("");
    expect(capturedBody?.text).toBeUndefined();
    expect(capturedBody?.names).toBeUndefined();
  });

  it("asserts getPackagesQuery hits POST /packages:search", async () => {
    let capturedSearchBody: Record<string, unknown> | undefined;

    server.use(
      http.post(`${API_URL}packages:search`, async ({ request }) => {
        capturedSearchBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({
          packages,
          count: packages.length,
          next: null,
          prev: null,
        });
      }),
    );

    const SearchPackagesConsumer: FC = () => {
      const { getPackagesQuery } = usePackages();
      getPackagesQuery({ computer_query: "id:1", text: "curl" });
      return null;
    };

    renderWithProviders(<SearchPackagesConsumer />, undefined, "/packages");

    await vi.waitFor(() => {
      expect(capturedSearchBody).toBeDefined();
    });

    expect(capturedSearchBody?.computer_query).toBe("id:1");
    expect(capturedSearchBody?.text).toBe("curl");
  });
});
