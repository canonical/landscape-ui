import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFilesPanel from ".";

describe("AutoinstallFilesPanel", () => {
  it("should render", async () => {
    renderWithProviders(<AutoinstallFilesPanel />);
  });
});
