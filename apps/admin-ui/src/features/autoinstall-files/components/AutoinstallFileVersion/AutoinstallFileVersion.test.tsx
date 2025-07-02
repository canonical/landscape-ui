import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFileVersion from "./AutoinstallFileVersion";

describe("AutoinstallFileVersion", () => {
  it("should render", async () => {
    const [file] = autoinstallFiles;

    const versionInfo = {
      version: 1,
      created_at: "2025-02-07T17:55:23.806269",
    };

    renderWithProviders(
      <AutoinstallFileVersion
        file={file}
        goBack={vi.fn()}
        versionInfo={versionInfo}
      />,
    );
  });
});
