import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFilesListContextualMenu from ".";
import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";

describe("AutoinstallFilesHeader", () => {
  it("should render", async () => {
    renderWithProviders(
      <AutoinstallFilesListContextualMenu file={autoinstallFiles[0]} />,
    );
  });
});
