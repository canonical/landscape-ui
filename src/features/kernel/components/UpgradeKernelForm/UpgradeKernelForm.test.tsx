import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import UpgradeKernelForm from "./UpgradeKernelForm";

const props: ComponentProps<typeof UpgradeKernelForm> = {
  currentKernelVersion: "5.11.0-27-generic",
  upgradeKernelVersions: [
    {
      id: 75473,
      name: "linux-image-virtual",
      version: "5.15.0.25.28",
      version_rounded: "5.15.0.30",
    },
    {
      id: 75474,
      name: "linux-image-virtual-2",
      version: "5.15.0.25.29",
      version_rounded: "5.15.0.30",
    },
  ],
  instanceName: "test-instance",
};

describe("UpgradeKernelForm", () => {
  it("renders notification message", () => {
    renderWithProviders(<UpgradeKernelForm {...props} />);
    expect(screen.getByText(/restart recommended/i)).toBeVisible();
  });

  it("radio button functionalities", async () => {
    renderWithProviders(<UpgradeKernelForm {...props} />);

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
