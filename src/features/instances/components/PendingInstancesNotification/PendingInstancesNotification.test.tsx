import { renderWithProviders } from "@/tests/render";
import { describe, expect } from "vitest";
import PendingInstancesNotification from "./PendingInstancesNotification";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("PendingInstancesNotification", () => {
  const user = userEvent.setup();

  it("should render without crashing", async () => {
    renderWithProviders(<PendingInstancesNotification />);

    const notification = await screen.findByRole("heading", {
      name: /pending instances/i,
    });
    expect(notification).toBeInTheDocument();
  });

  it("should not render when there are no pending instances", () => {
    setEndpointStatus({
      path: "GetPendingComputers",
      status: "empty",
    });

    renderWithProviders(<PendingInstancesNotification />);

    const notification = screen.queryByRole("heading", {
      name: /pending instances/i,
    });
    expect(notification).not.toBeInTheDocument();
  });

  it("should render the correct number of pending instances", async () => {
    renderWithProviders(<PendingInstancesNotification />);

    const notification = await screen.findByRole("heading", {
      name: /pending instances/i,
    });
    expect(notification).toBeInTheDocument();
    const instancesCount = await screen.findByText(
      /You currently have \d+ pending instances awaiting your review and approval\./i,
    );
    expect(instancesCount).toBeInTheDocument();
  });

  it("should open the side panel with pending instances when the button is clicked", async () => {
    renderWithProviders(<PendingInstancesNotification />);

    const reviewButton = await screen.findByRole("button", {
      name: /review pending instances/i,
    });
    expect(reviewButton).toBeInTheDocument();

    await user.click(reviewButton);
    const sidePanel = screen.getByRole("complementary");
    expect(sidePanel).toBeInTheDocument();

    const sidePanelTitle = await screen.findByRole("heading", {
      name: /review pending instances/i,
    });
    expect(sidePanelTitle).toBeInTheDocument();
  });
});
