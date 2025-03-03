import { autoinstallFiles } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFilesListContextualMenu from "./AutoinstallFilesListContextualMenu";

describe("AutoinstallFilesListContextualMenu", () => {
  it("should render", async () => {
    renderWithProviders(
      <AutoinstallFilesListContextualMenu file={autoinstallFiles[0]} />,
    );
  });
});
