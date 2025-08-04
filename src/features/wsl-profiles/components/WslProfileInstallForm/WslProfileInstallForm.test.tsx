import { wslProfiles } from "@/tests/mocks/wsl-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FILE_INPUT_HELPER_TEXT } from "../constants";
import WslProfileInstallForm from "./WslProfileInstallForm";

describe("WslProfileInstallForm", () => {
  const testProfile = wslProfiles[0];

  it("renders the form with correct fields for add action", async () => {
    const { container } = renderWithProviders(
      <WslProfileInstallForm action="add" />,
    );

    expect(container).toHaveTexts([
      "Title",
      "Access group",
      "Rootfs image",
      "Cloud-init",
      "Add",
    ]);
  });

  it("renders the form with correct fields and values for duplicate action", async () => {
    const { container } = renderWithProviders(
      <WslProfileInstallForm action="duplicate" profile={testProfile} />,
    );

    expect(container).toHaveInputValues([
      `${testProfile.title} (copy)`,
      testProfile.description,
    ]);
  });

  it("shows file upload for cloud-init", async () => {
    renderWithProviders(<WslProfileInstallForm action="add" />);

    await userEvent.selectOptions(screen.getByLabelText("Cloud-init"), "file");
    const helperText = screen.getByText(FILE_INPUT_HELPER_TEXT);
    expect(helperText).toBeInTheDocument();
  });
});
