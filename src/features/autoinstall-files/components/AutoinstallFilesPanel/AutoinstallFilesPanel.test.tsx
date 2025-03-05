import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import AutoinstallFilesPanel from "./AutoinstallFilesPanel";

describe("AutoinstallFilesPanel", () => {
  it("should render", async () => {
    renderWithProviders(<AutoinstallFilesPanel />);
  });
});
