import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PackageProfileDetailsConstraints from "./PackageProfileDetailsConstraints";

describe("PackageProfileDetailsConstraints", () => {
  beforeEach(() => {
    renderWithProviders(
      <PackageProfileDetailsConstraints profile={packageProfiles[0]} />,
    );
  });

  it("should render profile constraint list with the search", async () => {
    await expectLoadingState();

    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();

    packageProfiles[0].constraints.forEach((constraint) => {
      expect(
        screen.getByRole("rowheader", { name: constraint.package }),
      ).toBeInTheDocument();
    });
  });

  it("should filter profile constraints by search", async () => {
    const searchText = packageProfiles[0].constraints[0].package;

    const searchInput = await screen.findByPlaceholderText("Search");

    await userEvent.type(searchInput, `${searchText}{enter}`);

    expect(
      screen.getByRole("rowheader", { name: searchText }),
    ).toBeInTheDocument();

    packageProfiles[0].constraints
      .filter((constraint) => !constraint.package.includes(searchText))
      .forEach((constraint) => {
        expect(
          screen.queryByRole("rowheader", { name: constraint.package }),
        ).not.toBeInTheDocument();
      });
  });
});

describe("PackageProfileConstraints request params", () => {
  let capturedUrl: URL | undefined;

  beforeEach(() => {
    capturedUrl = undefined;
    setEndpointStatus("default");

    server.use(
      http.get(
        `${API_URL}packageprofiles/:profileName/constraints`,
        ({ request }) => {
          capturedUrl = new URL(request.url);
          return HttpResponse.json({
            results: packageProfiles[0].constraints,
            count: packageProfiles[0].constraints.length,
          });
        },
      ),
    );
  });

  it("omits search entirely when the search param is empty", async () => {
    renderWithProviders(
      <PackageProfileDetailsConstraints profile={packageProfiles[0]} />,
    );

    await vi.waitFor(() => {
      expect(capturedUrl).toBeDefined();
    });

    expect(capturedUrl?.searchParams.has("search")).toBe(false);
  });
});
