import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFileVersion from "./AutoinstallFileVersion";

describe("AutoinstallFileVersion", () => {
  it("should render", async () => {
    const [file] = autoinstallFiles;

    renderWithProviders(
      <AutoinstallFileVersion
        fileId={file.id}
        goBack={vi.fn()}
        version={file.version}
      />,
    );
  });
});
