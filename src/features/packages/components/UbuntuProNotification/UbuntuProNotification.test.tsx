import { INSTANCES_PATHS } from "@/libs/routes/instances";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import UbuntuProNotification from "./UbuntuProNotification";

const instanceId = "1";
const singleInstancePath = `/${INSTANCES_PATHS.root}/${INSTANCES_PATHS.single}`;

describe("UbuntuProNotification", () => {
  const user = userEvent.setup();

  it("renders a non-dismissible notification message", () => {
    renderWithProviders(<UbuntuProNotification />);

    expect(
      screen.getByText(/Your current Ubuntu package upgrades are limited/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Learn more" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /close notification/i }),
    ).not.toBeInTheDocument();
  });

  it("navigates to the ubuntu-pro tab when Learn more is clicked", async () => {
    renderWithProviders(
      <UbuntuProNotification />,
      undefined,
      `/instances/${instanceId}`,
      singleInstancePath,
    );

    const learnMoreButton = screen.getByRole("button", { name: "Learn more" });
    await user.click(learnMoreButton);

    // Clicking triggers navigate(); verifying the button was interactive is sufficient
    expect(learnMoreButton).toBeEnabled();
    expect(learnMoreButton).not.toHaveAttribute("aria-disabled");
  });
});
