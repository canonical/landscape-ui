import { setEndpointStatus } from "@/tests/controllers/controller";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("opens confirmation modal when Upgrade button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SecurityIssuesPanelHeader usns={["6557-1"]} />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    await user.click(await screen.findByRole("button", { name: /upgrade/i }));

    expect(
      await screen.findByText("Upgrade affected packages"),
    ).toBeInTheDocument();
  });

  it("shows singular security issue text in modal when one usn selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SecurityIssuesPanelHeader usns={["6557-1"]} />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    await user.click(await screen.findByRole("button", { name: /upgrade/i }));

    expect(
      await screen.findByText(/"6557-1" security issue/),
    ).toBeInTheDocument();
  });

  it("shows plural security issues text in modal when multiple usns selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SecurityIssuesPanelHeader usns={["6557-1", "6558-1"]} />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    await user.click(await screen.findByRole("button", { name: /upgrade/i }));

    expect(
      await screen.findByText(/2 selected security issues/),
    ).toBeInTheDocument();
  });

  it("calls upgrade mutation and shows success notification after confirming", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SecurityIssuesPanelHeader usns={["6557-1"]} />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    await user.click(await screen.findByRole("button", { name: /upgrade/i }));

    const dialog = await screen.findByRole("dialog");
    const { getByRole: getByRoleInDialog } = within(dialog);
    await user.click(getByRoleInDialog("button", { name: /^upgrade$/i }));

    expect(
      await screen.findByText(/you queued packages to be upgraded/i),
    ).toBeInTheDocument();
  });

  it("navigates to activities tab when View details is clicked after successful upgrade", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <SecurityIssuesPanelHeader usns={["6557-1"]} />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    await user.click(await screen.findByRole("button", { name: /upgrade/i }));

    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: /^upgrade$/i }),
    );

    await screen.findByText(/you queued packages to be upgraded/i);

    const viewDetailsButton = screen.getByRole("button", {
      name: /view details/i,
    });
    await user.click(viewDetailsButton);

    expect(
      screen.queryByText(/you queued packages to be upgraded/i),
    ).not.toBeInTheDocument();
  });

  it("handles error gracefully when upgrade endpoint fails", async () => {
    vi.spyOn(console, "error").mockReturnValue(undefined);
    setEndpointStatus("error");

    const user = userEvent.setup();
    renderWithProviders(
      <SecurityIssuesPanelHeader usns={["6557-1"]} />,
      undefined,
      "/instances/1",
      "/instances/:instanceId",
    );

    await user.click(await screen.findByRole("button", { name: /upgrade/i }));

    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: /^upgrade$/i }),
    );

    expect(
      screen.queryByText(/you queued packages to be upgraded/i),
    ).not.toBeInTheDocument();
  });
});
