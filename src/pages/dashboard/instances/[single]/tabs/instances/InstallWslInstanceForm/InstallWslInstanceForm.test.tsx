import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import InstallWslInstanceForm from "./InstallWslInstanceForm";
import userEvent from "@testing-library/user-event";

describe("InstallWslInstanceForm", () => {
  it("renders correct form fields when a provided instance type is selected", () => {
    const { container } = renderWithProviders(<InstallWslInstanceForm />);

    expect(container).toHaveTexts(["Instance type", "Cloud-init"]);

    const installInstanceButton = screen.getByRole("button", {
      name: /install/i,
    });
    expect(installInstanceButton).toBeInTheDocument();
    expect(installInstanceButton).toBeEnabled();
  });

  it("renders correct form fields when a provided custom instance type is selected", async () => {
    const { container } = renderWithProviders(<InstallWslInstanceForm />);

    expect(container).toHaveTexts(["Instance type", "Cloud-init"]);

    const instanceTypeSelect = screen.getByRole("combobox");
    expect(instanceTypeSelect).toBeInTheDocument();

    await userEvent.click(instanceTypeSelect);
    await userEvent.selectOptions(instanceTypeSelect, ["Custom"]);

    expect(container).toHaveTexts([
      "Instance type",
      "Instance name",
      "Rootfs URL",
      "Cloud-init",
    ]);

    const installInstanceButton = screen.getByRole("button", {
      name: /install/i,
    });

    expect(installInstanceButton).toBeInTheDocument();
    expect(installInstanceButton).toBeDisabled();
  });
});
