import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import SecurityIssuesPanelHeader from "./SecurityIssuesPanelHeader";

describe("SecurityIssuesPanelHeader", () => {
  it("renders a search box", async () => {
    renderWithProviders(
      <SecurityIssuesPanelHeader usns={[]} />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    expect(await screen.findByRole("searchbox")).toBeInTheDocument();
  });

  it("renders Upgrade button disabled when no usns selected", async () => {
    renderWithProviders(
      <SecurityIssuesPanelHeader usns={[]} />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByRole("button", { name: /upgrade/i }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("renders Upgrade button enabled when usns are selected", async () => {
    renderWithProviders(
      <SecurityIssuesPanelHeader usns={["6557-1"]} />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByRole("button", { name: /upgrade/i }),
    ).not.toBeDisabled();
  });
});
