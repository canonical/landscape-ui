import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { usns } from "@/tests/mocks/usn";
import { renderWithProviders } from "@/tests/render";
import SecurityIssueList from "./SecurityIssueList";

describe("SecurityIssueList", () => {
  it("renders the panel with USN list", async () => {
    renderWithProviders(
      <SecurityIssueList
        instance={ubuntuInstance}
        isUsnsLoading={false}
        totalUsnCount={usns.length}
        usns={usns}
      />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    expect(await screen.findByText("6557-1")).toBeInTheDocument();
  });

  it("renders Upgrade button disabled when no usns selected", async () => {
    renderWithProviders(
      <SecurityIssueList
        instance={ubuntuInstance}
        isUsnsLoading={false}
        totalUsnCount={usns.length}
        usns={usns}
      />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    expect(
      await screen.findByRole("button", { name: /upgrade/i }),
    ).toHaveAttribute("aria-disabled", "true");
  });
});
