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
      <AutoinstallFileTabs file={file} viewVersionHistory={vi.fn()} />,
    );

    const versionHistoryTab = screen.getByRole("link", {
      name: "Version history",
    });
    await userEvent.click(versionHistoryTab);

    expect(versionHistoryTab).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Info" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
