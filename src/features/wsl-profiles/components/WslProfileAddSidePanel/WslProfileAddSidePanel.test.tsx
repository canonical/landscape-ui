import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FILE_INPUT_HELPER_TEXT } from "../constants";
import WslProfileAddSidePanel from "./WslProfileAddSidePanel";

describe("WslProfileAddSidePanel", () => {
  it("renders the form with correct fields for add action", async () => {
    const { container } = renderWithProviders(<WslProfileAddSidePanel />);

    expect(container).toHaveTexts([
      "Title",
      "Access group",
      "rootfs image",
      "cloud-init",
      "Add",
    ]);
  });

  it("shows file upload for cloud-init", async () => {
    renderWithProviders(<WslProfileAddSidePanel />);

    await userEvent.selectOptions(screen.getByLabelText("cloud-init"), "file");
    const helperText = screen.getByText(FILE_INPUT_HELPER_TEXT);
    expect(helperText).toBeInTheDocument();
  });
});
