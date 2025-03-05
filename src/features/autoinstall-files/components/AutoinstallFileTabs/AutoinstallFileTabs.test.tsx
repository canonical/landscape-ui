import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe } from "vitest";
import AutoinstallFileTabs from "./AutoinstallFileTabs";

describe("AutoinstallFileTabs", () => {
  it("should change tabs", async () => {
    const [file] = autoinstallFiles;

    renderWithProviders(
      <AutoinstallFileTabs file={file} openVersionHistory={vi.fn()} />,
    );

    await userEvent.click(screen.getByRole("tab", { name: "Version history" }));
  });
});
