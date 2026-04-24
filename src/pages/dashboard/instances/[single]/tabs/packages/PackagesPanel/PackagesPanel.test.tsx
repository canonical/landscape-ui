import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PackagesPanel from "./PackagesPanel";

describe("PackagesPanel", () => {
  it("shows installed packages on the All filter when there are no upgrades", async () => {
    renderWithProviders(
      <PackagesPanel />,
      undefined,
      "/instances/999",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByRole("button", { name: "no-upgrades-pkg" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("No packages have been found yet."),
    ).not.toBeInTheDocument();
  });

  it("shows upgrade empty message (not global empty state) when installed packages exist", async () => {
    renderWithProviders(
      <PackagesPanel />,
      undefined,
      "/instances/999?status=upgrade",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByText("No available upgrades found."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("No packages have been found yet."),
    ).not.toBeInTheDocument();
  });

  it("shows global empty state when there are no installed packages for the instance", async () => {
    renderWithProviders(
      <PackagesPanel />,
      undefined,
      "/instances/100",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByText("No packages have been found yet."),
    ).toBeInTheDocument();
  });

  it("shows held packages empty message for held filter", async () => {
    renderWithProviders(
      <PackagesPanel />,
      undefined,
      "/instances/999?status=held",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByText("No held packages found."),
    ).toBeInTheDocument();
  });

  it("shows security upgrade empty message for security filter", async () => {
    renderWithProviders(
      <PackagesPanel />,
      undefined,
      "/instances/999?status=security",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByText("No available security upgrades found."),
    ).toBeInTheDocument();
  });

  it("selects a package when its checkbox is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PackagesPanel />,
      undefined,
      "/instances/999",
      "/instances/:instanceId",
    );

    const checkbox = await screen.findByRole("checkbox", {
      name: /toggle no-upgrades-pkg/i,
    });
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("clears selection when search is submitted", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PackagesPanel />,
      undefined,
      "/instances/999",
      "/instances/:instanceId",
    );

    await screen.findByRole("button", { name: "no-upgrades-pkg" });

    const checkbox = screen.getByRole("checkbox", {
      name: /toggle no-upgrades-pkg/i,
    });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test{enter}");

    expect(
      await screen.findByText(/no packages found with the search/i),
    ).toBeInTheDocument();
  });

  it("shows error boundary when packages endpoint returns an error", async () => {
    vi.spyOn(console, "error").mockReturnValue(undefined);
    setEndpointStatus({ status: "error", path: "computers-packages" });

    renderWithProviders(
      <AppErrorBoundary>
        <PackagesPanel />
      </AppErrorBoundary>,
      undefined,
      "/instances/999",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByText(/unexpected error occurred/i),
    ).toBeInTheDocument();
  });
});
