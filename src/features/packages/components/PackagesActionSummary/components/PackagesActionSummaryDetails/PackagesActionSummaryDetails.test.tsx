import { API_URL } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { instances } from "@/tests/mocks/instance";
import server from "@/tests/server";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { assert, describe, expect, it, onTestFinished, vi } from "vitest";
import type { ListPackageChangePlanItemsResponse } from "@/features/packages";
import type { PackageChangePlanAction } from "../../../../types";
import PackagesActionSummaryDetails from "./PackagesActionSummaryDetails";

const currentPackage = { id: 15, name: "libthai0", version: "0.1.9-1" };
const targetPackage = { id: 16, name: "libthai0", version: "0.1.10-1" };
const actionFilters = [
  {
    action: { type: "install", package: currentPackage },
    query: { install: currentPackage.id.toString() },
  },
  {
    action: { type: "remove", package: currentPackage },
    query: { remove: currentPackage.id.toString() },
  },
  {
    action: { type: "hold", package: currentPackage },
    query: { hold: currentPackage.id.toString() },
  },
  {
    action: { type: "unhold", package: currentPackage },
    query: { unhold: currentPackage.id.toString() },
  },
  {
    action: { type: "upgrade", to_package: targetPackage },
    query: { upgrade: targetPackage.id.toString() },
  },
] satisfies {
  action: PackageChangePlanAction;
  query: Record<string, string>;
}[];

describe("PackagesActionSummaryDetails", () => {
  it.each(actionFilters)(
    "sends the correct package filter for $action.type",
    async ({ action, query }) => {
      let requestParams: URLSearchParams | undefined;
      server.use(
        http.get(`${API_URL}package-change-plans/:id/items`, ({ request }) => {
          requestParams = new URL(request.url).searchParams;

          return HttpResponse.json<ListPackageChangePlanItemsResponse>({
            action: action.type,
            items: [],
            count: 0,
            next: "",
            previous: "",
          });
        }),
      );

      renderWithProviders(
        <PackagesActionSummaryDetails id={1} action={action} />,
      );

      await screen.findByText(/no instances found/i);
      assert(requestParams);
      expect(Object.fromEntries(requestParams)).toEqual({
        ...query,
        limit: DEFAULT_PAGE_SIZE.toString(),
        offset: "0",
      });
    },
  );

  it("sends change-version package IDs as a JSON query parameter", async () => {
    let changeVersionParam: string | null = null;
    server.use(
      http.get(`${API_URL}package-change-plans/:id/items`, ({ request }) => {
        changeVersionParam = new URL(request.url).searchParams.get(
          "change_version",
        );

        return HttpResponse.json<ListPackageChangePlanItemsResponse>({
          action: "change_version",
          items: [],
          count: 0,
          next: "",
          previous: "",
        });
      }),
    );

    renderWithProviders(
      <PackagesActionSummaryDetails
        id={1}
        action={{
          type: "change_version",
          from_package: { id: 10, name: "example", version: "1.0" },
          to_package: { id: 20, name: "example", version: "2.0" },
        }}
      />,
    );

    await waitFor(() => {
      expect(changeVersionParam).toBe(
        JSON.stringify({ from_package_id: 10, to_package_id: 20 }),
      );
    });

    expect(screen.getByText(/no instances found/i)).toBeInTheDocument();
  });

  it("searches from the first page and restores unfiltered results when cleared", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PackagesActionSummaryDetails
        id={1}
        action={{ type: "install", package: currentPackage }}
      />,
    );
    await screen.findByRole("table");

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(
      await screen.findByText(instances[DEFAULT_PAGE_SIZE].title),
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox"),
      `${instances[0].title}{Enter}`,
    );

    expect(await screen.findByText(instances[0].title)).toBeInTheDocument();
    expect(
      screen.queryByText(instances[DEFAULT_PAGE_SIZE].title),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Clear search field" }),
    );

    expect(await screen.findByRole("searchbox")).toHaveValue("");
    expect(
      within(await screen.findByRole("table")).getAllByRole("row"),
    ).toHaveLength(DEFAULT_PAGE_SIZE + 1);
    expect(screen.getByRole("spinbutton", { name: "page number" })).toHaveValue(
      1,
    );
  });

  it("surfaces API errors through the error boundary", async () => {
    const consoleError = vi.spyOn(console, "error").mockReturnValue(undefined);
    onTestFinished(() => {
      consoleError.mockRestore();
    });
    server.use(
      http.get(`${API_URL}package-change-plans/:id/items`, () =>
        HttpResponse.json(
          { message: "Failed to load package change plan items" },
          { status: 500 },
        ),
      ),
    );

    renderWithProviders(
      <AppErrorBoundary>
        <PackagesActionSummaryDetails
          id={1}
          action={{ type: "install", package: currentPackage }}
        />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
