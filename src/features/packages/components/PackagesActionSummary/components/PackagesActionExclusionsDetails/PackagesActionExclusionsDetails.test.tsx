import { renderWithProviders } from "@/tests/render";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import { API_URL } from "@/constants";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { instances } from "@/tests/mocks/instance";
import server from "@/tests/server";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, onTestFinished, vi } from "vitest";
import PackagesActionExclusionsDetails from "./PackagesActionExclusionsDetails";

const props = { id: 1, packageName: "libthai0" };

describe("PackagesActionExclusionsDetails", () => {
  it("shows loading before rendering the first page of excluded instances", async () => {
    renderWithProviders(<PackagesActionExclusionsDetails {...props} />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");

    const table = await screen.findByRole("table");
    expect(
      within(table).getByRole("columnheader", { name: "Instance name" }),
    ).toBeInTheDocument();
    expect(within(table).getAllByRole("row")).toHaveLength(
      DEFAULT_PAGE_SIZE + 1,
    );
    expect(within(table).getByText(instances[0].title)).toBeInTheDocument();
    expect(
      within(table).queryByText(instances[DEFAULT_PAGE_SIZE].title),
    ).not.toBeInTheDocument();
  });

  it("paginates instances and resets to the first page when page size changes", async () => {
    const user = userEvent.setup();
    const pageSize = 50;
    renderWithProviders(<PackagesActionExclusionsDetails {...props} />);
    await screen.findByRole("table");

    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByRole("spinbutton", { name: "page number" })).toHaveValue(
      2,
    );
    expect(
      screen.getByText(instances[DEFAULT_PAGE_SIZE].title),
    ).toBeInTheDocument();
    expect(screen.queryByText(instances[0].title)).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Instances per page" }),
      pageSize.toString(),
    );

    expect(screen.getByText(instances[0].title)).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(
      Math.min(pageSize, instances.length) + 1,
    );
  });

  it("searches by instance name from the first page and restores results when cleared", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PackagesActionExclusionsDetails {...props} />);
    await screen.findByRole("table");

    await user.click(screen.getByRole("button", { name: "Next page" }));
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

  it("shows an empty state when no excluded instance matches the search", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PackagesActionExclusionsDetails {...props} />);

    await user.type(
      await screen.findByRole("searchbox"),
      "nonexistent-excluded-instance{Enter}",
    );

    expect(
      await screen.findByText(
        "No instances found according to your search parameters.",
      ),
    ).toBeInTheDocument();
  });

  it("surfaces API errors through the error boundary", async () => {
    const consoleError = vi.spyOn(console, "error").mockReturnValue(undefined);
    onTestFinished(() => {
      consoleError.mockRestore();
    });
    server.use(
      http.get(
        `${API_URL}package-change-plans/:id/exclusions/:package_name`,
        () =>
          HttpResponse.json(
            { message: "Failed to load exclusions" },
            { status: 500 },
          ),
      ),
    );

    renderWithProviders(
      <AppErrorBoundary>
        <PackagesActionExclusionsDetails {...props} />
      </AppErrorBoundary>,
    );

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
