import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FILE_INPUT_HELPER_TEXT } from "../constants";
import WslProfileInstallForm from "./WslProfileInstallForm";

describe("WslProfileInstallForm", () => {
  it("renders the form with correct fields for add action", async () => {
    const { container } = renderWithProviders(<WslProfileInstallForm />);

    expect(container).toHaveTexts([
      "Title",
      "Access group",
      "Rootfs image",
      "Cloud-init",
      "Add",
    ]);
  });

  it("shows file upload for cloud-init", async () => {
    renderWithProviders(<WslProfileInstallForm />);

    await userEvent.selectOptions(screen.getByLabelText("Cloud-init"), "file");
    const helperText = screen.getByText(FILE_INPUT_HELPER_TEXT);
    expect(helperText).toBeInTheDocument();
  });
});
