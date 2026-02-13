import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
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
});
