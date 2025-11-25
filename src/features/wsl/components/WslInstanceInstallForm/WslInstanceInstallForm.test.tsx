import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WslInstanceInstallForm from "./WslInstanceInstallForm";

describe("WslInstanceInstallForm", () => {
  it("renders correct form fields when a provided instance type is selected", () => {
    const { container } = renderWithProviders(<WslInstanceInstallForm />);

    expect(container).toHaveTexts(["Instance type", "cloud-init"]);

    const installInstanceButton = screen.getByRole("button", {
      name: /create/i,
    });
    expect(installInstanceButton).toBeInTheDocument();
    expect(installInstanceButton).toBeEnabled();
  });

  it("renders correct form fields when a provided custom instance type is selected", async () => {
    const { container } = renderWithProviders(<WslInstanceInstallForm />);

    expect(container).toHaveTexts(["Instance type", "cloud-init"]);

    const instanceTypeSelect = screen.getByRole("combobox");
    expect(instanceTypeSelect).toBeInTheDocument();

    await userEvent.click(instanceTypeSelect);
    await userEvent.selectOptions(instanceTypeSelect, ["Custom"]);

    expect(container).toHaveTexts([
      "Instance type",
      "Instance name",
      "rootfs URL",
      "cloud-init",
    ]);

    const installInstanceButton = screen.getByRole("button", {
      name: /create/i,
    });

    expect(installInstanceButton).toBeInTheDocument();
  });
});
