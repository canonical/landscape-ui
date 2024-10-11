import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RestartInstanceForm from "./RestartInstanceForm";

describe("UpgradeKernelForm", () => {
  it("renders notification message", () => {
    renderWithProviders(
      <RestartInstanceForm showNotification instanceName="test-instance" />,
    );
    expect(screen.getByText(/restart recommended/i)).toBeVisible();
  });

  it("renders notification message", () => {
    renderWithProviders(
      <RestartInstanceForm
        showNotification={false}
        instanceName="test-instance"
      />,
    );
    expect(screen.queryByText(/restart recommended/i)).toBeNull();
  });

  it("radio button functionalities", async () => {
    renderWithProviders(
      <RestartInstanceForm
        showNotification={false}
        instanceName="test-instance"
      />,
    );

    const instantDeliveryTimeRadioOption = screen.getByLabelText(
      "As soon as possible",
    );
    expect(instantDeliveryTimeRadioOption).toBeChecked();

    const scheduledDeliveryTimeRadioOption = screen.getByLabelText("Scheduled");
    expect(scheduledDeliveryTimeRadioOption).not.toBeChecked();

    const randomizeDeliveryTrueOption = screen.getByLabelText("Yes");
    const randomizeDeliveryFalseOption = screen.getByLabelText("No");
    expect(randomizeDeliveryTrueOption).not.toBeChecked();
    expect(randomizeDeliveryFalseOption).toBeChecked();

    await userEvent.click(randomizeDeliveryTrueOption);
    expect(screen.getByText(/time in minutes/i)).toBeVisible();
  });
});
