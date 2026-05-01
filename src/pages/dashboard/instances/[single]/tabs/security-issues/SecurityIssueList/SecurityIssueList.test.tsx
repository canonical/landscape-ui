import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("shows a loading state in the list when isUsnsLoading is true", async () => {
    renderWithProviders(
      <SecurityIssueList
        instance={ubuntuInstance}
        isUsnsLoading={true}
        totalUsnCount={0}
        usns={[]}
      />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("enables Upgrade button after selecting a USN", async () => {
    const user = userEvent.setup();
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

    await screen.findByText("6557-1");

    const checkboxes = screen.getAllByRole("checkbox");
    const usnCheckbox = checkboxes.find((cb) => !cb.closest("th"));
    if (usnCheckbox) {
      await user.click(usnCheckbox);
      expect(
        screen.getByRole("button", { name: /upgrade/i }),
      ).not.toHaveAttribute("aria-disabled", "true");
    }
  });
});
