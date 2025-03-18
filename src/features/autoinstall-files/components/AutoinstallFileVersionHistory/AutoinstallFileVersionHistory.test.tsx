import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFileVersionHistory from "./AutoinstallFileVersionHistory";

describe("AutoinstallFileVersionHistory", () => {
  it("should render", async () => {
    const [file] = autoinstallFiles;

    renderWithProviders(
      <AutoinstallFileVersionHistory
        file={file}
        viewVersionHistory={vi.fn()}
      />,
    );
  });
});
