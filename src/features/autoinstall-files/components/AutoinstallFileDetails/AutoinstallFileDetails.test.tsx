import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFileDetails from "./AutoinstallFileDetails";

describe("AutoinstallFileDetails", () => {
  it("should render", async () => {
    const [file] = autoinstallFiles;

    renderWithProviders(
      <AutoinstallFileDetails
        file={file}
        openDetailsPanel={vi.fn()}
        openEditPanel={vi.fn()}
      />,
    );
  });
});
