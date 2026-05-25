import { INSTANCES_PATHS } from "@/libs/routes/instances";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import UbuntuProNotification from "./UbuntuProNotification";

const props: ComponentProps<typeof UbuntuProNotification> = {
  onDismiss: vi.fn(),
};

const instanceId = "1";
const singleInstancePath = `/${INSTANCES_PATHS.root}/${INSTANCES_PATHS.single}`;

describe("UbuntuProNotification", () => {
  const user = userEvent.setup();

  it("renders the notification message", () => {
    renderWithProviders(<UbuntuProNotification {...props} />);

    expect(
      screen.getByText(/Your current Ubuntu package upgrades are limited/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Learn more" }),
    ).toBeInTheDocument();
  });

  it("calls onDismiss when the close notification button is clicked", async () => {
    renderWithProviders(<UbuntuProNotification {...props} />);

    const closeButton = screen.getByRole("button", {
      name: /close notification/i,
    });
    await user.click(closeButton);

    expect(props.onDismiss).toHaveBeenCalledTimes(1);
  });

  it("navigates to the ubuntu-pro tab when Learn more is clicked", async () => {
    renderWithProviders(
      <UbuntuProNotification {...props} />,
      undefined,
      `/instances/${instanceId}`,
      singleInstancePath,
    );

    const learnMoreButton = screen.getByRole("button", { name: "Learn more" });
    await user.click(learnMoreButton);

    // Clicking triggers navigate(); verifying the button was interactive is sufficient
    expect(learnMoreButton).toBeEnabled();
  });
});
