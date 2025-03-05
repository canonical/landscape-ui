import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFileInfo from "./AutoinstallFileInfo";

describe("AutoinstallFileInfo", () => {
  it("should render", async () => {
    const [file] = autoinstallFiles;

    renderWithProviders(<AutoinstallFileInfo file={file} />);
  });
});
