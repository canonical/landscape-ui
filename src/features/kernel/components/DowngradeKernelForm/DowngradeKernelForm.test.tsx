import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";
import DowngradeKernelForm from "./DowngradeKernelForm";

const props: ComponentProps<typeof DowngradeKernelForm> = {
  currentKernelVersion: "5.11.0-27-generic",
  downgradeKernelVersions: [
    {
      id: 75473,
      name: "linux-image-virtual",
      version: "5.15.0.25.27",
      version_rounded: "5.15.0.25",
    },
    {
      id: 75474,
      name: "linux-image-virtual-2",
      version: "5.15.0.25.27",
      version_rounded: "5.15.0.25",
    },
  ],
  instanceName: "test-instance",
};

describe("DowngradeKernelForm", () => {
  it("renders notification message", () => {
    renderWithProviders(<DowngradeKernelForm {...props} />);
    expect(screen.getByText(/security warning/i)).toBeVisible();
  });

  it("radio button functionalities", async () => {
    renderWithProviders(<DowngradeKernelForm {...props} />);

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

  it("renders form dropdown", async () => {
    renderWithProviders(<DowngradeKernelForm {...props} />);

    const kernelVersionsCombobox = await screen.findByRole("combobox");
    expect(kernelVersionsCombobox).toBeInTheDocument();
  });

  it("switches between dropdown types", async () => {
    renderWithProviders(<DowngradeKernelForm {...props} />);

    const kernelVersionsCombobox = await screen.findByRole("combobox");
    expect(kernelVersionsCombobox).toBeInTheDocument();

    const options: HTMLOptionElement[] = await screen.findAllByRole("option");
    await userEvent.selectOptions(kernelVersionsCombobox, options[1]);
    expect(options[0].selected).toBeFalsy();
    expect(options[1].selected).toBeTruthy();
  });
});
